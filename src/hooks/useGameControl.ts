import { STATUS_POLL_INTERVAL } from '@/constants';
import { controlService } from '@/services/control.service';
import type { GameRound, RoundStats } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useGameControl = (isAuthenticated: boolean) => {
  const [round, setRound] = useState<GameRound | null>(null);
  const [stats, setStats] = useState<RoundStats | null>(null);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const data = await controlService.getStatus();
      setRound(data.round || null);
      setStats(data.stats || null);
    } catch {
      // 靜默失敗，避免打斷操作
    }
  }, []);

  // 啟動定時輪詢
  useEffect(() => {
    if (!isAuthenticated) return;

    loadStatus();
    pollRef.current = setInterval(loadStatus, STATUS_POLL_INTERVAL);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [isAuthenticated, loadStatus]);

  const startRound = useCallback(async () => {
    setLoading(true);
    try {
      const data = await controlService.startRound();
      if (data.success) {
        await loadStatus();
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, [loadStatus]);

  const closeBetting = useCallback(async (roundId: string) => {
    setLoading(true);
    try {
      const data = await controlService.closeBetting(roundId);
      if (data.success) {
        await loadStatus();
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, [loadStatus]);

  const submitResult = useCallback(async (roundId: string, result: number[]) => {
    setLoading(true);
    try {
      // 先輸入結果
      const inputData = await controlService.inputResult(roundId, result);
      if (!inputData.success) return inputData;

      // 確認開獎
      const confirmData = await controlService.confirmResult(roundId);
      if (confirmData.success) {
        await loadStatus();
      }
      return confirmData;
    } finally {
      setLoading(false);
    }
  }, [loadStatus]);

  const voidRound = useCallback(async (roundId: string, reason: string) => {
    setLoading(true);
    try {
      const data = await controlService.voidRound(roundId, reason);
      if (data.success) {
        await loadStatus();
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, [loadStatus]);

  // 防止投注中意外關閉
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (round?.status === 'betting') {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [round?.status]);

  return {
    round,
    stats,
    loading,
    loadStatus,
    startRound,
    closeBetting,
    submitResult,
    voidRound,
  };
};
