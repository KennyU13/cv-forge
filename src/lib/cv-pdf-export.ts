import { jsPDF } from "jspdf";
import type { CVData } from "./cv-types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 38;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

type PdfTheme = {
  primary: [number, number, number];
  text: [number, number, number];
  muted: [number, number, number];
  border: [number, number, number];
};

const THEMES: Record<string, PdfTheme> = {
  moderne: {
    primary: [37, 99, 235],
    text: [15, 23, 42],
    muted: [71, 85, 105],
    border: [203, 213, 225],
  },
  minimal: {
    primary: [15, 23, 42],
    text: [17, 24, 39],
    muted: [75, 85, 99],
    border: [209, 213, 219],
  },
  executive: {
    primary: [30, 41, 59],
    text: [15, 23, 42],
    muted: [71, 85, 105],
    border: [203, 213, 225],
  },
};

export function exportCVToPdf({
  data,
  title,
  template,
}: {
  data: CVData;
  title: string;
  template: string;
}) {
  const theme = THEMES[template] ?? THEMES.moderne;
  const scales = [1, 0.95, 0.9, 0.85, 0.8, 0.74, 0.68];
  let selectedScale = scales.at(-1)!;

  for (const scale of scales) {
    const dryRun = renderCV({ data, title, theme, scale, dryRun: true });
    if (!dryRun.overflow) {
      selectedScale = scale;
      break;
    }
  }

  const { doc } = renderCV({ data, title, theme, scale: selectedScale, dryRun: false });
  doc.save(`${safeFileName(title || data.personal.fullName || "cv")}.pdf`);
}

function renderCV({
  data,
  title,
  theme,
  scale,
  dryRun,
}: {
  data: CVData;
  title: string;
  theme: PdfTheme;
  scale: number;
  dryRun: boolean;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  let y = MARGIN;
  let overflow = false;

  const setColor = (color: [number, number, number]) => {
    if (!dryRun) doc.setTextColor(...color);
  };

  const setFont = (style: "normal" | "bold", size: number) => {
    if (!dryRun) doc.setFont("helvetica", style).setFontSize(size * scale);
  };

  const addLine = (height = 10) => {
    y += height * scale;
  };

  const canAdd = (height: number) => {
    if (y + height * scale <= PAGE_HEIGHT - MARGIN) return true;
    overflow = true;
    return false;
  };

  const text = (
    value: string,
    options: {
      size?: number;
      style?: "normal" | "bold";
      color?: [number, number, number];
      width?: number;
      lineHeight?: number;
      x?: number;
    } = {},
  ) => {
    const clean = normalizeText(value);
    if (!clean) return;

    const size = options.size ?? 10;
    const lineHeight = options.lineHeight ?? size + 3;
    const width = options.width ?? CONTENT_WIDTH;
    const x = options.x ?? MARGIN;
    setFont(options.style ?? "normal", size);
    setColor(options.color ?? theme.text);
    const lines = doc.splitTextToSize(clean, width);
    const height = lines.length * lineHeight;

    if (!canAdd(height)) return;
    if (!dryRun) doc.text(lines, x, y, { lineHeightFactor: lineHeight / size });
    y += height * scale;
  };

  const section = (label: string) => {
    if (!canAdd(22)) return;
    addLine(10);
    setFont("bold", 10);
    setColor(theme.primary);
    if (!dryRun) {
      doc.text(label.toUpperCase(), MARGIN, y);
      doc.setDrawColor(...theme.border);
      doc.line(MARGIN, y + 5, PAGE_WIDTH - MARGIN, y + 5);
    }
    addLine(17);
  };

  const itemHeader = (left: string, right?: string) => {
    if (!canAdd(15)) return;
    setFont("bold", 10.5);
    setColor(theme.text);
    if (!dryRun) doc.text(normalizeText(left), MARGIN, y);
    if (right && !dryRun) {
      setFont("normal", 8.5);
      setColor(theme.muted);
      doc.text(normalizeText(right), PAGE_WIDTH - MARGIN, y, { align: "right" });
    }
    addLine(14);
  };

  const p = data.personal;
  text(p.fullName || title || "CV", { size: 22, style: "bold", color: theme.primary });
  text(p.jobTitle, { size: 11.5, style: "bold", color: theme.text, lineHeight: 14 });
  text([p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean).join("  |  "), {
    size: 8.5,
    color: theme.muted,
    lineHeight: 11,
  });

  if (!dryRun) {
    doc.setDrawColor(...theme.border);
    doc.line(MARGIN, y + 4, PAGE_WIDTH - MARGIN, y + 4);
  }
  addLine(16);

  if (p.summary) {
    section("Profil");
    text(p.summary, { size: 9.5, color: theme.text, lineHeight: 12.2 });
  }

  if (data.experiences.length) {
    section("Expérience");
    data.experiences.forEach((experience) => {
      itemHeader(
        [experience.position, experience.company].filter(Boolean).join(" - "),
        formatRange(experience.startDate, experience.current ? "Actuel" : experience.endDate),
      );
      text([experience.location, ...toBullets(experience.description)].filter(Boolean).join("\n"), {
        size: 8.7,
        color: theme.muted,
        lineHeight: 11,
        width: CONTENT_WIDTH - 8,
        x: MARGIN + 8,
      });
      addLine(4);
    });
  }

  if (data.education.length) {
    section("Formation");
    data.education.forEach((education) => {
      itemHeader(
        [education.degree, education.school].filter(Boolean).join(" - "),
        formatRange(education.startDate, education.endDate),
      );
      text([education.location, education.description].filter(Boolean).join(" | "), {
        size: 8.6,
        color: theme.muted,
        lineHeight: 10.5,
      });
    });
  }

  if (data.skills.length) {
    section("Compétences");
    text(
      data.skills
        .filter((skill) => skill.name)
        .map((skill) => (skill.level ? `${skill.name} (${skill.level})` : skill.name))
        .join("  |  "),
      { size: 8.8, color: theme.text, lineHeight: 11 },
    );
  }

  if (data.languages.length) {
    section("Langues");
    text(
      data.languages
        .filter((language) => language.name)
        .map((language) => `${language.name} (${language.level})`)
        .join("  |  "),
      { size: 8.8, color: theme.text, lineHeight: 11 },
    );
  }

  if (data.certifications.length) {
    section("Certifications");
    text(
      data.certifications
        .filter((certification) => certification.name)
        .map((certification) =>
          [certification.name, certification.issuer, certification.date].filter(Boolean).join(" - "),
        )
        .join("\n"),
      { size: 8.6, color: theme.text, lineHeight: 10.8 },
    );
  }

  return { doc, overflow };
}

function toBullets(value: string) {
  return normalizeText(value)
    .split(/\n|•/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `• ${line.replace(/^[-•]\s*/, "")}`);
}

function formatRange(start?: string, end?: string) {
  const left = formatMonth(start);
  const right = end === "Actuel" ? "Actuel" : formatMonth(end);
  return [left, right].filter(Boolean).join(" - ");
}

function formatMonth(value?: string) {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  return new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" }).format(
    new Date(Number(year), Number(month) - 1, 1),
  );
}

function normalizeText(value?: string | null) {
  return (value ?? "").replace(/\s+/g, " ").replace(/\n\s*/g, "\n").trim();
}

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
