import { useLayoutEffect, useRef, useState } from 'react';
import { projects, type Project } from '../content';
import Reveal from '../lib/Reveal';
import { useFigure } from '../lib/useFigure';
import { gsap, ScrollTrigger, reduced } from '../lib/motion';

function Card({ p }: { p: Project }) {
  const fig = useFigure(14);
  return (
    <a href={`#${p.slug}`} className={`card card--${p.span}`} data-cursor="open">
      <div ref={fig} className="fig card__fig"><img src={p.cover} alt={p.title} /></div>
      <div className="card__cap label">
        <span>{p.index}<span className="card__dash">—</span>{p.short}</span>
        <span className="label--mute">{p.year}</span>
      </div>
    </a>
  );
}

/** Pinned scroll story: three stages (ideation → process → product) for one project.
    The image column stays put while the copy and a progress rule move with scroll. */
function Story({ p }: { p: Project }) {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const n = p.story.length;
  useLayoutEffect(() => {
    const el = root.current!;
    const bar = el.querySelector<HTMLElement>('.story__bar')!;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => {
        setI(Math.min(n - 1, Math.floor(s.progress * n)));
        bar.style.transform = `scaleY(${s.progress})`;
      },
    });
    if (!reduced()) {
      const imgs = el.querySelectorAll<HTMLElement>('.story__img');
      gsap.fromTo(imgs, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true } });
    }
    return () => st.kill();
  }, [n]);
  return (
    <article id={p.slug} ref={root} className="story" style={{ height: `${n * 100}svh` }}>
      <div className="story__stick">
        <div className="story__pics">
          {p.story.map((s, k) => (
            <div key={s.label} className={`story__img${k === i ? ' is-on' : ''}`}><img src={s.image} alt="" /></div>
          ))}
        </div>
        <div className="story__rail"><span className="story__bar" /></div>
        <div className="story__head frame label">
          <span>{p.index}<span className="card__dash">—</span>{p.short}</span>
          <span className="label--mute">{p.type} · {p.year}</span>
        </div>
        <div className="story__copy frame">
          <ol className="story__steps label">
            {p.story.map((s, k) => <li key={s.label} className={k === i ? 'is-on' : ''}>{s.label}</li>)}
          </ol>
          {p.story.map((s, k) => (
            <div key={s.label} className={`story__stage${k === i ? ' is-on' : ''}`} aria-hidden={k !== i}>
              <h3 className="lead">{s.title}</h3>
              <p className="body">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Works() {
  return (
    <section id="works" className="works" data-label="Works">
      <div className="frame">
        <h2 className="display works__h">
          <Reveal as="span" className="line">Selected</Reveal>
          <Reveal as="span" className="line line--in" delay={0.1}>Works</Reveal>
          <span className="works__count">({String(projects.length).padStart(2, '0')})</span>
        </h2>
      </div>
      <div className="works__grid frame">
        {projects.map((p) => <Card key={p.slug} p={p} />)}
      </div>
      <div className="frame works__note label label--mute">
        <span>Each work, from ideation to product</span><span>Scroll</span>
      </div>
      {projects.map((p) => <Story key={p.slug} p={p} />)}
    </section>
  );
}
