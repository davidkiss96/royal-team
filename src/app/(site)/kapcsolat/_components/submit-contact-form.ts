"use server";

import { Resend } from "resend";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";
import { validateContactFields, type ContactFormValues } from "./validate-contact-form";

export type { ContactFormValues } from "./validate-contact-form";
export type ContactFormResult = { ok: true } | { ok: false; message: string };

const GENERIC_ERROR_MESSAGE =
  "Hiba történt az üzenet küldése közben. Kérjük, próbálja meg újra, vagy keressen minket telefonon.";

const INVALID_INPUT_MESSAGE =
  "Kérjük, ellenőrizze a megadott adatokat, és próbálja meg újra.";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailBody(values: ContactFormValues): { html: string; text: string } {
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  const textLines = [
    "Új üzenet érkezett a weboldal kapcsolatfelvételi űrlapjáról.",
    "",
    `Név: ${name}`,
    `E-mail: ${email}`,
    ...(phone ? [`Telefon: ${phone}`] : []),
    "",
    "Üzenet:",
    message,
  ];

  const html = `
    <p>Új üzenet érkezett a weboldal kapcsolatfelvételi űrlapjáról.</p>
    <p>
      <strong>Név:</strong> ${escapeHtml(name)}<br />
      <strong>E-mail:</strong> ${escapeHtml(email)}<br />
      ${phone ? `<strong>Telefon:</strong> ${escapeHtml(phone)}<br />` : ""}
    </p>
    <p><strong>Üzenet:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `.trim();

  return { html, text: textLines.join("\n") };
}

/**
 * Server Action backing `ContactForm` (docs/architecture.md Section 9). Runs
 * server-side validation first — the actual integrity boundary, since the
 * client's own `validateContactFields` check is only ever a UX convenience
 * and its result is never trusted here — then sends the message via Resend
 * to the business's Sanity-configured `BusinessSettings.email`, with the
 * visitor's own address set as `Reply-To` so the workshop can just hit
 * Reply.
 *
 * Resolves (never throws) so `ContactForm`'s existing success/error UI
 * handles every outcome uniformly. Provider/config errors are logged
 * server-side without message content and never surfaced to the visitor —
 * only a generic, safe Hungarian message is returned.
 */
export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactFormResult> {
  const fieldErrors = validateContactFields(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: INVALID_INPUT_MESSAGE };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromAddress) {
    console.error(
      "[contact-form] Missing RESEND_API_KEY or RESEND_FROM_EMAIL — email not sent.",
    );
    return { ok: false, message: GENERIC_ERROR_MESSAGE };
  }

  try {
    const { email: recipient } = await getBusinessSettings();
    const { html, text } = buildEmailBody(values);
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      replyTo: values.email.trim(),
      subject: `Új kapcsolatfelvétel a weboldalról – ${values.name.trim()}`,
      html,
      text,
    });

    if (error) {
      console.error("[contact-form] Resend rejected the send request:", error.message);
      return { ok: false, message: GENERIC_ERROR_MESSAGE };
    }

    return { ok: true };
  } catch (error) {
    console.error(
      "[contact-form] Unexpected error while sending:",
      error instanceof Error ? error.message : error,
    );
    return { ok: false, message: GENERIC_ERROR_MESSAGE };
  }
}
