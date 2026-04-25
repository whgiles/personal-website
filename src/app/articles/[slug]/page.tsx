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
      <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
        <div className="hn-shell overflow-hidden border hn-rule bg-[var(--panel)]">
          <div className="hn-topline" />
          <div className="mx-auto max-w-3xl px-5 py-6 md:px-8 md:py-8">
            <Link href="/articles" className="hn-link text-sm font-medium">
              ← All articles
            </Link>

            <header className="mt-7 border-b hn-rule pb-8">
              <p className="hn-kicker">Article</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{article.title}</h1>
              <p className="mt-4 text-base leading-8 hn-muted md:text-lg">{article.summary}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm hn-muted">
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
              <div className="mt-5 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="hn-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <section className="mt-10">
              <ArticleBody source={article.content} />
            </section>
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
