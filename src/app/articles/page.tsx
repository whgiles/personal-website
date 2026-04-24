import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles | W. Hunter Giles",
  description:
    "Writing on software engineering, data platforms, platform architecture, and building reliable systems.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
          Writing
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
          Articles on engineering, systems, and reliability.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Long-form notes on designing dependable software and building systems that stay understandable as they grow.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            ← Back to home
          </Link>
        </div>
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </section>
    </main>
  );
}
