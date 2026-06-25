/**
 * Enhanced SEO Schema Generation
 * Comprehensive structured data for FoldForge
 */

export interface SchemaConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": "https://foldforge.app/#organization",
    "name": "FoldForge",
    "url": "https://foldforge.app",
    "logo": "https://foldforge.app/logo.webp",
    "description": "Institutional-grade EA stress testing studio for MetaTrader traders",
    "sameAs": [
      "https://twitter.com/foldforge",
      "https://www.linkedin.com/company/foldforge"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@foldforge.app",
      "url": "https://foldforge.app/support"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Albuquerque",
      "addressRegion": "NM",
      "addressCountry": "US"
    }
  };
}

/**
 * Generate Product schema for FoldForge
 */
export function generateProductSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": "https://foldforge.app/#software",
    "name": "FoldForge EA Stress Testing Studio",
    "description": "Professional EA validation platform with Monte Carlo simulations, walk-forward analysis, and real-time risk management",
    "url": "https://foldforge.app",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web, Windows, macOS, Linux",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "19",
      "highPrice": "79",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1200",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@id": "https://foldforge.app/#organization"
    }
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

/**
 * Generate Article/BlogPost schema
 */
export function generateArticleSchema(config: SchemaConfig & { articleBody?: string }) {
  return {
    "@type": "BlogPosting",
    "headline": config.title,
    "description": config.description,
    "image": config.image || "https://foldforge.app/og-image.png",
    "datePublished": config.datePublished || new Date().toISOString(),
    "dateModified": config.dateModified || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": config.author || "Warren Giddings",
      "url": "https://foldforge.app"
    },
    "publisher": {
      "@id": "https://foldforge.app/#organization"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": config.url
    },
    "articleBody": config.articleBody
  };
}

/**
 * Generate LocalBusiness schema (for prop firm partnerships)
 */
export function generateLocalBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": "https://foldforge.app/#localbusiness",
    "name": "FoldForge",
    "image": "https://foldforge.app/logo.webp",
    "description": "Professional EA validation and risk management for prop firm traders",
    "url": "https://foldforge.app",
    "telephone": "+1-505-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Albuquerque",
      "addressRegion": "NM",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "35.0844",
      "longitude": "-106.6504"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  };
}

/**
 * Generate Service schema for each pricing tier
 */
export function generateServiceSchema(tier: string, price: number, features: string[]) {
  return {
    "@type": "Service",
    "name": `FoldForge ${tier} Plan`,
    "description": `Professional EA validation service with ${features.length} key features`,
    "provider": {
      "@id": "https://foldforge.app/#organization"
    },
    "offers": {
      "@type": "Offer",
      "price": price.toString(),
      "priceCurrency": "USD",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "url": "https://foldforge.app/pricing"
    },
    "areaServed": "US",
    "availableLanguage": ["en"]
  };
}

/**
 * Generate Review/Testimonial schema
 */
export function generateReviewSchema(
  author: string,
  rating: number,
  text: string,
  datePublished?: string
) {
  return {
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": text,
    "datePublished": datePublished || new Date().toISOString(),
    "publisher": {
      "@id": "https://foldforge.app/#organization"
    }
  };
}

/**
 * Generate VideoObject schema
 */
export function generateVideoSchema(
  title: string,
  description: string,
  videoUrl: string,
  thumbnailUrl: string,
  duration: string = "PT2M30S"
) {
  return {
    "@type": "VideoObject",
    "name": title,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": new Date().toISOString(),
    "duration": duration,
    "contentUrl": videoUrl,
    "embedUrl": "https://foldforge.app",
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": 12470
    }
  };
}

/**
 * Generate AggregateRating schema
 */
export function generateAggregateRatingSchema(
  ratingValue: number,
  ratingCount: number
) {
  return {
    "@type": "AggregateRating",
    "ratingValue": ratingValue.toString(),
    "ratingCount": ratingCount.toString(),
    "bestRating": "5",
    "worstRating": "1"
  };
}

/**
 * Generate complete schema graph for homepage
 */
export function generateHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateOrganizationSchema(),
      generateProductSchema(),
      generateLocalBusinessSchema(),
      generateVideoSchema(
        "FoldForge Studio Walkthrough: Pass Your Prop Firm Challenge",
        "See how FoldForge uses Monte Carlo simulations and stress testing to validate EAs for FTMO and other prop firms.",
        "https://foldforge.app/foldforge_demo.mp4",
        "https://foldforge.app/og-image.png"
      ),
      {
        "@type": "WebSite",
        "@id": "https://foldforge.app/#website",
        "url": "https://foldforge.app",
        "name": "FoldForge",
        "description": "The world's most advanced EA stress testing studio for MetaTrader 5",
        "publisher": { "@id": "https://foldforge.app/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://foldforge.app/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };
}
