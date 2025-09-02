// app/page.tsx — Next.js 14+ (App Router) with TypeScript
// 1) npm i react-icons
// 2) Put your resume at public/resume.pdf

"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaDownload, FaMapMarkerAlt, FaEnvelope, FaMoon, FaSun } from "react-icons/fa";

type ProjectCardProps = {
  title: string;
  blurb: string;
  links: { label: string; href: string }[];
  tags: string[];
};

// Theme configuration object
const themes = {
  light: {
    background: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
    card: 'bg-white/80 border-slate-200/60 hover:border-slate-300/80 hover:shadow-lg',
    headerCard: 'bg-white/70 border-white/20',
    headerGradient: 'bg-gradient-to-r from-blue-600/5 to-purple-600/5',
    text: {
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
      tertiary: 'text-slate-500',
      muted: 'text-slate-400',
      gradient: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700',
    },
    button: {
      primary: 'bg-slate-900 text-white hover:bg-slate-800',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      github: 'bg-slate-800 hover:bg-slate-900',
    },
    accent: 'bg-gradient-to-r from-blue-500 to-purple-500',
    tag: 'bg-slate-100 text-slate-700',
    link: 'text-blue-600 hover:text-blue-700',
    border: 'border-slate-200/60',
    toggle: 'bg-white/80 border-slate-200/60',
  },
  dark: {
    background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    card: 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600/80 hover:shadow-slate-900/20',
    headerCard: 'bg-slate-800/70 border-slate-700/30',
    headerGradient: 'bg-gradient-to-r from-blue-400/10 to-purple-400/10',
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-300',
      tertiary: 'text-slate-400',
      muted: 'text-slate-500',
      gradient: 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300',
    },
    button: {
      primary: 'bg-slate-100 text-slate-900 hover:bg-white',
      secondary: 'bg-slate-700 text-slate-300 hover:bg-slate-600',
      github: 'bg-slate-700 hover:bg-slate-600',
    },
    accent: 'bg-gradient-to-r from-blue-400 to-purple-400',
    tag: 'bg-slate-700 text-slate-300',
    link: 'text-blue-400 hover:text-blue-300',
    border: 'border-slate-700/60',
    toggle: 'bg-slate-800/80 border-slate-700/60',
  },
};

// Theme utility function
const getTheme = (darkMode: boolean) => darkMode ? themes.dark : themes.light;
const storageKey = "theme"; // "dark" | "light"

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false; // SSR fallback (we'll correct on mount)
  const saved = window.localStorage.getItem(storageKey);
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export default function Page(): JSX.Element {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Initialize on mount
  useEffect(() => {
    setDarkMode(getInitialDark());
  }, []);

  // Persist whenever it changes
  useEffect(() => {
    if (darkMode === null) return;
    window.localStorage.setItem(storageKey, darkMode ? "dark" : "light");
  }, [darkMode]);

  // Keep tabs/windows in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setDarkMode(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Optional: follow system changes only if user hasn’t chosen (i.e., no saved key)
  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) return; // user preference wins
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setDarkMode(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  if (darkMode === null) {
    // Prevent initial flash while we detect the real value
    return <div className="min-h-screen bg-black/0" />;
  }

  const theme = getTheme(darkMode);

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

  const projects: ProjectCardProps[] = [
    {
      title: "Microservice Version Dashboard",
      blurb:
        "Real-time aggregation of /health/version endpoints to visualize deployed versions across multiple environments. Built with modern CI/CD integration.",
      links: [
        { label: "Repository", href: "#" },
        { label: "Live Demo", href: "#" },
      ],
      tags: ["TypeScript", "GitHub Actions", "Monitoring"],
    },
    {
      title: "Shorts Generation Pipeline",
      blurb:
        "Automated video generation pipeline using Cloud Run Jobs with Firestore triggers. Orchestrates script generation, audio synthesis, image processing, and publishing workflows.",
      links: [{ label: "Technical Write-up", href: "#" }],
      tags: ["GCP", "Pub/Sub", "Media Processing"],
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.background}`}>
      <main className="max-w-4xl mx-auto px-6 py-12 md:px-8 md:py-16">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />
        <Header theme={theme} />
        <div className="mt-12 space-y-12">
          <Skills skills={skills} theme={theme} />
          <ResumePDF theme={theme} />

          {/* <Projects projects={projects} theme={theme} /> */}
        </div>
        <Footer theme={theme} />
      </main>
    </div>
  );
}

 function ThemeToggle({
    darkMode,
    setDarkMode,
    theme,
  }: {
    darkMode: boolean;
    setDarkMode: (val: boolean) => void;
    theme: typeof themes.light | typeof themes.dark;
  }): JSX.Element {
    return (
      <div className="flex justify-end mb-8">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`group relative p-3 rounded-full backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${theme.toggle}`}
          aria-label="Toggle dark mode"
        >
          <div className="relative w-5 h-5">
            <FaSun
              className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
                darkMode ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <FaMoon
              className={`absolute inset-0 w-5 h-5 text-slate-400 transition-all duration-300 ${
                darkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
              }`}
            />
          </div>
        </button>
      </div>
    );
  }

function Header({ theme }: { theme: typeof themes.light }): JSX.Element {
  return (
    <header className="relative">
      <div className={`absolute inset-0 rounded-3xl transition-colors duration-300 ${theme.headerGradient}`}></div>
      <div className={`relative backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-300 ${theme.headerCard}`}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 animate-pulse"></div>
              <span className={`text-sm font-medium transition-colors duration-300 ${theme.text.secondary}`}>Available for opportunities</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent leading-tight ${theme.text.gradient}`}>
              W. Hunter Giles
            </h1>
            
            <p className={`mt-3 text-xl font-medium transition-colors duration-300 ${theme.text.secondary}`}>
              Software & Machine Learning Engineer
            </p>
            
            <p className={`mt-2 max-w-lg leading-relaxed transition-colors duration-300 ${theme.text.tertiary}`}>
              Specialized in building scalable microservices, data platforms, and cloud infrastructure. 
              Passionate about creating elegant solutions to complex technical challenges.
            </p>

            <div className={`mt-6 flex items-center gap-2 transition-colors duration-300 ${theme.text.tertiary}`}>
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>Atlanta, GA</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="/resume.pdf"
              className={`group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${theme.button.primary}`}
            >
              <FaDownload className="w-4 h-4 group-hover:animate-bounce" />
              Download Resume
            </a>

            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/hunter-giles-75497712a/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <FaLinkedin className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                <span className="hidden sm:inline font-medium">LinkedIn</span>
              </a>

              <a
                href="https://github.com/whgiles"
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 ${theme.button.github}`}
              >
                <FaGithub className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                <span className="hidden sm:inline font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Skills({ skills, theme }: { skills: { category: string; items: string[] }[]; theme: typeof themes.light }): JSX.Element {
  return (
    <section>
      <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${theme.text.primary}`}>Technical Skills</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {skills.map((skillGroup, index) => (
          <div
            key={skillGroup.category}
            className={`group backdrop-blur-sm rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${theme.card}`}
          >
            <h3 className={`font-semibold mb-4 text-sm uppercase tracking-wide transition-colors duration-300 ${theme.text.secondary}`}>
              {skillGroup.category}
            </h3>
            <div className="space-y-2">
              {skillGroup.items.map((skill, skillIndex) => (
                <div
                  key={skill}
                  className={`flex items-center gap-3 transition-colors duration-300 ${theme.text.secondary} group-hover:${theme.text.primary}`}
                  style={{
                    animationDelay: `${index * 100 + skillIndex * 50}ms`,
                  }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${theme.accent}`}></div>
                  <span className="text-sm font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects({ projects, theme }: { projects: ProjectCardProps[]; theme: typeof themes.light }): JSX.Element {
  return (
    <section>
      <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${theme.text.primary}`}>Selected Projects</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <article
            key={project.title}
            className={`group backdrop-blur-sm rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${theme.card}`}
          >
            <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${theme.text.primary} ${theme.link}`}>
              {project.title}
            </h3>
            
            <p className={`leading-relaxed mb-4 transition-colors duration-300 ${theme.text.secondary}`}>
              {project.blurb}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors duration-300 ${theme.tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`inline-flex items-center gap-1 font-medium hover:underline transition-colors duration-300 ${theme.link}`}
                >
                  {link.label}
                  <span className="group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResumePDF({ theme }: { theme: typeof themes.light }): JSX.Element {
  return (
    <section id="resume">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold transition-colors duration-300 ${theme.text.primary}`}>Resume</h2>
        <a
          href="/resume.pdf"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <FaDownload className="w-4 h-4" />
          Download PDF
        </a>
      </div>
      
      <p className={`mb-6 leading-relaxed transition-colors duration-300 ${theme.text.secondary}`}>
        Complete work history, education, and detailed project descriptions. 
      </p>

      <div className={`relative rounded-2xl overflow-hidden ring-1 shadow-lg transition-all duration-300 ${theme.card.split(' ')[0]} ${theme.border}`}>
        <div className={`absolute inset-0 transition-colors duration-300 ${theme.headerGradient}`}></div>
        <object
          data="/resume.pdf#view=FitH"
          type="application/pdf"
          className="relative w-full h-[80vh] hidden md:block"
        >
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${theme.button.secondary}`}>
              <FaDownload className={`w-6 h-6 ${theme.text.muted}`} />
            </div>
            <p className={`mb-4 transition-colors duration-300 ${theme.text.secondary}`}>
              Your browser does not support PDF preview.
            </p>
            <a
              href="/resume.pdf"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${theme.button.primary}`}
            >
              <FaDownload className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </object>
        
        <div className="md:hidden p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${theme.button.secondary}`}>
            <FaDownload className={`w-6 h-6 ${theme.text.muted}`} />
          </div>
          <p className={`mb-6 transition-colors duration-300 ${theme.text.secondary}`}>
            View the full resume on your device
          </p>
          <a
            href="/resume.pdf"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${theme.button.primary}`}
          >
            <FaDownload className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ theme }: { theme: typeof themes.light }): JSX.Element {
  return (
    <footer className={`mt-16 pt-8 border-t transition-colors duration-300 ${theme.border}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className={`text-sm transition-colors duration-300 ${theme.text.tertiary}`}>
          © {new Date().getFullYear()} W. Hunter Giles.
        </p>
        <div className={`flex items-center gap-6 text-sm ${theme.text.tertiary}`}>
          <a
            href="mailto:huntergiles2@gmail.com"
            className={`inline-flex items-center gap-2 transition-colors duration-300 ${theme.link}`}
          >
            <FaEnvelope className="w-4 h-4" />
            <span className="hidden sm:inline">Get in touch</span>
          </a>
        </div>
      </div>
    </footer>
  );
}