export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Hi, I'm a{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              MERN Stack Developer
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
            Crafting innovative web applications with MongoDB, Express.js, React, and Node.js. Specialized in building
            scalable, performant, and user-centric full-stack solutions.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            3+ years of experience in building production-ready applications with clean architecture and best practices.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#projects"
              className="px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-card transition-colors"
            >
              Get in Touch
            </a>
            <a
              href="/resume.pdf"
              className="px-8 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="w-full  rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 border border-border flex items-center justify-center">
            <div className="text-center">
              <img src="/photo.png" />
              {/* <div className="text-6xl mb-4">👨‍💻</div>
              <p className="text-muted-foreground">Your professional photo</p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
