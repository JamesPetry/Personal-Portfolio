import { footer, site } from '../content';

/** Sits behind <main> and is revealed as the page lifts off it (see .footer in sections.css). */
export default function Footer() {
  return (
    <footer className="footer frame">
      <div className="grid footer__top">
        <nav className="footer__nav" aria-label="Footer">
          <span className="label label--mute">Navigation</span>
          {footer.nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="footer__ack">
          <span className="label label--mute">Acknowledgement</span>
          <p className="footer__small">{footer.acknowledgement}</p>
        </div>
        <div className="footer__info">
          <span className="label label--mute">Info</span>
          <p className="footer__small">
            {site.city}<br />
            <a href={`mailto:${site.email}`}>{site.email}</a><br />
            <a href={site.phoneHref}>{site.phone}</a><br />
            <a href={site.webHref} target="_blank" rel="noreferrer">{site.web}</a>
          </p>
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__mark" aria-label={site.fullName}>{site.mark}</span>
        <div className="footer__legal label label--mute">
          <span>© {new Date().getFullYear()} {site.fullName}</span>
          <span>{site.role}</span>
          <span>{site.coords}</span>
        </div>
      </div>
    </footer>
  );
}
