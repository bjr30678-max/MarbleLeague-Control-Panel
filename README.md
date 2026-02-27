# MarbleLeague Control Panel

MarbleLeague 遊戲操盤控制台，供操作員（Operator）進行開局、封盤、開獎、宣告無效局等遊戲流程操作。

## 功能

### 認證系統
- 操作員帳號密碼登入，透過 `X-Session-ID` Header 進行 Session 認證
- Session 儲存於 `sessionStorage`，關閉分頁即失效
- 未認證或 Session 過期自動跳轉至登入頁

### 遊戲控制
- **開始新期數** — 建立新的遊戲回合，開放玩家下注
- **提前封盤** — 於倒數計時結束前手動關閉下注
- **輸入開獎結果** — 選擇 1~10 名的排名結果，已選號碼自動禁用防止重複
- **確認開獎** — 送出結果後自動觸發結算流程
- **宣告無效局** — 將進行中的回合宣告無效，所有投注自動退款（需填寫原因）

### 即時數據
- 當前回合狀態與倒數計時器即時顯示
- 投注筆數、總金額統計卡片
- 投注類型分布列表（依金額排序）
- 詳細統計彈窗：各類型細項分布 + 熱門投注 TOP 10

### WebSocket 即時推播
- 新投注通知（支援單筆投注與批量投注兩種格式）
- 回合狀態變更自動同步（開局、封盤、開獎、無效局）
- 連線狀態監控

### 操作日誌
- 前端即時記錄所有操作事件與 WebSocket 推播訊息
- 依事件等級顯示不同顏色標記（info / success / warning / error）
- 最多保留 50 條紀錄

### 安全機制
- 投注進行中關閉或重新整理頁面時觸發瀏覽器離開警告
- 重要操作（開局、封盤、開獎、無效局）皆需二次確認
- 未認證 API 請求自動清除 Session 並跳轉登入頁（登入請求除外）

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
├── main.tsx                        # 應用入口
├── App.tsx                         # 路由設定 & Ant Design 暗色主題配置
│
├── components/
│   ├── LoginForm.tsx               # 登入表單（Glass Morphism 風格）
│   ├── ControlPanel.tsx            # 主控台容器（組合所有子元件與 hooks）
│   ├── ControlHeader.tsx           # 頂部列（品牌 Logo、操作員資訊、登出）
│   ├── GameControl.tsx             # 遊戲控制面板（狀態顯示、操作按鈕、無效局）
│   ├── ResultInput.tsx             # 開獎結果輸入（5x2 下拉選單網格）
│   ├── StatsPanel.tsx              # 即時統計面板（投注筆數、金額、分布）
│   ├── StatsDetailModal.tsx        # 詳細統計彈窗（類型細項 + 熱門投注 TOP 10）
│   └── OperationLog.tsx            # 操作日誌列表
│
├── contexts/
│   └── AuthContext.tsx              # Session 認證狀態管理（Provider + useAuth hook）
│
├── hooks/
│   ├── useGameControl.ts           # 遊戲控制邏輯（開局、封盤、開獎、無效局、狀態輪詢）
│   ├── useSocket.ts                # WebSocket 連線管理 & 事件監聽
│   ├── useCountdown.ts             # 封盤倒數計時器（MM:SS 格式）
│   └── useOperationLog.ts          # 操作日誌狀態管理（最多 50 條）
│
├── services/
│   ├── http.ts                     # Axios 實例（X-Session-ID 攔截器、401 自動跳轉）
│   └── control.service.ts          # 所有 API 呼叫封裝
│
├── types/
│   └── index.ts                    # TypeScript 型別定義（Operator、GameRound、Stats、Socket 事件等）
│
├── constants/
│   └── index.ts                    # 常數定義（API 端點、狀態映射、選手號碼、輪詢間隔）
│
└── styles/
    └── global.css                  # 全域樣式（CSS Variables 暗色主題、元件樣式）
```

## 快速開始

### 前置需求

- Node.js >= 18
- npm >= 9
- MarbleLeague-Agent-Backend 後端服務運行中

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

> 開發模式下 Vite Dev Server 會自動代理 `/api` 和 `/socket.io` 請求到上述位址，無需額外處理 CORS。

### 開發

```bash
npm run dev
```

開發伺服器啟動於 `http://localhost:5174`，自動開啟瀏覽器。

### 建置

```bash
npm run build
```

產出至 `dist/` 目錄，建置時會自動進行 TypeScript 型別檢查。

建置產物自動分割為以下 chunks：
- `react-core` — React、ReactDOM
- `antd-core` — Ant Design
- `utils` — Axios、Socket.IO Client

### 預覽建置產物

```bash
npm run preview
```

### 程式碼檢查

```bash
npm run lint
```

## API 端點

所有請求（除登入外）透過 `X-Session-ID` Request Header 進行認證。

| 方法 | 端點 | 說明 | 請求參數 |
|---|---|---|---|
| POST | `/api/control/login` | 操作員登入 | `{ username, password }` |
| POST | `/api/control/logout` | 登出 | — |
| GET | `/api/control/status` | 取得當前回合狀態與統計 | `?detailed=true` 取得細項 |
| POST | `/api/control/start-round` | 開始新期數 | — |
| POST | `/api/control/close-betting` | 封盤 | `{ roundId }` |
| POST | `/api/control/input-result` | 輸入開獎結果 | `{ roundId, result: number[] }` |
| POST | `/api/control/confirm-result` | 確認開獎 | `{ roundId }` |
| POST | `/api/control/void-round` | 宣告無效局 | `{ roundId, reason }` |
| GET | `/api/control/logs` | 查詢操作日誌 | `?page=1&limit=20` |

## WebSocket 事件

| 事件 | 資料格式 | 說明 |
|---|---|---|
| `new-bet`（單筆） | `{ roundId, userId, betType, position, amount }` | 單筆新投注 |
| `new-bet`（批量） | `{ roundId, userId, betCount, totalAmount }` | 批量新投注 |
| `round-started` | `{ roundId }` | 新期數已開始 |
| `betting-closed` | `{ roundId }` | 封盤完成 |
| `result-confirmed` | `{ roundId }` | 開獎完成 |
| `round-voided` | `{ roundId, reason, voidedAt }` | 宣告無效局 |

## 回合狀態流程

```
                              ┌─── voided（已宣告無效）
                              │
betting → closed → playing → inputting → settling → finished
 下注中    已封盤   遊戲進行中  輸入結果中    結算中     已完成

※ 任何進行中狀態（betting / closed / playing / inputting）皆可宣告無效局
```

## 頁面路由

| 路徑 | 元件 | 說明 |
|---|---|---|
| `/login` | LoginForm | 登入頁（已登入自動跳轉至 `/`） |
| `/` | ControlPanel | 主控台（未登入自動跳轉至 `/login`） |
| `*` | — | 其他路徑重導至 `/` |
