import { Globe } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { FacebookIcon, InstagramIcon } from "./icons";
import type { SocialLink } from "@/lib/sanity/queries/business-settings";

const PLATFORMS: Record<string, { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  facebook: { label: "Facebook", Icon: FacebookIcon },
  instagram: { label: "Instagram", Icon: InstagramIcon },
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/**
 * `BusinessSettings.socialLinks` as the reference design's square,
 * gold-outlined icon buttons (Contact page "Kövessen minket", reused in
 * the Footer). Platforms without a dedicated mark (YouTube, TikTok,
 * "other") fall back to a generic globe so a new Studio entry still shows
 * up. Renders nothing when there are no links.
 */
export function SocialLinks({ links, className = "" }: { links: SocialLink[] | null; className?: string }) {
  if (!links?.length) return null;

  return (
    <ul className={`flex gap-3 ${className}`}>
      {links.map(({ platform, url }) => {
        const { label, Icon } = PLATFORMS[platform] ?? { label: platform, Icon: Globe };
        return (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (új lapon nyílik meg)`}
              className={`flex h-10 w-10 items-center justify-center border border-gold/20 text-foreground/50 transition-colors duration-200 hover:border-gold hover:text-gold ${focusRing}`}
            >
              <Icon width={15} height={15} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
