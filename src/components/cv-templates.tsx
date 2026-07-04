import type { CVData } from "@/lib/cv-types";
import type { ReactNode } from "react";

interface Props {
  data: CVData;
}

function fmtDate(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  const months = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];
  return m ? `${months[+m - 1]} ${y}` : y;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="mb-2 border-b border-secondary/20 pb-1 font-display text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
        {title}
      </h2>
      <div className="text-[11.5px] leading-relaxed text-secondary">{children}</div>
    </section>
  );
}

export function TemplateModerne({ data }: Props) {
  const p = data.personal;
  return (
    <div className="print-page mx-auto w-[210mm] min-h-[297mm] bg-white p-[15mm] font-sans text-secondary shadow-card">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {p.fullName || "Votre nom"}
        </h1>
        {p.jobTitle && <div className="mt-1 text-base font-medium text-primary">{p.jobTitle}</div>}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>{p.website}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </header>

      {p.summary && (
        <Section title="Résumé professionnel">
          <p>{p.summary}</p>
        </Section>
      )}

      {data.experiences.length > 0 && (
        <Section title="Expérience professionnelle">
          {data.experiences.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">{e.position}</div>
                <div className="text-[10px] text-muted-foreground">
                  {fmtDate(e.startDate)} — {e.current ? "aujourd'hui" : fmtDate(e.endDate)}
                </div>
              </div>
              <div className="text-[11px] text-primary">
                {e.company}
                {e.location ? ` · ${e.location}` : ""}
              </div>
              {e.description && <div className="mt-1 whitespace-pre-line">{e.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Formation">
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">{e.degree}</div>
                <div className="text-[10px] text-muted-foreground">
                  {fmtDate(e.startDate)} — {fmtDate(e.endDate)}
                </div>
              </div>
              <div className="text-[11px] text-primary">
                {e.school}
                {e.location ? ` · ${e.location}` : ""}
              </div>
              {e.description && <div className="mt-0.5">{e.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Compétences">
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s.id} className="rounded bg-muted px-2 py-0.5 text-[11px]">
                {s.name}
                {s.level ? ` · ${s.level}` : ""}
              </span>
            ))}
          </div>
        </Section>
      )}

      {data.languages.length > 0 && (
        <Section title="Langues">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.languages.map((l) => (
              <span key={l.id}>
                <b>{l.name}</b> — {l.level}
              </span>
            ))}
          </div>
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((c) => (
            <div key={c.id} className="mb-1">
              <b>{c.name}</b> — {c.issuer} ({fmtDate(c.date)})
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

export function TemplateMinimal({ data }: Props) {
  const p = data.personal;
  return (
    <div className="print-page mx-auto w-[210mm] min-h-[297mm] bg-white p-[18mm] font-sans text-secondary shadow-card">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {p.fullName || "Votre nom"}
        </h1>
        {p.jobTitle && (
          <div className="mt-1 text-sm tracking-widest uppercase text-muted-foreground">
            {p.jobTitle}
          </div>
        )}
        <div className="mt-3 text-[11px] text-secondary">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join("  ·  ")}
        </div>
      </header>

      {p.summary && (
        <div className="mb-6 border-y py-3 text-center text-[12px] italic">{p.summary}</div>
      )}

      {data.experiences.map((e) => (
        <div key={e.id} className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {fmtDate(e.startDate)} — {e.current ? "aujourd'hui" : fmtDate(e.endDate)}
          </div>
          <div className="font-display text-[15px] font-semibold">
            {e.position} · {e.company}
          </div>
          {e.description && (
            <div className="mt-1 whitespace-pre-line text-[11.5px] leading-relaxed">
              {e.description}
            </div>
          )}
        </div>
      ))}

      {data.education.length > 0 && (
        <Section title="Formation">
          {data.education.map((e) => (
            <div key={e.id} className="mb-2">
              <b>{e.degree}</b> · {e.school}{" "}
              <span className="text-muted-foreground">({fmtDate(e.endDate)})</span>
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Compétences">{data.skills.map((s) => s.name).join(" · ")}</Section>
      )}

      {data.languages.length > 0 && (
        <Section title="Langues">
          {data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}
        </Section>
      )}
    </div>
  );
}

export function TemplateExecutive({ data }: Props) {
  const p = data.personal;
  return (
    <div className="print-page mx-auto w-[210mm] min-h-[297mm] bg-white font-sans text-secondary shadow-card">
      <header className="bg-secondary p-[15mm] text-white">
        <h1 className="font-display text-4xl font-bold">{p.fullName || "Votre nom"}</h1>
        {p.jobTitle && <div className="mt-1 text-base font-light text-accent">{p.jobTitle}</div>}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/80">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </header>
      <div className="p-[15mm]">
        {p.summary && <Section title="Profil">{p.summary}</Section>}
        {data.experiences.length > 0 && (
          <Section title="Expérience">
            {data.experiences.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <div className="font-semibold">
                    {e.position} — {e.company}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {fmtDate(e.startDate)} — {e.current ? "aujourd'hui" : fmtDate(e.endDate)}
                  </div>
                </div>
                {e.description && <div className="mt-1 whitespace-pre-line">{e.description}</div>}
              </div>
            ))}
          </Section>
        )}
        {data.education.length > 0 && (
          <Section title="Formation">
            {data.education.map((e) => (
              <div key={e.id} className="mb-1.5">
                <b>{e.degree}</b>, {e.school}{" "}
                <span className="text-muted-foreground">— {fmtDate(e.endDate)}</span>
              </div>
            ))}
          </Section>
        )}
        {data.skills.length > 0 && (
          <Section title="Expertise">
            <div className="grid grid-cols-2 gap-1">
              {data.skills.map((s) => (
                <div key={s.id}>• {s.name}</div>
              ))}
            </div>
          </Section>
        )}
        {data.languages.length > 0 && (
          <Section title="Langues">
            {data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}
          </Section>
        )}
        {data.certifications.length > 0 && (
          <Section title="Certifications">
            {data.certifications.map((c) => (
              <div key={c.id}>
                • {c.name} — {c.issuer}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

export function CVRenderer({ template, data }: { template: string; data: CVData }) {
  if (template === "minimal") return <TemplateMinimal data={data} />;
  if (template === "executive") return <TemplateExecutive data={data} />;
  return <TemplateModerne data={data} />;
}

export const TEMPLATES = [
  { id: "moderne", name: "Moderne", description: "Équilibré et professionnel" },
  { id: "minimal", name: "Minimal", description: "Épuré et élégant" },
  { id: "executive", name: "Executive", description: "Imposant et premium" },
] as const;
