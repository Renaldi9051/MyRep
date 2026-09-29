import { useEffect, useLayoutEffect, useRef, type MouseEvent } from 'react';
import { haptic } from '../lib/device';

const HOLD_DELAY_MS = 450;
const REPEAT_MS = 80;

// Tap = satu langkah; tahan = ulang cepat (mis. beban 0 → 100 kg tanpa 40 kali tap)
export function useHoldRepeat(action: () => void, disabled = false) {
  const actionRef = useRef(action);
  const holdTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const repeatTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const repeated = useRef(false);

  useLayoutEffect(() => {
    actionRef.current = action;
  });

  const stop = () => {
    clearTimeout(holdTimer.current);
    clearInterval(repeatTimer.current);
  };

  useEffect(() => stop, []);
  useEffect(() => {
    if (disabled) stop();
  }, [disabled]);

  return {
    onPointerDown: () => {
      if (disabled) return;
      repeated.current = false;
      stop();
      holdTimer.current = setTimeout(() => {
        repeated.current = true;
        repeatTimer.current = setInterval(() => {
          actionRef.current();
          haptic(6);
        }, REPEAT_MS);
      }, HOLD_DELAY_MS);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onClick: () => {
      // Klik setelah menahan jangan menambah satu langkah lagi
      if (repeated.current) {
        repeated.current = false;
        return;
      }
      actionRef.current();
      haptic();
    },
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
  };
}
