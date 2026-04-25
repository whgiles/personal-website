import Link from "next/link";
import type { Article } from "@/lib/articles";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="border-b hn-rule pb-6 last:border-b-0">
      <div className="flex flex-wrap items-center gap-3 text-xs hn-muted">
        <span>{formatDate(article.publishedAt)}</span>
        <span>•</span>
        <span>{article.readingTimeText}</span>
      </div>

      <h3 className="mt-2 text-xl font-semibold tracking-tight">
        <Link href={`/articles/${article.slug}`} className="hn-link">
          {article.title}
        </Link>
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 hn-muted">{article.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="hn-tag">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
