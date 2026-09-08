"use client";

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  submitContactForm,
  type ContactFormValues,
} from "./submit-contact-form";

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  privacyAccepted: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {};

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

const inputClasses =
  "w-full border border-gold/12 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/18 focus:border-gold";
const labelClasses = "mb-2 block text-[10px] tracking-widest text-foreground/30 uppercase";
const errorClasses = "mt-1.5 text-xs text-destructive";

/**
 * Controlled contact form (docs/product.md Section 9: name/email required,
 * phone optional, message required, plus a privacy acknowledgement — not a
 * marketing-consent checkbox, per the GDPR Art. 6(1)(b) legal basis this
 * form relies on).
 *
 * Submission goes through `submitContactForm` — a clearly isolated,
 * temporary boundary (see that file) — so swapping in the real Server
 * Action later doesn't touch this component's validation/state logic.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function updateField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldErrors = validate(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setStatus("submitting");
    setStatusMessage(null);

    const result = await submitContactForm(values);

    if (result.ok) {
      setStatus("success");
      setValues(EMPTY_VALUES);
    } else {
      setStatus("error");
      setStatusMessage(result.message);
    }
  }

  if (status === "success") {
    return (
      <div className="py-12 text-center" role="status">
        <CheckCircle size={48} className="mx-auto mb-5 text-gold" />
        <h3 className="mb-2 font-heading text-2xl font-black text-foreground">
          Üzenet elküldve!
        </h3>
        <p className="text-sm text-foreground/40">
          Hamarosan felvesszük Önnel a kapcsolatot.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="mb-8 font-heading text-2xl font-black text-foreground">Küldjön üzenetet</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className={labelClasses}>
            Teljes név *
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Kovács János"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClasses}
          />
          {errors.name && (
            <p id="contact-name-error" className={errorClasses}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClasses}>
            E-mail cím *
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="email@example.com"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClasses}
          />
          {errors.email && (
            <p id="contact-email-error" className={errorClasses}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClasses}>
            Telefonszám
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+36 30 123 4567"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClasses}>
            Üzenet *
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Írjon nekünk..."
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`${inputClasses} resize-none`}
          />
          {errors.message && (
            <p id="contact-message-error" className={errorClasses}>
              {errors.message}
            </p>
          )}
        </div>

        <div className="pt-1">
          <div className="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={values.privacyAccepted}
              aria-describedby={
                errors.privacyAccepted ? "contact-privacy-error" : undefined
              }
              onClick={() => updateField("privacyAccepted", !values.privacyAccepted)}
              className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                values.privacyAccepted ? "border-gold bg-gold/15" : "border-gold/25 bg-transparent"
              }`}
            >
              {values.privacyAccepted && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
                  <path
                    d="M1 3.5L3.5 6L8 1"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <label className="text-xs leading-relaxed text-foreground/35">
              Elolvastam és tudomásul veszem az{" "}
              <a href="/adatvedelem" className="text-gold hover:underline">
                Adatvédelmi tájékoztatót
              </a>
              . *
            </label>
          </div>
          {errors.privacyAccepted && (
            <p id="contact-privacy-error" className={`${errorClasses} pl-7`}>
              {errors.privacyAccepted}
            </p>
          )}
        </div>
      </div>

      {status === "error" && statusMessage && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground/70"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-destructive" />
          <p>{statusMessage}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 bg-gold px-8 py-3.5 font-heading text-xs font-bold tracking-[0.2em] text-black uppercase transition-all duration-300 hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Küldés...
            </>
          ) : (
            "Üzenet küldése →"
          )}
        </button>
      </div>
    </form>
  );
}
