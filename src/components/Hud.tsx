import { useEffect, useRef } from 'react'
import './hud.css'

/** Zero-padded 4-digit pixel readout, e.g. 0412. */
const pad = (n: number) => String(Math.max(0, Math.min(9999, Math.round(n)))).padStart(4, '0')

/**
 * Hud — a fixed, non-interactive CAD-style readout.
 * Bottom-left: live cursor position. Bottom-right: scroll progress + section.
 * Values are written straight to the DOM inside a rAF so scrolling never
 * triggers a React render.
 */
export default function Hud() {
  const posRef = useRef<HTMLSpanElement>(null)
  const scrollRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    let x = 0
    let y = 0

    const render = () => {
      frame = 0

      if (posRef.current) posRef.current.textContent = `X ${pad(x)} Y ${pad(y)}`

      const doc = document.documentElement
      const max = Math.max(1, doc.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
      if (scrollRef.current) scrollRef.current.textContent = progress.toFixed(3)

      // Last section whose top has crossed 40% of the viewport.
      const line = window.innerHeight * 0.4
      let label = ''
      const sections = document.querySelectorAll<HTMLElement>('section[data-label]')
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) label = section.dataset.label ?? ''
      }
      if (labelRef.current && labelRef.current.textContent !== label) {
        labelRef.current.textContent = label
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div className="hud" aria-hidden="true">
      <span className="hud__pos" ref={posRef}>
        X 0000 Y 0000
      </span>
      <span className="hud__meta">
        <span className="hud__label" ref={labelRef} />
        <span className="hud__scroll">
          Scroll&nbsp;
          <span ref={scrollRef}>0.000</span>
        </span>
      </span>
    </div>
  )
}
