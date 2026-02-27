import { useAuth } from '@/contexts/AuthContext';
import { useGameControl } from '@/hooks/useGameControl';
import { useOperationLog } from '@/hooks/useOperationLog';
import { useSocket } from '@/hooks/useSocket';
import { useCallback } from 'react';
import ControlHeader from './ControlHeader';
import GameControl from './GameControl';
import OperationLog from './OperationLog';
import StatsPanel from './StatsPanel';

const ControlPanel: React.FC = () => {
  const { isAuthenticated, operator } = useAuth();
  const { logs, addLog } = useOperationLog();
  const { round, stats, loading, loadStatus, startRound, closeBetting, submitResult, voidRound } = useGameControl(isAuthenticated);

  const handleSocketEvent = useCallback(
    (level: 'info' | 'success' | 'warning' | 'error', message: string) => {
      addLog(level, message);
    },
    [addLog],
  );

  const handleStatusChange = useCallback(() => {
    loadStatus();
  }, [loadStatus]);

  useSocket(isAuthenticated, {
    onEvent: handleSocketEvent,
    onStatusChange: handleStatusChange,
  });

  if (isAuthenticated && operator && logs.length === 0) {
    addLog('info', `${operator.name} 登入系統`);
  }

  const handleStartRound = async () => {
    const data = await startRound();
    if (data.success && data.round) {
      addLog('success', `開始新期數: ${data.round.roundId}`);
    }
    return data;
  };

  const handleCloseBetting = async (roundId: string) => {
    const data = await closeBetting(roundId);
    if (data.success) {
      addLog('warning', `期數 ${roundId} 已封盤`);
    }
    return data;
  };

  const handleSubmitResult = async (roundId: string, result: number[]) => {
    const data = await submitResult(roundId, result);
    if (data.success) {
      addLog('success', `期數 ${roundId} 開獎完成, 結果: ${result.join(', ')}`);
    }
    return data;
  };

  const handleVoidRound = async (roundId: string, reason: string) => {
    const data = await voidRound(roundId, reason);
    if (data.success) {
      addLog('error', `期數 ${roundId} 已宣告無效局 - 原因: ${reason}`);
    }
    return data;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <ControlHeader />
      <div className="main-layout">
        <GameControl
          round={round}
          loading={loading}
          onStartRound={handleStartRound}
          onCloseBetting={handleCloseBetting}
          onSubmitResult={handleSubmitResult}
          onVoidRound={handleVoidRound}
        />
        <StatsPanel stats={stats} />
        <div style={{ gridColumn: 'span 2' }}>
          <OperationLog logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
