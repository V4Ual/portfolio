"use client"

import { Github, Linkedin, Mail } from "lucide-react"
import type React from "react"
import { useState } from "react"

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 2000)
  }

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">Get In Touch</h2>
        <p className="text-center text-muted-foreground mb-12">
          I'm always interested in hearing about new projects and opportunities. Let's connect!
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-4 rounded-lg border border-border text-center hover:bg-card transition-colors">
            <div className="flex justify-center">
              <Mail className="text-center" />

            </div>

            <p className="font-semibold text-foreground mb-1">Email</p>
            <a href="mailto:hello@example.com" className="text-accent hover:underline text-sm">
              visrma53@gmail.com
            </a>
          </div>
          <div className="p-4 rounded-lg border border-border text-center hover:bg-card transition-colors">
            <div className="flex justify-center">
              <Linkedin className="text-center" />
            </div>
            <p className="font-semibold text-foreground mb-1">LinkedIn</p>
            <a
              href="https://www.linkedin.com/in/vishal-sharma-6639a322a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm"
            >
              vishal-sharma
            </a>
          </div>
          <div className="p-4 rounded-lg border border-border text-center hover:bg-card transition-colors">
            <div className="flex justify-center">
              <Github className="text-center" />
            </div>
            <p className="font-semibold text-foreground mb-1">GitHub</p>
            <a
              href="https://github.com/V4Ual"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm"
            >
              V4Ual
            </a>
          </div>
        </div>

        {/* <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent outline-none transition-colors"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent outline-none transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-accent outline-none transition-colors resize-none"
              placeholder="Tell me about your project..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {submitted ? "Message Sent! ✓" : "Send Message"}
          </button>
        </form> */}
      </div>
    </section>
  )
}
