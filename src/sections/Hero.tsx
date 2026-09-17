import { useLayoutEffect, useRef } from 'react';
import { hero, site } from '../content';
import { gsap, reduced } from '../lib/motion';
import Reveal from '../lib/Reveal';

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const el = root.current!, pic = img.current!;
    if (reduced()) return;
    // entrance: image settles from a zoom; overlay rows slide in
    gsap.fromTo(pic, { scale: 1.2 }, { scale: 1.08, duration: 2.2, ease: 'power3.out' });
    gsap.from(el.querySelectorAll('.hero__meta > *'), { y: 10, autoAlpha: 0, stagger: 0.06, duration: 1, delay: 1, ease: 'power3.out' });
    // scroll: the picture holds and darkens while the text lifts off
    const scrub = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
      .to(pic, { yPercent: 18, scale: 1.0, ease: 'none' }, 0)
      .to(el.querySelector('.hero__shade'), { opacity: 0.55, ease: 'none' }, 0)
      .to(el.querySelectorAll('.hero__text, .hero__corner'), { yPercent: -30, autoAlpha: 0, ease: 'none' }, 0);
    // mouse: image drifts against the cursor by a few pixels
    const qx = gsap.quickTo(pic, 'x', { duration: 1.2, ease: 'power3' });
    const qy = gsap.quickTo(pic, 'y', { duration: 1.2, ease: 'power3' });
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5, dy = e.clientY / window.innerHeight - 0.5;
      qx(-dx * 24); qy(-dy * 16);
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); scrub.scrollTrigger?.kill(); scrub.kill(); };
  }, []);

  return (
    <section id="top" ref={root} className="hero" data-label="Home">
      <div className="hero__pic"><img ref={img} src={hero.image} alt="" /></div>
      <div className="hero__shade" />
      <div className="hero__meta frame label">
        {hero.meta.map((m) => (
          <div key={m.k} className="hero__kv"><span className="hero__k">{m.k}</span><span>{m.v}</span></div>
        ))}
        <a href="#works" className="hero__kv hero__kv--link" data-cursor="open"><span className="hero__k">Index</span><span>View project</span></a>
      </div>
      <div className="hero__foot frame">
        <Reveal as="p" className="hero__text lead" delay={1.1} start="top 100%">{hero.statement}</Reveal>
        <div className="hero__corner label">
          <span>{hero.corner}</span>
          <span>{site.coords}</span>
        </div>
      </div>
    </section>
  );
}
