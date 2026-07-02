// BookingModal — terminal-window dialog for booking a call (docs/features/
// call-booking.md). Mounted ONCE in ClientContact. Like DemoModal it owns no
// buttons: it intercepts clicks on any `[data-book]` element, so the CTA stays
// a plain Astro anchor whose mailto href remains the no-JS fallback.
// The island is i18n-dumb: every visible string arrives via `labels`.
import { useEffect, useRef, useState } from 'preact/hooks';
import './BookingModal.css';

export interface BookingLabels {
  title: string;
  loading: string;
  empty: string;
  tzNote: string;
  name: string;
  email: string;
  submit: string;
  submitting: string;
  confirmTitle: string;
  confirmBody: string; // shown above the meet link
  error: string;
  back: string;
  close: string;
}

interface Slot {
  start: string;
  end: string;
}

export default function BookingModal({ labels }: { labels: BookingLabels }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Global click delegation: any [data-book] element opens the modal.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-book]');
      if (!target) return;
      e.preventDefault(); // swallow the mailto fallback — we take it from here
      triggerRef.current = target;
      setOpen(true);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // While open: ESC closes, page behind is scroll-locked (same as DemoModal).
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);

  return (
    <div class="bookmodal" role="dialog" aria-modal="true" aria-label={labels.title}>
      <div class="bookmodal__backdrop" onClick={close} />
      <div class="bookmodal__panel">
        <header class="bookmodal__bar">
          <span class="bookmodal__title">{labels.title}</span>
          <button ref={closeRef} class="bookmodal__close" onClick={close} aria-label={labels.close}>
            ✕
          </button>
        </header>
        <BookingFlow labels={labels} />
      </div>
    </div>
  );
}

// Slots arrive as UTC instants; all grouping/formatting below uses the
// visitor's own timezone (no timeZone option = browser default), so a Lisbon
// 19:00 slot correctly shows as 15:00 — or even tomorrow — elsewhere.
const dayFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

function groupByLocalDay(slots: Slot[]): Map<string, Slot[]> {
  const days = new Map<string, Slot[]>();
  for (const s of slots) {
    const day = dayFmt.format(new Date(s.start));
    const list = days.get(day) ?? [];
    list.push(s);
    days.set(day, list);
  }
  return days; // Map keeps insertion order = chronological (API sorts)
}

function BookingFlow({ labels }: { labels: BookingLabels }) {
  const [slots, setSlots] = useState<Slot[] | null>(null); // null = loading
  const [failed, setFailed] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { slots: Slot[] }) => setSlots(data.slots))
      .catch(() => setFailed(true));
  }, []);

  if (failed) return <p class="bookmodal__status">{labels.error}</p>;
  if (!slots) return <p class="bookmodal__status">{labels.loading}</p>;
  if (slots.length === 0) return <p class="bookmodal__status">{labels.empty}</p>;

  const days = groupByLocalDay(slots);
  const activeDay = day ?? days.keys().next().value!;

  return (
    <div class="bookmodal__body bookmodal__enter">
      <p class="bookmodal__tz">{labels.tzNote}</p>
      <div class="bookmodal__days" role="tablist">
        {[...days.keys()].map((d) => (
          <button
            role="tab"
            aria-selected={d === activeDay}
            class={`bookmodal__day${d === activeDay ? ' is-active' : ''}`}
            onClick={() => {
              setDay(d);
              setSlot(null); // switching day drops the picked time
            }}
          >
            {d}
          </button>
        ))}
      </div>
      <div class="bookmodal__times">
        {days.get(activeDay)!.map((s) => (
          <button
            class={`bookmodal__time${slot?.start === s.start ? ' is-active' : ''}`}
            onClick={() => setSlot(s)}
          >
            {timeFmt.format(new Date(s.start))}
          </button>
        ))}
      </div>
      {slot && <BookingForm labels={labels} slot={slot} />}
    </div>
  );
}

const dateTimeFmt = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

function BookingForm({ labels, slot }: { labels: BookingLabels; slot: Slot }) {
  const [phase, setPhase] = useState<'form' | 'submitting' | 'done' | 'error'>('form');
  const [meetLink, setMeetLink] = useState('');

  async function onSubmit(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    setPhase('submitting');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          start: slot.start,
          name: data.get('name'),
          email: data.get('email'),
          website: data.get('website'), // honeypot — humans submit it empty
        }),
      });
      if (!res.ok) throw new Error();
      const out = (await res.json()) as { meetLink?: string };
      setMeetLink(out.meetLink ?? '');
      setPhase('done');
    } catch {
      setPhase('error'); // slot may be gone or server hiccup — form stays filled
    }
  }

  if (phase === 'done') {
    return (
      <div class="bookmodal__confirm bookmodal__enter" role="status">
        <p class="bookmodal__confirm-title">{labels.confirmTitle}</p>
        <p>
          {dateTimeFmt.format(new Date(slot.start))} — {labels.confirmBody}
        </p>
        {meetLink && (
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            {meetLink}
          </a>
        )}
      </div>
    );
  }

  return (
    <form class="bookmodal__form bookmodal__enter" onSubmit={onSubmit}>
      <p class="bookmodal__picked">→ {dateTimeFmt.format(new Date(slot.start))}</p>
      {phase === 'error' && <p class="bookmodal__error bookmodal__enter">{labels.error}</p>}
      <label>
        {labels.name}
        <input name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" />
      </label>
      <label>
        {labels.email}
        <input name="email" type="email" required maxLength={120} autoComplete="email" />
      </label>
      {/* Honeypot: visually removed, still in the DOM for naive bots. */}
      <label class="bookmodal__hp" aria-hidden="true">
        website
        <input name="website" type="text" tabindex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={phase === 'submitting'}>
        {phase === 'submitting' ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
