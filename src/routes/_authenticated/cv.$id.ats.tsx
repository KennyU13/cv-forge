import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { analyzeCV, matchJob } from "@/lib/ats-engine";
import { type CVData, emptyCV } from "@/lib/cv-types";
import { ArrowLeft, AlertCircle, CheckCircle2, AlertTriangle, Loader2, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cv/$id/ats")({
  head: () => ({ meta: [{ title: "Analyse ATS — CVForge" }] }),
  component: ATSPage,
});

function ATSPage() {
  const { id } = Route.useParams();
  const { data: cv, isLoading } = useQuery({
    queryKey: ["cv", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("cvs").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const cvData = useMemo<CVData>(
    () => ({ ...emptyCV(), ...((cv?.data ?? {}) as unknown as CVData) }),
    [cv],
  );
  const ats = useMemo(() => analyzeCV(cvData), [cvData]);

  const [jobDesc, setJobDesc] = useState("");
  const match = useMemo(
    () => (jobDesc.trim().length > 30 ? matchJob(cvData, jobDesc) : null),
    [cvData, jobDesc],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/cv/$id" params={{ id }}>
              <Button variant="ghost" size="icon" aria-label="Retour">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="font-display text-base font-semibold sm:text-lg">Analyse ATS</div>
              <div className="truncate text-xs text-muted-foreground">{cv?.title}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* GLOBAL SCORE */}
        <Card className="overflow-hidden">
          <div className="grid gap-6 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <ScoreRing score={ats.globalScore} />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Score ATS global</div>
              <div className="mt-1 font-display text-3xl font-bold">
                {ats.globalScore >= 80
                  ? "Excellent CV"
                  : ats.globalScore >= 60
                    ? "Bon CV"
                    : ats.globalScore >= 40
                      ? "À améliorer"
                      : "Faible compatibilité"}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {ats.wordCount} mots · {ats.detectedKeywords.length} mots-clés pros détectés
              </p>
            </div>
          </div>
        </Card>

        {/* DETAILED SCORES */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          <ScoreCard label="Structure" value={ats.structureScore} />
          <ScoreCard label="Expérience" value={ats.experienceScore} />
          <ScoreCard label="Compétences" value={ats.skillsScore} />
          <ScoreCard label="Lisibilité" value={ats.readabilityScore} />
          <ScoreCard label="Mots-clés" value={ats.keywordsScore} />
        </div>

        {/* RECOMMENDATIONS */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold">Recommandations</h2>
          <div className="mt-4 space-y-2">
            {ats.recommendations.map((r, i) => (
              <div
                key={i}
                className={`flex gap-3 rounded-lg border p-3 text-sm ${
                  r.type === "success"
                    ? "border-success/30 bg-success/5"
                    : r.type === "warning"
                      ? "border-warning/30 bg-warning/5"
                      : "border-destructive/30 bg-destructive/5"
                }`}
              >
                {r.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : r.type === "warning" ? (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                )}
                <span>{r.message}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* DETECTED KEYWORDS */}
        {ats.detectedKeywords.length > 0 && (
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Mots-clés détectés</h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {ats.detectedKeywords.map((k) => (
                <Badge
                  key={k}
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary"
                >
                  {k}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* JOB MATCH */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Comparer à une offre d'emploi</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Collez le texte d'une offre pour évaluer la correspondance.
          </p>
          <Textarea
            className="mt-4"
            rows={6}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Collez ici la description de poste complète…"
          />
          {match && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="font-display text-4xl font-bold text-primary">
                  {match.matchPercentage}%
                </div>
                <div>
                  <div className="text-sm font-medium">Taux de correspondance</div>
                  <Progress value={match.matchPercentage} className="mt-1 w-48" />
                </div>
              </div>
              {match.missingKeywords.length > 0 && (
                <div>
                  <div className="text-sm font-medium">Mots-clés manquants dans votre CV</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {match.missingKeywords.map((k) => (
                      <Badge
                        key={k}
                        className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {match.presentKeywords.length > 0 && (
                <div>
                  <div className="text-sm font-medium">Mots-clés présents</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {match.presentKeywords.map((k) => (
                      <Badge key={k} className="bg-success/10 text-success hover:bg-success/20">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {match.recommendations.map((r, i) => (
                <div key={i} className="text-sm text-muted-foreground">
                  → {r.message}
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";
  const circ = 2 * Math.PI * 52;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`font-display text-3xl font-bold ${color}`}>{score}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">sur 100</div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      <Progress value={value} className="mt-2 h-1.5" />
    </Card>
  );
}
