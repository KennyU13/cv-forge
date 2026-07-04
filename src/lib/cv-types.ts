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

export interface CVData {
  personal: CVPersonalInfo;
  experiences: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  languages: CVLanguage[];
  certifications: CVCertification[];
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
});
