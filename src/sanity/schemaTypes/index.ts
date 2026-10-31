import {imageWithAlt} from './objects/image-with-alt'
import {seo} from './objects/seo'
import {faqItem} from './objects/faq-item'
import {ctaLink} from './objects/cta-link'
import {priceItem} from './objects/price-item'

import {homepage} from './documents/homepage'
import {businessSettings} from './documents/business-settings'
import {aboutPage} from './documents/about-page'
import {service} from './documents/service'
import {project} from './documents/project'
import {blogPost} from './documents/blog-post'
import {review} from './documents/review'
import {author} from './documents/author'
import {priceCategory} from './documents/price-category'

/** The nine approved content types (docs/content-model.md) — three singletons, six regular documents — plus their shared object building blocks. */
export const schemaTypes = [
  // Objects
  imageWithAlt,
  seo,
  faqItem,
  ctaLink,
  priceItem,
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
]
