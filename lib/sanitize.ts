import sanitizeHtml from "sanitize-html";

/**
 * Blog içeriğini XSS'e karşı temizler.
 * AI asistanın ürettiği HTML tag'leri (h2, h3, p, ul, ol, li, img, vb.) korunur.
 * Sadece <script>, <iframe>, onerror= gibi tehlikeli öğeler temizlenir.
 */
export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      // Yapısal
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr", "div", "span",
      // Liste
      "ul", "ol", "li",
      // Metin biçimlendirme
      "strong", "b", "em", "i", "u", "s", "del", "ins",
      "sub", "sup", "small", "mark", "abbr",
      // Link & medya
      "a", "img",
      // Alıntı & kod
      "blockquote", "pre", "code",
      // Tablo
      "table", "thead", "tbody", "tfoot", "tr", "th", "td",
      // Diğer
      "figure", "figcaption", "details", "summary",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      code: ["class"],       // syntax highlight class'ları
      pre: ["class"],
      span: ["class"],
      div: ["class"],
      "*": ["id"],           // anchor link'ler için
    },
    allowedSchemes: ["http", "https", "mailto"],
    // target="_blank" olan link'lere otomatik noopener ekle
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
        },
      }),
    },
  });
}
