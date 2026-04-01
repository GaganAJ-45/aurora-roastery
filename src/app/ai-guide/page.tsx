'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@prisma/client'
import { 
  Zap, 
  Sparkles, 
  Leaf, 
  Wind, 
  Loader2, 
  ArrowRight,
  RefreshCcw,
  Compass
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'

const moodOptions = [
  { id: 'tired', label: 'Tired', icon: <Zap size={16} /> },
  { id: 'happy', label: 'Happy', icon: <Sparkles size={16} /> },
  { id: 'focused', label: 'Focused', icon: <Leaf size={16} /> },
  { id: 'chill', label: 'Chill', icon: <Wind size={16} /> },
  { id: 'adventurous', label: 'Adventurous', icon: <Compass size={16} /> },
]

export default function AIGuidePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<(Product & { aiExplanation?: string }) | null>(null)
  const [loading, setLoading] = useState(false)
  const { addItem } = useCartStore()

  const fetchRecommendation = async (mood: string) => {
    setLoading(true)
    setSelectedMood(mood)
    try {
      const res = await fetch(`/api/recommendations?mood=${mood}`)
      const data = (await res.json()) as Array<Product & { aiExplanation?: string }>
      // Simulate "thinking" for cinematic effect
      setTimeout(() => {
        setRecommendation(data[0]) 
        setLoading(false)
      }, 1500)
    } catch {
      toast.error("The oracle is silent. Try again.")
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!recommendation) return
    addItem({
      id: recommendation.id,
      name: recommendation.name,
      price: recommendation.price,
      image: recommendation.image,
      quantity: 1,
    })
    toast.success(`${recommendation.name} aligned to your ritual.`)
  }

  return (
    <div className="pt-40 pb-40 px-6 max-w-6xl mx-auto min-h-screen flex flex-col items-center justify-center space-y-24">
      <section className="text-center space-y-10">
        <div className="space-y-4">
          <span className="label-text text-amber-500">AI Coffee Consultation</span>
          <h1 className="hero-title text-white italic capitalize">
            How are you <br /><span className="text-amber-500">feeling today?</span>
          </h1>
        </div>
        <p className="body-text-sm max-w-lg mx-auto italic font-light leading-relaxed">
          Select your current emotional resonance to receive a precision-matched specialty recommendation.
        </p>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 w-full">
        {moodOptions.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => fetchRecommendation(mood.id)}
            className={`group relative p-10 rounded-[3rem] border transition-all duration-700 flex flex-col items-center gap-6 text-center ${
              selectedMood === mood.id 
                ? 'bg-amber-500 border-amber-400 shadow-2xl' 
                : 'bg-zinc-950/50 border-white/5 hover:border-white/10'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              selectedMood === mood.id ? 'bg-black text-amber-500' : 'bg-white/5 text-white/20 group-hover:bg-amber-500 group-hover:text-black'
            }`}>
              {mood.icon}
            </div>
            <span className={`label-text ${
              selectedMood === mood.id ? 'text-black' : 'text-white/40 group-hover:text-white'
            }`}>
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8 py-20"
          >
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
            <p className="label-text text-amber-500 animate-pulse">Scanning Bio-Resonance...</p>
          </motion.div>
        )}

        {recommendation && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-2 group"
          >
             <div className="h-96 md:h-auto overflow-hidden relative border-r border-white/5">
                <img src={recommendation.image} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-12 left-12">
                   <span className="px-6 py-2.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">Matched Archetype</span>
                </div>
             </div>

             <div className="p-16 md:p-20 flex flex-col justify-between space-y-16">
                <div className="space-y-10">
                   <div className="space-y-4">
                     <span className="label-text text-amber-500">{selectedMood} Alignment</span>
                     <h2 className="section-title text-white italic capitalize leading-tight">{recommendation.name}</h2>
                   </div>
                   <p className="body-text italic font-light leading-relaxed border-l border-white/10 pl-10">
                     &ldquo;This selection mirrors your current {selectedMood} state, offering precision-tuned sensory notes to anchor your moment.&rdquo;
                   </p>
                </div>

                <div className="space-y-6 pt-8">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-7 bg-white hover:bg-amber-500 text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-6 transition-all shadow-2xl active:scale-95"
                  >
                    Accept Ritual <ArrowRight size={20} />
                  </button>
                  <button 
                    onClick={() => { setRecommendation(null); setSelectedMood(null); }}
                    className="w-full flex items-center justify-center gap-4 label-text hover:text-white transition-colors py-4 uppercase tracking-[0.4em]"
                  >
                    <RefreshCcw size={12} /> Rescan resonance
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
