import { buildCanonicalUrl, SITE_NAME } from "../links";

export type MetadataPayloadInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imagePath?: string;
};

export function buildMetadataTitle(title: string) {
  return `${title} | ${SITE_NAME}`;
}

export function buildMetadataPayload({
  title,
  description,
  path,
  type = "website",
  imagePath
}: MetadataPayloadInput) {
  const canonical = buildCanonicalUrl(path);
  const image = imagePath ? buildCanonicalUrl(imagePath) : undefined;

  return {
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_LK",
      type,
      images: image
        ? [
            {
              url: image,
              alt: title
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}
