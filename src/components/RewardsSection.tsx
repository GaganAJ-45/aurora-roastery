"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

const fadeScale: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

export default function RewardsSection() {
  return (
    <section
      id="rewards"
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #1C1510 0%, #251A12 50%, #1C1510 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top divider line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "80px",
          background: "linear-gradient(to bottom, transparent, rgba(200,162,124,0.3))",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)", textAlign: "center" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: "16px" }}
        >
          <span className="tag">Rewards Program</span>
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
          Every Sip{" "}
          <span className="gradient-text" style={{ fontStyle: "italic" }}>
            Rewarded
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
            maxWidth: "500px",
            margin: "0 auto 80px",
            lineHeight: 1.7,
          }}
        >
          Join thousands of coffee lovers in Bangalore who earn with every cup.
        </motion.p>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
            marginBottom: "64px",
            position: "relative",
          }}
          className="rewards-grid"
        >
          {/* Connecting line */}
          <div
            style={{
              position: "absolute",
              top: "44px",
              left: "calc(16.67% + 32px)",
              right: "calc(16.67% + 32px)",
              height: "1px",
              background: "linear-gradient(90deg, rgba(200,162,124,0.1), rgba(200,162,124,0.3), rgba(200,162,124,0.1))",
              zIndex: 0,
            }}
            className="connector-line"
          />

          {siteConfig.rewards.map((reward, i) => (
            <motion.div
              key={reward.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeScale}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Step circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(37,26,18,1), rgba(25,17,11,1))",
                  border: "1px solid rgba(200,162,124,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "28px",
                  fontSize: "32px",
                  cursor: "default",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(200,162,124,0.6)";
                  el.style.boxShadow = "0 0 30px rgba(200,162,124,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(200,162,124,0.25)";
                  el.style.boxShadow = "none";
                }}
              >
                {reward.icon}
              </motion.div>

              {/* Step number */}
              <div
                className="font-display"
                style={{
                  fontSize: "13px",
                  color: "#C8A27C",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Step {reward.step}
              </div>

              {/* Title */}
              <h3
                className="font-serif"
                style={{
                  fontSize: "22px",
                  color: "#F5ECD7",
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                {reward.title}
              </h3>

              {/* Description */}
              <p
                className="font-sans"
                style={{ color: "#A89880", fontSize: "14px", lineHeight: 1.6 }}
              >
                {reward.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ padding: "18px 56px", fontSize: "15px" }}
          >
            Join Coffee Club ✨
          </motion.button>
          <span className="font-sans" style={{ fontSize: "12px", color: "#A89880" }}>
            Free to join · No card required
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .rewards-grid { gap: 1.5rem !important; }
        }
        @media (max-width: 768px) {
          .rewards-grid { grid-template-columns: 1fr !important; }
          .connector-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}

