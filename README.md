# MarbleLeague Control Panel

MarbleLeague 遊戲操盤控制台，供操作員進行開局、封盤、開獎等遊戲流程操作。

## 功能

- **操作員登入** — 帳號密碼登入，Session 認證
- **遊戲控制** — 開始新期數、封盤、輸入開獎結果
- **即時統計** — 投注筆數、總金額、投注分布、熱門投注 TOP 10
- **WebSocket 即時推播** — 新投注通知、回合狀態變更自動同步
- **操作日誌** — 前端即時記錄所有操作事件（最多 50 條）
- **防誤關保護** — 投注進行中關閉頁面時會觸發警告

## 技術棧

| 項目 | 版本 |
|---|---|
| Vite | 5.x |
| React | 19.x |
| TypeScript | 5.x |
| Ant Design | 5.x |
| Axios | 1.x |
| Socket.IO Client | 4.x |
| React Router | 7.x |

## 專案結構

```
src/
├── main.tsx                        # 入口
├── App.tsx                         # 路由 & 主題設定
├── components/
│   ├── LoginForm.tsx               # 登入表單
│   ├── ControlPanel.tsx            # 主控台容器
│   ├── ControlHeader.tsx           # 頂部列（操作員資訊 + 登出）
│   ├── GameControl.tsx             # 遊戲控制面板（狀態、按鈕）
│   ├── ResultInput.tsx             # 10 名次開獎結果輸入
│   ├── StatsPanel.tsx              # 即時統計面板
│   ├── StatsDetailModal.tsx        # 詳細統計彈窗
│   └── OperationLog.tsx            # 操作日誌
├── contexts/
│   └── AuthContext.tsx              # Session 認證狀態管理
├── hooks/
│   ├── useGameControl.ts           # 遊戲控制邏輯（開局、封盤、開獎）
│   ├── useSocket.ts                # WebSocket 連線 & 事件處理
│   ├── useCountdown.ts             # 倒數計時器
│   └── useOperationLog.ts          # 操作日誌管理
├── services/
│   ├── http.ts                     # Axios 實例（X-Session-ID 攔截器）
│   └── control.service.ts          # API 呼叫
├── types/
│   └── index.ts                    # TypeScript 型別定義
├── constants/
│   └── index.ts                    # 常數（端點、狀態映射、選手號碼）
└── styles/
    └── global.css                  # 全域樣式（暗色主題）
```

## 快速開始

### 安裝依賴

```bash
npm install
```

### 環境設定

建立 `.env` 檔案：

```env
# API 後端位址
VITE_API_URL=https://api.bjr8888.com/service

# WebSocket 位址
VITE_WS_URL=https://api.bjr8888.com
```

> 開發模式下 Vite 會自動代理 `/api` 和 `/socket.io` 請求到上述位址，不需額外設定 CORS。

### 開發

```bash
npm run dev
```

開發伺服器預設啟動於 `http://localhost:5174`。

### 建置

```bash
npm run build
```

產出至 `dist/` 目錄。

## API 端點

所有請求透過 `X-Session-ID` Header 認證。

| 方法 | 端點 | 說明 |
|---|---|---|
| POST | `/api/control/login` | 操作員登入 |
| POST | `/api/control/logout` | 登出 |
| GET | `/api/control/status` | 取得當前回合狀態與統計 |
| POST | `/api/control/start-round` | 開始新期數 |
| POST | `/api/control/close-betting` | 封盤 |
| POST | `/api/control/input-result` | 輸入開獎結果 |
| POST | `/api/control/confirm-result` | 確認開獎 |
| GET | `/api/control/logs` | 查詢操作日誌 |

## WebSocket 事件

| 事件 | 說明 |
|---|---|
| `new-bet` | 新投注進入 |
| `round-started` | 新期數已開始 |
| `betting-closed` | 封盤完成 |
| `result-confirmed` | 開獎完成 |

## 回合狀態流程

```
betting → closed → playing → inputting → settling → finished
 下注中    已封盤   遊戲進行中  輸入結果中    結算中     已完成
```
