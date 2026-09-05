import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "outline";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string;
  type?: undefined;
  onClick?: undefined;
  disabled?: undefined;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const baseClasses =
  "inline-flex items-center justify-center rounded-sharp px-8 py-3.5 font-heading text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gold text-black hover:bg-gold-bright",
  outline: "border border-gold/50 text-gold hover:border-gold hover:bg-gold/8",
};

/**
 * The gold-filled ("primary") and gold-outlined ("outline") CTA button from
 * the reference design (docs/design-system.md Section 7), tokenized against
 * the theme's gold/font-heading/rounded-sharp tokens rather than the
 * reference's hardcoded hex values and inline fontFamily strings.
 *
 * Renders a Next.js `Link` when `href` is passed (real CTAs point to another
 * page or a phone link), otherwise a native `<button>`.
 */
export function Button(props: ButtonProps) {
  const { children, variant = "primary", className = "" } = props;
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick, disabled } = props;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
