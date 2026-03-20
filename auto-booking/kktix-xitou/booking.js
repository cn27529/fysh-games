const puppeteer = require("puppeteer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
require("dotenv").config();

class KKTIXBooking {
  constructor() {
    this.config = {
      searchUrl:
        "https://kktix.com/events?utf8=%E2%9C%93&search=%E6%BA%AA%E9%A0%AD&max_price=&min_price=&start_at=2026%2F02%2F09&end_at=&event_tag_ids_in=",
      keyword: "員林→溪頭",
      preferredTimeKeyword: "",
      requireInStock: true,
      ticketNameKeyword: "",
      ticketQuantity: 1,
      autoSubmit: false,
      autoFillForm: true,
      agreeTerms: true,
      displayInfo: false,
      headless: false,
      enableCron: false,
      cronSpec: "*/5 * * * *",
      sendMailTo: "cn27529@gmail.com",
      mailSubject: "KKTIX 自動買票通知",
      mailFrom: "cn27529@gmail.com",
      passenger: {
        name: process.env.KKTIX_PASSENGER_NAME || "",
        idNumber: process.env.KKTIX_PASSENGER_ID || "",
        phone: process.env.KKTIX_PASSENGER_PHONE || "",
        email: process.env.KKTIX_PASSENGER_EMAIL || "",
        birth: process.env.KKTIX_PASSENGER_BIRTH || "",
        gender: process.env.KKTIX_PASSENGER_GENDER || "",
        address: process.env.KKTIX_PASSENGER_ADDRESS || "",
        emergencyName: process.env.KKTIX_EMERGENCY_NAME || "",
        emergencyPhone: process.env.KKTIX_EMERGENCY_PHONE || "",
      },
    };

    this.auth = {
      login: process.env.KKTIX_LOGIN || "",
      password: process.env.KKTIX_PASSWORD || "",
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

  async runOnce() {
    const browser = await puppeteer.launch({
      headless: this.config.headless,
      defaultViewport: null,
    });

    try {
      const page = await browser.newPage();
      await page.goto(this.config.searchUrl, { waitUntil: "networkidle2" });

      const filtered = await this.collectEventsAcrossPages(page);
      if (filtered.length === 0) {
        console.log("沒有符合條件的活動");
        return false;
      }

      const selected = filtered.sort((a, b) => a.start_at - b.start_at)[0];
      console.log(`✅ 選到活動: ${selected.name}`);

      const eventUrl = this.buildRegistrationUrl(selected.public_url);
      console.log(`前往報名頁: ${eventUrl}`);

      await page.goto(eventUrl, { waitUntil: "networkidle2" });
      await this.ensureLogin(page);
      await this.selectTickets(page);
      await this.goNextAfterTicket(page);

      if (!this.config.autoSubmit) {
        console.log("✅ 已完成選票，未啟用自動送出");
        await new Promise(() => {});
      }

      if (this.config.autoFillForm) {
        await this.waitForHumanVerification(page);
        await this.fillPassengerForm(page);
        await this.confirmOrder(page);
      }

      await this.sendMail(
        this.config.mailSubject,
        `已開啟報名頁並選擇票券: ${selected.name}`,
      );

      if (!this.config.autoSubmit) {
        console.log("✅ 已完成選票，請人工確認與提交");
        await new Promise(() => {});
      }

      return true;
    } catch (error) {
      console.error("流程發生錯誤:", error);
      await this.sendMail(
        `${this.config.mailSubject} - 失敗`,
        String(error && error.message ? error.message : error),
      );
      return false;
    } finally {
      await browser.close();
    }
  }

  async collectEventsAcrossPages(page) {
    let allEvents = [];
    let pageNum = 1;

    while (true) {
      await page.waitForSelector('[data-react-class="SearchWrapper"]');

      const { events, props } = await this.readSearchEvents(page);
      const filtered = this.filterEvents(events);
      allEvents = allEvents.concat(filtered);

      const hasNext = await page.evaluate(() => {
        return Boolean(document.querySelector('.pagination a[rel="next"]'));
      });

      if (!hasNext) break;

      console.log(`📄 切換到第 ${pageNum + 1} 頁...`);

      await page.evaluate(() => {
        const nextLink = document.querySelector('.pagination a[rel="next"]');
        if (nextLink) nextLink.click();
      });

      try {
        await page.waitForFunction(
          (prevProps) => {
            const el = document.querySelector('[data-react-class="SearchWrapper"]');
            if (!el) return false;
            const nextProps = el.getAttribute("data-react-props");
            return nextProps && nextProps !== prevProps;
          },
          { timeout: 8000 },
          props,
        );
      } catch (error) {
        await page.waitForTimeout(2000);
      }

      pageNum += 1;
    }

    return allEvents;
  }

  async readSearchEvents(page) {
    const searchProps = await page.$eval(
      '[data-react-class="SearchWrapper"]',
      (el) => el.getAttribute("data-react-props"),
    );

    let data;
    try {
      data = JSON.parse(searchProps || "{}");
    } catch (error) {
      throw new Error("無法解析 data-react-props JSON");
    }

    const events = Array.isArray(data.data) ? data.data : [];
    if (events.length === 0) {
      console.log("找不到活動資料");
    }

    return { events, props: searchProps || "" };
  }

  filterEvents(events) {
    const keyword = this.config.keyword.trim();
    const preferredTimeKeyword = this.config.preferredTimeKeyword.trim();

    return events.filter((event) => {
      if (!event || typeof event.name !== "string") return false;
      if (keyword && !event.name.includes(keyword)) return false;
      if (this.config.requireInStock && event.register_status !== "IN_STOCK") {
        return false;
      }
      if (preferredTimeKeyword && !event.name.includes(preferredTimeKeyword)) {
        return false;
      }
      return true;
    });
  }

  buildRegistrationUrl(publicUrl) {
    if (!publicUrl) return "";
    const match = publicUrl.match(/\/events\/([^/?#]+)/);
    const slug = match ? match[1] : "";
    if (!slug) return publicUrl;
    return `https://kktix.com/events/${slug}/registrations/new`;
  }

  async ensureLogin(page) {
    const url = page.url();
    if (url.includes("/users/sign_in")) {
      await this.fillLoginForm(page);
      return;
    }

    const loginLink = await page.$('a[href*="/users/sign_in"]');
    if (loginLink) {
      await loginLink.click();
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      await this.fillLoginForm(page);
    }
  }

  async fillLoginForm(page) {
    if (!this.auth.login || !this.auth.password) {
      throw new Error("請在 .env 設定 KKTIX_LOGIN 與 KKTIX_PASSWORD");
    }

    await page.waitForSelector("#user_login", { timeout: 10000 });
    await page.type("#user_login", this.auth.login, { delay: 30 });
    await page.type("#user_password", this.auth.password, { delay: 30 });

    await Promise.all([
      page.click('input[type="submit"][value="登入"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);
  }

  async selectTickets(page) {
    await page.waitForTimeout(2000);

    const options = await page.evaluate(() => {
      const selectors = [
        "input[type=number]",
        "input[name*='quantity']",
        "input[name*='ticket']",
        "select",
      ];
      const inputs = selectors
        .flatMap((sel) => Array.from(document.querySelectorAll(sel)))
        .filter((el) => el && !el.disabled);

      return inputs.map((input, index) => {
        const container =
          input.closest(".ticket, .ticket-wrapper, .ticket-info") ||
          input.closest("li") ||
          input.parentElement;
        const text = container
          ? container.innerText.replace(/\s+/g, " ").trim()
          : "";
        return {
          index,
          tagName: input.tagName,
          type: input.type,
          name: input.name,
          text,
        };
      });
    });

    if (options.length === 0) {
      console.log("⚠️ 找不到票券輸入框，請人工確認頁面");
      return;
    }

    console.log("可用票券欄位:");
    options.forEach((opt, i) => {
      console.log(`${i + 1}. ${opt.text.slice(0, 80)}`);
    });

    const keyword = this.config.ticketNameKeyword.trim();
    let targetIndex = 0;

    if (keyword) {
      const found = options.findIndex((opt) => opt.text.includes(keyword));
      if (found >= 0) targetIndex = found;
    }

    const quantity = Math.max(1, Number(this.config.ticketQuantity) || 1);

    await page.evaluate(
      ({ targetIndex, quantity }) => {
        const selectors = [
          "input[type=number]",
          "input[name*='quantity']",
          "input[name*='ticket']",
          "select",
        ];
        const inputs = selectors
          .flatMap((sel) => Array.from(document.querySelectorAll(sel)))
          .filter((el) => el && !el.disabled);

        const target = inputs[targetIndex];
        if (!target) return;

        if (target.tagName === "SELECT") {
          const option = Array.from(target.options).find(
            (opt) => Number(opt.value) === quantity,
          );
          if (option) {
            target.value = option.value;
            target.dispatchEvent(new Event("change", { bubbles: true }));
          }
        } else {
          target.value = String(quantity);
          target.dispatchEvent(new Event("input", { bubbles: true }));
          target.dispatchEvent(new Event("change", { bubbles: true }));
        }
      },
      { targetIndex, quantity },
    );

    console.log(`✅ 已選票數量 ${quantity}`);
  }

  async goNextAfterTicket(page) {
    if (this.config.agreeTerms) {
      const agreed = await page.evaluate(() => {
        const checkbox = document.querySelector("#person_agree_terms");
        if (checkbox && !checkbox.checked) {
          checkbox.click();
          return true;
        }
        return Boolean(checkbox);
      });
      if (agreed) {
        console.log("✅ 已勾選同意條款");
      }
    }

    if (!this.config.autoSubmit) return;

    const clicked = await page.evaluate(() => {
      const texts = ["下一步", "繼續", "確認", "Next", "Continue"];
      const buttons = Array.from(
        document.querySelectorAll("button, input[type=submit]"),
      );
      const target = buttons.find((btn) => {
        const text = (btn.innerText || btn.value || "").trim();
        return texts.some((t) => text.includes(t));
      });
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("🚀 已嘗試進入下一步，請留意是否需要填寫資料");
    } else {
      console.log("⚠️ 找不到下一步按鈕，請人工確認");
    }
  }

  async waitForHumanVerification(page) {
    const hasCaptcha = await page.$(
      'iframe[src*="recaptcha"], #rc-imageselect',
    );
    if (!hasCaptcha) return;

    console.log("⚠️  偵測到人機驗證，請在瀏覽器手動完成");
    try {
      await page.waitForFunction(
        () =>
          !document.querySelector("#rc-imageselect") &&
          !document.querySelector('iframe[src*="recaptcha"]'),
        { timeout: 10 * 60 * 1000 },
      );
    } catch (error) {
      console.log("⚠️  等待人機驗證逾時，請人工確認");
    }
  }

  async fillPassengerForm(page) {
    const profile = this.config.passenger || {};
    const hasData = Object.values(profile).some((value) =>
      String(value).trim(),
    );
    if (!hasData) {
      console.log("⚠️ 未設定乘客資料，略過自動填寫");
      return;
    }

    await page.waitForTimeout(2000);

    const filled = await page.evaluate((profile) => {
      const normalize = (value) => String(value || "").trim();
      const genderValue = normalize(profile.gender).toLowerCase();
      const genderAliases = new Map([
        ["male", ["男", "先生", "male", "m"]],
        ["female", ["女", "小姐", "female", "f"]],
      ]);
      const genderTokens = genderValue
        ? Array.from(genderAliases.values()).find((list) =>
            list.some((token) => genderValue.includes(token)),
          ) || [genderValue]
        : [];

      const keywordMap = [
        { key: "name", keywords: ["姓名", "名字", "聯絡人", "乘客", "name"] },
        {
          key: "idNumber",
          keywords: ["身分證", "身份證", "證號", "身分證字號", "id"],
        },
        { key: "phone", keywords: ["手機", "電話", "聯絡電話", "phone"] },
        { key: "email", keywords: ["email", "電子郵件", "e-mail", "mail"] },
        { key: "birth", keywords: ["生日", "出生", "出生日期", "birth"] },
        { key: "address", keywords: ["地址", "住址", "address"] },
        {
          key: "emergencyName",
          keywords: ["緊急聯絡人", "緊急聯絡姓名"],
        },
        {
          key: "emergencyPhone",
          keywords: ["緊急聯絡電話", "緊急聯絡手機"],
        },
      ];

      const getLabelText = (el) => {
        if (!el) return "";
        const id = el.id ? `#${el.id}` : "";
        const label =
          (id && document.querySelector(`label[for=\"${el.id}\"]`)) ||
          el.closest("label");
        const labelText = label ? label.innerText : "";
        const placeholder = el.getAttribute("placeholder") || "";
        const name = el.getAttribute("name") || "";
        const aria = el.getAttribute("aria-label") || "";
        return `${labelText} ${placeholder} ${name} ${aria}`.toLowerCase();
      };

      const candidates = Array.from(
        document.querySelectorAll("input, textarea, select"),
      ).filter((el) => {
        if (el.disabled) return false;
        const type = (el.getAttribute("type") || "").toLowerCase();
        if (type === "hidden" || type === "password") return false;
        if (el.offsetParent === null) return false;
        return true;
      });

      let filledCount = 0;

      candidates.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const type = (el.getAttribute("type") || "").toLowerCase();
        const labelText = getLabelText(el);

        if (type === "radio" && genderTokens.length > 0) {
          const value = (el.value || "").toLowerCase();
          const matched = genderTokens.some((token) => {
            const t = String(token).toLowerCase();
            return value.includes(t) || labelText.includes(t);
          });
          if (matched) {
            el.click();
            filledCount += 1;
          }
          return;
        }

        if (type === "checkbox") {
          return;
        }

        const match = keywordMap.find((item) =>
          item.keywords.some((kw) => labelText.includes(kw)),
        );
        if (!match) return;

        const value = normalize(profile[match.key]);
        if (!value) return;

        if (tag === "select") {
          const option = Array.from(el.options).find((opt) =>
            opt.textContent.includes(value),
          );
          if (option) {
            el.value = option.value;
            el.dispatchEvent(new Event("change", { bubbles: true }));
            filledCount += 1;
          }
          return;
        }

        el.value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        filledCount += 1;
      });

      return filledCount;
    }, profile);

    console.log(`✅ 已自動填寫 ${filled} 個欄位`);

    if (this.config.displayInfo) {
      await page.evaluate(() => {
        const checkbox = document.querySelector(
          'input[ng-model="values.displayInfo"]',
        );
        if (checkbox && !checkbox.checked) checkbox.click();
      });
      console.log("✅ 已勾選公開顯示參加資訊");
    }
  }

  async confirmOrder(page) {
    if (!this.config.autoSubmit) {
      console.log("✅ 已填寫表單，請人工確認並提交");
      await new Promise(() => {});
    }

    const clicked = await page.evaluate(() => {
      const texts = ["確認表單資料", "確認", "送出", "完成", "提交"];
      const buttons = Array.from(
        document.querySelectorAll("button, a.btn, input[type=submit]"),
      );
      const target = buttons.find((btn) => {
        const text = (btn.innerText || btn.value || "").trim();
        return texts.some((t) => text.includes(t));
      });
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("🚀 已嘗試送出表單");
    } else {
      console.log("⚠️ 找不到送出按鈕，請人工確認");
    }
  }

  async start() {
    if (!this.config.enableCron) {
      await this.runOnce();
      return;
    }

    console.log(`啟動排程: ${this.config.cronSpec}`);
    cron.schedule(this.config.cronSpec, async () => {
      console.log("開始執行自動買票流程...");
      await this.runOnce();
    });
  }
}

(async () => {
  const booking = new KKTIXBooking();
  await booking.start();
})();
