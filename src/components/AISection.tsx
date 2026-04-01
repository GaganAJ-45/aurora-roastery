"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

const moodOptions = [
  { emoji: "T", label: "Tired", key: "tired" },
  { emoji: "H", label: "Happy", key: "happy" },
  { emoji: "F", label: "Focused", key: "focused" },
  { emoji: "C", label: "Chill", key: "chill" },
  { emoji: "A", label: "Adventurous", key: "adventurous" },
];

type Suggestion = {
  drink: string;
  reason: string;
};

export default function AISection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const router = useRouter();
  const { addItem } = useCartStore();

  const handleMoodSelect = (key: string) => {
    setSelected(key);
    setLoading(true);
    setSuggestion(null);

    setTimeout(() => {
      const result = siteConfig.aiSuggestions.moods[key as keyof typeof siteConfig.aiSuggestions.moods];
      setSuggestion(result);
      setLoading(false);
    }, 1200);
  };

  const handleTextSubmit = () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setSuggestion(null);

    const lower = inputText.toLowerCase();
    let key = "focused";

    if (lower.includes("tired") || lower.includes("sleepy") || lower.includes("exhausted")) key = "tired";
    else if (lower.includes("happy") || lower.includes("celebrat") || lower.includes("great")) key = "happy";
    else if (lower.includes("chill") || lower.includes("relax") || lower.includes("calm")) key = "chill";
    else if (lower.includes("adven") || lower.includes("excit") || lower.includes("try")) key = "adventurous";

    setSelected(key);

    setTimeout(() => {
      setSuggestion(siteConfig.aiSuggestions.moods[key as keyof typeof siteConfig.aiSuggestions.moods]);
      setLoading(false);
    }, 1400);
  };

  const handleOrderSuggestion = async () => {
    if (!selected) {
      toast.error("Choose a mood first so we can match a live ritual.");
      return;
    }

    setOrdering(true);

    try {
      const res = await fetch(`/api/recommendations?mood=${selected}`);
      const data = (await res.json()) as Array<{
        id: string;
        name: string;
        price: number;
        image: string;
      }>;

      const product = data[0];

      if (!product?.id) {
        toast.error("No live ritual is available for this mood right now.");
        return;
      }

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });

      toast.success(`${product.name} added to your ritual cart.`);
      router.push("/checkout");
    } catch {
      toast.error("We couldn't prepare that recommendation right now.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <section
      id="ai"
      className="section-padding"
      style={{
        background: "linear-gradient(180deg, #120E0A 0%, #1C1510 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,162,124,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 4vw, 2rem)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="tag">AI Recommendations</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif"
          style={{
            fontSize: "clamp(28px, 4.5vw, 52px)",
            fontWeight: "600",
            color: "#F5ECD7",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          What Do You Feel Like{" "}
          <span className="gradient-text" style={{ fontStyle: "italic" }}>
            Today?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-sans"
          style={{ color: "#A89880", fontSize: "15px", lineHeight: 1.7, marginBottom: "48px" }}
        >
          Tell us your mood and we&apos;ll suggest the perfect Aurora brew for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          {moodOptions.map((mood) => (
            <motion.button
              key={mood.key}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood.key)}
              style={{
                padding: "14px 24px",
                borderRadius: "50px",
                border:
                  selected === mood.key
                    ? "1px solid rgba(200,162,124,0.6)"
                    : "1px solid rgba(200,162,124,0.15)",
                background:
                  selected === mood.key
                    ? "linear-gradient(135deg, rgba(111,78,55,0.3), rgba(200,162,124,0.15))"
                    : "rgba(255,255,255,0.02)",
                color: selected === mood.key ? "#F5ECD7" : "#A89880",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "999px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: selected === mood.key ? "rgba(245,236,215,0.18)" : "rgba(255,255,255,0.06)",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {mood.emoji}
              </span>
              {mood.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="ai-input-row"
          style={{
            display: "flex",
            gap: "12px",
            maxWidth: "540px",
            margin: "0 auto 48px",
          }}
        >
          <input
            id="mood-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Or describe how you feel..."
            className="font-sans"
            style={{
              flex: 1,
              padding: "14px 20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(200,162,124,0.15)",
              borderRadius: "12px",
              color: "#F5ECD7",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(200,162,124,0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(200,162,124,0.15)";
            }}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTextSubmit}
            className="btn-primary"
            style={{ whiteSpace: "nowrap", padding: "14px 24px" }}
          >
            Ask AI
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass"
              style={{
                padding: "40px",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: "32px" }}
              >
                O
              </motion.div>
              <div className="font-sans" style={{ color: "#A89880", fontSize: "14px", letterSpacing: "1px" }}>
                Brewing your perfect match...
              </div>
            </motion.div>
          )}

          {suggestion && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass"
              style={{
                padding: "40px",
                borderRadius: "20px",
                textAlign: "center",
                border: "1px solid rgba(200,162,124,0.2)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>C</div>
              <div
                className="font-sans"
                style={{
                  fontSize: "11px",
                  color: "#C8A27C",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                We Recommend
              </div>
              <div className="font-serif gradient-text" style={{ fontSize: "32px", fontWeight: "500", marginBottom: "16px" }}>
                {suggestion.drink}
              </div>
              <p
                className="font-sans"
                style={{ color: "#A89880", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px" }}
              >
                {suggestion.reason}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ padding: "14px 36px" }}
                onClick={handleOrderSuggestion}
                disabled={ordering}
              >
                {ordering ? "Preparing Order..." : "Order This Now"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx>{`
          @media (max-width: 768px) {
            .ai-input-row {
              flex-direction: column !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
