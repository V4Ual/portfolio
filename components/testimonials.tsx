export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content:
        "Outstanding developer! Alex delivered our e-commerce platform ahead of schedule with exceptional code quality and attention to detail. Highly recommended!",
      image: "👩‍💼",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO at StartupXYZ",
      content:
        "Alex's expertise in MERN stack and system design helped us scale our platform to handle millions of users. A true full-stack professional.",
      image: "👨‍💻",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Lead Developer at CloudVenture",
      content:
        "Fantastic mentor and collaborator. Alex's code reviews and architectural insights significantly improved our team's development practices.",
      image: "👩‍🔬",
    },
  ]

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-accent">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
