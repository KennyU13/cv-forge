export type CVTemplate = "moderne" | "minimal" | "executive";

export interface CVPersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

export interface CVExperience {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CVEducation {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface CVSkill {
  id: string;
  name: string;
  level?: "Débutant" | "Intermédiaire" | "Avancé" | "Expert";
}

export interface CVLanguage {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Natif";
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CoverLetterData {
  company: string;
  recipient: string;
  jobTitle: string;
  jobDescription: string;
  body: string;
}

export interface CVData {
  personal: CVPersonalInfo;
  experiences: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  languages: CVLanguage[];
  certifications: CVCertification[];
  coverLetter: CoverLetterData;
}

export const emptyCV = (): CVData => ({
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  coverLetter: {
    company: "",
    recipient: "",
    jobTitle: "",
    jobDescription: "",
    body: "",
  },
});

export const sampleCV = (): CVData => ({
  personal: {
    fullName: "Camille Laurent",
    jobTitle: "Développeuse Full-Stack",
    email: "camille.laurent@email.fr",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    website: "camille-laurent.dev",
    linkedin: "linkedin.com/in/camillelaurent",
    summary:
      "Développeuse full-stack avec 5 ans d'expérience dans la conception d'applications web performantes. Spécialisée en React, Node.js et architectures cloud. Passionnée par l'expérience utilisateur et le code propre.",
  },
  experiences: [
    {
      id: "1",
      position: "Développeuse Senior Full-Stack",
      company: "Stellar Tech",
      location: "Paris",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "• Conception et développement d'une plateforme SaaS B2B utilisée par 15 000 utilisateurs\n• Migration de l'architecture monolithique vers des microservices (Node.js, Docker, Kubernetes)\n• Encadrement d'une équipe de 4 développeurs juniors",
    },
    {
      id: "2",
      position: "Développeuse Full-Stack",
      company: "Nova Studio",
      location: "Lyon",
      startDate: "2019-09",
      endDate: "2022-02",
      current: false,
      description:
        "• Développement d'applications React et Next.js pour des clients e-commerce\n• Mise en place de pipelines CI/CD réduisant le temps de déploiement de 60%\n• Intégration de paiements Stripe et PayPal",
    },
  ],
  education: [
    {
      id: "1",
      degree: "Master en Informatique",
      school: "Université Paris-Saclay",
      location: "Paris",
      startDate: "2017-09",
      endDate: "2019-06",
      description: "Spécialisation Génie Logiciel",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "Expert" },
    { id: "2", name: "TypeScript", level: "Expert" },
    { id: "3", name: "Node.js", level: "Avancé" },
    { id: "4", name: "PostgreSQL", level: "Avancé" },
    { id: "5", name: "Docker", level: "Intermédiaire" },
    { id: "6", name: "AWS", level: "Intermédiaire" },
  ],
  languages: [
    { id: "1", name: "Français", level: "Natif" },
    { id: "2", name: "Anglais", level: "C1" },
    { id: "3", name: "Espagnol", level: "B1" },
  ],
  certifications: [{ id: "1", name: "AWS Certified Developer", issuer: "Amazon", date: "2023-05" }],
  coverLetter: {
    company: "Stellar Tech",
    recipient: "",
    jobTitle: "Developpeuse Full-Stack Senior",
    jobDescription:
      "Developpement React, Node.js, architecture cloud, collaboration produit et encadrement technique.",
    body: "",
  },
});

export function generateCoverLetter(data: CVData) {
  const p = data.personal;
  const letter = data.coverLetter;
  const targetJob = letter.jobTitle || p.jobTitle || "le poste propose";
  const company = letter.company || "votre entreprise";
  const greeting = letter.recipient ? `Madame, Monsieur ${letter.recipient},` : "Madame, Monsieur,";
  const topSkills = data.skills
    .map((skill) => skill.name)
    .filter(Boolean)
    .slice(0, 4);
  const latestExperience = data.experiences.find(
    (experience) => experience.position || experience.company,
  );
  const experienceLine = latestExperience
    ? `Mon experience en tant que ${latestExperience.position || p.jobTitle} chez ${
        latestExperience.company || "mon precedent employeur"
      } m'a permis de contribuer a des projets concrets avec rigueur, autonomie et sens du resultat.`
    : "Mon parcours m'a permis de developper une approche structuree, orientee resultat et adaptee aux besoins metier.";
  const skillsLine = topSkills.length
    ? `Je peux notamment apporter mes competences en ${topSkills.join(", ")}, ainsi qu'une capacite a apprendre vite et a collaborer efficacement.`
    : "Je peux apporter une forte capacite d'adaptation, une communication claire et une approche orientee solution.";
  const motivationLine = letter.jobDescription.trim()
    ? `Votre offre retient particulierement mon attention car elle correspond aux priorites suivantes : ${summarizeJobDescription(
        letter.jobDescription,
      )}.`
    : "Votre projet retient particulierement mon attention par son exigence professionnelle et les perspectives d'impact qu'il propose.";

  return [
    greeting,
    "",
    `Je vous propose ma candidature pour ${targetJob} au sein de ${company}. ${motivationLine}`,
    "",
    `${experienceLine} ${skillsLine}`,
    "",
    `Au-dela de mes competences techniques, je souhaite rejoindre une equipe ou la qualite d'execution, la responsabilite et l'amelioration continue sont essentielles. Je serais heureux d'echanger avec vous afin de vous presenter plus concretement ma motivation et la valeur que je peux apporter a ${company}.`,
    "",
    "Je vous remercie pour votre attention et vous prie d'agreer, Madame, Monsieur, l'expression de mes salutations distinguees.",
    "",
    p.fullName,
  ].join("\n");
}

function summarizeJobDescription(value: string) {
  return value
    .replace(/\s+/g, " ")
    .split(/[.!?]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ")
    .slice(0, 220);
}
