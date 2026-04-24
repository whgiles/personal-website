import { getAllArticles } from "@/lib/articles";

export async function GET() {
  const baseUrl = "https://www.whuntergiles.com";
  const articles = getAllArticles();

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>W. Hunter Giles</title>
    <link>${baseUrl}</link>
    <description>Engineering notes on systems, platforms, and reliability.</description>
    ${articles
      .map(
        (article) => `<item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid>${baseUrl}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.summary}]]></description>
    </item>`,
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
