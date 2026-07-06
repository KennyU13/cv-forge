import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CVRenderer, TEMPLATES } from "@/components/cv-templates";
import { type CVData, emptyCV, generateCoverLetter } from "@/lib/cv-types";
import { analyzeCV } from "@/lib/ats-engine";
import { exportCoverLetterToPdf, exportCVToPdf } from "@/lib/cv-pdf-export";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  BarChart3,
  Loader2,
  Check,
  Eye,
  Mail,
  Pencil,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SortableList } from "@/components/sortable-list";

export const Route = createFileRoute("/_authenticated/cv/$id")({
  head: () => ({ meta: [{ title: "Éditeur de CV — CVForge" }] }),
  component: Builder,
});

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function Builder() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const isMobile = useIsMobile();

  const { data: cv, isLoading } = useQuery({
    queryKey: ["cv", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("cvs").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("moderne");
  const [data, setData] = useState<CVData>(emptyCV());
  const [savedFlag, setSavedFlag] = useState<"saved" | "saving" | "dirty">("saved");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [exportingPdf, setExportingPdf] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (!cv || initRef.current) return;
    initRef.current = true;
    setTitle(cv.title);
    setTemplate(cv.template);
    const defaults = emptyCV();
    const savedData = cv.data as unknown as Partial<CVData>;
    setData({
      ...defaults,
      ...savedData,
      personal: { ...defaults.personal, ...savedData.personal },
      coverLetter: { ...defaults.coverLetter, ...savedData.coverLetter },
    });
  }, [cv]);

  const atsScore = useMemo(() => analyzeCV(data).globalScore, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("cvs")
        .update({
          title,
          template,
          data: data as never,
          ats_score: atsScore,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: () => setSavedFlag("saving"),
    onSuccess: () => {
      setSavedFlag("saved");
      qc.invalidateQueries({ queryKey: ["cvs"] });
    },
    onError: (e: Error) => {
      setSavedFlag("dirty");
      toast.error("Sauvegarde échouée", { description: e.message });
    },
  });

  // autosave debounced
  useEffect(() => {
    if (!initRef.current) return;
    setSavedFlag("dirty");
    const t = setTimeout(() => save.mutate(), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, template, JSON.stringify(data)]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const update = (patch: Partial<CVData>) => setData((d) => ({ ...d, ...patch }));

  const showEditor = !isMobile || mobileView === "edit";
  const showPreview = !isMobile || mobileView === "preview";

  function onExportPdf() {
    setExportingPdf(true);
    try {
      exportCVToPdf({ data, title, template });
      toast.success("PDF exporté", { description: "Le CV a été généré sur une seule page A4." });
    } catch (error) {
      toast.error("Export PDF échoué", {
        description: error instanceof Error ? error.message : "Réessayez dans un instant.",
      });
    } finally {
      setExportingPdf(false);
    }
  }

  function onExportCoverLetterPdf() {
    setExportingPdf(true);
    try {
      exportCoverLetterToPdf({ data, title });
      toast.success("PDF exporte", { description: "La lettre de motivation a ete generee." });
    } catch (error) {
      toast.error("Export PDF echoue", {
        description: error instanceof Error ? error.message : "Reessayez dans un instant.",
      });
    } finally {
      setExportingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" aria-label="Retour">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-full font-display font-semibold"
              placeholder="Titre du CV"
            />
          </div>
          <SaveIndicator state={savedFlag} />
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Badge
              className={`shrink-0 ${
                atsScore >= 75
                  ? "bg-success"
                  : atsScore >= 50
                    ? "bg-warning text-warning-foreground"
                    : "bg-destructive"
              }`}
            >
              ATS {atsScore}
            </Badge>
            <Link to="/cv/$id/ats" params={{ id }} className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-1.5 h-4 w-4" /> Analyse
              </Button>
            </Link>
            <Link to="/cv/$id/ats" params={{ id }} className="sm:hidden">
              <Button variant="outline" size="icon" aria-label="Analyse ATS">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              className="shrink-0 bg-gradient-primary shadow-glow"
              onClick={onExportPdf}
              disabled={exportingPdf}
            >
              {exportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin sm:mr-1.5" />
              ) : (
                <Download className="h-4 w-4 sm:mr-1.5" />
              )}
              <span className="hidden sm:inline">Exporter PDF</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={onExportCoverLetterPdf}
              disabled={exportingPdf}
            >
              {exportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin sm:mr-1.5" />
              ) : (
                <Mail className="h-4 w-4 sm:mr-1.5" />
              )}
              <span className="hidden sm:inline">Lettre PDF</span>
            </Button>
          </div>
        </div>

        {/* Mobile editor/preview switch */}
        {isMobile && (
          <div className="mx-auto flex max-w-[1400px] gap-1 border-t bg-background/60 px-3 py-2">
            <Button
              variant={mobileView === "edit" ? "default" : "ghost"}
              size="sm"
              className={`flex-1 ${mobileView === "edit" ? "bg-gradient-primary" : ""}`}
              onClick={() => setMobileView("edit")}
            >
              <Pencil className="mr-1.5 h-4 w-4" /> Éditer
            </Button>
            <Button
              variant={mobileView === "preview" ? "default" : "ghost"}
              size="sm"
              className={`flex-1 ${mobileView === "preview" ? "bg-gradient-primary" : ""}`}
              onClick={() => setMobileView("preview")}
            >
              <Eye className="mr-1.5 h-4 w-4" /> Aperçu
            </Button>
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-3 py-4 sm:px-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* EDITOR */}
        {showEditor && (
          <div className="no-print">
            <Card className="p-4">
              <Label>Template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} — {t.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            <Tabs defaultValue="personal" className="mt-4">
              <TabsList className="hide-scrollbar flex w-full justify-start overflow-x-auto lg:grid lg:grid-cols-7">
                <TabsTrigger value="personal" className="shrink-0">
                  Profil
                </TabsTrigger>
                <TabsTrigger value="exp" className="shrink-0">
                  Expérience
                </TabsTrigger>
                <TabsTrigger value="edu" className="shrink-0">
                  Formation
                </TabsTrigger>
                <TabsTrigger value="skills" className="shrink-0">
                  Compétences
                </TabsTrigger>
                <TabsTrigger value="lang" className="shrink-0">
                  Langues
                </TabsTrigger>
                <TabsTrigger value="cert" className="shrink-0">
                  Certifs
                </TabsTrigger>
                <TabsTrigger value="letter" className="shrink-0">
                  Lettre
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalForm data={data} update={update} />
              </TabsContent>
              <TabsContent value="exp">
                <ExperiencesForm data={data} update={update} />
              </TabsContent>
              <TabsContent value="edu">
                <EducationForm data={data} update={update} />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsForm data={data} update={update} />
              </TabsContent>
              <TabsContent value="lang">
                <LanguagesForm data={data} update={update} />
              </TabsContent>
              <TabsContent value="cert">
                <CertificationsForm data={data} update={update} />
              </TabsContent>
              <TabsContent value="letter">
                <CoverLetterForm data={data} update={update} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* PREVIEW */}
        {showPreview && (
          <div className="cv-preview-viewport overflow-auto rounded-lg bg-muted/40 p-2 sm:p-4">
            <Tabs defaultValue="cv" className="min-w-[210mm]">
              <TabsList className="no-print mb-3">
                <TabsTrigger value="cv">CV</TabsTrigger>
                <TabsTrigger value="letter">Lettre</TabsTrigger>
              </TabsList>
              <TabsContent value="cv" className="mt-0">
                <div className="cv-preview-page">
                  <CVRenderer template={template} data={data} />
                </div>
              </TabsContent>
              <TabsContent value="letter" className="mt-0">
                <CoverLetterPreview data={data} title={title} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: "saved" | "saving" | "dirty" }) {
  return (
    <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
      {state === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Sauvegarde…
        </>
      )}
      {state === "saved" && (
        <>
          <Check className="h-3 w-3 text-success" /> Enregistré
        </>
      )}
      {state === "dirty" && <span className="text-warning">Modifications en attente</span>}
    </div>
  );
}

interface FormProps {
  data: CVData;
  update: (patch: Partial<CVData>) => void;
}

function PersonalForm({ data, update }: FormProps) {
  const p = data.personal;
  const set = (k: keyof typeof p, v: string) => update({ personal: { ...p, [k]: v } });
  return (
    <Card className="mt-4 space-y-3 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Nom complet">
          <Input value={p.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </Field>
        <Field label="Titre professionnel">
          <Input
            value={p.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            placeholder="Développeur Full-Stack"
          />
        </Field>
        <Field label="Email">
          <Input type="email" value={p.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Téléphone">
          <Input value={p.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Localisation">
          <Input
            value={p.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Paris, France"
          />
        </Field>
        <Field label="Site web">
          <Input value={p.website || ""} onChange={(e) => set("website", e.target.value)} />
        </Field>
        <Field label="LinkedIn" className="md:col-span-2">
          <Input value={p.linkedin || ""} onChange={(e) => set("linkedin", e.target.value)} />
        </Field>
      </div>
      <Field label="Résumé professionnel">
        <Textarea
          rows={5}
          value={p.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="Présentez-vous en 3-4 phrases. Mettez en avant vos compétences clés et votre valeur ajoutée."
        />
      </Field>
    </Card>
  );
}

function CoverLetterForm({ data, update }: FormProps) {
  const letter = data.coverLetter;
  const set = (k: keyof typeof letter, v: string) =>
    update({ coverLetter: { ...letter, [k]: v } });
  const generate = () => {
    const nextData = {
      ...data,
      coverLetter: {
        ...letter,
        body: "",
      },
    };
    update({
      coverLetter: {
        ...letter,
        body: generateCoverLetter(nextData),
      },
    });
    toast.success("Lettre generee", {
      description: "Vous pouvez maintenant l'ajuster avant de l'exporter.",
    });
  };

  return (
    <Card className="mt-4 space-y-4 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Poste vise">
          <Input
            value={letter.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            placeholder={data.personal.jobTitle || "Developpeur Full-Stack"}
          />
        </Field>
        <Field label="Entreprise">
          <Input
            value={letter.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Nom de l'entreprise"
          />
        </Field>
        <Field label="Destinataire" className="md:col-span-2">
          <Input
            value={letter.recipient}
            onChange={(e) => set("recipient", e.target.value)}
            placeholder="Nom du recruteur ou service RH"
          />
        </Field>
      </div>
      <Field label="Offre d'emploi ou contexte">
        <Textarea
          rows={5}
          value={letter.jobDescription}
          onChange={(e) => set("jobDescription", e.target.value)}
          placeholder="Collez l'offre ou les attentes principales du poste pour personnaliser la lettre."
        />
      </Field>
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={generate}>
          <Mail className="mr-2 h-4 w-4" /> Generer la lettre
        </Button>
      </div>
      <Field label="Lettre de motivation">
        <Textarea
          rows={14}
          value={letter.body}
          onChange={(e) => set("body", e.target.value)}
          placeholder="Generez une lettre, puis modifiez-la selon votre ton."
        />
      </Field>
    </Card>
  );
}

function CoverLetterPreview({ data, title }: { data: CVData; title: string }) {
  const p = data.personal;
  const letter = data.coverLetter;
  return (
    <div className="print-page mx-auto min-h-[297mm] w-[210mm] bg-white p-[18mm] font-sans text-secondary shadow-card">
      <header className="border-b border-secondary/20 pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {p.fullName || title || "Votre nom"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </header>
      <main className="pt-8 text-[12px] leading-7">
        <div className="mb-8">
          <div className="font-semibold">{letter.jobTitle || "Candidature"}</div>
          {letter.company && <div className="text-muted-foreground">{letter.company}</div>}
        </div>
        <div className="whitespace-pre-line">
          {letter.body || "Votre lettre de motivation apparaitra ici apres generation."}
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ExperiencesForm({ data, update }: FormProps) {
  const add = () =>
    update({
      experiences: [
        ...data.experiences,
        {
          id: uid(),
          position: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  const set = (id: string, patch: Partial<CVData["experiences"][0]>) =>
    update({ experiences: data.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const remove = (id: string) =>
    update({ experiences: data.experiences.filter((e) => e.id !== id) });

  return (
    <div className="mt-4 space-y-3">
      <SortableList
        items={data.experiences}
        onReorder={(experiences) => update({ experiences })}
        renderItem={(e, handle) => (
          <Card className="space-y-3 p-5">
            <div className="flex items-start gap-2">
              {handle}
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Poste">
                    <Input
                      value={e.position}
                      onChange={(ev) => set(e.id, { position: ev.target.value })}
                    />
                  </Field>
                  <Field label="Entreprise">
                    <Input
                      value={e.company}
                      onChange={(ev) => set(e.id, { company: ev.target.value })}
                    />
                  </Field>
                  <Field label="Localisation">
                    <Input
                      value={e.location || ""}
                      onChange={(ev) => set(e.id, { location: ev.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Début">
                      <Input
                        type="month"
                        value={e.startDate}
                        onChange={(ev) => set(e.id, { startDate: ev.target.value })}
                      />
                    </Field>
                    <Field label="Fin">
                      <Input
                        type="month"
                        value={e.endDate}
                        onChange={(ev) => set(e.id, { endDate: ev.target.value })}
                        disabled={e.current}
                      />
                    </Field>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`cur-${e.id}`}
                    checked={e.current}
                    onCheckedChange={(v) =>
                      set(e.id, { current: !!v, endDate: v ? "" : e.endDate })
                    }
                  />
                  <Label htmlFor={`cur-${e.id}`} className="text-sm">
                    Poste actuel
                  </Label>
                </div>
                <Field label="Description (utilisez des puces • pour chaque réalisation)">
                  <Textarea
                    rows={4}
                    value={e.description}
                    onChange={(ev) => set(e.id, { description: ev.target.value })}
                    placeholder="• Réalisation chiffrée&#10;• Mission clé"
                  />
                </Field>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => remove(e.id)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" /> Supprimer
                </Button>
              </div>
            </div>
          </Card>
        )}
      />
      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une expérience
      </Button>
    </div>
  );
}

function EducationForm({ data, update }: FormProps) {
  const add = () =>
    update({
      education: [
        ...data.education,
        {
          id: uid(),
          degree: "",
          school: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
        },
      ],
    });
  const set = (id: string, patch: Partial<CVData["education"][0]>) =>
    update({ education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const remove = (id: string) => update({ education: data.education.filter((e) => e.id !== id) });

  return (
    <div className="mt-4 space-y-3">
      <SortableList
        items={data.education}
        onReorder={(education) => update({ education })}
        renderItem={(e, handle) => (
          <Card className="space-y-3 p-5">
            <div className="flex items-start gap-2">
              {handle}
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Diplôme">
                    <Input
                      value={e.degree}
                      onChange={(ev) => set(e.id, { degree: ev.target.value })}
                    />
                  </Field>
                  <Field label="École / Université">
                    <Input
                      value={e.school}
                      onChange={(ev) => set(e.id, { school: ev.target.value })}
                    />
                  </Field>
                  <Field label="Début">
                    <Input
                      type="month"
                      value={e.startDate}
                      onChange={(ev) => set(e.id, { startDate: ev.target.value })}
                    />
                  </Field>
                  <Field label="Fin">
                    <Input
                      type="month"
                      value={e.endDate}
                      onChange={(ev) => set(e.id, { endDate: ev.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Description (optionnel)">
                  <Input
                    value={e.description || ""}
                    onChange={(ev) => set(e.id, { description: ev.target.value })}
                  />
                </Field>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => remove(e.id)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" /> Supprimer
                </Button>
              </div>
            </div>
          </Card>
        )}
      />
      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une formation
      </Button>
    </div>
  );
}

function SkillsForm({ data, update }: FormProps) {
  const add = () => update({ skills: [...data.skills, { id: uid(), name: "", level: "Avancé" }] });
  const set = (id: string, patch: Partial<CVData["skills"][0]>) =>
    update({ skills: data.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const remove = (id: string) => update({ skills: data.skills.filter((s) => s.id !== id) });

  return (
    <Card className="mt-4 space-y-2 p-5">
      <SortableList
        items={data.skills}
        onReorder={(skills) => update({ skills })}
        className="space-y-2"
        renderItem={(s, handle) => (
          <div className="flex items-center gap-2">
            {handle}
            <Input
              className="flex-1 min-w-0"
              value={s.name}
              onChange={(e) => set(s.id, { name: e.target.value })}
              placeholder="ex. React"
            />
            <Select
              value={s.level}
              onValueChange={(v) => set(s.id, { level: v as CVData["skills"][0]["level"] })}
            >
              <SelectTrigger className="w-28 shrink-0 sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Débutant", "Intermédiaire", "Avancé", "Expert"].map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => remove(s.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une compétence
      </Button>
    </Card>
  );
}

function LanguagesForm({ data, update }: FormProps) {
  const add = () =>
    update({ languages: [...data.languages, { id: uid(), name: "", level: "B2" }] });
  const set = (id: string, patch: Partial<CVData["languages"][0]>) =>
    update({ languages: data.languages.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const remove = (id: string) => update({ languages: data.languages.filter((s) => s.id !== id) });

  return (
    <Card className="mt-4 space-y-2 p-5">
      <SortableList
        items={data.languages}
        onReorder={(languages) => update({ languages })}
        className="space-y-2"
        renderItem={(l, handle) => (
          <div className="flex items-center gap-2">
            {handle}
            <Input
              className="flex-1 min-w-0"
              value={l.name}
              onChange={(e) => set(l.id, { name: e.target.value })}
              placeholder="Anglais"
            />
            <Select
              value={l.level}
              onValueChange={(v) => set(l.id, { level: v as CVData["languages"][0]["level"] })}
            >
              <SelectTrigger className="w-24 shrink-0 sm:w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["A1", "A2", "B1", "B2", "C1", "C2", "Natif"].map((x) => (
                  <SelectItem key={x} value={x}>
                    {x}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => remove(l.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />
      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une langue
      </Button>
    </Card>
  );
}

function CertificationsForm({ data, update }: FormProps) {
  const add = () =>
    update({
      certifications: [...data.certifications, { id: uid(), name: "", issuer: "", date: "" }],
    });
  const set = (id: string, patch: Partial<CVData["certifications"][0]>) =>
    update({
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  const remove = (id: string) =>
    update({ certifications: data.certifications.filter((c) => c.id !== id) });

  return (
    <div className="mt-4 space-y-3">
      <SortableList
        items={data.certifications}
        onReorder={(certifications) => update({ certifications })}
        renderItem={(c, handle) => (
          <Card className="space-y-3 p-5">
            <div className="flex items-start gap-2">
              {handle}
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Nom">
                    <Input value={c.name} onChange={(e) => set(c.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Émetteur">
                    <Input
                      value={c.issuer}
                      onChange={(e) => set(c.id, { issuer: e.target.value })}
                    />
                  </Field>
                  <Field label="Date">
                    <Input
                      type="month"
                      value={c.date}
                      onChange={(e) => set(c.id, { date: e.target.value })}
                    />
                  </Field>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => remove(c.id)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" /> Supprimer
                </Button>
              </div>
            </div>
          </Card>
        )}
      />
      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une certification
      </Button>
    </div>
  );
}
