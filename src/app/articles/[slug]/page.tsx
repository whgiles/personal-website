import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  try {
    const article = getArticleBySlug(params.slug);

    return {
      title: `${article.title} | W. Hunter Giles`,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        type: "article",
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const article = getArticleBySlug(slug);

    return (
      <main className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <Link
          href="/articles"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          ← All articles
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8 dark:border-slate-800">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
            Article
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{article.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readingTimeText}</span>
            {article.updatedAt ? (
              <>
                <span>•</span>
                <span>Updated {formatDate(article.updatedAt)}</span>
              </>
            ) : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section className="mt-10">
          <ArticleBody source={article.content} />
        </section>
      </main>
    );
  } catch {
    notFound();
  }
}
