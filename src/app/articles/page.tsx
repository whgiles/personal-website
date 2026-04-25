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
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="hn-shell overflow-hidden border hn-rule bg-[var(--panel)]">
        <div className="hn-topline" />
        <div className="px-5 py-6 md:px-8 md:py-8">
          <div className="max-w-3xl border-b hn-rule pb-8">
            <p className="hn-kicker">Writing</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Articles on engineering, systems, and reliability.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 hn-muted">
              Long-form notes on building dependable software, infrastructure, and systems that remain legible as they evolve.
            </p>
            <div className="mt-5">
              <Link href="/" className="hn-link text-sm font-medium">
                ← Back to home
              </Link>
            </div>
          </div>

          <section className="mt-8 space-y-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
