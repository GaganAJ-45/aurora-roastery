"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import Image from "next/image";

const slideLeft: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function CraftSection() {
  return (
    <section
      id="menu"
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #1C1510 0%, #120E0A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "80px",
          background: "linear-gradient(to bottom, transparent, rgba(200,162,124,0.4))",
        }}
      />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: "16px" }}
          >
            <span className="tag">Our Craft</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif"
            style={{
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: "600",
              color: "#F5ECD7",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Where Science Meets{" "}
            <span className="gradient-text" style={{ fontStyle: "italic" }}>
              Soul
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans"
            style={{
              color: "#A89880",
              fontSize: "16px",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Every bean we source is a story. Roasted in small batches using
            precision temperature control to unlock the full spectrum of flavour.
          </motion.p>
        </div>

        {/* Main 2-col layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "start",
            marginBottom: "80px",
          }}
          className="craft-grid"
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}
            className="glow-amber"
          >
            <Image
              src="/craft_section.png"
              alt="Aurora Roastery craft interior"
              width={700}
              height={520}
              style={{ width: "100%", height: "auto" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top right, rgba(10,7,5,0.6), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                padding: "12px 20px",
                borderRadius: "8px",
                background: "rgba(10,7,5,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(200,162,124,0.2)",
              }}
            >
              <div className="font-sans" style={{ fontSize: "11px", color: "#A89880", letterSpacing: "2px", textTransform: "uppercase" }}>
                Est. 2020
              </div>
              <div className="font-serif" style={{ fontSize: "18px", color: "#F5ECD7", marginTop: "2px" }}>
                Bangalore&apos;s Roastery
              </div>
            </div>
          </motion.div>

          {/* Blends */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "20px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="divider" style={{ marginBottom: "24px" }} />
              <h3
                className="font-serif"
                style={{ fontSize: "22px", color: "#F5ECD7", marginBottom: "8px" }}
              >
                Signature Blends
              </h3>
              <p
                className="font-sans"
                style={{ color: "#A89880", fontSize: "14px", lineHeight: 1.6 }}
              >
                Three expressions of our roastery&apos;s philosophy — crafted for
                every palate.
              </p>
            </motion.div>

            {siteConfig.blends.map((blend, i) => (
              <motion.div
                key={blend.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideLeft}
                whileHover={{ x: 8 }}
                className="glass card-hover"
                style={{
                  padding: "24px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <div
                      className="font-serif"
                      style={{ fontSize: "20px", color: "#F5ECD7", fontWeight: "500" }}
                    >
                      {blend.name}
                    </div>
                    <div
                      className="font-sans"
                      style={{ fontSize: "12px", color: "#C8A27C", letterSpacing: "1px" }}
                    >
                      {blend.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      opacity: 0.6,
                    }}
                  >
                    ☕
                  </div>
                </div>
                <p
                  className="font-sans"
                  style={{ color: "#A89880", fontSize: "13px", lineHeight: 1.6, marginBottom: "14px" }}
                >
                  {blend.detail}
                </p>
                {/* Intensity bar */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      className="font-sans"
                      style={{ fontSize: "10px", color: "#A89880", letterSpacing: "1.5px", textTransform: "uppercase" }}
                    >
                      Intensity
                    </span>
                    <span
                      className="font-sans"
                      style={{ fontSize: "10px", color: "#C8A27C" }}
                    >
                      {blend.intensity}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background: "rgba(200,162,124,0.1)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${blend.intensity}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #6F4E37, #C8A27C)",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
          className="features-grid"
        >
          {siteConfig.features.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideLeft}
              whileHover={{ scale: 1.03, y: -4 }}
              style={{
                padding: "36px 28px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(37,26,18,0.8) 0%, rgba(18,14,10,0.9) 100%)",
                border: "1px solid rgba(200,162,124,0.1)",
                cursor: "pointer",
                transition: "border-color 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,162,124,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,162,124,0.1)";
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{feat.icon}</div>
              <h4
                className="font-serif"
                style={{ fontSize: "20px", color: "#F5ECD7", marginBottom: "10px" }}
              >
                {feat.title}
              </h4>
              <p
                className="font-sans"
                style={{ color: "#A89880", fontSize: "14px", lineHeight: 1.6 }}
              >
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .craft-grid { gap: 2rem !important; }
        }
        @media (max-width: 768px) {
          .craft-grid { grid-template-columns: 1fr !important; margin-bottom: 3rem !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </section>
  );
}

