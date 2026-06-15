import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  author?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: Record<string, any>;
}

export default function SEO({ 
  title, 
  description = "Institutional-grade EA stress testing, broker data synchronization, and real-time risk management for MetaTrader traders.", 
  canonical,
  author = "Warren Giddings",
  image = "https://foldforge.app/og-image.png",
  type = "website",
  noIndex = false,
  breadcrumbs,
  schema
}: SEOProps) {
  useEffect(() => {
    // Update Title
    const fullTitle = title.includes("FoldForge") ? title : `${title} | FoldForge`;
    document.title = fullTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Meta Author
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (!metaAuthor) {
      metaAuthor = document.createElement('meta');
      metaAuthor.setAttribute('name', 'author');
      document.head.appendChild(metaAuthor);
    }
    metaAuthor.setAttribute('content', author);

    // Update Robots Meta (noindex)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.remove();
    }

    // Update Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    const currentCanonical = canonical || window.location.origin + window.location.pathname;
    linkCanonical.setAttribute('href', currentCanonical);

    // Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    // Update OG Description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    // Update OG Image
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    // Update OG URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', currentCanonical);

    // Update OG Type
    let ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', type);

    // Update Twitter Title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);

    // Update Twitter Description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    // Update Twitter Image
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', image);

    // Handle JSON-LD Schema
    if (schema || breadcrumbs) {
      // Remove existing schema script if present
      const existingSchema = document.querySelector('script[type="application/ld+json"][data-seo-schema="true"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Build combined schema
      const schemaToAdd: Record<string, any> = {
        "@context": "https://schema.org",
        "@graph": []
      };

      // Add breadcrumb schema if provided
      if (breadcrumbs && breadcrumbs.length > 0) {
        const breadcrumbSchema = {
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
          }))
        };
        schemaToAdd["@graph"].push(breadcrumbSchema);
      }

      // Add custom schema if provided
      if (schema) {
        if (Array.isArray(schema)) {
          schemaToAdd["@graph"].push(...schema);
        } else {
          schemaToAdd["@graph"].push(schema);
        }
      }

      // Only add script if there's actual schema to add
      if (schemaToAdd["@graph"].length > 0) {
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.setAttribute('data-seo-schema', 'true');
        schemaScript.textContent = JSON.stringify(schemaToAdd);
        document.head.appendChild(schemaScript);
      }
    }

  }, [title, description, canonical, author, image, type, noIndex, breadcrumbs, schema]);

  return null;
}
