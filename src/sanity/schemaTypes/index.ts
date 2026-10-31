import {imageWithAlt} from './objects/image-with-alt'
import {seo} from './objects/seo'
import {faqItem} from './objects/faq-item'
import {ctaLink} from './objects/cta-link'
import {priceItem} from './objects/price-item'
import {accentHeading} from './objects/accent-heading'
import {ctaSection, pageHeader, pageMeta, sectionHeading} from './objects/copy-blocks'

import {homepage} from './documents/homepage'
import {businessSettings} from './documents/business-settings'
import {aboutPage} from './documents/about-page'
import {service} from './documents/service'
import {project} from './documents/project'
import {blogPost} from './documents/blog-post'
import {review} from './documents/review'
import {author} from './documents/author'
import {priceCategory} from './documents/price-category'
import {
  blogPage,
  contactPage,
  priceListPage,
  projectsPage,
  servicesPage,
  siteCopy,
} from './documents/page-copy'

/** The approved content types (docs/content-model.md) — the singletons (incl. the per-page copy documents, `documents/page-copy.ts`), six regular documents — plus their shared object building blocks. */
export const schemaTypes = [
  // Objects
  imageWithAlt,
  seo,
  faqItem,
  ctaLink,
  priceItem,
  accentHeading,
  sectionHeading,
  pageHeader,
  ctaSection,
  pageMeta,
  // Documents
  homepage,
  businessSettings,
  aboutPage,
  service,
  project,
  blogPost,
  review,
  author,
  priceCategory,
  servicesPage,
  blogPage,
  contactPage,
  priceListPage,
  projectsPage,
  siteCopy,
]
