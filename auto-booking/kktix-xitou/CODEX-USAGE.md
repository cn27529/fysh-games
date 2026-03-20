# KKTIX 溪頭自動買票使用文檔

此腳本會從 KKTIX 搜尋頁抓取活動清單，挑選「員林→溪頭」且可購買的班次，開啟報名頁、自動登入、選票，並在你完成圖片驗證後自動填寫乘客資料與送出表單。

## 需求

- Node.js 18+ (建議 18 或 20)
- 專案已安裝依賴 (puppeteer, node-cron, nodemailer, dotenv)

## 快速開始

1. 建立 `.env`

在專案根目錄建立 `.env`，至少填入：

```
GMAIL_APP_PASSWORD=你的Gmail應用程式密碼
KKTIX_LOGIN=你的帳號或Email
KKTIX_PASSWORD=你的密碼
```

若要自動填乘客資料，追加：

```
KKTIX_PASSENGER_NAME=乘客姓名
KKTIX_PASSENGER_ID=身分證字號
KKTIX_PASSENGER_PHONE=手機
KKTIX_PASSENGER_EMAIL=Email
KKTIX_PASSENGER_BIRTH=生日(可選)
KKTIX_PASSENGER_GENDER=男 或 女
KKTIX_PASSENGER_ADDRESS=地址(可選)
KKTIX_EMERGENCY_NAME=緊急聯絡人(可選)
KKTIX_EMERGENCY_PHONE=緊急聯絡電話(可選)
```

2. 執行腳本

```
node kktix-xitou/booking.js
```

## 重要說明

- **人機驗證**：KKTIX 會出現圖片驗證 (reCAPTCHA)，無法全自動化。你需要在瀏覽器中手動完成驗證，腳本會在驗證完成後繼續。
- **autoSubmit**：預設 `false`，避免誤送。若確認流程無誤可改為 `true` 讓腳本自動點下一步與送出。

## 主要設定 (在 `kktix-xitou/booking.js`)

- `keyword`: 目前為「員林→溪頭」
- `preferredTimeKeyword`: 若想鎖定班次時間（例：`07:20`）
- `requireInStock`: 只挑選可購買的班次
- `ticketNameKeyword`: 若票種要再篩（例：`全票`）
- `ticketQuantity`: 張數
- `autoSubmit`: 是否自動點下一步與送出
- `autoFillForm`: 是否自動填寫乘客資料
- `agreeTerms`: 是否自動勾選同意條款
- `displayInfo`: 是否勾選「在公開頁面顯示您參加了本活動」
- `enableCron`: 是否啟用排程
- `cronSpec`: 排程規則 (預設 `*/5 * * * *`)

## 常見問題

1. 沒有自動填表

- 確認 `.env` 是否有提供乘客資料
- 表單欄位若有變動，可能需要調整欄位偵測規則

2. 找不到票券輸入框

- 活動頁的票券 UI 可能不同，請先觀察頁面結構

3. 登入失敗

- 確認 `KKTIX_LOGIN` 與 `KKTIX_PASSWORD` 正確

## 安全建議

- `.env` 請勿提交到版本控制
- 不要把帳密寫進 `kktix-xitou/kktix-xitou.md`
