import type { CVData } from "./cv-types";

export interface ATSRecommendation {
  type: "success" | "warning" | "error";
  message: string;
}

export interface ATSResult {
  globalScore: number;
  skillsScore: number;
  structureScore: number;
  readabilityScore: number;
  keywordsScore: number;
  experienceScore: number;
  recommendations: ATSRecommendation[];
  detectedKeywords: string[];
  wordCount: number;
}

export interface JobMatchResult {
  matchPercentage: number;
  missingKeywords: string[];
  presentKeywords: string[];
  recommendations: ATSRecommendation[];
}

const STOPWORDS = new Set([
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "de",
  "du",
  "et",
  "ou",
  "à",
  "au",
  "aux",
  "en",
  "dans",
  "pour",
  "par",
  "sur",
  "avec",
  "sans",
  "ce",
  "cette",
  "ces",
  "qui",
  "que",
  "quoi",
  "dont",
  "où",
  "est",
  "sont",
  "été",
  "être",
  "avoir",
  "ai",
  "as",
  "a",
  "avons",
  "avez",
  "ont",
  "je",
  "tu",
  "il",
  "elle",
  "nous",
  "vous",
  "ils",
  "elles",
  "mon",
  "ma",
  "mes",
  "ton",
  "ta",
  "tes",
  "son",
  "sa",
  "ses",
  "notre",
  "nos",
  "votre",
  "vos",
  "leur",
  "leurs",
  "plus",
  "moins",
  "très",
  "bien",
  "tout",
  "tous",
  "toute",
  "toutes",
  "the",
  "and",
  "or",
  "of",
  "in",
  "on",
  "for",
  "with",
  "to",
  "is",
  "are",
  "an",
  "as",
  "by",
  "at",
  "from",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export function cvToText(cv: CVData): string {
  const parts: string[] = [];
  const p = cv.personal;
  parts.push(p.fullName, p.jobTitle, p.email, p.phone, p.location, p.summary);
  cv.experiences.forEach((e) => parts.push(e.position, e.company, e.description));
  cv.education.forEach((e) => parts.push(e.degree, e.school, e.description || ""));
  cv.skills.forEach((s) => parts.push(s.name));
  cv.languages.forEach((l) => parts.push(l.name));
  cv.certifications.forEach((c) => parts.push(c.name, c.issuer));
  return parts.filter(Boolean).join(" ");
}

export function analyzeCV(cv: CVData): ATSResult {
  const text = cvToText(cv);
  const tokens = tokenize(text);
  const wordCount = tokens.length;
  const recommendations: ATSRecommendation[] = [];

  // STRUCTURE (sections présentes)
  let structureScore = 0;
  if (cv.personal.fullName) structureScore += 15;
  else recommendations.push({ type: "error", message: "Ajoutez votre nom complet." });
  if (cv.personal.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.personal.email))
    structureScore += 15;
  else recommendations.push({ type: "error", message: "Email manquant ou invalide." });
  if (cv.personal.phone && cv.personal.phone.replace(/\D/g, "").length >= 8) structureScore += 15;
  else recommendations.push({ type: "warning", message: "Ajoutez un numéro de téléphone." });
  if (cv.personal.jobTitle) structureScore += 10;
  else recommendations.push({ type: "warning", message: "Ajoutez un titre professionnel." });
  if (cv.personal.summary && cv.personal.summary.length > 80) structureScore += 15;
  else
    recommendations.push({
      type: "warning",
      message: "Rédigez un résumé professionnel (≥ 80 caractères).",
    });
  if (cv.experiences.length > 0) structureScore += 15;
  else recommendations.push({ type: "error", message: "Aucune expérience renseignée." });
  if (cv.education.length > 0) structureScore += 10;
  else recommendations.push({ type: "warning", message: "Ajoutez votre formation." });
  if (cv.skills.length >= 3) structureScore += 5;
  structureScore = Math.min(100, structureScore);

  // EXPÉRIENCE
  const expDetails = cv.experiences.filter(
    (e) => e.description && e.description.length > 30,
  ).length;
  const experienceScore = Math.min(100, cv.experiences.length * 25 + expDetails * 12);
  if (cv.experiences.length > 0 && expDetails < cv.experiences.length) {
    recommendations.push({
      type: "warning",
      message: "Détaillez chaque expérience avec des réalisations chiffrées.",
    });
  }

  // COMPÉTENCES
  const skillsScore = Math.min(100, cv.skills.length * 12);
  if (cv.skills.length < 6) {
    recommendations.push({
      type: "warning",
      message: `Ajoutez plus de compétences techniques (${cv.skills.length}/6 recommandé).`,
    });
  }

  // LISIBILITÉ (longueur, équilibre)
  let readabilityScore = 80;
  if (wordCount < 150) {
    readabilityScore = 40;
    recommendations.push({
      type: "warning",
      message: "Votre CV est trop court. Visez 300-600 mots.",
    });
  } else if (wordCount > 900) {
    readabilityScore = 60;
    recommendations.push({
      type: "warning",
      message: "CV trop long. Restez concis (idéalement < 900 mots).",
    });
  } else if (wordCount >= 250 && wordCount <= 700) {
    readabilityScore = 100;
  }

  // MOTS-CLÉS (densité du vocabulaire pro détecté)
  const techTerms = new Set([
    "react",
    "vue",
    "angular",
    "javascript",
    "typescript",
    "node",
    "python",
    "java",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "git",
    "agile",
    "scrum",
    "rest",
    "api",
    "graphql",
    "ci",
    "cd",
    "devops",
    "leadership",
    "gestion",
    "projet",
    "équipe",
    "management",
    "marketing",
    "vente",
    "communication",
    "analyse",
    "stratégie",
    "budget",
    "client",
    "performance",
  ]);
  const detected = Array.from(new Set(tokens)).filter((t) => techTerms.has(t));
  const keywordsScore = Math.min(100, detected.length * 10 + 20);

  const globalScore = Math.round(
    structureScore * 0.3 +
      experienceScore * 0.2 +
      skillsScore * 0.15 +
      readabilityScore * 0.15 +
      keywordsScore * 0.2,
  );

  if (globalScore >= 80)
    recommendations.unshift({
      type: "success",
      message: "Excellent ! Votre CV est très bien optimisé ATS.",
    });
  else if (globalScore >= 60)
    recommendations.unshift({
      type: "success",
      message: "Bon CV. Quelques améliorations possibles.",
    });

  return {
    globalScore,
    skillsScore,
    structureScore,
    readabilityScore,
    keywordsScore,
    experienceScore,
    recommendations,
    detectedKeywords: detected,
    wordCount,
  };
}

export function matchJob(cv: CVData, jobDescription: string): JobMatchResult {
  const cvTokens = new Set(tokenize(cvToText(cv)));
  const jobTokens = tokenize(jobDescription);
  const jobUnique = Array.from(new Set(jobTokens)).filter((t) => t.length > 3);

  const present: string[] = [];
  const missing: string[] = [];
  jobUnique.forEach((t) => {
    if (cvTokens.has(t)) present.push(t);
    else missing.push(t);
  });

  const matchPercentage = jobUnique.length
    ? Math.round((present.length / jobUnique.length) * 100)
    : 0;

  const recommendations: ATSRecommendation[] = [];
  if (matchPercentage < 40)
    recommendations.push({
      type: "error",
      message: "Faible correspondance. Adaptez votre CV à l'offre.",
    });
  else if (matchPercentage < 70)
    recommendations.push({
      type: "warning",
      message: "Correspondance moyenne. Intégrez les mots-clés manquants pertinents.",
    });
  else
    recommendations.push({
      type: "success",
      message: "Excellente correspondance avec cette offre !",
    });

  if (missing.length > 0)
    recommendations.push({
      type: "warning",
      message: `${missing.length} mots-clés de l'offre absents de votre CV.`,
    });

  return {
    matchPercentage,
    missingKeywords: missing.slice(0, 20),
    presentKeywords: present.slice(0, 20),
    recommendations,
  };
}
