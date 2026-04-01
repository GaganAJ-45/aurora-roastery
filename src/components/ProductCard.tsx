'use client'

import type React from 'react'
import { Product } from '@prisma/client'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { Plus, Sparkles, Zap, Leaf, Wind } from 'lucide-react'
import { toast } from 'sonner'

const moodIcon: Record<string, React.ReactNode> = {
  tired: <Zap className="w-3 h-3" />,
  happy: <Sparkles className="w-3 h-3" />,
  focused: <Leaf className="w-3 h-3" />,
  chill: <Wind className="w-3 h-3" />,
  adventurous: <Sparkles className="w-3 h-3" />,
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast.success(`${product.name} added to your ritual!`, {
      description: "Ready to warm your soul.",
      className: "bg-zinc-900 border-white/10 text-white",
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:bg-zinc-900/50 hover:border-amber-500/30"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10 opacity-60" />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Category Tag */}
        <div className="absolute top-6 left-6 z-20">
          <span className="bg-black/60 backdrop-blur-md text-white/70 text-[10px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full border border-white/10">
            {product.category}
          </span>
        </div>

        {/* Mood Tags */}
        <div className="absolute bottom-6 left-6 z-20 flex gap-2">
          {product.moodTags.map((tag) => (
            <div key={tag} className="flex items-center gap-1.5 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              {moodIcon[tag] || <Sparkles className="w-3 h-3" />}
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="font-playfair text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <span className="text-xl font-medium text-white/50">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-white/40 leading-relaxed font-light italic">
          &ldquo;{product.description}&rdquo;
        </p>

        <div className="flex items-center justify-between pt-4 mt-auto">
          {/* Intensity Level (Dots) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Intensity</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i <= product.intensity ? 'bg-amber-500' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-white hover:bg-amber-400 text-black px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add To Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}
