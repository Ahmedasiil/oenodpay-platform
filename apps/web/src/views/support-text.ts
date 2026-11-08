import type { CONTACT_TOPICS } from "@oenodpay/shared";

/** English words for the contact form and status board; pages pass translated copies in. */

export const TOPIC_LABEL: Record<(typeof CONTACT_TOPICS)[number], string> = {
  support: "Help with my account", privacy: "Privacy or my personal information", complaint: "Make a complaint",
  security: "Report a security issue", press: "Press and media", partnerships: "Partnerships", careers: "Careers",
};

export const FORM_TEXT = {
  name: "Your name", email: "Email", topic: "What is it about?", message: "Message", placeholder: "Don't include card numbers or passwords.",
  errEmail: "Enter a valid email address.", errName: "Enter your name.", errForm: "Check the form and try again.",
  errBusy: "Too many messages. Wait a minute and try again.", errSend: "We couldn't send your message. Try again in a moment.", errGeneric: "Something went wrong.",
  done: "Thanks, we've got your message. Your reference is {reference}. We'll reply by email within one business day.",
  sending: "Sending…", send: "Send message",
};
export type FormText = typeof FORM_TEXT & { topics: Record<string, string> };

export const STATUS_TEXT = {
  down: "We can't reach our servers right now. We're looking into it.", checking: "Checking…",
  ok: "All systems operational", bad: "Some systems are having problems", operational: "Operational", outage: "Outage", last: "Last checked {time}.",
};
export type StatusText = typeof STATUS_TEXT & { names: Record<string, string>; locale: string };
