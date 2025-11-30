export function Experience() {
  const experiences = [
    {
      id: 1,
      role: "MERN Stack Developer",
      company: "Webforest LLP.",
      period: "Aug 2025 - Present",
      description:
        "Joined as a MERN Stack Developer focusing on building scalable web applications, optimizing API performance, and collaborating across teams to deliver high-quality features.",
      achievements: [
        "Developed and maintained MERN-based modules with reusable and scalable components",
        "Optimized REST APIs and database queries, improving overall application responsiveness",
        "Collaborated with cross-functional teams to deliver new features and improvements",
        "Contributed to code reviews and followed best practices to maintain code quality"
      ],
    },
    {
      id: 2,
      role: "Freelance Full-Stack Developer",
      company: "Xvantage Infotech",
      period: "Mar 2025 - Jul 2025",
      description:
        "Worked as a freelance MERN Stack developer delivering end-to-end web applications, collaborating directly with Team, and providing scalable, high-quality solutions.",
      achievements: [
        "Delivered multiple MERN-based client projects with responsive UI and optimized backend APIs",
        "Managed full project lifecycle including requirements, development, deployment, and support"
      ],
    },
    {
      id: 3,
      role: "Node.js Backend Developer",
      company: "White Orange Software",
      period: "Sep 2022 - Mar 2025",
      description:
        "Worked as a Node.js Backend Developer, completing a 2.5-year journey including internship, focusing on building robust REST APIs, improving backend performance, and collaborating with the development team on scalable solutions.",
      achievements: [
        "Developed and maintained backend services using Node.js, Express,MySQL, and MongoDB",
        "Optimized API performance and improved response times across multiple projects",
        "Integrated third-party services and implemented secure authentication flows",
        "Contributed to deployment, debugging, and ongoing maintenance of client applications"
      ],
    }
  ]

  return (
    <section id="experience" className="py-20 px-6 bg-card/50 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Experience</h2>
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 rounded-xl border border-border hover:bg-card transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-accent mb-1">{exp.role}</h3>
                  <p className="text-lg text-foreground">{exp.company}</p>
                </div>
                <span className="text-muted-foreground mt-2 md:mt-0">{exp.period}</span>
              </div>
              <p className="text-muted-foreground mb-4">{exp.description}</p>
              <ul className="space-y-2">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-muted-foreground flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
