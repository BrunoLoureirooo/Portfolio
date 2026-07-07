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
  next: string;
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
          {/* Traffic lights, same contract as DemoModal / the page title bar:
              red is a real close button; yellow/green stay decorative. */}
          <div class="bookmodal__dots">
            <button
              ref={closeRef}
              type="button"
              class="bookmodal__dot bookmodal__dot--red"
              onClick={close}
              aria-label={labels.close}
              title={labels.close}
            />
            <span class="bookmodal__dot bookmodal__dot--yellow" aria-hidden="true" />
            <span class="bookmodal__dot bookmodal__dot--green" aria-hidden="true" />
          </div>
          <span class="bookmodal__title">{labels.title}</span>
        </header>
        <BookingFlow labels={labels} />
      </div>
    </div>
  );
}

// Slots arrive as UTC instants; all grouping/formatting below uses the
// visitor's own timezone (local Date methods = browser default), so a Lisbon
// 19:00 slot correctly shows as 15:00 — or even tomorrow — elsewhere.
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });

// Grouping key = the slot's LOCAL calendar date as "YYYY-MM-DD" — real date
// parts (not a display string) so the calendar grid can do month math on it.
function localDayKey(iso: string): string {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function groupByLocalDay(slots: Slot[]): Map<string, Slot[]> {
  const days = new Map<string, Slot[]>();
  for (const s of slots) {
    const day = localDayKey(s.start);
    const list = days.get(day) ?? [];
    list.push(s);
    days.set(day, list);
  }
  return days; // Map keeps insertion order = chronological (API sorts)
}

// Week starts Monday (European convention). 2024-01-01 was a Monday, so
// formatting Jan 1–7 2024 yields localized Mon…Sun labels for the header.
const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(undefined, { weekday: 'short' })
    .format(new Date(2024, 0, i + 1))
    .slice(0, 2),
);

function BookingFlow({ labels }: { labels: BookingLabels }) {
  const [slots, setSlots] = useState<Slot[] | null>(null); // null = loading
  const [failed, setFailed] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [viewYm, setViewYm] = useState<string | null>(null); // calendar month "YYYY-MM"
  const [step, setStep] = useState<'pick' | 'details'>('pick'); // 2-step wizard

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

  // Step 1: calendar + hours, and a continue button once a time is picked.
  // Step 2: the picker clears away; the choice lives on in a small header
  // (with a way back) above the name/email fields. `key` remounts the step
  // container on change, replaying the shared enter animation.
  return (
    <div class="bookmodal__body">
      {step === 'pick' ? (
        <div class="bookmodal__step bookmodal__enter" key="pick">
          <p class="bookmodal__tz">{labels.tzNote}</p>
          <CalendarGrid
            days={days}
            activeDay={activeDay}
            shownYm={viewYm ?? activeDay.slice(0, 7)}
            onNav={setViewYm}
            onPick={(d) => {
              setDay(d);
              setSlot(null); // switching day drops the picked time
            }}
          />
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
          {slot && (
            <button
              class="bookmodal__next bookmodal__enter"
              onClick={() => setStep('details')}
            >
              {labels.next}
            </button>
          )}
        </div>
      ) : (
        <div class="bookmodal__step bookmodal__enter" key="details">
          <BookingForm labels={labels} slot={slot!} onBack={() => setStep('pick')} />
        </div>
      )}
    </div>
  );
}

// Month grid in the spirit of unix `cal`: weekday header row, plain day
// numbers, week starts Monday. Days with free slots are live buttons; the
// rest are dimmed. ‹ › only reach months the 14-day horizon touches.
function CalendarGrid({
  days,
  activeDay,
  shownYm,
  onPick,
  onNav,
}: {
  days: Map<string, Slot[]>;
  activeDay: string;
  shownYm: string; // "YYYY-MM" currently displayed
  onPick: (day: string) => void;
  onNav: (ym: string) => void;
}) {
  const [y, m] = shownYm.split('-').map(Number);
  // Months that contain at least one bookable day (1 or 2 with a 14-day horizon).
  const months = [...new Set([...days.keys()].map((k) => k.slice(0, 7)))];
  const at = months.indexOf(shownYm);

  const firstWeekday = (new Date(y, m - 1, 1).getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(y, m, 0).getDate(); // day 0 of next month
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null), // leading blanks
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div class="bookmodal__cal">
      <div class="bookmodal__cal-head">
        <button
          class="bookmodal__cal-nav"
          disabled={at <= 0}
          onClick={() => onNav(months[at - 1])}
          aria-label="previous month"
        >
          ‹
        </button>
        <span class="bookmodal__cal-month">{monthFmt.format(new Date(y, m - 1, 1))}</span>
        <button
          class="bookmodal__cal-nav"
          disabled={at >= months.length - 1}
          onClick={() => onNav(months[at + 1])}
          aria-label="next month"
        >
          ›
        </button>
      </div>
      <div class="bookmodal__cal-grid">
        {weekdayLabels.map((w) => (
          <span class="bookmodal__cal-wd" aria-hidden="true">
            {w}
          </span>
        ))}
        {cells.map((n) => {
          if (n === null) return <span />;
          const key = `${shownYm}-${String(n).padStart(2, '0')}`;
          const open = days.has(key);
          return (
            <button
              class={`bookmodal__cal-day${key === activeDay ? ' is-active' : ''}`}
              disabled={!open}
              aria-pressed={key === activeDay}
              onClick={() => onPick(key)}
            >
              {n}
            </button>
          );
        })}
      </div>
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

function BookingForm({
  labels,
  slot,
  onBack,
}: {
  labels: BookingLabels;
  slot: Slot;
  onBack: () => void;
}) {
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
    <form class="bookmodal__form" onSubmit={onSubmit}>
      <div class="bookmodal__stephead">
        <button type="button" class="bookmodal__back" onClick={onBack}>
          {labels.back}
        </button>
        <p class="bookmodal__picked">→ {dateTimeFmt.format(new Date(slot.start))}</p>
      </div>
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
