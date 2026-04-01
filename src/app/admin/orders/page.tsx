'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Loader2, 
  X
} from 'lucide-react'
import { toast } from 'sonner'

type AdminOrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    image: string
  }
}

type AdminOrder = {
  id: string
  status: string
  totalAmount: number
  user: {
    name: string | null
    email: string | null
  }
  store: {
    name: string
  }
  items: AdminOrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = (await res.json()) as AdminOrder[]
      setOrders(data)
    } catch {
      toast.error("Failed to sync dispatch logs.")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (res.ok) {
        toast.success(`Ritual #${id.substring(0,8)} manifest status updated.`)
        fetchOrders()
        if (selectedOrder?.id === id) {
           setSelectedOrder(null)
        }
      }
    } catch {
      toast.error("Status synchronization failed.")
    }
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto space-y-12">
      <section className="space-y-2">
        <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Command Center</span>
        <h1 className="text-6xl font-playfair font-black text-white italic uppercase tracking-tight leading-none underline underline-offset-[24px] decoration-white/5">Order <span className="text-amber-500">Chronicles</span></h1>
      </section>

      {loading ? (
        <div className="py-40 flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px]">Syncing Logs...</p>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.3em] font-black text-white/20">
                  <th className="p-8">Manifest #</th>
                  <th className="p-8">Entity</th>
                  <th className="p-8">Ritual Store</th>
                  <th className="p-8">Items</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Ritual Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order.id} className="group hover:bg-white/5 transition-all cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="p-8 font-mono text-[10px] text-white/40 group-hover:text-amber-500 transition-colors uppercase">#{order.id.substring(0,8)}</td>
                    <td className="p-8">
                       <p className="text-sm font-bold text-white uppercase tracking-widest">{order.user.name}</p>
                       <p className="text-[10px] text-white/20 mt-1">{order.user.email}</p>
                    </td>
                    <td className="p-8 italic font-light text-white/40 text-xs">
                      {order.store.name}
                    </td>
                    <td className="p-8">
                       <span className="text-[10px] font-black text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                         {order.items.length} units
                       </span>
                    </td>
                    <td className="p-8">
                       <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 bg-zinc-900 ${
                         order.status === 'COMPLETED' ? 'text-green-400' : 'text-amber-500 animate-pulse'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="p-8 text-right">
                       <div className="flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => updateStatus(order.id, 'COMPLETED')}
                            className="bg-white/5 hover:bg-green-500 hover:text-black border border-white/10 p-3 rounded-xl text-white/20 transition-all"
                            disabled={order.status === 'COMPLETED'}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Side Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-zinc-950 border-l border-white/10 z-[61] shadow-2xl p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                 <div className="space-y-2">
                   <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[9px]">Ritual Specifics</p>
                   <h2 className="text-3xl font-playfair font-black text-white italic uppercase tracking-tight">Manifest <span className="text-white/20">#{selectedOrder.id.substring(0,8)}</span></h2>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                   <X size={24} />
                 </button>
              </div>

              <div className="space-y-12">
                 <section className="space-y-6">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 pb-4 border-b border-white/5">Ritual Entity</h3>
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl font-black text-amber-500 uppercase">
                          {selectedOrder.user.name?.charAt(0)}
                       </div>
                       <div className="space-y-1">
                          <p className="text-xl font-bold text-white uppercase tracking-widest">{selectedOrder.user.name}</p>
                          <p className="text-xs text-white/30 italic font-light">{selectedOrder.user.email}</p>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 pb-4 border-b border-white/5">Ritual Content</h3>
                    <div className="space-y-4">
                       {selectedOrder.items.map((item) => (
                         <div key={item.id} className="flex justify-between items-center group">
                            <div className="flex gap-4 items-center">
                               <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all">
                                  <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white uppercase tracking-widest">{item.product.name}</p>
                                  <p className="text-[10px] text-white/20">Quantity: {item.quantity}</p>
                               </div>
                            </div>
                            <p className="text-white/60 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                         </div>
                       ))}
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Total Souls Exchanged</p>
                          <p className="text-4xl font-playfair font-black text-white italic underline underline-offset-8 decoration-amber-500/20">${selectedOrder.totalAmount.toFixed(2)}</p>
                       </div>
                       <div className="text-right space-y-2">
                          <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Soul-Warming Earned: +{Math.floor(selectedOrder.totalAmount)} PTS</p>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 pb-4 border-b border-white/5">Dispatch Ritual</h3>
                    <div className="flex flex-col gap-4">
                       <button 
                         onClick={() => updateStatus(selectedOrder.id, 'PREPARING')}
                         className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] transition-all border ${
                           selectedOrder.status === 'PREPARING' ? 'bg-amber-500 border-amber-400 text-black shadow-2xl' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                         }`}
                       >
                         Commence Preparation
                       </button>
                       <button 
                         onClick={() => updateStatus(selectedOrder.id, 'READY')}
                         className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] transition-all border ${
                           selectedOrder.status === 'READY' ? 'bg-indigo-500 border-indigo-400 text-white shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                         }`}
                       >
                         Signal Ready for Pickup
                       </button>
                       <button 
                         onClick={() => updateStatus(selectedOrder.id, 'COMPLETED')}
                         className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] transition-all border ${
                           selectedOrder.status === 'COMPLETED' ? 'bg-green-500 border-green-400 text-black shadow-2xl' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                         }`}
                       >
                         Consummate Ritual
                       </button>
                    </div>
                 </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
