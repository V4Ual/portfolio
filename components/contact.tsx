"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { SpotlightCard } from "./reactbits/SpotlightCard";
import { DecryptedText } from "./reactbits/DecryptedText";
import { MagnetButton } from "./reactbits/MagnetButton";
import { StarBorder } from "./reactbits/StarBorder";
import { Mail, Linkedin, Github, Copy, Check, Send, Sparkles, MessageSquare } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("visrma53@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactCards = [
    {
      title: "Email Address",
      value: "visrma53@gmail.com",
      actionLabel: copiedEmail ? "Copied to Clipboard! ✓" : "Click to Copy Email",
      icon: Mail,
      onClick: handleCopyEmail,
      link: "mailto:visrma53@gmail.com",
    },
    {
      title: "LinkedIn Profile",
      value: "vishal-sharma",
      actionLabel: "Connect on LinkedIn ↗",
      icon: Linkedin,
      link: "https://www.linkedin.com/in/vishal-sharma-6639a322a/",
    },
    {
      title: "GitHub Repository",
      value: "V4Ual",
      actionLabel: "View Repositories ↗",
      icon: Github,
      link: "https://github.com/V4Ual",
    },
  ];

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* HEADING */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              // Let's Build Something Great
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Get In{" "}
            <DecryptedText
              text="Touch"
              speed={40}
              maxIterations={10}
              animateOn="view"
              className="bg-gradient-to-r from-accent via-cyan-300 to-primary bg-clip-text text-transparent"
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Whether you have a project in mind, an opportunity to discuss, or just want to connect — feel free to drop a message!
          </motion.p>
        </div>

        {/* QUICK CONTACT CARDS */}
        <div className="grid sm:grid-cols-3 gap-6">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <SpotlightCard className="p-6 h-full flex flex-col justify-between text-center space-y-4 border border-border/80 bg-card/60 group hover:border-accent/60 transition-all">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/30 text-accent group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">
                        {card.title}
                      </h3>
                      <p className="text-accent text-sm font-mono mt-0.5">
                        {card.value}
                      </p>
                    </div>
                  </div>

                  {card.onClick ? (
                    <button
                      onClick={card.onClick}
                      className="text-xs font-semibold text-muted-foreground group-hover:text-accent hover:underline flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{card.actionLabel}</span>
                    </button>
                  ) : (
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-muted-foreground group-hover:text-accent hover:underline transition-colors"
                    >
                      {card.actionLabel}
                    </a>
                  )}
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* INTERACTIVE FORM */}

      </div>
    </section>
  );
}
