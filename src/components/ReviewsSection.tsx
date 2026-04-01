"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= rating ? "#C8A27C" : "rgba(200,162,124,0.2)",
            fontSize: "14px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ initials, index }: { initials: string; index: number }) {
  const colors = [
    ["#6F4E37", "#C8A27C"],
    ["#8B5E3C", "#D4AE88"],
    ["#5C3D1E", "#B8924A"],
    ["#7A5230", "#E8D5B7"],
    ["#4A2F1A", "#C8A27C"],
  ];
  const [from, to] = colors[index % colors.length];
  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "600",
        color: "#F5ECD7",
        fontFamily: "Inter, sans-serif",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const reviews = siteConfig.reviews;

  return (
    <section
      id="reviews"
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #1C1510 0%, #0A0705 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative quote mark */}
      <div
        className="font-display"
        style={{
          position: "absolute",
          top: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "200px",
          color: "rgba(200,162,124,0.04)",
          lineHeight: 1,
          userSelect: "none",
          fontStyle: "italic",
        }}
      >
        &ldquo;
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: "16px" }}
          >
            <span className="tag">Testimonials</span>
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
            Loved by{" "}
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
              fontSize: "16px",
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Real stories from real coffee lovers.
          </motion.p>
        </div>

        {/* Featured review */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass"
            style={{
              padding: "clamp(32px, 5vw, 60px)",
              borderRadius: "24px",
              marginBottom: "48px",
              maxWidth: "780px",
              margin: "0 auto 48px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              className="font-display"
              style={{
                fontSize: "60px",
                color: "rgba(200,162,124,0.2)",
                lineHeight: 0.8,
                marginBottom: "24px",
                fontStyle: "italic",
              }}
            >
              &ldquo;
            </div>
            <p
              className="font-serif"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: "#F5ECD7",
                lineHeight: 1.6,
                fontStyle: "italic",
                fontWeight: "400",
                marginBottom: "32px",
              }}
            >
              {reviews[active].text}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <Avatar
                initials={reviews[active].avatar}
                index={active}
              />
              <div style={{ textAlign: "left" }}>
                <div
                  className="font-sans"
                  style={{ fontSize: "15px", color: "#F5ECD7", fontWeight: "600" }}
                >
                  {reviews[active].name}
                </div>
                <div
                  className="font-sans"
                  style={{ fontSize: "12px", color: "#A89880" }}
                >
                  {reviews[active].role}
                </div>
              </div>
              <div style={{ marginLeft: "8px" }}>
                <StarRating rating={reviews[active].rating} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* All review cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "16px",
            marginTop: "16px",
          }}
          className="review-cards"
        >
          {reviews.map((review, i) => (
            <motion.button
              key={review.name}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{
                background: active === i
                  ? "linear-gradient(135deg, rgba(111,78,55,0.3), rgba(200,162,124,0.15))"
                  : "rgba(255,255,255,0.02)",
                border: active === i
                  ? "1px solid rgba(200,162,124,0.4)"
                  : "1px solid rgba(200,162,124,0.08)",
                borderRadius: "16px",
                padding: "20px 16px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <Avatar initials={review.avatar} index={i} />
              <div
                className="font-sans"
                style={{
                  fontSize: "13px",
                  color: active === i ? "#F5ECD7" : "#A89880",
                  fontWeight: "500",
                  marginTop: "8px",
                  marginBottom: "4px",
                  transition: "color 0.3s",
                }}
              >
                {review.name}
              </div>
              <StarRating rating={review.rating} />
            </motion.button>
          ))}
        </div>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center",
            marginTop: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              className="font-display gradient-text"
              style={{ fontSize: "48px", fontStyle: "italic", fontWeight: "300" }}
            >
              4.9
            </div>
            <StarRating rating={5} />
          </div>
          <div
            style={{
              width: "1px",
              height: "60px",
              background: "rgba(200,162,124,0.2)",
            }}
          />
          <div className="font-sans" style={{ color: "#A89880" }}>
            <div style={{ fontSize: "24px", fontWeight: "600", color: "#F5ECD7" }}>10,000+</div>
            <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
              Happy Members
            </div>
          </div>
          <div style={{ width: "1px", height: "60px", background: "rgba(200,162,124,0.2)" }} />
          <div className="font-sans" style={{ color: "#A89880" }}>
            <div style={{ fontSize: "24px", fontWeight: "600", color: "#F5ECD7" }}>100%</div>
            <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
              Recommend Us
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .review-cards { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .review-cards { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .review-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
