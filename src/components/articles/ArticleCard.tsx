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
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span>{formatDate(article.publishedAt)}</span>
        <span>•</span>
        <span>{article.readingTimeText}</span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
        <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
          {article.title}
        </Link>
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{article.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
