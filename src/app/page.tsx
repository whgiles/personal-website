// app/page.tsx — Next.js 14+ (App Router) with TypeScript
// 1) npm i react-icons
// 2) Put your resume at public/resume.pdf

import type { Metadata } from "next";
import type { JSX } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const metadata: Metadata = {
  title: "W. Hunter Giles — Resume",
  description:
    "Software Engineer specializing in microservices, data platforms, and cloud infrastructure.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type ProjectCardProps = {
  title: string;
  blurb: string;
  links: { label: string; href: string }[];
};

export default function Page(): JSX.Element {
  const skills: string[] = [
    "TypeScript / Node / NestJS",
    "Java / Spring",
    "PostgreSQL / TypeORM",
    "GCP (Cloud Run, Pub/Sub, BigQuery)",
    "Databricks / Spark",
    "Terraform / GitHub Actions",
    "Docker",
  ];

  const projects: ProjectCardProps[] = [
    {
      title: "Microservice Version Dashboard",
      blurb:
        "Aggregates /health/version endpoints to visualize deployed versions across environments. GitHub Actions + GitHub Pages + TypeScript.",
      links: [
        { label: "Repo", href: "#" },
        { label: "Live", href: "#" },
      ],
    },
    {
      title: "Shorts Generation Pipeline",
      blurb:
        "Cloud Run Jobs orchestrated via Firestore triggers & Pub/Sub. Steps: script → audio → image → stitch → publish.",
      links: [{ label: "Write-up", href: "#" }],
    },
  ];

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10 bg-neutral-50 text-neutral-900">
      <Header />
      <Skills skills={skills} />
      <ResumePDF />
      {/* <Projects projects={projects} /> */}
      <Footer />
    </main>
  );
}

function Header(): JSX.Element {
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">W. Hunter Giles</h1>
          <p className="mt-1 text-neutral-600">
            Software/Machine Learning Engineer • Microservices • Data Platforms 
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-700">
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
            >
              Download Resume (PDF)
            </a>

            {/* LinkedIn (brand button) */}
            <a
              href="https://www.linkedin.com/in/hunter-giles-75497712a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition shadow"
            >
              <FaLinkedin />
              LinkedIn
            </a>

            {/* GitHub (brand button) */}
            <a
              href="https://github.com/whgiles"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#333] text-white hover:bg-black transition shadow"
            >
              <FaGithub />
              GitHub
            </a>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100">
              Atlanta, GA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ skills }: { skills: string[] }): JSX.Element {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Skills</h2>
      <ul className="mt-2 flex flex-wrap gap-2 text-sm">
        {skills.map((s) => (
          <li
            key={s}
            className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-100"
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Projects({ projects }: { projects: ProjectCardProps[] }): JSX.Element {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Selected Projects</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <article key={p.title} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h3 className="font-medium">{p.title}</h3>
            <p className="mt-1 text-sm text-neutral-700">{p.blurb}</p>
            <div className="mt-2 text-sm flex gap-4">
              {p.links.map((l) => (
                <a key={l.label} className="text-purple-700 hover:underline" href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResumePDF(): JSX.Element {
  return (
    <section id="resume" className="mt-8">
      <h2 className="text-xl font-semibold flex items-center justify-between">
        Resume
        <a
          href="/resume.pdf"
          className="text-sm px-3 py-1 rounded-lg bg-purple-700 text-white hover:bg-purple-800 shadow"
        >
          Download PDF
        </a>
      </h2>
      <p className="mt-2 text-sm text-neutral-700">
        The site highlights skills and projects; the full CV is served as a static file. On mobile,
        use the download button.
      </p>
      <div className="mt-4 w-full rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white">
        <object
          data="/resume.pdf#view=FitH"
          type="application/pdf"
          className="w-full h-[75vh] hidden md:block"
        >
          <div className="p-6 text-sm">
            <p>
              Your browser can’t display PDFs inline. Please{" "}
              <a className="text-purple-700 underline" href="/resume.pdf">
                download the PDF here
              </a>
              .
            </p>
          </div>
        </object>
        <div className="md:hidden p-4">
          <a
            href="/resume.pdf"
            className="inline-block px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow"
          >
            Download resume.pdf
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer(): JSX.Element {
  return (
    <footer className="mt-10 pt-6 border-t border-neutral-200 text-xs text-neutral-600">
      <p>© {new Date().getFullYear()} Hunter Giles. All rights reserved.</p>
    </footer>
  );
}
