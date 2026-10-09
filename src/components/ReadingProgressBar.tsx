import React, { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  /** Optional custom scrollable container reference; defaults to window scroll */
  targetRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ targetRef, className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    if (targetRef && targetRef.current) {
      const element = targetRef.current;
      const updateTargetProgress = () => {
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        if (scrollHeight > 0) {
          const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
          setProgress(percent);
        } else {
          setProgress(0);
        }
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateTargetProgress);
          ticking = true;
        }
      };

      element.addEventListener('scroll', onScroll, { passive: true });
      updateTargetProgress();

      return () => element.removeEventListener('scroll', onScroll);
    }

    // Window scroll tracking
    const updateWindowProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setProgress(percent);
      } else {
        setProgress(0);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateWindowProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateWindowProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetRef]);

  return (
    <div
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed top-0 left-0 right-0 z-50 h-[3.5px] pointer-events-none bg-neutral-200/40 dark:bg-neutral-800/40 ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-[#C8102E] via-[#E02947] to-[#FF3B56] dark:from-[#FF3B56] dark:via-[#FF6B81] dark:to-[#FFA0B0] shadow-[0_0_10px_rgba(200,16,46,0.7)] dark:shadow-[0_0_12px_rgba(255,59,86,0.85)] transition-[width] duration-75 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
