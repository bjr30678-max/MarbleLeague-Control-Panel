import { useCallback, useEffect, useRef, useState } from 'react';

export const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<string>('-');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft('-');
  }, []);

  const start = useCallback((endTime: string) => {
    stop();

    const update = () => {
      const now = Date.now();
      const end = new Date(endTime).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      if (diff <= 0) {
        stop();
      }
    };

    update();
    intervalRef.current = setInterval(update, 1000);
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { timeLeft, start, stop };
};
