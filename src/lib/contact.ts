export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export type ContactErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_LIMITS = { name: 100, email: 200, subject: 200, message: 5000 } as const;

/** Shared by the form (client) and the API route (server). */
export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name (at least 2 characters).";
  else if (v.name.length > CONTACT_LIMITS.name) e.name = "Name is too long.";
  if (!EMAIL_RE.test(v.email.trim()) || v.email.length > CONTACT_LIMITS.email) e.email = "Please enter a valid email address.";
  if (v.subject.trim().length < 3) e.subject = "Please enter a subject (at least 3 characters).";
  else if (v.subject.length > CONTACT_LIMITS.subject) e.subject = "Subject is too long.";
  if (v.message.trim().length < 10) e.message = "Please write a message of at least 10 characters.";
  else if (v.message.length > CONTACT_LIMITS.message) e.message = "Message is too long.";
  return e;
}
