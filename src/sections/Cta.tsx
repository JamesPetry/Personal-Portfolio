import { cta, site } from '../content';
import Reveal from '../lib/Reveal';

export default function Cta() {
  const [a, b, c] = cta.headline;
  return (
    <section id="connect" className="cta frame" data-label="Connect">
      <h2 className="display">
        <Reveal as="span" className="line">{a}</Reveal>
        <Reveal as="span" className="line line--in" delay={0.1}>{b}</Reveal>
        <Reveal as="span" className="line line--r" delay={0.2}>{c}</Reveal>
      </h2>
      <div className="cta__row">
        <a href={`mailto:${site.email}`} className="pill">{cta.button}</a>
        <span className="label label--mute">{site.city}</span>
      </div>
    </section>
  );
}
