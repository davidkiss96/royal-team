export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAccepted: boolean;
}

export type ContactFormResult = { ok: true } | { ok: false; message: string };

/**
 * TEMPORARY UI-only submission boundary (docs/architecture.md Section 9
 * describes the real flow: a Server Action validates server-side and
 * forwards the message via Resend to szerviz@royalteam.hu — not implemented
 * yet, per this step's explicit scope limits).
 *
 * `ContactForm` calls this one function to submit, and only this function
 * needs to change once the real Server Action exists — swap the body below
 * for a call to that action, keep the same `ContactFormValues` in /
 * `ContactFormResult` out shape, and the rest of the form is untouched.
 *
 * Deliberately does not report success — no email is actually sent yet, and
 * claiming otherwise would be fake delivery confirmation. Resolves (not
 * throws) so the form's normal error-state UI handles this like any other
 * submission failure.
 */
export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactFormResult> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ok: false,
    message:
      "A kapcsolatfelvételi űrlap küldése jelenleg még nem aktív. Kérjük, keressen minket telefonon vagy e-mailben — elérhetőségeink fent megtalálhatók.",
  };
}
