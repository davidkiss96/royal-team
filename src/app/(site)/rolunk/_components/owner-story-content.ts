import { toPlainText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * `AboutPage.ownerStory` (docs/content-model.md Section 9) is one flowing
 * Portable Text array with no dedicated sub-sections — the current content
 * uses `h2` blocks to mark three narrative beats (the intro, the service
 * list, the closing philosophy) and `h3` blocks for each service item
 * within the middle beat. Splitting on those style boundaries — rather than
 * matching literal heading text — lets `/rolunk`'s section components stay
 * purely presentational and keeps working if the copy is edited without
 * touching the content model.
 */
export interface OwnerStoryServiceItem {
  key: string;
  number?: string;
  title: string;
  body: PortableTextBlock[];
}

export interface OwnerStoryHeadingSection {
  heading: PortableTextBlock;
  body: PortableTextBlock[];
}

export interface OwnerStorySections {
  intro: OwnerStoryHeadingSection | null;
  services: (OwnerStoryHeadingSection & { items: OwnerStoryServiceItem[] }) | null;
  closing: OwnerStoryHeadingSection | null;
  /** Any further `h2` beats beyond the three above (none in the current
   * content) — kept so a future content edit can never silently disappear
   * from the page instead of just landing in an unstyled spot. */
  extra: PortableTextBlock[];
}

function isBlockStyle(block: PortableTextBlock, style: string): boolean {
  return block._type === "block" && block.style === style;
}

/** Groups `blocks` into runs, each starting at an `h2` block. Content before
 * the first `h2` (none in the current story) has nowhere to attach and is
 * dropped — same "no home for it" tradeoff as `unknownBlockStyle` upstream. */
function splitByH2(blocks: PortableTextBlock[]): PortableTextBlock[][] {
  const groups: PortableTextBlock[][] = [];
  for (const block of blocks) {
    if (isBlockStyle(block, "h2")) {
      groups.push([block]);
    } else if (groups.length > 0) {
      // Non-null: this branch only runs once `groups` has at least one run.
      groups[groups.length - 1]!.push(block);
    }
  }
  return groups;
}

const SERVICE_NUMBER_PATTERN = /^(\d+)\s*[—–-]\s*(.+)$/;

function toServiceItems(blocks: PortableTextBlock[]): OwnerStoryServiceItem[] {
  const items: OwnerStoryServiceItem[] = [];
  blocks.forEach((block, index) => {
    if (isBlockStyle(block, "h3")) {
      const text = toPlainText(block);
      const match = text.match(SERVICE_NUMBER_PATTERN);
      items.push({
        key: block._key ?? `service-${index}`,
        number: match?.[1],
        title: match ? (match[2] ?? text) : text,
        body: [],
      });
    } else if (items.length > 0) {
      // Non-null: this branch only runs once `items` has at least one entry.
      items[items.length - 1]!.body.push(block);
    }
  });
  return items;
}

export function splitOwnerStory(blocks: PortableTextBlock[]): OwnerStorySections {
  const [introGroup, servicesGroup, closingGroup, ...rest] = splitByH2(blocks);

  // Non-null headings below: `splitByH2` only ever creates a run by pushing
  // `[block]`, so every group's first element is always present.
  const intro: OwnerStoryHeadingSection | null = introGroup
    ? { heading: introGroup[0]!, body: introGroup.slice(1) }
    : null;

  const services = servicesGroup
    ? (() => {
        const firstItemIndex = servicesGroup.findIndex((block) => isBlockStyle(block, "h3"));
        const introEnd = firstItemIndex === -1 ? servicesGroup.length : firstItemIndex;
        return {
          heading: servicesGroup[0]!,
          body: servicesGroup.slice(1, introEnd),
          items: toServiceItems(servicesGroup.slice(introEnd)),
        };
      })()
    : null;

  const closing: OwnerStoryHeadingSection | null = closingGroup
    ? { heading: closingGroup[0]!, body: closingGroup.slice(1) }
    : null;

  return { intro, services, closing, extra: rest.flat() };
}
