import Link from "next/link";
import { ExternalLink, Github, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { SKILL_CATEGORIES, skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { achievements } from "@/data/achievements";
import { ContactForm } from "@/components/ui/ContactForm";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { Placeholder, SafeImage } from "@/components/ui/SafeImage";
import { SocialLinks } from "@/components/ui/Social";
import { formatMonth } from "@/lib/utils";

const chip = "chip";

/**
 * The complete portfolio as semantic, server-rendered HTML.
 * Used as the text view / WebGL fallback and kept in the DOM for search engines.
 */
export function ClassicPortfolio() {
  return (
    <div>
      <header className="mx-auto max-w-5xl px-5 pb-6 pt-14 md:pt-20">
        <p className="eyebrow">NEXUS · Portfolio</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">{profile.name}</h1>
        <p className="mt-2 text-xl text-nexus-cyan">{profile.title}</p>
        <p className="mt-4 max-w-2xl text-nexus-muted">{profile.shortIntro}</p>
        <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2">
          {["about", "education", "experience", "skills", "projects", "certificates", "achievements", "contact"].map((id) => (
            <a key={id} href={`#classic-${id}`} className="chip capitalize">
              {id}
            </a>
          ))}
        </nav>
      </header>

      <section id="classic-about" className="classic-section" aria-labelledby="classic-about-title">
        <h2 id="classic-about-title">About</h2>
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-xl border border-nexus-cyan/40">
            <SafeImage src={profile.portrait} alt={profile.portraitAlt} priority sizes="220px" fallback={<Placeholder label={profile.initials} />} />
          </div>
          <div className="prose-nexus space-y-3">
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="flex items-center gap-1 text-sm">
              <MapPin size={14} aria-hidden="true" /> {profile.location}
            </p>
            <h3 className="pt-2 font-semibold text-nexus-text">Career interests</h3>
            <ul>
              {profile.careerInterests.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <h3 className="pt-2 font-semibold text-nexus-text">Professional goals</h3>
            <ul>
              {profile.goals.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <SocialLinks links={profile.socials} className="pt-3" />
            <div className="pt-2">
              <ResumeButton variant="primary" />
            </div>
          </div>
        </div>
      </section>

      <section id="classic-education" className="classic-section" aria-labelledby="classic-education-title">
        <h2 id="classic-education-title">Education</h2>
        <ol className="space-y-6">
          {education.map((e) => (
            <li key={e.id} className="glass p-5">
              <p className="eyebrow">
                {e.startYear} – {e.endYear}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{e.institution}</h3>
              <p className="text-nexus-muted">
                {e.degree} · {e.field}
                {e.location ? ` · ${e.location}` : ""}
              </p>
              {e.grade && <p className="mt-1 font-mono text-sm text-nexus-cyan">Grade: {e.grade}</p>}
              <p className="prose-nexus mt-3">{e.description}</p>
              <ul className="prose-nexus mt-3">
                {e.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="classic-experience" className="classic-section" aria-labelledby="classic-experience-title">
        <h2 id="classic-experience-title">Experience</h2>
        <ol className="space-y-6">
          {experience.map((e) => (
            <li key={e.id} className="glass p-5">
              <p className="eyebrow">
                {formatMonth(e.startDate)} – {e.endDate === "Present" ? "Present" : formatMonth(e.endDate)}
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                {e.position} · {e.company}
              </h3>
              <p className="text-nexus-muted">
                {e.employmentType} · {e.location}
              </p>
              <div className="prose-nexus mt-3">
                <h4 className="font-semibold text-nexus-text">Responsibilities</h4>
                <ul>
                  {e.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <h4 className="mt-3 font-semibold text-nexus-text">Achievements</h4>
                <ul>
                  {e.achievements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
                {e.technologies.map((t) => (
                  <li key={t} className={chip}>
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="classic-skills" className="classic-section" aria-labelledby="classic-skills-title">
        <h2 id="classic-skills-title">Skills</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat}>
              <h3 className="mb-2 font-semibold">{cat}</h3>
              <ul className="space-y-1 text-sm text-nexus-muted">
                {skills
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <li key={s.id}>
                      <span className="text-nexus-text">{s.name}</span>
                      {s.experience ? ` — ${s.experience}` : ""}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="classic-projects" className="classic-section" aria-labelledby="classic-projects-title">
        <h2 id="classic-projects-title">Projects</h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug} className="glass flex flex-col p-5">
              <p className="eyebrow">
                {p.category}
                {p.featured ? " · Featured" : ""}
              </p>
              <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
              <p className="prose-nexus mt-2 flex-1">{p.shortDescription}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                {p.technologies.map((t) => (
                  <li key={t} className={chip}>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/projects/${p.slug}`} className="btn btn-primary !px-3 !py-2">
                  Case study
                </Link>
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                    <Github size={14} aria-hidden="true" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                    <ExternalLink size={14} aria-hidden="true" /> Live demo<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="classic-certificates" className="classic-section" aria-labelledby="classic-certificates-title">
        <h2 id="classic-certificates-title">Certificates</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {certificates.map((c) => (
            <li key={c.id} className="glass p-5">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-nexus-muted">
                {c.issuer} · Issued {formatMonth(c.issueDate)}
                {c.expirationDate ? ` · Expires ${formatMonth(c.expirationDate)}` : ""}
              </p>
              {c.credentialId && <p className="mt-1 font-mono text-xs text-nexus-cyan">ID: {c.credentialId}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {c.pdf && (
                  <a href={c.pdf} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                    View PDF<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {c.verificationUrl && (
                  <a href={c.verificationUrl} target="_blank" rel="noopener noreferrer" className="btn !px-3 !py-2">
                    Verify<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="classic-achievements" className="classic-section" aria-labelledby="classic-achievements-title">
        <h2 id="classic-achievements-title">Achievements</h2>
        <ul className="space-y-4">
          {achievements.map((a) => (
            <li key={a.id} className="glass p-5">
              <p className="eyebrow">
                {a.category} · {formatMonth(a.date)}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{a.title}</h3>
              <p className="prose-nexus mt-2">{a.description}</p>
              <p className="prose-nexus mt-2">{a.story}</p>
              {a.evidenceUrl && (
                <a href={a.evidenceUrl} target="_blank" rel="noopener noreferrer" className="btn mt-3 !px-3 !py-2">
                  Evidence<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="classic-contact" className="classic-section" aria-labelledby="classic-contact-title">
        <h2 id="classic-contact-title">Contact</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="prose-nexus space-y-3">
            <p>
              Email:{" "}
              <a href={`mailto:${profile.email}`} className="text-nexus-cyan underline">
                {profile.email}
              </a>
            </p>
            <SocialLinks links={profile.socials} />
            <ResumeButton />
          </div>
          <ContactForm idPrefix="classic-contact-form" />
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-5 pb-12 pt-4 text-sm text-nexus-muted">
        © {new Date().getFullYear()} {profile.name}. Built with NEXUS.
      </footer>
    </div>
  );
}
