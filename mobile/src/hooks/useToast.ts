import { useState, useCallback, useRef } from 'react';

interface UseToastResult {
  message: string;
  visible: boolean;
  show: (msg: string, durationMs?: number) => void;
}

export function useToast(): UseToastResult {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string, durationMs = 2500) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), durationMs);
  }, []);

  return { message, visible, show };
}
