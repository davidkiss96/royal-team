import { Fragment, type ReactNode } from "react";
import type { AccentHeading as AccentHeadingValue } from "@/lib/copy/accent";

function withLineBreaks(text: string, keyPrefix: string): ReactNode[] {
  return text.split("\n").flatMap((line, index) =>
    index === 0 ? [line] : [<br key={`${keyPrefix}-br${index}`} />, line],
  );
}

/**
 * Renders an `AccentHeading` inline (callers supply the `<h1>`/`<h2>` and
 * its classes): `gold`-marked text in the brand gold, `\n` and block
 * boundaries as `<br />`.
 */
export function AccentHeading({ value }: { value: AccentHeadingValue }) {
  return (
    <>
      {value.map((block, blockIndex) => (
        <Fragment key={block._key ?? blockIndex}>
          {blockIndex > 0 && <br />}
          {block.children.map((child, childIndex) => {
            const key = `${block._key ?? blockIndex}-${child._key ?? childIndex}`;
            const text = "text" in child ? String(child.text) : "";
            const content = withLineBreaks(text, key);
            return child.marks?.includes("gold") ? (
              <span key={key} className="text-gold">
                {content}
              </span>
            ) : (
              <Fragment key={key}>{content}</Fragment>
            );
          })}
        </Fragment>
      ))}
    </>
  );
}
