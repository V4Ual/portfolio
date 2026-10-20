"use client";

import { useActionState, Suspense } from "react";
import { loginAction } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-md relative z-10 space-y-6">
      {/* Return to Portfolio Link */}
      <div className="flex items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground bg-card/60 hover:bg-card border border-border/80 transition-all shadow-xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-accent group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Portfolio</span>
        </Link>
      </div>

      {/* Header with Distinct Centered Lock Icon */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 text-accent border border-accent/25 shadow-lg shadow-accent/10">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Blog Admin Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your admin credentials to manage portfolio articles
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/20">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {state?.error && (
            <div className="p-3.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@vishalsharma.dev"
                // defaultValue="admin@vishalsharma.dev"
                className="pl-9 h-10 rounded-xl bg-background/80 border-border/80 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                // defaultValue="admin123"
                className="pl-9 h-10 rounded-xl bg-background/80 border-border/80 text-xs sm:text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl h-10 text-xs sm:text-sm gap-2 mt-2 shadow-md shadow-accent/20 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Admin CMS</span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center">
          <p className="text-[11px] text-muted-foreground">
            Default development credentials:{" "}
            <code className="text-accent font-semibold px-1 py-0.5 rounded bg-accent/10">
              admin@vishalsharma.dev
            </code>{" "}
            /{" "}
            <code className="text-accent font-semibold px-1 py-0.5 rounded bg-accent/10">
              admin123
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden bg-ambient-mesh">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md h-96 rounded-2xl bg-card/60 animate-pulse border border-border/60" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
