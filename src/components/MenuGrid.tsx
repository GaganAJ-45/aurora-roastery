'use client'

import React, { useState } from 'react'
import { Product } from '@prisma/client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'

export default function MenuGrid({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { addItem } = useCartStore()

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast.success(`${product.name} captured.`)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 max-w-7xl mx-auto">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layoutId={`product-${product.id}`}
            onClick={() => setSelectedProduct(product)}
            className="group cursor-pointer bg-zinc-950/50 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:border-white/10"
          >
            <div className="relative h-64 overflow-hidden">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
               />
               <div className="absolute top-6 left-6 flex gap-2">
                 {product.moodTags.slice(0, 1).map(tag => (
                   <span key={tag} className="px-4 py-1.5 bg-white/5 backdrop-blur-md text-white/40 text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>

            <div className="p-10 space-y-4">
               <div className="flex justify-between items-start">
                  <h3 className="card-title text-white group-hover:text-amber-500 transition-colors capitalize">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-white/40 font-playfair italic">${product.price.toFixed(2)}</p>
               </div>
               
               <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                     <span className="label-text text-white/20">Intensity {product.intensity}/5</span>
                  </div>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="p-4 bg-white hover:bg-amber-500 rounded-2xl text-black transition-all active:scale-90"
                  >
                    <Plus size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
            />
            <motion.div
              layoutId={`product-${selectedProduct.id}`}
              className="fixed inset-0 m-auto w-[95%] max-w-5xl h-fit max-h-[90vh] bg-zinc-950 border border-white/10 rounded-[4rem] overflow-hidden z-[101] shadow-2xl overflow-y-auto"
            >
               <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="h-96 md:h-auto border-r border-white/5">
                   <img src={selectedProduct.image} className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0" alt="" />
                 </div>

                 <div className="p-12 md:p-20 relative">
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="absolute top-10 right-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/20 hover:text-white transition-all"
                    >
                      <X size={24} />
                    </button>

                    <div className="space-y-12">
                       <div className="space-y-4">
                         <span className="label-text text-amber-500">{selectedProduct.category} Ritual</span>
                         <h2 className="hero-title text-white italic capitalize leading-none">
                           {selectedProduct.name}
                         </h2>
                       </div>

                       <p className="text-lg italic text-white/40 font-light border-l border-white/10 pl-8 leading-relaxed">
                         &ldquo;{selectedProduct.description}&rdquo;
                       </p>

                       <div className="grid grid-cols-2 gap-8 pt-6">
                          <div className="space-y-3">
                             <span className="label-text text-white/20">Ritual Mapping</span>
                             <div className="flex gap-2">
                               {selectedProduct.moodTags.map(tag => (
                                 <span key={tag} className="text-[10px] uppercase font-black tracking-widest text-amber-500">{tag}</span>
                               ))}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <span className="label-text text-white/20">Souls Exchanged</span>
                             <p className="text-3xl font-playfair font-black text-white italic leading-none">${selectedProduct.price.toFixed(2)}</p>
                          </div>
                       </div>

                       <button 
                         onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                         className="w-full py-7 bg-white hover:bg-amber-500 text-black rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-6 transition-all shadow-2xl active:scale-95 translate-y-4"
                       >
                         Lock in Ritual <ShoppingBag size={20} />
                       </button>
                    </div>
                 </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
