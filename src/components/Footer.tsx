"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0A0705",
        borderTop: "1px solid rgba(200,162,124,0.08)",
        padding: "80px 0 40px",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "60px",
            marginBottom: "60px",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #6F4E37, #C8A27C)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                }}
              >
                ☕
              </div>
              <div
                className="font-serif"
                style={{ fontSize: "18px", color: "#F5ECD7", fontWeight: "600" }}
              >
                Aurora Roastery
              </div>
            </div>
            <p
              className="font-sans"
              style={{ color: "#A89880", fontSize: "14px", lineHeight: 1.7, maxWidth: "280px", marginBottom: "24px" }}
            >
              Bangalore&apos;s premier specialty coffee roastery. Ethically sourced, precisely roasted, lovingly brewed.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {["𝕏", "IG", "FB"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "rgba(200,162,124,0.08)",
                    border: "1px solid rgba(200,162,124,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#A89880", fontSize: "13px", textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,162,124,0.4)"; (e.currentTarget as HTMLAnchorElement).style.color = "#C8A27C"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,162,124,0.12)"; (e.currentTarget as HTMLAnchorElement).style.color = "#A89880"; }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Explore",
              links: ["Menu", "Seasonal", "Brew Bar", "Reservations"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Sustainability"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms", "Cookie Policy", "Refunds"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                className="font-sans"
                style={{
                  fontSize: "11px", color: "#C8A27C", letterSpacing: "2px",
                  textTransform: "uppercase", marginBottom: "20px", fontWeight: "600",
                }}
              >
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    whileHover={{ x: 4, color: "#C8A27C" }}
                    className="underline-anim font-sans"
                    style={{ color: "#A89880", textDecoration: "none", fontSize: "14px", transition: "color 0.3s" }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(200,162,124,0.08)", marginBottom: "32px" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            className="font-sans"
            style={{ color: "#A89880", fontSize: "13px" }}
          >
            © 2026 Aurora Roastery. All rights reserved. Made with ☕ in Bangalore.
          </div>
          <div
            className="font-sans"
            style={{
              fontSize: "11px", color: "#A89880", letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {siteConfig.brand.tagline}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
