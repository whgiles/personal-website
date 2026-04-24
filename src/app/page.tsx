import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getFeaturedArticles } from "@/lib/articles";

const skills: { category: string; items: string[] }[] = [
  {
    category: "Languages & Frameworks",
    items: ["TypeScript", "Node.js", "NestJS", "Java", "Spring"],
  },
  {
    category: "Data & Infrastructure",
    items: ["PostgreSQL", "TypeORM", "Databricks", "Apache Spark"],
  },
  {
    category: "Cloud & DevOps",
    items: ["GCP", "Cloud Run", "Pub/Sub", "BigQuery", "Terraform", "GitHub Actions", "Docker"],
  },
];

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(2);

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-12 md:px-8 md:py-16">
        <header className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 md:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                Available for opportunities
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">W. Hunter Giles</h1>
              <p className="mt-4 text-xl font-medium text-slate-700 dark:text-slate-300">
                Software and Machine Learning Engineer
              </p>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                I build scalable data platforms, backend systems, and cloud infrastructure with a bias for reliability, clarity, and operational excellence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/resume.pdf"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  Download resume
                </a>
                <Link
                  href="/articles"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
                >
                  Read articles
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <a href="https://github.com/whgiles" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/hunter-giles-75497712a/" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                LinkedIn
              </a>
              <a href="mailto:huntergiles2@gmail.com" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Contact
              </a>
              <span className="text-slate-500 dark:text-slate-400">Atlanta, GA</span>
            </div>
          </div>
        </header>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">Featured writing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Engineering notes</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Writing that shows how I think about systems design, reliability, data platforms, and platform engineering.
              </p>
            </div>
            <Link href="/articles" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight">Technical skills</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {skills.map((skillGroup) => (
              <div
                key={skillGroup.category}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  {skillGroup.category}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  {skillGroup.items.map((skill) => (
                    <li key={skill} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
