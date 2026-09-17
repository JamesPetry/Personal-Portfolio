import { useEffect } from 'react';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Practice from './sections/Practice';
import Works from './sections/Works';
import Method from './sections/Method';
import Cta from './sections/Cta';
import Footer from './sections/Footer';
import Hud from './components/Hud';
import Cursor from './components/Cursor';
import { startSmoothScroll, ScrollTrigger } from './lib/motion';
import { refreshOnResize } from './lib/Reveal';
import './styles/global.css';
import './styles/sections.css';

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    const off = refreshOnResize();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { stop(); off(); };
  }, []);
  return (
    <>
      <Nav />
      <main className="page">
        <Hero />
        <Practice />
        <Works />
        <Method />
        <Cta />
      </main>
      <Footer />
      <Hud />
      <Cursor />
    </>
  );
}
