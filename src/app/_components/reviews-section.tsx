import { Star } from "lucide-react";
import { Container } from "@/components/container";
import { SectionLabel } from "@/components/section-label";
import { formatHungarianMonthYear } from "@/lib/format-date";
import { getHomepageContent } from "@/lib/sanity/queries/homepage";

function StarRow({ size }: { size: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={size} className="fill-gold text-gold" />
      ))}
    </div>
  );
}

export async function ReviewsSection() {
  const { featuredReviews } = await getHomepageContent();
  if (featuredReviews.length === 0) return null;

  return (
    <section className="bg-card/40 py-24">
      <Container>
        <div className="mb-14 text-center">
          <SectionLabel>Ügyfeleink mondták</SectionLabel>
          <h2 className="font-heading text-4xl font-black text-foreground md:text-5xl">
            Vásárlói <span className="text-gold">vélemények.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <div
              key={review.authorName}
              className="border border-gold/8 bg-card p-7 transition-all duration-300 hover:border-gold/30"
            >
              <div className="mb-4">
                <StarRow size={13} />
              </div>
              <p className="mb-6 text-sm leading-relaxed text-foreground/60 italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="border-t border-gold/10 pt-4">
                <div className="font-heading text-sm font-bold text-foreground">
                  {review.authorName}
                </div>
                {review.sourceDetail && (
                  <div className="mt-0.5 font-mono-label text-[10px] text-gold">
                    {review.sourceDetail}
                  </div>
                )}
                {review.reviewDate && (
                  <div className="mt-1 text-[10px] text-foreground/50">
                    {formatHungarianMonthYear(review.reviewDate)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
