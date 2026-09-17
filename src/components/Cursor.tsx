import { useEffect, useRef, useState } from 'react'
import './cursor.css'

type Mode = 'idle' | 'link' | 'open'

const EASE = 0.18

/**
 * Cursor — a lerping ring that replaces the pointer over interactive elements.
 * Idle: 10px ring. `a`/`button`: 40px ring. `[data-cursor="open"]`: 56px + label.
 * Inert on coarse pointers; the native cursor is only hidden on [data-cursor].
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const [mode, setMode] = useState<Mode>('idle')

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty
    let raf = 0

    const tick = () => {
      cx += (tx - cx) * EASE
      cy += (ty - cy) * EASE
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('[data-cursor="open"]')) setMode('open')
      else if (target?.closest('a, button')) setMode('link')
      else setMode('idle')
    }

    const onLeave = () => setMode('idle')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className={`cursor cursor--${mode}`} ref={ref} aria-hidden="true">
      <span className="cursor__ring" />
      <span className="cursor__label">Open</span>
    </div>
  )
}
