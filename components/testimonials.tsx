import React from "react";
import { UserCheck, Code, Sparkles, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content:
        "Outstanding developer! Vishal delivered our e-commerce platform ahead of schedule with exceptional code quality and attention to detail. Highly recommended!",
      initials: "SJ",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO at StartupXYZ",
      content:
        "Vishal's expertise in PERN stack and system design helped us scale our platform to handle millions of users. A true full-stack professional.",
      initials: "MC",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Lead Developer at CloudVenture",
      content:
        "Fantastic mentor and collaborator. Vishal's code reviews and architectural insights significantly improved our team's development practices.",
      initials: "ER",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-accent text-xs font-bold tracking-widest uppercase">
            // Client & Team Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            What People Say
          </h2>
          <p className="text-muted-foreground text-base">
            Endorsements from collaborators, product managers, and team leads.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md hover:border-accent/40 transition-all flex flex-col justify-between space-y-6 relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-accent/10 group-hover:text-accent/20 transition-colors pointer-events-none" />

              <p className="text-muted-foreground leading-relaxed text-sm relative z-10 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${t.badgeColor}`}
                >
                  {t.initials}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{t.name}</h3>
                  <p className="text-xs text-accent font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
