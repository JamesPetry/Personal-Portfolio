import { useLayoutEffect, useRef } from 'react';
import { method, site } from '../content';
import Reveal from '../lib/Reveal';
import { useFigure } from '../lib/useFigure';
import { gsap, reduced } from '../lib/motion';

export default function Method() {
  const fig = useFigure(10);
  const list = useRef<HTMLOListElement>(null);
  const tools = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const a = gsap.from(list.current!.children, { y: 16, autoAlpha: 0, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: list.current, start: 'top 80%', once: true } });
    const b = gsap.from(tools.current!.children, { y: -14, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: tools.current, start: 'top 90%', once: true } });
    return () => [a, b].forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
  }, []);
  return (
    <section id="method" className="method frame" data-label="Method">
      <div className="method__top label label--mute"><span>{method.label}</span><span>Propose · Resolve · Check · Commit</span></div>
      <div className="grid method__row">
        <div className="method__left">
          <div ref={fig} className="fig method__fig"><img src={method.image} alt="" /></div>
          <ol ref={list} className="method__steps">
            {method.stages.map((s) => (
              <li key={s.n}>
                <span className="label label--mute">{s.n}</span>
                <span className="method__name">{s.name}</span>
                <span className="method__text">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="method__right">
          <Reveal className="lead method__lead">{method.lead}</Reveal>
          <Reveal className="lead method__lead" delay={0.1}>{method.lead2}</Reveal>
          <ul ref={tools} className="method__tools">
            {site.tools.map((t) => <li key={t} className="chip">{t}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
