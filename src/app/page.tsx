import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getFeaturedArticles } from "@/lib/articles";

const skills: { category: string; items: string[] }[] = [
  {
    category: "Languages & Backend Engineering",
    items: ["TypeScript", "Python", "Java", "C#", "Node.js", "NestJS", "Spring", ".NET"],
  },
  {
    category: "Data, ML & Analytics Platforms",
    items: ["Databricks", "Apache Spark", "PySpark", "BigQuery", "Structured Streaming", "Delta Tables", "PyTorch", "Keras"],
  },
  {
    category: "Cloud, DevOps & Infrastructure",
    items: ["Google Cloud Platform", "Cloud Run", "Pub/Sub", "Terraform", "Docker", "GitHub Actions", "Kubernetes", "Flux"],
  },
];

export default function HomePage() {
  const featuredArticles = getFeaturedArticles(2);

  return (
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="hn-shell overflow-hidden border hn-rule bg-[var(--panel)]">
        <div className="hn-topline" />

        <div className="px-5 py-6 md:px-8 md:py-8">
          <header className="border-b hn-rule pb-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="hn-kicker">Available for opportunities</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">W. Hunter Giles</h1>
                <p className="mt-3 text-lg font-medium hn-muted md:text-xl">
                  Software and Machine Learning Engineer
                </p>
                <div className="mt-6 flex flex-wrap gap-5 text-sm">
                  <a href="/resume.pdf" className="hn-link font-medium">
                    Resume
                  </a>
                  <Link href="/articles" className="hn-link font-medium">
                    Articles
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm hn-muted">
                <a href="https://github.com/whgiles" target="_blank" rel="noreferrer" className="hn-link">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/hunter-giles-75497712a/" target="_blank" rel="noreferrer" className="hn-link">
                  LinkedIn
                </a>
                <a href="mailto:huntergiles2@gmail.com" className="hn-link">
                  Contact
                </a>
                <span>Atlanta, GA</span>
              </div>
            </div>
          </header>

          <section className="border-b hn-rule py-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="hn-kicker">Writing</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Selected articles</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 hn-muted md:text-base">
                  Notes on infrastructure, systems, and practical engineering work.
                </p>
              </div>
              <Link href="/articles" className="hn-link text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="mt-8 space-y-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>

          <section className="py-8">
            <p className="hn-kicker">Technical skills</p>
            <div className="mt-5 grid gap-8 md:grid-cols-3">
              {skills.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide hn-muted">
                    {skillGroup.category}
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm leading-6">
                    {skillGroup.items.map((skill) => (
                      <li key={skill} className="flex items-start gap-2">
                        <span className="mt-[0.45rem] h-1 w-1 rounded-full bg-[var(--accent)]" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
