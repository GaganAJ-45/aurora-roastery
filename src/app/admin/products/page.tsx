'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'

type AdminProduct = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  intensity: number
  moodTags: string[]
  isAvailable?: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'COFFEE',
    intensity: 3,
    moodTags: [] as string[]
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = (await res.json()) as AdminProduct[]
      setProducts(data)
    } catch {
      toast.error("Failed to sync ritual archives.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingProduct ? 'PUT' : 'POST'
    const body = editingProduct ? { ...formData, id: editingProduct.id } : formData

    try {
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, price: parseFloat(body.price as string) }),
      })

      if (res.ok) {
        toast.success(editingProduct ? "Ritual updated." : "New ritual manifest created.")
        setIsModalOpen(false)
        setEditingProduct(null)
        fetchProducts()
      } else {
        toast.error("Manifest rejected. Check frequencies.")
      }
    } catch {
      toast.error("Transmission error.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this ritual archive?")) return
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        const result = await res.json()
        toast.success(result.mode === 'archived' ? "Ritual archived because it is used in past orders." : "Ritual terminated.")
        fetchProducts()
      } else {
        toast.error("Termination failed.")
      }
    } catch {
      toast.error("Termination failed.")
    }
  }

  const openEdit = (product: AdminProduct) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      intensity: product.intensity,
      moodTags: product.moodTags
    })
    setIsModalOpen(true)
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Command Center</span>
          <h1 className="text-6xl font-playfair font-black text-white italic uppercase tracking-tight leading-none underline underline-offset-[24px] decoration-white/5">Ritual <span className="text-amber-500">Archives</span></h1>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', image: '', category: 'COFFEE', intensity: 3, moodTags: [] }); setIsModalOpen(true); }}
          className="bg-white text-black px-10 py-4 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all shadow-2xl active:scale-95"
        >
          <Plus size={16} /> Forge New Ritual
        </button>
      </section>

      {/* Product Table */}
      <div className="bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Archives...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.3em] font-black text-white/20">
                  <th className="p-8">Visual</th>
                  <th className="p-8">Ritual Name</th>
                  <th className="p-8">Category</th>
                  <th className="p-8">Price</th>
                  <th className="p-8">Intensity</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(product => (
                  <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-8">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700">
                         <img src={product.image} className="w-full h-full object-cover" alt="" />
                       </div>
                    </td>
                    <td className="p-8">
                       <p className="font-playfair text-xl font-black text-white italic group-hover:text-amber-500 transition-colors uppercase tracking-tight">{product.name}</p>
                       <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">ID: {product.id.substring(0,8)}</p>
                    </td>
                    <td className="p-8">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                        {product.category}
                      </span>
                      {product.isAvailable === false && (
                        <span className="ml-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest text-amber-500">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="p-8 font-black text-white text-lg">${product.price.toFixed(2)}</td>
                    <td className="p-8">
                       <div className="flex gap-1">
                         {[1,2,3,4,5].map(i => (
                           <div key={i} className={`w-1 h-1 rounded-full ${i <= product.intensity ? 'bg-amber-500' : 'bg-white/10'}`} />
                         ))}
                       </div>
                    </td>
                    <td className="p-8">
                       <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => openEdit(product)} className="p-3 bg-white/5 hover:bg-amber-500 hover:text-black rounded-xl text-white/40 transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-3 bg-white/5 hover:bg-red-500 hover:text-black rounded-xl text-white/40 transition-all">
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="fixed inset-0 m-auto w-[90%] max-w-2xl h-fit bg-zinc-950 border border-white/10 rounded-[3.5rem] p-12 z-[61] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.03] grain pointer-events-none" />
              
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-playfair font-black text-white italic uppercase tracking-tight leading-none">
                   {editingProduct ? "Refine Ritual" : "Forge Ritual"}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Ritual Title</label>
                       <input 
                         required
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50 transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Soul-Cost ($)</label>
                       <input 
                         required
                         type="number"
                         step="0.01"
                         value={formData.price}
                         onChange={e => setFormData({...formData, price: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-amber-500/50 transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Manifestation Narrative</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium italic outline-none focus:border-amber-500/50 transition-all resize-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Visual Archetype (URL)</label>
                       <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-amber-500/50 transition-all">
                          <ImageIcon className="text-white/20" size={18} />
                          <input 
                            required
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                            className="w-full bg-transparent outline-none text-white text-xs font-bold"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Category Cluster</label>
                       <select 
                         value={formData.category}
                         onChange={e => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black uppercase tracking-widest text-[10px] outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                       >
                         <option value="COFFEE">COFFEE</option>
                         <option value="FOOD">FOOD</option>
                         <option value="MERCHANDISE">MERCHANDISE</option>
                         <option value="SEASONAL">SEASONAL</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-widest text-white/20">Ritual Intensity</label>
                       <div className="flex gap-3">
                          {[1,2,3,4,5].map(i => (
                            <button 
                              key={i} 
                              type="button"
                              onClick={() => setFormData({...formData, intensity: i})}
                              className={`w-10 h-2 rounded-full transition-all ${i <= formData.intensity ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-white/5'}`}
                            />
                          ))}
                       </div>
                    </div>
                    <button 
                      type="submit"
                      className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-amber-400 transition-all shadow-2xl active:scale-95"
                    >
                      Store manifest
                    </button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
