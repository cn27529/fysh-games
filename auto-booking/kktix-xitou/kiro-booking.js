const puppeteer = require("puppeteer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const readline = require("readline");
require("dotenv").config();

class KKTIXBooking {
  constructor() {
    this.config = {
      searchUrl:
        "https://kktix.com/events?utf8=%E2%9C%93&search=%E6%BA%AA%E9%A0%AD&max_price=&min_price=&start_at=2026%2F02%2F09&end_at=",
      keyword: "員林→溪頭",
      sendMailTo: "cn27529@gmail.com",
      mailSubject: "KKTIX 員林→溪頭 自動買票通知",
      mailFrom: "cn27529@gmail.com",
    };

    this.auth = {
      login: process.env.KKTIX_LOGIN,
      password: process.env.KKTIX_PASSWORD,
    };

    if (process.env.GMAIL_APP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: this.config.mailFrom,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    } else {
      console.log("⚠️  未設定 GMAIL_APP_PASSWORD，將跳過郵件發送功能");
      this.transporter = null;
    }
  }

  async sendMail(subject, text) {
    if (!this.transporter) return;
    try {
      await this.transporter.sendMail({
        from: this.config.mailFrom,
        to: this.config.sendMailTo,
        subject,
        text,
      });
      console.log("✅ 已發送通知郵件");
    } catch (error) {
      console.error("郵件發送失敗:", error);
    }
  }

  async tryBooking() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    try {
      const page = await browser.newPage();
      console.log("🔍 搜尋活動...");
      await page.goto(this.config.searchUrl, { waitUntil: "networkidle2" });

      // 解析活動列表
      const events = await this.parseEvents(page);
      if (events.length === 0) {
        console.log("❌ 找不到符合條件的活動");
        return false;
      }

      console.log(`✅ 找到 ${events.length} 個「${this.config.keyword}」活動`);
      events.forEach((e, i) => {
        console.log(`${i + 1}. ${e.name} - ${e.status}`);
      });

      const selected = events[0];
      console.log(`\n🎯 選擇: ${selected.name}`);

      // 前往買票頁面
      await page.goto(selected.url, { waitUntil: "networkidle2" });

      // 登入
      await this.handleLogin(page);

      // 選票
      await this.selectTicket(page);

      // 勾選同意條款
      await this.agreeTerms(page);

      // 點擊下一步
      await this.clickNext(page);

      // 等待人工驗證
      console.log("\n⏳ 請完成人機驗證 (reCAPTCHA)...");
      await this.waitForCaptcha(page);

      // 勾選公開顯示
      await this.checkDisplayInfo(page);

      // 點擊確認表單資料
      await this.confirmOrder(page);

      console.log("\n🎉 買票流程完成！");
      await this.sendMail(
        `${this.config.mailSubject} - 成功`,
        `已完成買票: ${selected.name}`,
      );

      return true;
    } catch (error) {
      console.error("❌ 發生錯誤:", error.message);
      await this.sendMail(`${this.config.mailSubject} - 失敗`, error.message);
      return false;
    } finally {
      console.log("\n💡 按 Ctrl+C 可結束程序");
      await new Promise(() => {}); // 保持瀏覽器開啟
    }
  }

  async parseEvents(page) {
    let allEvents = [];
    let pageNum = 1;

    while (true) {
      console.log(`📄 檢查第 ${pageNum} 頁...`);
      await page.waitForSelector('[data-react-class="SearchWrapper"]');

      const data = await page.$eval(
        '[data-react-class="SearchWrapper"]',
        (el) => {
          try {
            return JSON.parse(el.getAttribute("data-react-props") || "{}");
          } catch {
            return {};
          }
        },
      );

      const events = Array.isArray(data.data) ? data.data : [];
      const filtered = events.filter(
        (e) =>
          e.name?.includes(this.config.keyword) &&
          e.register_status === "IN_STOCK",
      );

      allEvents.push(...filtered);

      // 檢查是否有下一頁
      const hasNext = await page.evaluate(() => {
        const nextLink = document.querySelector('.pagination a[rel="next"]');
        return nextLink !== null;
      });

      if (!hasNext) break;

      // 點擊下一頁
      await page.evaluate(() => {
        const nextLink = document.querySelector('.pagination a[rel="next"]');
        if (nextLink) nextLink.click();
      });

      await page.waitForTimeout(5000);
      pageNum++;
    }

    return allEvents.map((e) => ({
      name: e.name,
      status: "開賣中",
      url: `https://kktix.com/events/${e.slug}/registrations/new`,
    }));
  }

  async handleLogin(page) {
    const url = page.url();

    if (url.includes("/users/sign_in")) {
      console.log("🔐 需要登入...");
      await page.waitForSelector("#user_login");
      await page.type("#user_login", this.auth.login, { delay: 50 });
      await page.type("#user_password", this.auth.password, { delay: 50 });

      await Promise.all([
        page.click('input[type="submit"][value="登入"]'),
        page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);

      console.log("✅ 登入成功");
    }
  }

  async selectTicket(page) {
    await page.waitForTimeout(2000);

    // 找到第一個可用的加號按鈕
    const clicked = await page.evaluate(() => {
      const plusButtons = Array.from(
        document.querySelectorAll("button.plus:not([disabled])"),
      );

      if (plusButtons.length > 0) {
        plusButtons[0].click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("✅ 已選擇 1 張票");
    } else {
      console.log("⚠️  找不到可選的票券");
    }
  }

  async agreeTerms(page) {
    const agreed = await page.evaluate(() => {
      const checkbox = document.querySelector("#person_agree_terms");
      if (checkbox && !checkbox.checked) {
        checkbox.click();
        return true;
      }
      return false;
    });

    if (agreed) {
      console.log("✅ 已勾選同意條款");
    }
  }

  async clickNext(page) {
    await page.waitForTimeout(1000);

    const clicked = await page.evaluate(() => {
      const buttons = Array.from(
        document.querySelectorAll("button, input[type=submit]"),
      );
      const nextBtn = buttons.find((btn) =>
        (btn.innerText || btn.value || "").includes("下一步"),
      );

      if (nextBtn) {
        nextBtn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("✅ 已點擊下一步");
    }
  }

  async waitForCaptcha(page) {
    try {
      await page.waitForFunction(
        () => !document.querySelector("#rc-imageselect"),
        { timeout: 10 * 60 * 1000 },
      );
      console.log("✅ 人機驗證完成");
    } catch {
      console.log("⚠️  等待驗證逾時");
    }
  }

  async checkDisplayInfo(page) {
    await page.waitForTimeout(2000);

    const checked = await page.evaluate(() => {
      const checkbox = document.querySelector(
        'input[ng-model="values.displayInfo"]',
      );
      if (checkbox && !checkbox.checked) {
        checkbox.click();
        return true;
      }
      return false;
    });

    if (checked) {
      console.log("✅ 已勾選公開顯示參加資訊");
    }
  }

  async confirmOrder(page) {
    await page.waitForTimeout(1000);

    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button, a.btn"));
      const confirmBtn = buttons.find((btn) =>
        (btn.innerText || "").includes("確認表單資料"),
      );

      if (confirmBtn) {
        confirmBtn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("✅ 已點擊確認表單資料");
    }
  }

  async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("請選擇運行模式:");
    console.log("1. 單次執行");
    console.log("2. 排程執行 (每 5 分鐘)");

    const mode = await new Promise((resolve) => {
      rl.question("請輸入選擇 (1 或 2): ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });

    if (mode === "2") {
      console.log("🚀 啟動排程模式 (每 5 分鐘執行一次)");
      cron.schedule("*/5 * * * *", () => {
        console.log(`\n[${new Date().toLocaleString()}] 開始檢查...`);
        this.tryBooking();
      });

      // 立即執行一次
      await this.tryBooking();
    } else {
      console.log("🚀 單次執行模式");
      await this.tryBooking();
    }
  }
}

// 啟動
const booking = new KKTIXBooking();
booking.start();

process.on("SIGINT", () => {
  console.log("\n👋 程序已停止");
  process.exit(0);
});
