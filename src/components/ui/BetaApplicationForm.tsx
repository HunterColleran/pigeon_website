"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Link from "next/link";

type State =
  | { step: "form" }
  | { step: "transmitting" }
  | { step: "done"; firstName: string; isNew: boolean };

function SignalWaves() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-8 w-8 rounded-full border border-signal-orange/30"
            animate={{
              scale: [1, 5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.45,
              ease: "easeOut",
            }}
          />
        ))}
        <motion.div
          className="relative h-2.5 w-2.5 rounded-full bg-signal-orange"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

const cornerBase =
  "absolute h-3 w-3 border-signal-orange/0 transition-all duration-300 group-focus-within:border-signal-orange/60";

function FieldWrapper({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`group relative ${className}`}>
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-concrete/40">
        {label}
        {required && <span className="ml-1 text-signal-orange/60">*</span>}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute -inset-2">
          <div className={`${cornerBase} left-0 top-0 border-l-2 border-t-2`} />
          <div className={`${cornerBase} right-0 top-0 border-r-2 border-t-2`} />
          <div className={`${cornerBase} bottom-0 left-0 border-b-2 border-l-2`} />
          <div className={`${cornerBase} bottom-0 right-0 border-b-2 border-r-2`} />
        </div>
        {children}
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-cloud/[0.08] bg-transparent px-4 py-3 font-mono text-sm text-cloud placeholder:text-concrete/20 focus:border-signal-orange/50 focus:outline-none transition-colors duration-300";

const selectClass =
  "w-full appearance-none border border-cloud/[0.08] bg-transparent px-4 py-3 font-mono text-sm text-cloud focus:border-signal-orange/50 focus:outline-none transition-colors duration-300 cursor-pointer";

const SCREEN_TIME_OPTIONS = [
  "Less than 2 hours",
  "2–4 hours",
  "4–6 hours",
  "6–8 hours",
  "8–10 hours",
  "10+ hours",
];

const AGE_OPTIONS = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"];

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Other",
];

export function BetaApplicationForm() {
  const [state, setState] = useState<State>({ step: "form" });
  const [error, setError] = useState("");
  const reduced = useReducedMotion();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [country, setCountry] = useState("United States");
  const [screenTime, setScreenTime] = useState("");
  const [phoneOs, setPhoneOs] = useState("");
  const [occupation, setOccupation] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!city.trim() || !country) {
      setError("City and country are required.");
      return;
    }

    if (!screenTime || !phoneOs || !age) {
      setError("Screen time, primary phone, and age are required.");
      return;
    }

    setState({ step: "transmitting" });

    try {
      const [res] = await Promise.all([
        fetch("/api/beta-apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            city: city.trim(),
            state: stateField.trim() || undefined,
            country,
            screenTime,
            phoneOs,
            occupation: occupation.trim() || undefined,
            age,
            gender: gender || undefined,
          }),
        }),
        new Promise((r) => setTimeout(r, 1800)),
      ]);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      const data = await res.json();
      setState({
        step: "done",
        firstName: data.firstName,
        isNew: data.isNew,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState({ step: "form" });
    }
  }

  const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state.step === "form" && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={transition}
          >
            {/* 01 — About You */}
            <div className="mb-16">
              <p className="mb-8 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-orange/60">
                01 — About You
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <FieldWrapper label="First name" required>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    required
                    className={inputClass}
                  />
                </FieldWrapper>
                <FieldWrapper label="Last name" required>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className={inputClass}
                  />
                </FieldWrapper>
              </div>
              <div className="mt-6">
                <FieldWrapper label="Email" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className={inputClass}
                  />
                </FieldWrapper>
              </div>
              <div className="mt-6">
                <FieldWrapper label="Phone">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className={inputClass}
                  />
                </FieldWrapper>
              </div>
            </div>

            {/* 02 — Where You Are */}
            <div className="mb-16">
              <p className="mb-8 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-orange/60">
                02 — Where You Are
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                <FieldWrapper label="City" required>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Phoenix"
                    required
                    className={inputClass}
                  />
                </FieldWrapper>
                <FieldWrapper label="State / Province">
                  <input
                    type="text"
                    value={stateField}
                    onChange={(e) => setStateField(e.target.value)}
                    placeholder="AZ"
                    className={inputClass}
                  />
                </FieldWrapper>
                <FieldWrapper label="Country" required>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className={selectClass}
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c} value={c} className="bg-shadow text-cloud">
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-concrete/30" />
                      </svg>
                    </div>
                  </div>
                </FieldWrapper>
              </div>
            </div>

            {/* 03 — Your Relationship with Technology */}
            <div className="mb-12">
              <p className="mb-8 font-mono text-[10px] tracking-[0.25em] uppercase text-signal-orange/60">
                03 — Your Relationship with Technology
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <FieldWrapper label="Daily screen time" required>
                  <div className="relative">
                    <select
                      value={screenTime}
                      onChange={(e) => setScreenTime(e.target.value)}
                      required
                      className={`${selectClass} ${!screenTime ? "text-concrete/20" : ""}`}
                    >
                      <option value="" disabled className="bg-shadow text-concrete/40">
                        Select
                      </option>
                      {SCREEN_TIME_OPTIONS.map((o) => (
                        <option key={o} value={o} className="bg-shadow text-cloud">
                          {o}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-concrete/30" />
                      </svg>
                    </div>
                  </div>
                </FieldWrapper>
                <FieldWrapper label="Primary phone" required>
                  <div className="relative">
                    <select
                      value={phoneOs}
                      onChange={(e) => setPhoneOs(e.target.value)}
                      required
                      className={`${selectClass} ${!phoneOs ? "text-concrete/20" : ""}`}
                    >
                      <option value="" disabled className="bg-shadow text-concrete/40">
                        Select
                      </option>
                      <option value="iPhone" className="bg-shadow text-cloud">iPhone</option>
                      <option value="Android" className="bg-shadow text-cloud">Android</option>
                      <option value="Other" className="bg-shadow text-cloud">Other</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-concrete/30" />
                      </svg>
                    </div>
                  </div>
                </FieldWrapper>
              </div>
              <div className="mt-6">
                <FieldWrapper label="Occupation">
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="Designer, Engineer, Student..."
                    className={inputClass}
                  />
                </FieldWrapper>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <FieldWrapper label="Age" required>
                  <div className="relative">
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      className={`${selectClass} ${!age ? "text-concrete/20" : ""}`}
                    >
                      <option value="" disabled className="bg-shadow text-concrete/40">
                        Select
                      </option>
                      {AGE_OPTIONS.map((o) => (
                        <option key={o} value={o} className="bg-shadow text-cloud">
                          {o}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-concrete/30" />
                      </svg>
                    </div>
                  </div>
                </FieldWrapper>
                <FieldWrapper label="Gender">
                  <div className="relative">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`${selectClass} ${!gender ? "text-concrete/20" : ""}`}
                    >
                      <option value="" className="bg-shadow text-concrete/40">
                        Prefer not to say
                      </option>
                      {GENDER_OPTIONS.map((o) => (
                        <option key={o} value={o} className="bg-shadow text-cloud">
                          {o}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-concrete/30" />
                      </svg>
                    </div>
                  </div>
                </FieldWrapper>
              </div>
            </div>

            {error && (
              <p className="mb-6 font-mono text-[11px] text-signal-orange">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer border border-cloud/[0.08] bg-signal-orange px-8 py-4 font-mono text-[11px] tracking-[0.15em] uppercase text-cloud transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            >
              Submit Application &rarr;
            </button>
          </motion.form>
        )}

        {state.step === "transmitting" && (
          <motion.div
            key="transmitting"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.9 }}
            transition={transition}
            className="flex min-h-[400px] items-center justify-center"
          >
            <SignalWaves />
          </motion.div>
        )}

        {state.step === "done" && (
          <motion.div
            key="done"
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex min-h-[400px] flex-col items-center justify-center text-center"
          >
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-concrete/40">
              Application received
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-cloud">
              Thank you, {state.firstName}.
            </h2>
            {!state.isNew && (
              <p className="mt-4 font-mono text-[11px] text-concrete/50">
                You&rsquo;ve already applied &mdash; we have your info.
              </p>
            )}
            <div className="mt-10 flex gap-6">
              <Link
                href="/letter"
                className="font-mono text-[11px] tracking-[0.15em] text-signal-orange transition-colors duration-300 hover:text-signal-orange/70"
              >
                Read our letter &rarr;
              </Link>
              <Link
                href="/"
                className="font-mono text-[11px] tracking-[0.15em] text-concrete/40 transition-colors duration-300 hover:text-cloud"
              >
                Home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
