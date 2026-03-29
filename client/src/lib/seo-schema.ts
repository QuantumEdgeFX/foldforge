// Advanced SEO Schema Markup Generator
export const generateSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FoldForge",
  "description": "The world's most advanced EA stress testing studio for MetaTrader 5. Pass prop firm challenges with Monte Carlo simulations and AI-powered risk management.",
  "url": "https://foldforge.app",
  "applicationCategory": "FinanceApplication",
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
    "ratingCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "Giddings Capital Management LLC",
    "url": "https://foldforge.app"
  },
  "operatingSystem": "Web, Windows, macOS",
  "requirements": "MetaTrader 4 or MetaTrader 5",
  "downloadUrl": "https://foldforge.app/pricing"
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FoldForge",
  "url": "https://foldforge.app",
  "logo": "https://foldforge.app/logo.webp",
  "description": "EA stress testing studio for MetaTrader 5",
  "sameAs": [
    "https://twitter.com/foldforge",
    "https://linkedin.com/company/foldforge"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@foldforge.app",
    "url": "https://foldforge.app/support"
  }
});

export const generateFAQSchema = (faqs: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified,
  "author": {
    "@type": "Person",
    "name": article.author
  }
});
