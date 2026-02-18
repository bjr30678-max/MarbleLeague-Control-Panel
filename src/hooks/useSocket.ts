import type { LogLevel } from '@/types';
import { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_WS_URL || 'https://api.bjr8888.com');

interface UseSocketOptions {
  onEvent: (level: LogLevel, message: string) => void;
  onStatusChange: () => void;
}

export const useSocket = (
  isConnected: boolean,
  { onEvent, onStatusChange }: UseSocketOptions,
) => {
  const socketRef = useRef<Socket | null>(null);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      disconnect();
      return;
    }

    const socket = io(WS_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      onEvent('success', '已連接到伺服器');
    });

    socket.on('disconnect', () => {
      onEvent('error', '與伺服器斷開連線');
    });

    socket.on('new-bet', (data: { userId: string; betType: string; amount: number }) => {
      onEvent('info', `新投注 - 用戶: ${data.userId}, 類型: ${data.betType}, 金額: ${data.amount}`);
      onStatusChange();
    });

    socket.on('round-started', (data: { roundId: string }) => {
      onEvent('success', `期數 ${data.roundId} 已開始`);
      onStatusChange();
    });

    socket.on('betting-closed', (data: { roundId: string }) => {
      onEvent('warning', `期數 ${data.roundId} 已封盤`);
      onStatusChange();
    });

    socket.on('result-confirmed', (data: { roundId: string }) => {
      onEvent('success', `期數 ${data.roundId} 開獎完成`);
      onStatusChange();
    });

    return () => {
      socket.disconnect();
    };
  }, [isConnected, onEvent, onStatusChange, disconnect]);

  return { disconnect };
};
