// API 端點
export const API_ENDPOINTS = {
  LOGIN: '/api/control/login',
  LOGOUT: '/api/control/logout',
  STATUS: '/api/control/status',
  START_ROUND: '/api/control/start-round',
  CLOSE_BETTING: '/api/control/close-betting',
  INPUT_RESULT: '/api/control/input-result',
  CONFIRM_RESULT: '/api/control/confirm-result',
  VOID_ROUND: '/api/control/void-round',
  LOGS: '/api/control/logs',
} as const;

// SessionStorage keys
export const STORAGE_KEYS = {
  SESSION_ID: 'controlSessionId',
  OPERATOR: 'controlOperator',
} as const;

// 回合狀態對應中文
export const ROUND_STATUS_MAP: Record<string, string> = {
  betting: '下注中',
  closed: '已封盤',
  playing: '遊戲進行中',
  inputting: '輸入結果中',
  settling: '結算中',
  finished: '已完成',
  voided: '已宣告無效',
};

// 選手號碼（1-10）
export const PLAYER_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

// 狀態輪詢間隔（毫秒）
export const STATUS_POLL_INTERVAL = 5000;

// 最大日誌條數
export const MAX_LOG_ENTRIES = 50;
