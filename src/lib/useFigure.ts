import { useLayoutEffect, useRef } from 'react';
import { gsap, reduced } from './motion';

/** Clip-reveal on enter, light sweep, and a slow inner parallax for the lifetime of the figure. */
export function useFigure(parallax = 12) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const fig = ref.current!;
    const img = fig.querySelector('img')!;
    if (reduced()) return;
    gsap.set(fig, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(img, { scale: 1.18 });
    const reveal = gsap.to(fig, {
      clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut',
      scrollTrigger: { trigger: fig, start: 'top 88%', once: true },
      onStart: () => fig.classList.add('is-shimmer'),
    });
    const settle = gsap.to(img, {
      scale: 1.06, duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: fig, start: 'top 88%', once: true },
    });
    const drift = gsap.fromTo(img, { yPercent: -parallax / 2 }, {
      yPercent: parallax / 2, ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    return () => [reveal, settle, drift].forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, [parallax]);
  return ref;
}
