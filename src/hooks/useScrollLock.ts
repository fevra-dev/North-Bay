import { useEffect } from 'react';

/**
 * SCROLL LOCK, WITHOUT THE LAYOUT SHIFT.
 *
 * Setting `overflow: hidden` on the body to stop background scrolling removes the scrollbar,
 * and the page snaps sideways by its width the instant a menu opens. Measuring the scrollbar's
 * actual on-screen width and padding the body by exactly that amount keeps the layout still.
 *
 * The measurement is taken live rather than assumed, because it is 0 on macOS with overlay
 * scrollbars, ~15px on Windows, and different again on Linux — a hardcoded value is wrong on
 * two of the three.
 *
 * The previous state is captured and restored rather than reset to a literal, so this hook
 * cannot clobber a body style something else set.
 */
export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isLocked]);
};
