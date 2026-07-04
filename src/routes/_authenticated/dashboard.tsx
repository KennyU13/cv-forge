import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { sampleCV, emptyCV } from "@/lib/cv-types";
import { toast } from "sonner";
import { useState } from "react";
import {
  FileText,
  Plus,
  LogOut,
  Trash2,
  Copy,
  Edit3,
  BarChart3,
  Loader2,
  MoreVertical,
  Sparkles,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — CVForge" }] }),
  component: Dashboard,
});

interface CVRow {
  id: string;
  title: string;
  template: string;
  ats_score: number | null;
  updated_at: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");

  const { data: cvs, isLoading } = useQuery({
    queryKey: ["cvs"],
    queryFn: async (): Promise<CVRow[]> => {
      const { data, error } = await supabase
        .from("cvs")
        .select("id, title, template, ats_score, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createCV = useMutation({
    mutationFn: async (useSample: boolean) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Non authentifié");
      const { data, error } = await supabase
        .from("cvs")
        .insert({
          user_id: u.user.id,
          title: useSample ? "Exemple — Camille Laurent" : "Nouveau CV",
          template: "moderne",
          data: (useSample ? sampleCV() : emptyCV()) as never,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (cv) => navigate({ to: "/cv/$id", params: { id: cv.id } }),
    onError: (e) => toast.error("Erreur", { description: e.message }),
  });

  const deleteCV = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cvs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("CV supprimé");
      qc.invalidateQueries({ queryKey: ["cvs"] });
    },
  });

  const duplicateCV = useMutation({
    mutationFn: async (id: string) => {
      const { data: u } = await supabase.auth.getUser();
      const { data: src, error: e1 } = await supabase.from("cvs").select("*").eq("id", id).single();
      if (e1) throw e1;
      const { error } = await supabase.from("cvs").insert({
        user_id: u.user!.id,
        title: `${src.title} (copie)`,
        template: src.template,
        data: src.data,
        target_job: src.target_job,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("CV dupliqué");
      qc.invalidateQueries({ queryKey: ["cvs"] });
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const filtered = (cvs ?? []).filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase().trim()),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-bold sm:text-lg">CVForge</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Compte">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Mes CV</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez, dupliquez et optimisez vos candidatures.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => createCV.mutate(true)}
              disabled={createCV.isPending}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Exemple
            </Button>
            <Button
              onClick={() => createCV.mutate(false)}
              className="flex-1 bg-gradient-primary shadow-glow sm:flex-none"
              disabled={createCV.isPending}
            >
              {createCV.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Nouveau CV
            </Button>
          </div>
        </div>

        {/* Search */}
        {(cvs?.length ?? 0) > 0 && (
          <div className="relative mt-6 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un CV…"
              className="pl-9"
            />
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-5">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="mt-2 h-3 w-2/5" />
                  <Skeleton className="mt-4 h-8 w-full" />
                </Card>
              ))}
            </>
          )}
          {!isLoading && cvs?.length === 0 && (
            <Card className="col-span-full flex flex-col items-center justify-center p-10 text-center sm:p-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">Aucun CV pour le moment</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Créez votre premier CV optimisé ATS en quelques minutes, ou démarrez depuis un
                exemple.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => createCV.mutate(true)}>
                  <Sparkles className="mr-2 h-4 w-4" /> Exemple
                </Button>
                <Button className="bg-gradient-primary" onClick={() => createCV.mutate(false)}>
                  <Plus className="mr-2 h-4 w-4" /> Nouveau CV
                </Button>
              </div>
            </Card>
          )}
          {!isLoading && filtered.length === 0 && (cvs?.length ?? 0) > 0 && (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              Aucun CV ne correspond à « {query} ».
            </div>
          )}
          {filtered.map((cv) => (
            <Card
              key={cv.id}
              className="group relative overflow-hidden p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-base font-semibold">{cv.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Modifié le {new Date(cv.updated_at).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                {typeof cv.ats_score === "number" && (
                  <Badge
                    className={`shrink-0 ${
                      cv.ats_score >= 75
                        ? "bg-success"
                        : cv.ats_score >= 50
                          ? "bg-warning text-warning-foreground"
                          : "bg-destructive"
                    }`}
                  >
                    ATS {cv.ats_score}
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="capitalize">
                  {cv.template}
                </Badge>
              </div>
              <div className="mt-5 flex gap-1.5">
                <Link to="/cv/$id" params={{ id: cv.id }} className="flex-1">
                  <Button size="sm" className="w-full bg-gradient-primary">
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Modifier
                  </Button>
                </Link>
                <Link to="/cv/$id/ats" params={{ id: cv.id }}>
                  <Button size="sm" variant="outline" aria-label="Analyse ATS" title="Analyse ATS">
                    <BarChart3 className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => duplicateCV.mutate(cv.id)}
                  aria-label="Dupliquer"
                  title="Dupliquer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" aria-label="Supprimer" title="Supprimer">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce CV ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        « {cv.title} » sera définitivement supprimé. Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCV.mutate(cv.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
