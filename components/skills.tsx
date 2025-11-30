export function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Framer Motion"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express.js", "Sequelize", 'Drizzle', "REST APIs", "GraphQL", "SocketIo", "WebSockets"],
    },
    {
      category: "Database",
      skills: ["MongoDB", "Mongoose", 'MySQL', "Postgres"],
    },
    {
      category: "DevOps & Tools",
      skills: ["Docker", "AWS", "Git", "CI/CD", "Jest", "Postman"],
    },
    {
      category: "Languages",
      skills: ["JavaScript", "TypeScript", "Python", "SQL"],
    },
    {
      category: "Soft Skills",
      skills: ["Problem Solving", "Agile", "Code Review"],
    },
  ]

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Skills & Technologies</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="p-6 rounded-xl border border-border hover:bg-card/50 transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-accent">{cat.category}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-sm text-foreground hover:border-accent hover:bg-accent/10 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
