"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import Image from "next/image";

const slideRight: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function SeasonalSection() {
  return (
    <section
      id="seasonal"
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #120E0A 0%, #1C1510 50%, #120E0A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(111,78,55,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
            marginBottom: "64px",
          }}
          className="seasonal-header"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "16px" }}
            >
              <span className="tag">Seasonal Menu</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif"
              style={{
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontWeight: "600",
                color: "#F5ECD7",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              Limited Edition{" "}
              <span className="gradient-text" style={{ fontStyle: "italic" }}>
                Creations
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-sans"
              style={{ color: "#A89880", fontSize: "15px", lineHeight: 1.7 }}
            >
              Inspired by the changing seasons and the vibrant culture of
              Bangalore. Each drink is a limited edition — here today, gone
              tomorrow.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src="/seasonal_drinks.png"
              alt="Seasonal drinks"
              width={600}
              height={340}
              style={{ width: "100%", height: "auto" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(18,14,10,0.5), transparent)",
              }}
            />
          </motion.div>
        </div>

        {/* Drink Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "48px",
          }}
          className="drinks-grid"
        >
          {siteConfig.seasonalDrinks.map((drink, i) => (
            <motion.div
              key={drink.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideRight}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-dark"
              style={{
                padding: "36px 28px",
                borderRadius: "20px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(200,162,124,0.1)",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(200,162,124,0.3)";
                el.style.boxShadow = "0 20px 60px rgba(111,78,55,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(200,162,124,0.1)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Glow blob */}
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${drink.color}25 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Tag */}
              <div style={{ marginBottom: "20px" }}>
                <span
                  className="tag"
                  style={{
                    background: `${drink.color}20`,
                    borderColor: `${drink.color}50`,
                    color: drink.color,
                  }}
                >
                  {drink.tag}
                </span>
              </div>

              {/* Emoji */}
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>{drink.emoji}</div>

              {/* Name */}
              <h3
                className="font-serif"
                style={{
                  fontSize: "22px",
                  color: "#F5ECD7",
                  fontWeight: "500",
                  marginBottom: "10px",
                  lineHeight: 1.2,
                }}
              >
                {drink.name}
              </h3>

              {/* Description */}
              <p
                className="font-sans"
                style={{
                  color: "#A89880",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {drink.description}
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ x: 4 }}
                className="font-sans"
                style={{
                  background: "none",
                  border: "none",
                  color: drink.color,
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Order This Drink <span style={{ fontSize: "16px" }}>→</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary"
            style={{ padding: "16px 48px" }}
          >
            View Full Seasonal Menu
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .seasonal-header { gap: 2rem !important; }
        }
        @media (max-width: 768px) {
          .seasonal-header { grid-template-columns: 1fr !important; }
          .drinks-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .drinks-grid { gap: 1rem !important; }
        }
      `}</style>
    </section>
  );
}

