import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, splitLines, reduced } from './motion';

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** 'lines' masks and slides each wrapped line; 'block' fades the whole node */
  mode?: 'lines' | 'block';
  delay?: number;
  start?: string;
};

/** Scroll-triggered text reveal. Lines are split at render time, so keep children as plain text. */
export default function Reveal({ as: Tag = 'p', className, children, mode = 'lines', delay = 0, start = 'top 85%' }: Props) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    if (reduced()) return;
    const orig = el.textContent;
    let targets: HTMLElement[];
    if (mode === 'lines') {
      targets = splitLines(el);
      gsap.set(targets, { yPercent: 110 });
    } else {
      targets = [el];
      gsap.set(el, { autoAlpha: 0, y: 18 });
    }
    const tw = gsap.to(targets, {
      yPercent: 0, y: 0, autoAlpha: 1,
      duration: 1.1, ease: 'power4.out', stagger: 0.09, delay,
      scrollTrigger: { trigger: el, start, once: true },
      onComplete: () => { if (mode === 'lines') { el.textContent = orig; delete el.dataset.split; } },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, [mode, delay, start]);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

/** Re-measure lines on resize; called once from App. */
export function refreshOnResize() {
  let t = 0;
  const on = () => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 200); };
  window.addEventListener('resize', on);
  return () => window.removeEventListener('resize', on);
}
