"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import ConfettiButton, { type ConfettiButtonHandle } from "./ConfettiButton";
import { isValidEmail, isValidName } from "@/lib/bookingValidation";
import { getStoredUtmParams } from "@/lib/utm";
import { pushDataLayerEvent } from "@/lib/analytics";

const DAYS_AHEAD = 14;
const SESSION_BOOKED_KEY = "kd_booking_done";
const MIN_FILL_TIME_MS = 1200;

type SlotsByDate = Record<string, { start: string }[]>;

function formatDayLabel(dateKey: string) {
  const d = new Date(`${dateKey}T00:00:00`);
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
    day: d.toLocaleDateString(undefined, { day: "numeric" }),
    month: d.toLocaleDateString(undefined, { month: "short" }),
  };
}

function formatTimeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingForm() {
  const [timeZone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [mountedAt] = useState(() => Date.now());
  const [alreadyBookedThisSession] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_BOOKED_KEY) === "1"
  );

  const [slotsByDate, setSlotsByDate] = useState<SlotsByDate | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot — real users never fill this
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiButtonHandle>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // The success card is far shorter than the full form it replaces (day
  // picker, time picker, name/email all disappear at once) — without this,
  // whatever scroll position the user was at over the old, taller form is
  // left stranded, reading as a big dead gap between the card and the
  // footer. Scrolling the card into view re-centers the page on what's
  // actually there now.
  useEffect(() => {
    if (status !== "success" || !successRef.current) return;
    lenis?.scrollTo(successRef.current, { offset: -120, duration: 1 });
  }, [status, lenis]);

  useEffect(() => {
    if (alreadyBookedThisSession) return;

    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + DAYS_AHEAD);

    const url = `/api/cal/slots?start=${encodeURIComponent(
      start.toISOString()
    )}&end=${encodeURIComponent(end.toISOString())}&timeZone=${encodeURIComponent(timeZone)}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data?.error) {
          setLoadError(data.error);
          return;
        }
        const byDate: SlotsByDate = data?.data || {};
        setSlotsByDate(byDate);
      })
      .catch(() => setLoadError("Couldn't load availability. Please try again."));
  }, [timeZone, alreadyBookedThisSession]);

  const availableDays = useMemo(
    () =>
      Object.keys(slotsByDate || {})
        .filter((key) => (slotsByDate?.[key]?.length ?? 0) > 0)
        .sort(),
    [slotsByDate]
  );

  const slotsForSelectedDay = useMemo(
    () => (selectedDate ? slotsByDate?.[selectedDate] || [] : []),
    [slotsByDate, selectedDate]
  );

  // The day with the most slots — used purely as an invisible height sizer
  // so the time-picker area reserves its tallest possible size up front.
  // Without this, whichever day (or none) happens to be selected determines
  // the row's height, and every date change would resize the page.
  const maxSlotsDay = useMemo(
    () =>
      availableDays.reduce<string | null>((best, d) => {
        const count = slotsByDate?.[d]?.length ?? 0;
        const bestCount = best ? slotsByDate?.[best]?.length ?? 0 : -1;
        return count > bestCount ? d : best;
      }, null),
    [availableDays, slotsByDate]
  );
  const ghostSlots = useMemo(
    () => (maxSlotsDay ? slotsByDate?.[maxSlotsDay] || [] : []),
    [slotsByDate, maxSlotsDay]
  );

  const nameError = nameTouched && !isValidName(name) ? "Please enter your full name." : null;
  const emailError =
    emailTouched && !isValidEmail(email) ? "Please enter a valid email address." : null;
  const canSubmit = Boolean(selectedSlot) && isValidName(name) && isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);

    if (company.trim().length > 0) return; // honeypot tripped — silently ignore
    if (!selectedSlot || !isValidName(name) || !isValidEmail(email)) return;
    if (Date.now() - mountedAt < MIN_FILL_TIME_MS) return; // filled in implausibly fast

    setStatus("submitting");
    setSubmitError(null);

    try {
      const res = await fetch("/api/cal/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: selectedSlot,
          name,
          email,
          timeZone,
          company,
          utm: getStoredUtmParams(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      sessionStorage.setItem(SESSION_BOOKED_KEY, "1");
      confettiRef.current?.fire();
      pushDataLayerEvent("booking_confirmed", { value: 1 });
      setStatus("success");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const fieldClass =
    "rounded-lg bg-glass px-4 py-3.5 font-helvetica text-[16px] text-cream placeholder:text-cream/40 outline-none ring-1 ring-glass-border transition-shadow focus:ring-2 focus:ring-[#FFDDA9]/70";
  const fieldErrorClass = "focus:ring-red-400/70 ring-red-400/50";

  if (status === "success" && selectedSlot) {
    const label = formatDayLabel(selectedDate!);
    return (
      <div
        ref={successRef}
        className="rounded-2xl bg-glass px-8 py-10 text-center ring-1 ring-glass-border"
      >
        <h3 className="font-serif text-[1.75rem] text-white">You&apos;re booked.</h3>
        <p className="mt-3 font-helvetica text-[16px] leading-[1.5] text-cream/70">
          {label.weekday}, {label.month} {label.day} at {formatTimeLabel(selectedSlot)}.
          A confirmation is on its way to {email}.
        </p>
      </div>
    );
  }

  if (alreadyBookedThisSession) {
    return (
      <div className="rounded-2xl bg-glass px-8 py-10 text-center ring-1 ring-glass-border">
        <h3 className="font-serif text-[1.75rem] text-white">Already booked.</h3>
        <p className="mt-3 font-helvetica text-[16px] leading-[1.5] text-cream/70">
          You&apos;ve already booked a call with us. Check your email for the
          confirmation, or reach out directly if you need to make changes.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="font-helvetica text-[15px] text-cream/60">
        {loadError} You can also{" "}
        <a
          href="mailto:contact@klmatmdigital.com"
          className="text-[#FFDDA9] underline underline-offset-2"
        >
          email us directly
        </a>
        .
      </p>
    );
  }

  if (!slotsByDate) {
    return (
      <p className="font-helvetica text-[15px] text-cream/50">
        Loading availability…
      </p>
    );
  }

  if (availableDays.length === 0) {
    return (
      <p className="font-helvetica text-[15px] text-cream/60">
        No open slots in the next {DAYS_AHEAD} days —{" "}
        <a
          href="mailto:contact@klmatmdigital.com"
          className="text-[#FFDDA9] underline underline-offset-2"
        >
          email us instead
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-6">
      {/* Honeypot field: visually hidden from real visitors, irresistible to bots. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />

      <div className="flex flex-col gap-2.5">
        <span className="font-helvetica text-[16px] font-bold text-cream/80">Pick a day</span>
        <div className="no-scrollbar -mx-[var(--edge-padding)] flex justify-start gap-2.5 overflow-x-auto px-[var(--edge-padding)] pb-1 md:mx-0 md:justify-center md:px-0">
          {availableDays.map((dateKey) => {
            const label = formatDayLabel(dateKey);
            const isActive = dateKey === selectedDate;
            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => {
                  setSelectedDate(dateKey);
                  setSelectedSlot(null);
                }}
                className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-lg py-2.5 font-helvetica ring-1 transition-colors ${
                  isActive
                    ? "bg-[#FFDDA9] text-[#1a1918] ring-[#FFDDA9]"
                    : "bg-glass text-cream ring-glass-border hover:bg-white/10"
                }`}
              >
                <span className="text-[12px] opacity-70">{label.weekday}</span>
                <span className="text-[16px] font-medium">{label.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Always in the layout, like the name/email block below — the time
          row's own height is set by an invisible "ghost" copy of whichever
          day has the most slots, so revealing it (or switching days) never
          resizes the page; only the real, visible buttons on top change. */}
      <div
        aria-hidden={!selectedDate}
        className={`flex flex-col gap-2.5 transition-opacity duration-500 ${
          selectedDate ? "opacity-100" : "invisible opacity-0"
        }`}
      >
        <span className="font-helvetica text-[16px] font-bold text-cream/80">Pick a time</span>
        <div className="relative">
          <div className="invisible flex flex-wrap justify-center gap-2.5" aria-hidden="true">
            {ghostSlots.map((slot) => (
              <span key={slot.start} className="rounded-lg px-4 py-2.5 font-helvetica text-[14px] ring-1">
                {formatTimeLabel(slot.start)}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-wrap justify-center gap-2.5">
            {slotsForSelectedDay.map((slot) => {
              const isActive = slot.start === selectedSlot;
              return (
                <button
                  key={slot.start}
                  type="button"
                  tabIndex={selectedDate ? 0 : -1}
                  onClick={() => setSelectedSlot(slot.start)}
                  className={`rounded-lg px-4 py-2.5 font-helvetica text-[14px] ring-1 transition-colors ${
                    isActive
                      ? "bg-[#FFDDA9] text-[#1a1918] ring-[#FFDDA9]"
                      : "bg-glass text-cream ring-glass-border hover:bg-white/10"
                  }`}
                >
                  {formatTimeLabel(slot.start)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Always in the layout (never mounted/unmounted) so revealing it never
          shifts the page — only its opacity/visibility cross-fades in. */}
      <div
        aria-hidden={!selectedSlot}
        className={`grid grid-cols-1 gap-5 transition-opacity duration-500 sm:grid-cols-2 ${
          selectedSlot ? "opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-name" className="font-helvetica text-[16px] font-bold text-cream/80">
            Name
          </label>
          <input
            id="booking-name"
            required={Boolean(selectedSlot)}
            tabIndex={selectedSlot ? 0 : -1}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            placeholder="Your name"
            className={`${fieldClass} ${nameError ? fieldErrorClass : ""}`}
          />
          {nameError && (
            <span className="font-helvetica text-[13px] text-red-400">{nameError}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-email" className="font-helvetica text-[16px] font-bold text-cream/80">
            Email
          </label>
          <input
            id="booking-email"
            type="email"
            required={Boolean(selectedSlot)}
            tabIndex={selectedSlot ? 0 : -1}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@company.com"
            className={`${fieldClass} ${emailError ? fieldErrorClass : ""}`}
          />
          {emailError && (
            <span className="font-helvetica text-[13px] text-red-400">{emailError}</span>
          )}
        </div>
      </div>

      {submitError && (
        <p className="font-helvetica text-[14px] text-red-400">{submitError}</p>
      )}

      <ConfettiButton
        ref={confettiRef}
        type="submit"
        aria-hidden={!selectedSlot}
        tabIndex={selectedSlot ? 0 : -1}
        disabled={status === "submitting" || !canSubmit}
        className={`group mt-1 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#FFDDA9] px-8 py-3.5 font-serif text-[19px] text-[#1a1918] transition duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100 ${
          selectedSlot ? "opacity-100" : "invisible opacity-0"
        }`}
      >
        {status === "submitting" ? "Booking…" : "Confirm Booking"}
      </ConfettiButton>
    </form>
  );
}
