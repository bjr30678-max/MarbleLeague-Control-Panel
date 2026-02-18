import { ROUND_STATUS_MAP } from '@/constants';
import { useCountdown } from '@/hooks/useCountdown';
import type { GameRound } from '@/types';
import {
  CaretRightOutlined,
  LockOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { App, Button, Card, Space } from 'antd';
import { useEffect, useState } from 'react';
import ResultInput from './ResultInput';

interface GameControlProps {
  round: GameRound | null;
  loading: boolean;
  onStartRound: () => Promise<{ success: boolean; error?: string }>;
  onCloseBetting: (roundId: string) => Promise<{ success: boolean; error?: string }>;
  onSubmitResult: (roundId: string, result: number[]) => Promise<{ success: boolean; error?: string }>;
}

const getStatusDotClass = (status?: string): string => {
  switch (status) {
    case 'betting': return 'status-dot betting';
    case 'closed':
    case 'playing':
    case 'inputting':
    case 'settling': return 'status-dot active';
    default: return 'status-dot idle';
  }
};

const getStatusTagClass = (status?: string): string => {
  if (!status) return 'round-status-tag idle';
  return `round-status-tag ${status}`;
};

const GameControl: React.FC<GameControlProps> = ({
  round,
  loading,
  onStartRound,
  onCloseBetting,
  onSubmitResult,
}) => {
  const { timeLeft, start, stop } = useCountdown();
  const { message, modal } = App.useApp();
  const [showResultInput, setShowResultInput] = useState(false);

  useEffect(() => {
    if (round?.status === 'betting' && round.betEndTime) {
      start(round.betEndTime);
    } else {
      stop();
    }
  }, [round?.status, round?.betEndTime, start, stop]);

  const handleStartRound = () => {
    modal.confirm({
      title: '開始新期數',
      content: '確定要開始新的遊戲期數嗎？',
      okText: '確認',
      cancelText: '取消',
      onOk: async () => {
        const data = await onStartRound();
        if (data.success) {
          message.success('新期數已開始');
        } else {
          message.error(data.error || '操作失敗');
        }
      },
    });
  };

  const handleCloseBetting = () => {
    if (!round) return;
    modal.confirm({
      title: '提前封盤',
      content: '確定要提前結束下注嗎？',
      okText: '確認',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        const data = await onCloseBetting(round.roundId);
        if (data.success) {
          message.success('已封盤');
        } else {
          message.error(data.error || '操作失敗');
        }
      },
    });
  };

  const handleSubmitResult = async (result: number[]) => {
    if (!round) return;
    const resultStr = result.join(', ');
    modal.confirm({
      title: '確認開獎結果',
      content: `開獎結果為：${resultStr}\n確定要提交嗎？`,
      okText: '確認',
      cancelText: '取消',
      onOk: async () => {
        const data = await onSubmitResult(round.roundId, result);
        if (data.success) {
          message.success('開獎完成');
          setShowResultInput(false);
        } else {
          message.error(data.error || '開獎失敗');
        }
      },
    });
  };

  const canStart = !round || round.status === 'finished';
  const canClose = round?.status === 'betting';
  const canResult = round?.status === 'playing' || round?.status === 'inputting';
  const statusText = round ? (ROUND_STATUS_MAP[round.status] || round.status) : '等待開局';

  return (
    <Card
      title={
        <Space>
          <span className={getStatusDotClass(round?.status)} />
          <span>遊戲控制</span>
        </Space>
      }
      style={{ height: '100%' }}
    >
      <div style={{ background: 'var(--bg-inner)', borderRadius: 10, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--border-color)' }}>
        <div className="status-info-row">
          <span className="status-label">當前期數</span>
          <span className="status-value">{round?.roundId || '-'}</span>
        </div>
        <div className="status-info-row">
          <span className="status-label">期數狀態</span>
          <span className={getStatusTagClass(round?.status || 'idle')}>{statusText}</span>
        </div>
        <div className="status-info-row">
          <span className="status-label">剩餘時間</span>
          <span className="status-value countdown">{timeLeft}</span>
        </div>
      </div>

      {!showResultInput && (
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <Button
            type="primary"
            size="large"
            block
            disabled={!canStart || loading}
            loading={loading}
            icon={<CaretRightOutlined />}
            onClick={handleStartRound}
            className="btn-start"
          >
            開始新回合
          </Button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Button
              danger
              size="large"
              disabled={!canClose || loading}
              onClick={handleCloseBetting}
              icon={<LockOutlined />}
              className="btn-close-bet"
            >
              提前封盤
            </Button>
            <Button
              size="large"
              disabled={!canResult || loading}
              onClick={() => setShowResultInput(true)}
              icon={<TrophyOutlined />}
              className="btn-input-result"
            >
              輸入結果
            </Button>
          </div>
        </Space>
      )}

      {showResultInput && (
        <ResultInput
          onSubmit={handleSubmitResult}
          onCancel={() => setShowResultInput(false)}
          loading={loading}
        />
      )}
    </Card>
  );
};

export default GameControl;
