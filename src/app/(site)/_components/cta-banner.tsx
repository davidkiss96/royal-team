import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { getBusinessSettings } from "@/lib/sanity/queries/business-settings";

export async function CtaBanner() {
  const { phone } = await getBusinessSettings();
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <section className="relative overflow-hidden bg-gold py-20">
      <Image
        src="/placeholders/photo-placeholder.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.07]"
      />
      <Container className="relative text-center">
        <h2 className="mb-4 font-heading text-4xl font-black text-black md:text-5xl">
          Kérdése van? Lépjen kapcsolatba.
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-sm text-black/55">
          Szívesen adunk árajánlatot vagy válaszolunk kérdéseire — keressen minket telefonon vagy írjon üzenetet.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/kapcsolat"
            className="bg-black px-10 py-4 font-heading text-xs font-black tracking-[0.2em] text-gold uppercase transition-all duration-300 hover:bg-[#111111]"
          >
            Kapcsolatfelvétel →
          </Link>
          <a
            href={phoneHref}
            className="flex items-center gap-2 border border-black/30 px-10 py-4 font-heading text-xs font-black tracking-[0.2em] text-black uppercase transition-all hover:bg-black/10"
          >
            <Phone size={14} />
            {phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
