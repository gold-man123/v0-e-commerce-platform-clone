import type { Metadata } from "next"

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "product"
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = "/og-image.jpg",
  url,
  type = "website",
}: SEOProps): Metadata {
  const siteName = "وادي - منصة التجارة الإلكترونية"
  const fullTitle = `${title} | ${siteName}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Wadi E-commerce" }],
    creator: "Wadi E-commerce",
    publisher: "Wadi E-commerce",
    robots: "index, follow",
    openGraph: {
      type,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(url && { url }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        ar: url,
        en: url?.replace("/ar", "/en"),
      },
    },
  }
}

// Product-specific SEO
export function generateProductSEO(product: {
  name_ar: string
  name_en: string
  description_ar: string
  price: number
  image_url?: string
  category?: string
  store?: string
}) {
  return generateSEO({
    title: product.name_ar,
    description: product.description_ar.slice(0, 160),
    keywords: [
      product.name_ar,
      product.name_en,
      product.category || "",
      product.store || "",
      "تسوق أونلاين",
      "موريتانيا",
    ].filter(Boolean),
    image: product.image_url,
    type: "product",
  })
}

// Store-specific SEO
export function generateStoreSEO(store: {
  name_ar: string
  name_en: string
  description_ar: string
  logo_url?: string
}) {
  return generateSEO({
    title: `متجر ${store.name_ar}`,
    description: store.description_ar.slice(0, 160),
    keywords: [store.name_ar, store.name_en, "متجر إلكتروني", "تسوق أونلاين", "موريتانيا"],
    image: store.logo_url,
    type: "website",
  })
}
