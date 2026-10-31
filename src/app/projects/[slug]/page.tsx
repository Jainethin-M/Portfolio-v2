import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { SITE } from "@/config/site";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { AssetsProvider } from "@/components/ui/AssetsContext";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { existingAssets } from "@/lib/assets";
import { experienceForProject, getProject } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  const url = `${SITE.url}/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} | ${profile.name}`,
      description: project.shortDescription,
      url,
    },
    twitter: { card: "summary_large_image", title: project.title, description: project.shortDescription },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10" aria-labelledby={`h-${title.replace(/\W+/g, "-").toLowerCase()}`}>
      <h2 id={`h-${title.replace(/\W+/g, "-").toLowerCase()}`} className="mb-3 border-b border-nexus-cyan/20 pb-2 text-xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1 pl-5 text-nexus-muted">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const roles = experienceForProject(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    genre: project.category,
    keywords: project.technologies.join(", "),
    author: { "@type": "Person", name: profile.name },
    url: `${SITE.url}/projects/${project.slug}`,
    ...(project.year ? { dateCreated: String(project.year) } : {}),
  };

  return (
    <AssetsProvider existing={existingAssets()}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a href="#project-main" className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]">
        Skip to content
      </a>
      <header className="border-b border-nexus-cyan/20 bg-nexus-bg/80">
        <nav aria-label="Project navigation" className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="btn !px-3 !py-2">
            <ArrowLeft size={14} aria-hidden="true" />
            Back to NEXUS
          </Link>
          <span className="font-display text-lg font-bold tracking-[0.3em] text-nexus-cyan">NEXUS</span>
        </nav>
      </header>

      <main id="project-main" className="mx-auto max-w-4xl px-5 pb-20 pt-10">
        <p className="eyebrow">
          {project.category}
          {project.featured ? " · Featured" : ""}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-nexus-muted">{project.shortDescription}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn">
              <Github size={14} aria-hidden="true" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <ExternalLink size={14} aria-hidden="true" /> Live demo<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {project.images.length > 0 ? (
            project.images.map((img) => (
              <div key={img.src} className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                <SafeImage src={img.src} alt={img.alt} fallback={<Placeholder label="Image unavailable" />} sizes="(max-width: 640px) 100vw, 400px" />
              </div>
            ))
          ) : (
            <div className="aspect-[16/6] overflow-hidden rounded-xl border border-white/10 sm:col-span-2">
              <Placeholder label="Project images coming soon" />
            </div>
          )}
        </div>

        <Section title="Overview">
          <p className="leading-relaxed text-nexus-muted">{project.description}</p>
        </Section>
        <Section title="Technologies">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Key features">
          <List items={project.features} />
        </Section>
        {project.architecture && (
          <Section title="Architecture">
            <p className="leading-relaxed text-nexus-muted">{project.architecture}</p>
          </Section>
        )}
        {project.challenges.length > 0 && (
          <Section title="Challenges">
            <List items={project.challenges} />
          </Section>
        )}
        {project.solutions.length > 0 && (
          <Section title="Solutions">
            <List items={project.solutions} />
          </Section>
        )}
        {project.outcomes.length > 0 && (
          <Section title="Outcomes">
            <List items={project.outcomes} />
          </Section>
        )}

        {roles.length > 0 && (
          <Section title="Built during">
            <ul className="space-y-1 text-nexus-muted">
              {roles.map((r) => (
                <li key={r.id}>
                  {r.position} at {r.company}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <nav aria-label="More projects" className="mt-14 flex flex-wrap justify-between gap-3 border-t border-nexus-cyan/20 pt-6">
          <Link href={`/projects/${prev.slug}`} className="btn">
            <ArrowLeft size={14} aria-hidden="true" /> {prev.title}
          </Link>
          <Link href={`/projects/${next.slug}`} className="btn">
            {next.title} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </nav>
      </main>
    </AssetsProvider>
  );
}
