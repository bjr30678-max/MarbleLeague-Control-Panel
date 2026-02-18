import { MAX_LOG_ENTRIES } from '@/constants';
import type { LogEntry, LogLevel } from '@/types';
import { useCallback, useState } from 'react';

let logId = 0;

export const useOperationLog = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((level: LogLevel, message: string) => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);

    setLogs((prev) => {
      const newLogs = [{ id: ++logId, level, message, time }, ...prev];
      return newLogs.slice(0, MAX_LOG_ENTRIES);
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, clearLogs };
};
