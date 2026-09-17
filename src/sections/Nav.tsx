import { useEffect, useRef } from 'react';
import { site } from '../content';
import { gsap, ScrollTrigger } from '../lib/motion';

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    // Over the hero the nav is white via blend; once the hero leaves, it becomes ink on paper.
    const st = ScrollTrigger.create({
      trigger: '#top', start: 'bottom 60px',
      onEnter: () => el.classList.add('is-paper'),
      onLeaveBack: () => el.classList.remove('is-paper'),
    });
    gsap.from(el.children, { y: -12, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.6 });
    return () => st.kill();
  }, []);
  return (
    <header ref={ref} className="nav frame">
      <a href="#top" className="nav__mark">{site.name}</a>
      <nav className="nav__links label" aria-label="Primary">
        {site.nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
      </nav>
      <a href={`mailto:${site.email}`} className="pill pill--paper nav__cta">Get in touch</a>
    </header>
  );
}
