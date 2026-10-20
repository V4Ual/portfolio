import { getSession } from "@/lib/auth";
import Link from "next/link";
import { logoutAction } from "@/app/actions/blog";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Admin CMS | Portfolio Blog",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If on login page without session, don't show the navigation bar
  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col bg-ambient-mesh">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-accent transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-accent-foreground font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5 text-background" />
              </div>
              <span className="tracking-tight">Blog CMS</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/posts"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Articles</span>
              </Link>
              <Link
                href="/admin/posts/new"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-accent hover:bg-accent/10 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Article</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/blog"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-accent/60 transition-colors border border-border/80 bg-card/80 px-3 py-1.5 rounded-lg shadow-xs"
            >
              <span>View Public Blog</span>
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
            </Link>

            <div className="flex items-center gap-3 border-l border-border/60 pl-3">
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline font-mono">
                {session.name}
              </span>
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
