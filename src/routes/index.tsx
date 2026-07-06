import type { ReactElement } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Sparkles,
  FileText,
  Target,
  Download,
  BarChart3,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { LandingMobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVForge — Créez votre CV ATS Friendly en ligne" },
      {
        name: "description",
        content:
          "Créez un CV optimisé pour les ATS en quelques minutes. Templates professionnels, score ATS en temps réel, export PDF. Gratuit pour commencer.",
      },
      { property: "og:title", content: "CVForge — CV ATS Friendly" },
      {
        property: "og:description",
        content: "Décrochez plus d'entretiens avec un CV scientifiquement optimisé.",
      },
    ],
  }),
  component: Landing,
});

const NAV_LINKS = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#templates", label: "Templates" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Templates />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-base font-bold sm:text-lg">CVForge</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link to="/auth" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link to="/auth" className="hidden md:inline-flex">
            <Button size="sm" className="bg-gradient-primary shadow-glow">
              Commencer
            </Button>
          </Link>
          <Link to="/auth" className="hidden min-[420px]:inline-flex md:hidden">
            <Button size="sm" className="bg-gradient-primary">
              Commencer
            </Button>
          </Link>
          <LandingMobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
        <div className="flex flex-col justify-center">
          <Badge
            variant="outline"
            className="mb-5 w-fit max-w-full gap-1.5 whitespace-normal border-primary/30 bg-primary/5 text-primary shadow-glow"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Score ATS instantané · Nouveau moteur v2
          </Badge>
          <h1 className="font-display text-3xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Le CV qui passe
            <br />
            <span className="text-primary">les filtres ATS.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:mt-6 sm:text-lg">
            Créez un CV professionnel optimisé pour les robots de recrutement. Templates
            ATS-friendly, analyse en temps réel, matching d'offre et export PDF haute qualité.
          </p>
          <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
            <Link to="/auth" className="sm:flex-none">
              <Button
                size="lg"
                className="w-full bg-gradient-primary shadow-elegant transition hover:-translate-y-0.5 sm:w-auto"
              >
                Créer mon CV gratuitement
              </Button>
            </Link>
            <a href="#templates" className="sm:flex-none">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary/20 bg-background/60 backdrop-blur sm:w-auto"
              >
                Voir les templates
              </Button>
            </a>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground sm:mt-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> Sans carte bancaire
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> Export PDF illimité
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> RGPD · UE
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {/* Glow disc behind mockup */}
          <div className="relative animate-fade-in-up">
            <div className="relative rotate-[-1.5deg] transition duration-500 hover:rotate-0">
              <CVPreviewMock />
            </div>
            <ScoreCard />
            <KeywordChip />
            <PassChip />
          </div>
        </div>
      </div>
    </section>
  );
}

function CVPreviewMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-elegant ring-1 ring-border sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="min-w-0">
          <div className="font-display text-lg font-bold text-slate-900 sm:text-xl">
            Camille Laurent
          </div>
          <div className="mt-0.5 text-sm font-medium text-primary">
            Développeuse Full-Stack Senior
          </div>
          <div className="mt-2 text-[10px] leading-relaxed text-slate-500">
            camille.laurent@email.fr · +33 6 12 34 56 78
            <br />
            Paris · linkedin.com/in/claurent
          </div>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
          CL
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Briefcase className="h-3 w-3" /> Expérience
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-xs font-semibold text-slate-800">
                Développeuse Senior · Stellar Tech
              </div>
              <div className="shrink-0 text-[9px] text-slate-500">2022 — Actuel</div>
            </div>
            <div className="mt-1 space-y-1">
              <div className="h-1.5 w-full rounded bg-slate-100" />
              <div className="h-1.5 w-11/12 rounded bg-slate-100" />
              <div className="h-1.5 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-xs font-semibold text-slate-800">Développeuse · Nova SaaS</div>
              <div className="shrink-0 text-[9px] text-slate-500">2019 — 2022</div>
            </div>
            <div className="mt-1 space-y-1">
              <div className="h-1.5 w-full rounded bg-slate-100" />
              <div className="h-1.5 w-3/4 rounded bg-slate-100" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <GraduationCap className="h-3 w-3" /> Formation
          </div>
          <div className="mt-1.5 text-xs font-semibold text-slate-800">
            Master Informatique · EPITA
          </div>
          <div className="text-[9px] text-slate-500">2017 — 2019</div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Compétences
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL"].map(
              (s) => (
                <span
                  key={s}
                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200/60"
                >
                  {s}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard() {
  return (
    <div className="absolute -bottom-6 -left-4 z-10 hidden w-56 rounded-lg bg-secondary p-5 text-white shadow-elegant ring-1 ring-white/10 animate-float lg:block">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-white/70">Score ATS</div>
        <Badge className="bg-success text-success-foreground">Excellent</Badge>
      </div>
      <div className="mt-1 font-display text-4xl font-bold tabular-nums">
        87<span className="text-xl text-white/50">/100</span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          ["Structure", 92],
          ["Mots-clés", 85],
          ["Lisibilité", 88],
        ].map(([label, val]) => (
          <div key={label as string}>
            <div className="flex justify-between text-[10px] text-white/70">
              <span>{label}</span>
              <span>{val}%</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeywordChip() {
  return (
    <div className="absolute -right-3 top-8 z-10 hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-elegant ring-1 ring-border animate-float-slow lg:flex">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
        <TrendingUp className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-[10px] text-slate-500">Mots-clés</div>
        <div className="font-semibold">+12 détectés</div>
      </div>
    </div>
  );
}

function PassChip() {
  return (
    <div
      className="absolute -right-2 -bottom-4 z-10 hidden items-center gap-2 rounded-full bg-gradient-primary px-3 py-2 text-xs font-medium text-white shadow-glow animate-float lg:flex"
      style={{ animationDelay: "1.2s" }}
    >
      <Award className="h-3.5 w-3.5" />
      <span>Passe 100% des ATS</span>
    </div>
  );
}

function Stats() {
  const items = [
    ["75%", "des CV rejetés par les ATS"],
    ["3×", "plus d'entretiens"],
    ["8 min", "pour créer votre CV"],
    ["100%", "compatible ATS"],
  ];
  return (
    <section className="border-y bg-surface-elevated">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 md:grid-cols-4">
        {items.map(([v, l]) => (
          <div key={l} className="text-center">
            <div className="font-display text-2xl font-bold text-primary sm:text-3xl">{v}</div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Target,
      title: "Optimisation ATS",
      desc: "Analyse temps réel, score sur 100, recommandations actionnables.",
    },
    {
      icon: FileText,
      title: "Templates premium",
      desc: "Designs ATS-friendly testés sur les principaux logiciels de recrutement.",
    },
    {
      icon: BarChart3,
      title: "Matching d'offre",
      desc: "Comparez votre CV à une offre d'emploi et détectez les mots-clés manquants.",
    },
    {
      icon: Download,
      title: "Export PDF haute qualité",
      desc: "PDF illimités, parfaitement lisibles par les ATS et les recruteurs.",
    },
    {
      icon: Zap,
      title: "Aperçu en direct",
      desc: "Modifiez et visualisez instantanément votre CV.",
    },
    {
      icon: Shield,
      title: "Données sécurisées",
      desc: "Vos CV sont chiffrés et stockés en Europe.",
    },
  ];
  return (
    <section id="fonctionnalites" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="mb-4">
          Fonctionnalités
        </Badge>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Tout pour battre les filtres ATS
        </h2>
        <p className="mt-4 text-muted-foreground">
          Chaque fonctionnalité est conçue pour maximiser vos chances de passer la première
          sélection automatisée.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card
            key={f.title}
            className="group relative overflow-hidden border-border/60 p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="font-display text-lg font-semibold">{f.title}</div>
            <div className="mt-1.5 text-sm text-muted-foreground">{f.desc}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}

type TemplateMini = {
  id: string;
  name: string;
  tagline: string;
  score: number;
  featured?: boolean;
  render: () => ReactElement;
};

function MiniModerne() {
  return (
    <div className="h-full w-full bg-white p-3 text-slate-800">
      <div className="border-b border-slate-200 pb-1.5">
        <div className="text-[8px] font-bold tracking-tight text-slate-900">CAMILLE LAURENT</div>
        <div className="text-[6px] font-medium text-primary">Développeuse Full-Stack</div>
        <div className="text-[5px] text-slate-500">camille@email.fr · Paris</div>
      </div>
      <div className="mt-1.5">
        <div className="text-[5px] font-bold uppercase tracking-wider text-primary">Expérience</div>
        <div className="mt-0.5 text-[6px] font-semibold">Senior · Stellar Tech</div>
        <div className="mt-0.5 h-[2px] w-full rounded bg-slate-100" />
        <div className="mt-0.5 h-[2px] w-11/12 rounded bg-slate-100" />
        <div className="mt-0.5 h-[2px] w-3/4 rounded bg-slate-100" />
        <div className="mt-1 text-[6px] font-semibold">Dev · Nova SaaS</div>
        <div className="mt-0.5 h-[2px] w-full rounded bg-slate-100" />
        <div className="mt-0.5 h-[2px] w-4/5 rounded bg-slate-100" />
      </div>
      <div className="mt-1.5">
        <div className="text-[5px] font-bold uppercase tracking-wider text-primary">
          Compétences
        </div>
        <div className="mt-0.5 flex flex-wrap gap-0.5">
          {["React", "TS", "Node", "SQL", "AWS"].map((s) => (
            <span key={s} className="rounded-sm bg-slate-100 px-1 py-px text-[5px]">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniMinimal() {
  return (
    <div className="h-full w-full bg-white p-4 text-slate-800">
      <div className="text-center">
        <div className="text-[9px] font-bold tracking-tight text-slate-900">Camille Laurent</div>
        <div className="mt-0.5 text-[5px] uppercase tracking-[0.15em] text-slate-500">
          Développeuse
        </div>
        <div className="mt-0.5 text-[5px] text-slate-500">camille@email.fr · Paris</div>
      </div>
      <div className="mt-2 border-y py-1 text-center text-[5px] italic text-slate-600">
        10 ans d'expérience en développement produit SaaS.
      </div>
      <div className="mt-1.5 space-y-1.5">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="text-[5px] uppercase tracking-wider text-slate-400">2022 — Actuel</div>
            <div className="text-[6px] font-semibold">Senior · Stellar Tech</div>
            <div className="mt-0.5 h-[2px] w-full rounded bg-slate-100" />
            <div className="mt-0.5 h-[2px] w-4/5 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniExecutive() {
  return (
    <div className="h-full w-full bg-white text-slate-800">
      <div className="bg-secondary p-2.5 text-white">
        <div className="text-[8px] font-bold">CAMILLE LAURENT</div>
        <div className="text-[6px] font-light text-accent">Directrice Technique</div>
        <div className="mt-0.5 text-[5px] text-white/70">camille@email.fr · Paris</div>
      </div>
      <div className="p-2.5">
        <div className="text-[5px] font-bold uppercase tracking-wider text-primary">Profil</div>
        <div className="mt-0.5 h-[2px] w-full rounded bg-slate-100" />
        <div className="mt-0.5 h-[2px] w-11/12 rounded bg-slate-100" />
        <div className="mt-1.5 text-[5px] font-bold uppercase tracking-wider text-primary">
          Expérience
        </div>
        <div className="mt-0.5 text-[6px] font-semibold">CTO · Stellar Tech</div>
        <div className="mt-0.5 h-[2px] w-full rounded bg-slate-100" />
        <div className="mt-0.5 h-[2px] w-4/5 rounded bg-slate-100" />
        <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[5px]">
          <span>• Leadership</span>
          <span>• Architecture</span>
          <span>• Cloud</span>
          <span>• Product</span>
        </div>
      </div>
    </div>
  );
}

function Templates() {
  const templates: TemplateMini[] = [
    {
      id: "moderne",
      name: "Moderne",
      tagline: "Équilibré et professionnel",
      score: 96,
      featured: true,
      render: MiniModerne,
    },
    { id: "minimal", name: "Minimal", tagline: "Épuré et élégant", score: 94, render: MiniMinimal },
    {
      id: "executive",
      name: "Executive",
      tagline: "Imposant et premium",
      score: 92,
      render: MiniExecutive,
    },
  ];
  return (
    <section id="templates" className="relative bg-surface-elevated py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Templates
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Des designs qui passent les ATS
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sans colonnes complexes, sans tableaux, sans graphiques cassants. Lisibles à 100% par
            les robots.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-3">
          {templates.map((t) => (
            <Card
              key={t.id}
              className="group relative overflow-hidden border-border/60 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
            >
              {/* Border glow on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px color-mix(in oklab, var(--color-primary) 40%, transparent)",
                }}
              />

              {/* Preview stage */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-primary/15 p-5">
                {t.featured && (
                  <Badge className="absolute left-3 top-3 z-10 gap-1 bg-gradient-primary text-white shadow-glow">
                    <Star className="h-3 w-3 fill-current" /> Populaire
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="absolute right-3 top-3 z-10 gap-1 bg-success/15 text-success ring-1 ring-success/25"
                >
                  <CheckCircle2 className="h-3 w-3" /> ATS {t.score}
                </Badge>

                {/* CV paper — slight tilt, lifts on hover */}
                <div className="relative mx-auto aspect-[210/297] h-full max-h-52 rotate-[-2deg] overflow-hidden rounded-md bg-white shadow-elegant ring-1 ring-black/5 transition duration-500 group-hover:rotate-0 group-hover:scale-[1.03]">
                  {t.render()}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border/60 p-5">
                <div className="min-w-0">
                  <div className="font-display font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.tagline}</div>
                </div>
                <Link to="/auth">
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                    Utiliser →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Choisissez un template", "Sélectionnez parmi nos templates ATS-friendly testés."],
    ["02", "Remplissez votre CV", "Notre éditeur intelligent vous guide section par section."],
    [
      "03",
      "Optimisez avec l'ATS",
      "Score temps réel et recommandations pour maximiser vos chances.",
    ],
    ["04", "Téléchargez en PDF", "Export haute qualité, prêt à envoyer aux recruteurs."],
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Comment ça marche</h2>
        <p className="mt-4 text-muted-foreground">Un CV optimisé en moins de 10 minutes.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-2 lg:grid-cols-4">
        {steps.map(([num, title, desc]) => (
          <div key={num} className="relative">
            <div className="font-display text-5xl font-bold text-primary/20">{num}</div>
            <div className="mt-3 font-display text-lg font-semibold">{title}</div>
            <div className="mt-1.5 text-sm text-muted-foreground">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Sophie M.",
      role: "Chef de projet",
      text: "J'ai décroché 3 entretiens en deux semaines après avoir refait mon CV avec CVForge.",
    },
    {
      name: "Karim B.",
      role: "Développeur",
      text: "Le score ATS m'a permis d'identifier exactement ce qui clochait dans mon CV.",
    },
    {
      name: "Léa T.",
      role: "Marketing",
      text: "L'export PDF est parfait et les templates sont vraiment professionnels.",
    },
  ];
  return (
    <section className="bg-surface-elevated py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ils ont décroché leur poste
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.name} className="border-border/60 p-6 shadow-card">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm">"{t.text}"</p>
              <div className="mt-4 border-t pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Gratuit",
      price: "0 Ariary",
      desc: "Pour commencer",
      features: ["1 CV", "3 templates", "Score ATS basique", "Export PDF"],
      cta: "Commencer",
    },
    {
      name: "Pro",
      price: "45 000 Ariary",
      period: "/mois",
      desc: "Pour les chercheurs actifs",
      features: [
        "CV illimités",
        "Tous les templates",
        "Score ATS avancé",
        "Matching offre d'emploi",
        "Export PDF illimité",
      ],
      cta: "Essayer Pro",
      featured: true,
    },
    {
      name: "Entreprise",
      price: "Sur devis",
      desc: "Pour les équipes RH",
      features: ["Tout Pro", "Multi-utilisateurs", "API d'analyse ATS", "Support dédié"],
      cta: "Nous contacter",
    },
  ];
  return (
    <section id="tarifs" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="mb-4">
          Tarifs
        </Badge>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Choisissez votre formule</h2>
        <p className="mt-4 text-muted-foreground">
          Commencez gratuitement, évoluez quand vous voulez.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={`relative p-7 sm:p-8 ${p.featured ? "border-primary shadow-elegant" : "border-border/60 shadow-card"}`}
          >
            {p.featured && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary">
                Le plus populaire
              </Badge>
            )}
            <div className="font-display text-lg font-semibold">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              {p.period && <span className="text-muted-foreground">{p.period}</span>}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="mt-6 block">
              <Button
                className={`w-full ${p.featured ? "bg-gradient-primary" : ""}`}
                variant={p.featured ? "default" : "outline"}
              >
                {p.cta}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    [
      "Qu'est-ce qu'un CV ATS Friendly ?",
      "Un CV ATS Friendly est un CV optimisé pour être correctement lu et analysé par les logiciels de recrutement automatisés (Applicant Tracking Systems), utilisés par 75% des grandes entreprises.",
    ],
    [
      "Mes CV sont-ils vraiment compatibles ATS ?",
      "Oui. Nos templates n'utilisent ni colonnes complexes, ni tableaux, ni graphiques. Le PDF généré est entièrement textuel et lisible par tous les ATS du marché.",
    ],
    [
      "Puis-je créer plusieurs CV ?",
      "Oui. Le plan gratuit permet 1 CV, le plan Pro permet un nombre illimité de CV adaptés à chaque candidature.",
    ],
    [
      "Comment fonctionne le score ATS ?",
      "Notre moteur analyse la structure, les mots-clés, la lisibilité et l'expérience de votre CV pour produire un score sur 100, accompagné de recommandations concrètes.",
    ],
    [
      "Mes données sont-elles sécurisées ?",
      "Vos données sont chiffrées au repos et en transit, hébergées en Europe et conformes au RGPD.",
    ],
  ];
  return (
    <section id="faq" className="bg-surface-elevated py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Questions fréquentes</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {items.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-secondary text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold">CVForge</span>
            </div>
            <p className="mt-3 text-sm">CV optimisés ATS pour décrocher plus d'entretiens.</p>
          </div>
          <div>
            <div className="font-semibold text-white">Produit</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#fonctionnalites" className="hover:text-white">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white">
                  Templates
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white">
                  Tarifs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white">Ressources</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Guide ATS
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white">Légal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  CGU
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} CVForge. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
