import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

interface NavLink {
  href: string;
  label: string;
}

export function LandingMobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Ouvrir le menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88%] max-w-sm border-l p-0 sm:w-80">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-bold">CVForge</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fermer">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mt-2 border-t p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Apparence</span>
            <ThemeToggle />
          </div>
          <Link to="/auth" onClick={() => setOpen(false)} className="block">
            <Button variant="outline" className="mt-1 w-full">
              Se connecter
            </Button>
          </Link>
          <Link to="/auth" onClick={() => setOpen(false)} className="block">
            <Button className="mt-2 w-full bg-gradient-primary">Commencer gratuitement</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
