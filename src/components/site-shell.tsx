import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";
import { getNavLinks, SITE_URL } from "@/lib/site-config";
import { buildLocalBusinessJsonLd } from "@/lib/seo";

/**
 * The public site's page chrome — LocalBusiness JSON-LD, skip link,
 * Header, `<main>` and Footer. Shared by `(site)/layout.tsx` (every public
 * page) and the root `app/not-found.tsx` (which Next.js renders outside the
 * `(site)` group, so it can't inherit this from that layout). Kept out of
 * the root layout so the embedded Studio at `/studio` never gets it.
 */
export async function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched here (rather than inside Header) because Header is a Client
  // Component (scroll/menu state) and getBusinessSettings() is server-only.
  const settings = await getBusinessSettings();
  const phoneHref = `tel:${settings.phone.replace(/\s+/g, "")}`;
  const localBusinessJsonLd = buildLocalBusinessJsonLd(
    settings,
    SITE_URL,
    `${SITE_URL}/logos/icon-gradient-light.svg`,
  );

  return (
    <>
      <script
        type="application/ld+json"
        // Server-generated from Sanity BusinessSettings only, no user
        // input — `<` is still escaped so no field value can prematurely
        // close this script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-60 focus-visible:bg-gold focus-visible:px-4 focus-visible:py-2 focus-visible:font-heading focus-visible:text-xs focus-visible:font-bold focus-visible:tracking-widest focus-visible:text-black focus-visible:uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Ugrás a tartalomhoz
      </a>
      <Header
        phone={settings.phone}
        phoneHref={phoneHref}
        notice={settings.siteNotice}
        navLinks={getNavLinks(settings.siteFeatures)}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
