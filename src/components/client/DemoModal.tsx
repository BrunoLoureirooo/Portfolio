// DemoModal — one floating window that frames a live demo site in an <iframe>.
// Mounted ONCE (in ClientWork). It doesn't own any buttons; instead it listens
// for clicks anywhere on a `[data-demo-url]` element (event delegation), so the
// SampleCards can stay static Astro with zero per-card JS. The iframe `src` is
// only set while open → the demo site isn't fetched until you ask for it.
import { useEffect, useRef, useState } from 'preact/hooks';
import './DemoModal.css';

interface OpenState {
  url: string;
  title: string;
}

// Labels come from Astro as props (i18n resolved at build, per locale) —
// the island itself is i18n-dumb, same pattern as BookingModal.
interface Props {
  labels: {
    open: string;
    close: string;
    loading: string;
  };
}

export default function DemoModal({ labels }: Props) {
  const [demo, setDemo] = useState<OpenState | null>(null);
  // False until the iframe fires `load` — drives the loader + iframe fade-in,
  // so there's no white flash while the demo site fetches.
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Global click delegation: any element carrying data-demo-url opens the modal.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-demo-url]');
      if (!target) return;
      e.preventDefault();
      triggerRef.current = target; // remember where focus was, to restore on close
      setLoaded(false); // fresh open → fresh loader
      setDemo({
        url: target.dataset.demoUrl!,
        title: target.dataset.demoTitle ?? 'demo',
      });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // While open: ESC closes, and the page behind is scroll-locked so scrolling
  // the demo doesn't bleed into the portfolio. Both undo on close/unmount.
  useEffect(() => {
    if (!demo) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDemo(null);
      // Focus trap: aria-modal promises focus stays inside — wrap Tab at the
      // edges. (Once focus is INSIDE the cross-origin iframe the parent page
      // can't see keys; the trap re-engages when focus tabs back out.)
      if (e.key === 'Tab' && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, iframe',
        );
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus(); // move focus into the dialog on open
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus(); // restore focus to the card button on close
    };
  }, [demo]);

  if (!demo) return null;

  const close = () => setDemo(null);

  return (
    <div class="demomodal" role="dialog" aria-modal="true" aria-label={demo.title}>
      <div class="demomodal__backdrop" onClick={close} />
      <div ref={panelRef} class="demomodal__panel">
        <header class="demomodal__bar">
          {/* Traffic lights, mirroring the page title bar: red is the real
              close control (same semantic as the layout's red → exit program),
              yellow/green stay decorative. */}
          <div class="demomodal__dots">
            <button
              ref={closeRef}
              type="button"
              class="demomodal__dot demomodal__dot--red"
              onClick={close}
              aria-label={labels.close}
              title={labels.close}
            />
            <span class="demomodal__dot demomodal__dot--yellow" aria-hidden="true" />
            <span class="demomodal__dot demomodal__dot--green" aria-hidden="true" />
          </div>
          <span class="demomodal__title">{demo.title}</span>
          <a
            class="demomodal__open"
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {labels.open}
          </a>
        </header>
        <div class="demomodal__viewport">
          {!loaded && (
            <p class="demomodal__loading" role="status">
              {labels.loading}
              <span class="demomodal__cursor" aria-hidden="true">
                ▮
              </span>
            </p>
          )}
          <iframe
            class={`demomodal__frame ${loaded ? 'is-loaded' : ''}`}
            src={demo.url}
            title={demo.title}
            onLoad={() => setLoaded(true)}
          />
        </div>
        {/* Focus sentinel: tabbing out of the iframe's document can't be seen
            by our keydown trap (events stay in the child doc) — instead the
            exiting focus lands here and gets punted back to the first control. */}
        <span
          tabindex={0}
          class="demomodal__sentinel"
          onFocus={() => closeRef.current?.focus()}
        />
      </div>
    </div>
  );
}
