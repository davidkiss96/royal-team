export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAccepted: boolean;
}

export type ContactFormFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The single source of truth for contact-form validation rules
 * (docs/product.md Section 9: name/email required, phone optional, message
 * required, plus the GDPR privacy acknowledgement). Imported by both
 * `ContactForm` (immediate client-side feedback) and the `submitContactForm`
 * Server Action (the actual integrity boundary — client-provided validation
 * state is never trusted) so the two can never drift apart.
 */
export function validateContactFields(values: ContactFormValues): ContactFormFieldErrors {
  const errors: ContactFormFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Adja meg a nevét.";
  }

  if (!values.email.trim()) {
    errors.email = "Adja meg az e-mail címét.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Adjon meg egy érvényes e-mail címet.";
  }

  if (!values.message.trim()) {
    errors.message = "Írja le, miben segíthetünk.";
  }

  if (!values.privacyAccepted) {
    errors.privacyAccepted = "Az üzenet elküldéséhez ezt el kell fogadnia.";
  }

  return errors;
}
