const puppeteer = require("puppeteer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
require("dotenv").config();

class BCCHBooking {
  constructor() {
    this.config = {
      doctorName: "邱欣玲", // 邱欣玲 0063040, 黃雅琪 0147226, 邱欣玲 0063040
      doctorCode: "0063040",
      patientId: "A123456789", //A123456789
      birthday: "0706",
      baseUrl:
        "https://bc.cch.org.tw/BCRG/opd/service-e.aspx?id=0900&Page=11&#p",
      autoSubmit: true,
      sendMailTo: "cn27529@gmail.com",
      mailSubject: "幫媽媽自動掛號系統",
      mailFrom: "cn27529@gmail.com",
    };

    // 設置郵件傳送器 (只有在有密碼時才初始化)
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

  async tryBooking() {
    // 詢問運行模式
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("請選擇運行模式:");
    console.log("1. 依日期選擇可用的醫師");
    console.log(
      `2. 依config自動尋找${this.config.doctorName}醫師${this.config.doctorCode}`,
    );

    const mode = await new Promise((resolve) => {
      rl.question("請輸入選擇 (1 或 2，按 Enter 結束): ", (answer) => {
        rl.close();
        if (answer.trim() === "") {
          console.log("👋 程序已取消");
          process.exit(0);
        }
        resolve(answer);
      });
    });

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    try {
      const page = await browser.newPage();
      await page.goto(this.config.baseUrl, { waitUntil: "networkidle2" });

      // 等待日期選擇器載入
      await page.waitForSelector("select");

      // 獲取所有可選日期
      const dates = await page.$$eval("select option", (options) =>
        options
          .slice(1)
          .map((opt) => ({ value: opt.value, text: opt.textContent })),
      );

      console.log(`找到 ${dates.length} 個可選日期`);

      for (const date of dates) {
        console.log(`檢查日期: ${date.text}`);

        // 選擇日期
        await page.select("select", date.value);
        await page.waitForTimeout(2000); // 等待頁面刷新

        // 列出所有醫師連結
        const doctorLinks = await page.$$eval('a[href*="dr_no="]', (links) =>
          links.map((link) => ({
            text: link.textContent.trim(),
            href: link.href,
            doctorCode: link.href.match(/dr_no=([^&]+)/)?.[1],
          })),
        );

        if (mode === "1") {
          // 模式1: 讓用戶選擇醫師
          if (doctorLinks.length > 0) {
            console.log("可用醫師:");
            doctorLinks.forEach((doctor, index) => {
              console.log(
                `${index + 1}. ${doctor.text} (代碼: ${doctor.doctorCode})`,
              );
            });

            const readline2 = require("readline");
            const rl2 = readline2.createInterface({
              input: process.stdin,
              output: process.stdout,
            });

            const choice = await new Promise((resolve) => {
              rl2.question("請選擇醫師 (輸入數字): ", (answer) => {
                rl2.close();
                resolve(parseInt(answer) - 1);
              });
            });

            const selectedDoctor = doctorLinks[choice];

            if (selectedDoctor) {
              console.log(
                `選擇了 ${selectedDoctor.text} 醫師，進入掛號頁面...`,
              );

              const doctorLink = await page.$(
                `a[href*="dr_no=${selectedDoctor.doctorCode}"]`,
              );
              await doctorLink.click();
              await page.waitForNavigation({ waitUntil: "networkidle2" });

              await this.fillBookingForm(page);

              if (this.config.autoSubmit) {
                console.log("🚀 開始自動提交...");
                await this.autoSubmitBooking(page);
              } else {
                console.log("✅ 已自動填寫表單，請檢查並手動提交");
                console.log("💡 按 Ctrl+C 可結束程序");
                await new Promise(() => {}); // 無限等待
              }
              return true;
            }
          }
        } else {
          // 模式2: 自動尋找邱欣玲醫師
          const targetDoctor = doctorLinks.find(
            (doctor) => doctor.doctorCode === this.config.doctorCode,
          );

          if (targetDoctor) {
            console.log(
              `找到 ${targetDoctor.text} 醫師 (代碼: ${targetDoctor.doctorCode})，進入掛號頁面...`,
            );

            const doctorLink = await page.$(
              `a[href*="dr_no=${targetDoctor.doctorCode}"]`,
            );
            await doctorLink.click();
            await page.waitForNavigation({ waitUntil: "networkidle2" });

            // 自動填寫表單
            await this.fillBookingForm(page);

            if (this.config.autoSubmit) {
              console.log("🚀 開始自動提交...");
              await this.autoSubmitBooking(page);
            } else {
              console.log("✅ 已自動填寫表單，請檢查並手動提交");
              console.log("💡 按 Ctrl+C 可結束程序");
              await new Promise(() => {}); // 無限等待
            }
            return true;
          } else {
            console.log(
              `未找到醫師代碼 ${this.config.doctorCode} 的 ${this.config.doctorName}醫師`,
            );
          }
        }
      }

      console.log("本次檢查未找到可掛號時段");
      return false;
    } catch (error) {
      console.error("掛號過程發生錯誤:", error);
      return false;
    } finally {
      await browser.close();
    }
  }

  async fillBookingForm(page) {
    try {
      // 等待頁面載入
      await page.waitForTimeout(2000);

      // 先列出所有輸入框供調試
      const inputs = await page.$$eval("input, select", (elements) =>
        elements.map((el, index) => ({
          index,
          tagName: el.tagName,
          type: el.type,
          name: el.name,
          id: el.id,
          placeholder: el.placeholder,
          value: el.value,
          className: el.className,
        })),
      );

      console.log("頁面上的所有輸入框:", JSON.stringify(inputs, null, 2));

      // 嘗試按順序填寫前幾個 text 輸入框
      const textInputs = await page.$$('input[type="text"]');

      if (textInputs.length >= 1) {
        await textInputs[0].type(this.config.patientId);
        console.log(`✅ 填寫第1個輸入框 (病歷號): ${this.config.patientId}`);
      }

      if (textInputs.length >= 2) {
        await textInputs[1].type(this.config.birthday);
        console.log(`✅ 填寫第2個輸入框 (生日): ${this.config.birthday}`);
      }

      // 嘗試選擇下拉選單
      const selects = await page.$$("select");
      if (selects.length > 0) {
        const options = await page.$$eval("select option", (opts) =>
          opts.map((opt) => ({ value: opt.value, text: opt.textContent })),
        );
        console.log("下拉選單選項:", options);

        if (options.length > 1) {
          await page.select("select", options[1].value); // 選擇第二個選項
          console.log(`✅ 選擇掛號類別: ${options[1].text}`);
        }
      }
    } catch (error) {
      console.log("填寫表單時發生錯誤:", error.message);
    }
  }

  async checkBookingResult(page) {
    try {
      // 檢查是否有成功訊息或錯誤訊息
      const successMsg = await page.$eval("body", (el) => el.textContent);
      return successMsg.includes("成功") || successMsg.includes("完成");
    } catch {
      return false;
    }
  }

  async autoSubmitBooking(page) {
    try {
      // 先設置 dialog 監聽器，確保自動處理 window.confirm
      page.on("dialog", async (dialog) => {
        console.log(`📋 彈窗訊息: ${dialog.message()}`);
        await dialog.accept();
        console.log("✅ 已自動確認提交");
      });

      // 點擊提交按鈕
      const submitButton = await page.$("#BtOK");
      if (submitButton) {
        console.log("🚀 點擊提交按鈕...");
        await submitButton.click();
        console.log("✅ 已點擊提交按鈕");

        // 等待結果頁面載入
        await page.waitForTimeout(3000);

        // 檢查是否有 Table7 結果
        const table7 = await page.$("#Table7");
        if (table7) {
          console.log("📊 找到結果表格，正在解析...");
          const bookingResult = await this.parseBookingResult(page);
          await this.sendNotificationEmail(bookingResult);
        } else {
          console.log("❌ 未找到結果表格");
        }
      } else {
        console.log("❌ 未找到提交按鈕 #BtOK");
      }
    } catch (error) {
      console.error("自動提交過程發生錯誤:", error);
    }
  }

  async parseBookingResult(page) {
    try {
      const result = await page.evaluate(() => {
        const table = document.getElementById("Table7");
        if (!table) return null;

        const data = {};

        // 解析各個欄位
        const rid1 = document.getElementById("Rid1");
        if (rid1) data.身份證 = rid1.textContent.trim();

        const rid2 = document.getElementById("Rid2");
        if (rid2) data.病歷號碼 = rid2.textContent.trim();

        const rrname = document.getElementById("Rrname");
        if (rrname) data.民眾姓名 = rrname.textContent.trim();

        const rdname = document.getElementById("Rdname");
        if (rdname) data.醫師姓名 = rdname.textContent.trim();

        const rregdate = document.getElementById("Rregdate");
        if (rregdate) data.預約時間 = rregdate.textContent.trim();

        const showShift1 = document.getElementById("ShowShift1");
        if (showShift1) data.看診時段 = showShift1.textContent.trim();

        const rresult = document.getElementById("Rresult");
        if (rresult) data.預約結果 = rresult.textContent.trim();

        const loclb = document.getElementById("loclb");
        if (loclb) data.診間位置 = loclb.textContent.trim();

        return data;
      });

      console.log("📋 解析結果:", result);
      return result;
    } catch (error) {
      console.error("解析結果時發生錯誤:", error);
      return null;
    }
  }

  async sendNotificationEmail(bookingData) {
    if (!bookingData) {
      console.log("❌ 無掛號資料，跳過郵件發送");
      return;
    }

    // 檢查是否已經掛號成功或重複掛號
    if (
      bookingData.預約結果 &&
      (bookingData.預約結果.includes("已預約為") ||
        bookingData.預約結果.includes("重覆掛號"))
    ) {
      if (bookingData.預約結果.includes("已預約為")) {
        console.log("🎉 掛號成功！預約結果：", bookingData.預約結果);
        console.log("✅ 已成功掛號，程序即將退出");
      } else if (bookingData.預約結果.includes("重覆掛號")) {
        console.log("⚠️  重複掛號！預約結果：", bookingData.預約結果);
        console.log("✅ 已重複掛號，程序即將退出");
      }

      // 發送通知郵件後退出
      if (this.config.sendMailTo && process.env.GMAIL_APP_PASSWORD) {
        try {
          const emailBody = this.formatEmailBody(bookingData);
          const subject = bookingData.預約結果.includes("已預約為")
            ? `${this.config.mailSubject} - 掛號成功通知 ✅`
            : `${this.config.mailSubject} - 重複掛號通知 ⚠️`;

          const mailOptions = {
            from: this.config.mailFrom,
            to: this.config.sendMailTo,
            subject: subject,
            html: emailBody,
          };
          const info = await this.transporter.sendMail(mailOptions);
          console.log("📧 通知郵件已發送:", info.messageId);
        } catch (error) {
          console.error("郵件發送失敗:", error);
        }
      }

      process.exit(0); // 掛號成功或重複掛號後退出程序
    }

    // 檢查所有必要條件
    if (
      !this.config.autoSubmit ||
      !this.config.sendMailTo ||
      !process.env.GMAIL_APP_PASSWORD
    ) {
      console.log("📧 郵件功能未完全啟用，掛號結果：");
      if (!this.config.autoSubmit) console.log("   - autoSubmit 未啟用");
      if (!this.config.sendMailTo) console.log("   - sendMailTo 未設定");
      if (!process.env.GMAIL_APP_PASSWORD)
        console.log("   - GMAIL_APP_PASSWORD 未設定");

      console.log("身份證：", bookingData.身份證 || "");
      console.log("病歷號碼：", bookingData.病歷號碼 || "");
      console.log("民眾姓名：", bookingData.民眾姓名 || "");
      console.log("醫師姓名：", bookingData.醫師姓名 || "");
      console.log("預約時間：", bookingData.預約時間 || "");
      console.log("看診時段：", bookingData.看診時段 || "");
      console.log("預約結果：", bookingData.預約結果 || "");
      console.log("診間位置：", bookingData.診間位置 || "");
      return;
    }

    try {
      const emailBody = this.formatEmailBody(bookingData);

      const mailOptions = {
        from: this.config.mailFrom,
        to: this.config.sendMailTo,
        subject: `${this.config.mailSubject} - 掛號結果通知`,
        html: emailBody,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("📧 郵件發送成功:", info.messageId);
    } catch (error) {
      console.error("郵件發送失敗:", error);
    }
  }

  formatEmailBody(data) {
    return `
      <h2>🏥 掛號結果通知</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>身份證：</strong></td><td>${data.身份證 || ""}</td></tr>
        <tr><td><strong>病歷號碼：</strong></td><td>${data.病歷號碼 || ""}</td></tr>
        <tr><td><strong>民眾姓名：</strong></td><td>${data.民眾姓名 || ""}</td></tr>
        <tr><td><strong>醫師姓名：</strong></td><td>${data.醫師姓名 || ""}</td></tr>
        <tr><td><strong>預約時間：</strong></td><td>${data.預約時間 || ""}</td></tr>
        <tr><td><strong>看診時段：</strong></td><td>${data.看診時段 || ""}</td></tr>
        <tr><td><strong>預約結果：</strong></td><td>${data.預約結果 || ""}</td></tr>
        <tr><td><strong>診間位置：</strong></td><td>${data.診間位置 || ""}</td></tr>
      </table>
      <p><small>此郵件由自動掛號系統發送 - ${new Date().toLocaleString()}</small></p>
    `;
  }

  startScheduler() {
    console.log("🚀 啟動自動掛號系統...");
    console.log("⏰ 每天 1,3,5,7,9,11,13,15,17,19,21,23 自動檢查掛號");

    // 每天 8:00, 12:00, 18:00 執行
    cron.schedule("0 1,3,5,7,9,11,13,15,17,19,21,23 * * *", () => {
      console.log(`\n[${new Date().toLocaleString()}] 開始自動掛號檢查...`);
      this.tryBooking();
    });

    // 立即執行一次
    this.tryBooking().then((result) => {
      if (!result) {
        // 如果沒找到可掛號時段，結束程序
        console.log("👋 自動掛號系統已停止");
        process.exit(0);
      }
    });
  }
}

// 啟動自動掛號系統
const booking = new BCCHBooking();
booking.startScheduler();

// 保持程序運行
process.on("SIGINT", () => {
  console.log("\n👋 自動掛號系統已停止");
  process.exit(0);
});
