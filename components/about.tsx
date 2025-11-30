export function About() {
  return (
    <section id="about" className="py-20 px-6 bg-card/50 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">About Me</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              I'm a passionate MERN Full-Stack Developer with 3+ years of experience building robust web applications. I
              specialize in creating scalable backend systems with Node.js and Express, combined with modern React
              frontends that deliver exceptional user experiences.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              My expertise spans from architecting RESTful APIs and database design with Postgres to optimizing frontend
              performance and implementing responsive designs. I'm committed to writing clean, maintainable code and
              following industry best practices.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border hover:bg-card transition-colors">
              <h3 className="font-semibold text-accent mb-2">Backend Expertise</h3>
              <p className="text-muted-foreground text-sm">
                Node.js, ExpressJs, NestJs, REST APIs, Microservices Architecture, Database Design, Authentication
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border hover:bg-card transition-colors">
              <h3 className="font-semibold text-accent mb-2">Frontend Mastery</h3>
              <p className="text-muted-foreground text-sm">
                React, Next.js, TypeScript, State Management (Redux and redux toolkit), Performance Optimization
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border hover:bg-card transition-colors">
              <h3 className="font-semibold text-accent mb-2">Database & DevOps</h3>
              <p className="text-muted-foreground text-sm">
                MongoDB, Postgres, MySql, Docker, AWS, CI/CD Pipelines, Git, Server Deployment
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border hover:bg-card transition-colors">
              <h3 className="font-semibold text-accent mb-2">Additional Skills</h3>
              <p className="text-muted-foreground text-sm">
                GraphQL, Redis, RabbitMQ Agile Methodologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
