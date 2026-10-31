"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { profile } from "@/data/profile";
import { validateContact, type ContactErrors, type ContactValues } from "@/lib/contact";

type Values = ContactValues;
type Errors = ContactErrors;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "unconfigured" }
  | { kind: "error"; message: string };

function mailtoHref(v: Values) {
  const body = `${v.message}\n\n— ${v.name} (${v.email})`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm({ idPrefix = "contact" }: { idPrefix?: string }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", subject: "", message: "", website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (key: keyof Values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "idle" });
      document.getElementById(`${idPrefix}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; configured?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        setValues({ name: "", email: "", subject: "", message: "", website: "" });
      } else if (data.configured === false) {
        setStatus({ kind: "unconfigured" });
      } else {
        setStatus({ kind: "error", message: data.error ?? "The message could not be sent." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error. Your message was not sent." });
    }
  }

  const field = (key: keyof Errors, label: string, type = "text", autoComplete?: string) => {
    const id = `${idPrefix}-${key}`;
    const err = errors[key];
    return (
      <div>
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <input
          id={id}
          name={key}
          type={type}
          autoComplete={autoComplete}
          className="field"
          value={values[key]}
          onChange={set(key)}
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `${id}-error` : undefined}
          required
        />
        {err && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-300">
            {err}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" aria-label="Contact form">
      {field("name", "Name", "text", "name")}
      {field("email", "Email", "email", "email")}
      {field("subject", "Subject")}
      <div>
        <label htmlFor={`${idPrefix}-message`} className="field-label">
          Message
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={4}
          className="field resize-y"
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
          required
        />
        {errors.message && (
          <p id={`${idPrefix}-message-error`} className="mt-1 text-xs text-red-300">
            {errors.message}
          </p>
        )}
      </div>
      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={status.kind === "sending"}>
        <Send size={14} aria-hidden="true" />
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>

      <div aria-live="polite" className="min-h-[1.5rem] text-sm">
        {status.kind === "sent" && (
          <p role="status" className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-3 text-emerald-200">
            Message sent. Thank you — I will reply by email.
          </p>
        )}
        {status.kind === "unconfigured" && (
          <div role="status" className="rounded-lg border border-amber-300/40 bg-amber-300/10 p-3 text-amber-100">
            <p>
              Direct delivery is not configured on this site, so nothing has been sent. Use your email app instead:
            </p>
            <a href={mailtoHref(values)} className="btn mt-2 !px-3 !py-2">
              Open email draft
            </a>
          </div>
        )}
        {status.kind === "error" && (
          <div role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-red-200">
            <p>{status.message}</p>
            <a href={mailtoHref(values)} className="btn mt-2 !px-3 !py-2">
              Email me directly
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
