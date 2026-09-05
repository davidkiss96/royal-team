import type { ProjectBodyBlock } from "@/lib/types";

interface BodyBlocksProps {
  blocks: ProjectBodyBlock[];
  className?: string;
}

/**
 * Renders the flowing-narrative part of a mock `body` (paragraphs and a
 * bullet list) — used by the Project detail page's "Overview" section.
 * `numberedSteps` and `quote` blocks are deliberately not rendered here:
 * both get their own distinct, full-width visual treatment elsewhere on
 * the page (a numbered-step grid, a pull-quote card), not a plain inline
 * rendering, so the page extracts them from `body` separately rather than
 * passing the whole array through this component.
 */
export function BodyBlocks({ blocks, className = "" }: BodyBlocksProps) {
  return (
    <div className={`space-y-4 text-sm leading-relaxed text-foreground/55 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <p key={index}>{block.text}</p>;
        }
        if (block.type === "list") {
          return (
            <div key={index} className="space-y-2.5 pt-2">
              {block.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-foreground/55">
                  <div className="h-1.5 w-1.5 flex-shrink-0 bg-gold" />
                  {item}
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
