// ===== 認證相關 =====
export interface Operator {
  id: string;
  name: string;
  role: 'admin' | 'operator';
  username: string;
}

export interface LoginResponse {
  success: boolean;
  sessionId: string;
  operator: Operator;
  error?: string;
}

// ===== 遊戲回合 =====
export type RoundStatus = 'betting' | 'closed' | 'playing' | 'inputting' | 'settling' | 'finished' | 'voided';

export interface GameRound {
  roundId: string;
  status: RoundStatus;
  betEndTime?: string;
  result?: number[];
  createdAt?: string;
}

// ===== 統計 =====
export interface BetDetail {
  betTypeName: string;
  _sum: { betAmount: number | null };
  _count: { userId: number | null };
}

export interface TypeSummary {
  betTypeName: string;
  totalAmount: number;
  totalCount: number;
  details?: BetDetail[];
}

export interface PopularBet {
  betTypeName: string;
  betContentDisplay: string;
  count: number;
  totalAmount: number;
}

export interface RoundStats {
  totalBets: number;
  totalAmount: number;
  typeSummary?: TypeSummary[];
  popularBets?: PopularBet[];
}

export interface StatusResponse {
  success: boolean;
  round: GameRound | null;
  stats: RoundStats | null;
  recentResults?: GameRound[];
  error?: string;
}

// ===== 操作日誌 =====
export type LogLevel = 'info' | 'success' | 'warning' | 'error';

export interface LogEntry {
  id: number;
  level: LogLevel;
  message: string;
  time: string;
}

// ===== Socket 事件 =====
export interface NewBetSingleEvent {
  roundId: string;
  userId: string;
  betType: string;
  position: number | null;
  amount: number;
}

export interface NewBetBatchEvent {
  roundId: string;
  userId: string;
  betCount: number;
  totalAmount: number;
}

export type NewBetEvent = NewBetSingleEvent | NewBetBatchEvent;

// ===== API 通用回應 =====
export interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  round?: GameRound;
}
