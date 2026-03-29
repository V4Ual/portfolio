"use client";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {/* Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Hi, I'm a{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              MERN Stack Developer
            </span>
          </motion.h1>

          {/* Paragraph 1 */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="text-xl text-muted-foreground mb-4 leading-relaxed"
          >
            Crafting innovative web applications with MongoDB, Express.js,
            React, and Node.js.
          </motion.p>

          {/* Paragraph 2 */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            3+ years of experience in building production-ready applications.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex gap-4 flex-wrap"
          >
            {[
              {
                text: "View My Work",
                link: "#projects",
                style: "bg-accent text-accent-foreground",
              },
              {
                text: "Get in Touch",
                link: "#contact",
                style: "border border-border",
              },
              {
                text: "Download Resume",
                link: "/resume.pdf",
                style: "border border-accent text-accent",
              },
            ].map((btn, i) => (
              <motion.a
                key={i}
                href={btn.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 font-semibold rounded-lg transition-all ${btn.style}`}
              >
                {btn.text}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <motion.img
            src="/photo.png"
            alt="Profile"
            className="rounded-2xl w-[350px]"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
