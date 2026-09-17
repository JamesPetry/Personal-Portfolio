import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (reduced()) return () => {};
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis');
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const el = document.querySelector(a.getAttribute('href')!);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el as HTMLElement, { duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
  };
  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('click', onClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

/** Wrap each visual line of an element in a mask so it can slide up into view. */
export function splitLines(el: HTMLElement) {
  if (el.dataset.split) return Array.from(el.querySelectorAll<HTMLElement>('.rv-line'));
  const words = el.textContent!.trim().split(/\s+/);
  el.textContent = '';
  const spans = words.map((w) => {
    const s = document.createElement('span');
    s.textContent = w + ' ';
    el.appendChild(s);
    return s;
  });
  const lines: HTMLSpanElement[][] = [];
  let top: number | null = null;
  spans.forEach((s) => {
    const t = s.offsetTop;
    if (t !== top) { lines.push([]); top = t; }
    lines[lines.length - 1].push(s);
  });
  el.textContent = '';
  const out = lines.map((ws) => {
    const mask = document.createElement('span');
    mask.className = 'rv-mask';
    const line = document.createElement('span');
    line.className = 'rv-line';
    line.textContent = ws.map((w) => w.textContent!.trim()).join(' ');
    mask.appendChild(line);
    el.appendChild(mask);
    return line;
  });
  el.dataset.split = '1';
  return out;
}

export { gsap, ScrollTrigger };
