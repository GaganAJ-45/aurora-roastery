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

export default function LocationsSection() {
  return (
    <section
      id="locations"
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #0A0705 0%, #120E0A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "start",
            marginBottom: "64px",
          }}
          className="locations-header"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: "16px" }}
            >
              <span className="tag">📍 Locations</span>
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
              Find Us in{" "}
              <span className="gradient-text" style={{ fontStyle: "italic" }}>
                Bangalore
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
                fontSize: "15px",
                lineHeight: 1.7,
                maxWidth: "420px",
              }}
            >
              Three premium locations across Bangalore&apos;s most vibrant neighborhoods.
              Each crafted to perfection. All roasting the same exceptional beans.
            </motion.p>
          </div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              height: "280px",
              position: "relative",
            }}
          >
            <Image
              src="/store_interior.png"
              alt="Aurora Roastery store"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover", opacity: 0.7 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(10,7,5,0.5), rgba(111,78,55,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>🗺️</div>
                <div className="font-sans" style={{ fontSize: "13px", color: "#F5ECD7", letterSpacing: "1px" }}>
                  Bangalore • Karnataka • India
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Location cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "48px",
          }}
          className="locations-grid"
        >
          {siteConfig.locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideRight}
              whileHover={{ y: -8 }}
              className="glass"
              style={{
                padding: "32px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                border: "1px solid rgba(200,162,124,0.1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(200,162,124,0.35)";
                el.style.boxShadow = "0 20px 50px rgba(111,78,55,0.2)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(200,162,124,0.1)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Tag */}
              <div style={{ marginBottom: "20px" }}>
                <span className="tag">{loc.tag}</span>
              </div>

              {/* Icon */}
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>📍</div>

              {/* Name */}
              <h3
                className="font-serif"
                style={{
                  fontSize: "19px",
                  color: "#F5ECD7",
                  fontWeight: "500",
                  marginBottom: "12px",
                  lineHeight: 1.3,
                }}
              >
                {loc.name}
              </h3>

              {/* Divider */}
              <div className="divider" style={{ marginBottom: "16px", width: "40px" }} />

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>📌</span>
                  <span
                    className="font-sans"
                    style={{ color: "#A89880", fontSize: "13px", lineHeight: 1.5 }}
                  >
                    {loc.address}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px" }}>🕐</span>
                  <span
                    className="font-sans"
                    style={{ color: "#A89880", fontSize: "13px" }}
                  >
                    {loc.hours}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px" }}>📞</span>
                  <span
                    className="font-sans"
                    style={{ color: "#C8A27C", fontSize: "13px" }}
                  >
                    {loc.phone}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ x: 4 }}
                className="font-sans"
                style={{
                  marginTop: "24px",
                  background: "none",
                  border: "none",
                  color: "#C8A27C",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  letterSpacing: "0.5px",
                }}
              >
                Get Directions <span>→</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
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
            Find Nearby Store 📍
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .locations-header { gap: 2rem !important; }
        }
        @media (max-width: 768px) {
          .locations-header { grid-template-columns: 1fr !important; }
          .locations-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .locations-grid { gap: 1rem !important; }
        }
      `}</style>
    </section>
  );
}

