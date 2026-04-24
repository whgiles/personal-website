import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const articlesDirectory = path.join(process.cwd(), "src", "content", "articles");

const dateField = z.union([z.string(), z.date()]).transform((value) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${String(value)}`);
  }

  return date.toISOString().slice(0, 10);
});

const articleFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1).max(240),
  publishedAt: dateField,
  updatedAt: dateField.optional(),
  tags: z.array(z.string().min(1)).default([]),
  draft: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  heroImage: z.string().optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export type Article = ArticleFrontmatter & {
  content: string;
  readingTimeText: string;
};

function ensureArticlesDirectory(): void {
  if (!fs.existsSync(articlesDirectory)) {
    throw new Error(`Articles directory not found: ${articlesDirectory}`);
  }
}

function parseArticleFile(fileName: string): Article {
  const fullPath = path.join(articlesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = articleFrontmatterSchema.parse(data);

  return {
    ...frontmatter,
    content,
    readingTimeText: readingTime(content).text,
  };
}

export function getAllArticles(includeDrafts = false): Article[] {
  ensureArticlesDirectory();

  const fileNames = fs
    .readdirSync(articlesDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"));

  return fileNames
    .map(parseArticleFile)
    .filter((article) => includeDrafts || !article.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleSlugs(includeDrafts = false): string[] {
  return getAllArticles(includeDrafts).map((article) => article.slug);
}

export function getArticleBySlug(slug: string, includeDrafts = false): Article {
  const article = getAllArticles(includeDrafts).find((entry) => entry.slug === slug);

  if (!article) {
    throw new Error(`Article not found for slug: ${slug}`);
  }

  return article;
}

export function getFeaturedArticles(limit = 2): Article[] {
  return getAllArticles(false)
    .filter((article) => article.featured)
    .slice(0, limit);
}
