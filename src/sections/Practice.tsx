import { useLayoutEffect, useRef } from 'react';
import { practice, site } from '../content';
import Reveal from '../lib/Reveal';
import { useFigure } from '../lib/useFigure';
import { gsap, reduced } from '../lib/motion';

export default function Practice() {
  const fig = useFigure(10);
  const stats = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const tw = gsap.from(stats.current!.children, {
      y: -24, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power4.out',
      scrollTrigger: { trigger: stats.current, start: 'top 85%', once: true },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);
  const [a, b, c] = practice.headline;
  return (
    <section id="practice" className="practice frame" data-label="Practice">
      <h2 className="display practice__h">
        <Reveal as="span" className="line">{a}</Reveal>
        <Reveal as="span" className="line" delay={0.1}>{b}</Reveal>
        <Reveal as="span" className="line line--r" delay={0.2}>{c}</Reveal>
      </h2>
      <div className="practice__row grid">
        <div ref={fig} className="fig practice__fig"><img src={practice.image} alt="" /></div>
        <div className="practice__copy">
          {practice.body.map((p) => <Reveal key={p} className="body">{p}</Reveal>)}
          <ul ref={stats} className="practice__stats">
            {practice.stats.map((s) => (
              <li key={s.k}><span className="practice__num">{s.v}</span><span className="label label--mute">{s.k}</span></li>
            ))}
          </ul>
          <a href="#method" className="pill">How I work</a>
        </div>
        <div className="practice__side label label--mute">
          <span>{practice.label}</span>
          <span>{site.role}</span>
        </div>
      </div>
    </section>
  );
}
