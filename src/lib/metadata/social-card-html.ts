function escapeAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderSocialCardHtml(input: {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  type: "website" | "article";
}): string {
  const title = escapeAttr(input.title);
  const description = escapeAttr(input.description);
  const url = escapeAttr(input.url);
  const image = escapeAttr(input.image);
  const imageAlt = escapeAttr(input.imageAlt);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${url}"><meta property="og:type" content="${input.type}"><meta property="og:locale" content="en_US"><meta property="og:site_name" content="Abdalrhman M. Alkady"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:secure_url" content="${image}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${imageAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${imageAlt}"></head><body><h1>${title}</h1><p>${description}</p></body></html>`;
}
