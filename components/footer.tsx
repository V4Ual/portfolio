export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-12 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-accent mb-4">Navigation</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-foreground transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-foreground transition-colors">
                  Experience
                </a>
              </li>
            </ul>
          </div>
          {/* <div>
            <h3 className="font-semibold text-accent mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a href="#blog" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/resume.pdf" className="hover:text-foreground transition-colors">
                  Resume
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div> */}
          <div>
            <h3 className="font-semibold text-accent mb-4">Social</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {/* <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li> */}
              <li>
                <a
                  href="https://www.linkedin.com/in/vishal-sharma-6639a322a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/V4Ual"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-accent mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a href="mailto:hello@example.com" className="hover:text-foreground transition-colors">
                  visrma53@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {year} MERN Full-Stack Developer. All rights reserved. | Designed & Built with React & Node.js</p>
        </div>
      </div>
    </footer>
  )
}
