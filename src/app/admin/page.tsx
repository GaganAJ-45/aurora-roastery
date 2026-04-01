'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Coffee, 
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type AdminOrder = {
  id: string
  totalAmount: number
  status: string
  user: {
    name: string | null
  }
  store: {
    name: string
  }
}

type AdminStats = {
  userCount: number
  orderCount: number
  productCount: number
  orders: AdminOrder[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then((json: AdminStats) => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-black">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
        <p className="text-white/20 text-xs font-black uppercase tracking-[0.5em]">Syncing Command Center...</p>
      </div>
    )
  }

  if (!data) return null

  const { userCount, orderCount, productCount, orders } = data
  const mockRevenue = 5420.50

  const stats = [
    { label: 'Total Revenue', value: `$${mockRevenue.toLocaleString()}`, icon: <DollarSign />, color: 'text-green-400', trend: '+12.5%' },
    { label: 'Active Orders', value: orderCount, icon: <ShoppingBag />, color: 'text-amber-400', trend: '+3.2%' },
    { label: 'Aurora Members', value: userCount, icon: <Users />, color: 'text-indigo-400', trend: '+8.1%' },
    { label: 'Brews Catalog', value: productCount, icon: <Coffee />, color: 'text-rose-400', trend: '+2 new' },
  ]

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Command Center</span>
          <h1 className="font-playfair text-6xl font-black text-white italic tracking-tight uppercase leading-none underline underline-offset-[24px] decoration-white/5">Aurora Admin</h1>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/users" className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
             Manage Members
           </Link>
           <Link href="/admin/products" className="bg-white text-black px-8 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all shadow-xl active:scale-95">
             Manage Rituals
           </Link>
           <Link href="/admin/orders" className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
             Order Log
           </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] space-y-4 group hover:border-amber-500/30 transition-all shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-45">
                {stat.icon}
             </div>
             
             <div className="flex justify-between items-start">
               <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  {stat.icon}
               </div>
               <span className="text-[9px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">{stat.trend}</span>
             </div>

             <div className="space-y-1">
               <p className="text-[9px] uppercase tracking-widest font-black text-white/30">{stat.label}</p>
               <p className="text-4xl font-playfair font-black text-white italic tracking-tighter">{stat.value}</p>
             </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 bg-zinc-950 border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-playfair font-black text-white italic uppercase bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent underline underline-offset-8 decoration-white/5">Recent Transmissions</h2>
               <Link href="/admin/orders" className="text-[9px] font-black uppercase tracking-widest text-amber-500 hover:underline">View Dispatch Log</Link>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] font-black text-white/20">
                     <th className="pb-6 px-4">Order ID</th>
                     <th className="pb-6 px-4">Entity</th>
                     <th className="pb-6 px-4">Sanctuary</th>
                     <th className="pb-6 px-4">Balance</th>
                     <th className="pb-6 px-4">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {orders.map((order) => (
                     <tr key={order.id} className="group hover:bg-white/5 transition-all duration-500 cursor-pointer">
                       <td className="py-6 px-4 text-[10px] font-mono text-white/40 group-hover:text-amber-500 transition-colors">#{order.id.substring(0, 8)}</td>
                       <td className="py-6 px-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-white/50 border border-white/10 uppercase group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-all">
                             {order.user.name?.charAt(0)}
                           </div>
                           <span className="text-sm font-bold text-white transition-colors group-hover:text-amber-400">{order.user.name}</span>
                         </div>
                       </td>
                       <td className="py-6 px-4 text-xs font-medium text-white/20 italic">{order.store.name}</td>
                       <td className="py-6 px-4 text-sm font-black text-white">${order.totalAmount.toFixed(2)}</td>
                       <td className="py-6 px-4">
                         <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5 bg-zinc-900 group-hover:border-amber-500/20 ${
                           order.status === 'COMPLETED' ? 'text-green-400' : 'text-amber-500'
                         }`}>
                           {order.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
        </section>

        <section className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-playfair font-black text-white italic underline underline-offset-8 decoration-white/5">Mood Resonance</h2>
            <div className="space-y-6">
               {[
                 { mood: 'Tired', stat: '45%', color: 'bg-rose-500' },
                 { mood: 'Focused', stat: '32%', color: 'bg-indigo-500' },
                 { mood: 'Adventurous', stat: '12%', color: 'bg-amber-500' },
                 { mood: 'Chill', stat: '11%', color: 'bg-zinc-500' },
               ].map(m => (
                 <div key={m.mood} className="space-y-2">
                   <div className="flex justify-between text-[10px] uppercase tracking-widest font-black text-white/30">
                     <span>{m.mood}</span>
                     <span>{m.stat}</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: m.stat }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className={`h-full ${m.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`} 
                      />
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="pt-8 border-t border-white/5">
                <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl space-y-3">
                   <div className="flex items-center gap-2 text-amber-500">
                     <TrendingUp size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Growth Opportunity</span>
                   </div>
                   <p className="text-xs text-white/60 font-light leading-relaxed italic">
                     &ldquo;Tired&rdquo; resonance is high. Recommend pushing High Intensity cold brew campaigns this week.
                   </p>
                </div>
            </div>
        </section>
      </div>
    </div>
  )
}
