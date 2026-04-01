'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  User, 
  House,
  History, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  Zap,
  Coffee,
  ChevronDown
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useSession, signOut } from 'next-auth/react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Locations', href: '/locations' },
  { name: 'Rewards', href: '/rewards' },
  { name: 'AI Guide', href: '/ai-guide' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const pathname = usePathname()
  const { data: session } = useSession()
  const { items, removeItem, updateQuantity } = useCartStore()
  const { scrollYProgress } = useScroll()
  
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const displayName = session?.user?.name?.split(' ')[0] || 'Guest'
  const profileTone = session?.user?.role === 'ADMIN' ? 'Command Center Access' : 'Guild Member Active'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6 transition-all duration-700">
        <motion.div 
           className="pointer-events-none absolute top-0 left-0 h-[2px] bg-amber-500 z-[60]"
           style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-3 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[1.75rem] lg:rounded-[2.5rem] px-3 py-3 sm:px-4 lg:px-8 lg:py-4 shadow-2xl">
          
          <Link href="/" className="relative z-20 flex items-center gap-3 group">
             <div className="pointer-events-none absolute inset-0 bg-amber-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="w-10 h-10 bg-white text-black rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-amber-500 z-10">
                <Coffee size={24} />
             </div>
             <span className="text-lg sm:text-xl lg:text-2xl font-playfair font-black text-white italic uppercase tracking-tighter leading-none z-10">Aurora</span>
          </Link>

          {/* Desktop Nav */}
          <div className="relative z-20 hidden lg:flex items-center gap-10">
             {navLinks.map((link) => (
               <Link 
                 key={link.href} 
                 href={link.href}
                 className={`relative inline-flex pointer-events-auto text-[10px] font-black uppercase tracking-[0.4em] transition-all group ${
                   pathname === link.href ? 'text-amber-500' : 'text-white/40 hover:text-white'
                 }`}
               >
                 {link.name}
                 <span className={`absolute -bottom-2 left-0 h-[1.5px] bg-amber-500 transition-all duration-500 ${
                   pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                 }`} />
               </Link>
             ))}
          </div>

          <div className="relative z-20 flex items-center gap-2 sm:gap-3 lg:gap-6">
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative min-h-[44px] min-w-[44px] p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all group"
            >
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-lg border-2 border-black">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
               <button 
                 onMouseEnter={() => setIsProfileOpen(true)}
                 onClick={() => setIsProfileOpen(!isProfileOpen)}
                 className={`flex items-center gap-2 rounded-[1.1rem] lg:rounded-[1.35rem] border transition-all ${
                   session
                     ? 'bg-gradient-to-r from-white/6 via-white/4 to-amber-500/10 border-white/10 hover:border-amber-500/30 hover:bg-white/10 pl-2 pr-2.5 py-2 lg:pr-3 shadow-[0_10px_40px_rgba(0,0,0,0.25)] min-h-[44px]'
                     : 'p-1.5 bg-white/5 border-white/10 rounded-2xl hover:bg-white/10 min-h-[44px]'
                 }`}
               >
                 <div className="w-8 h-8 rounded-[14px] bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black shadow-xl overflow-hidden">
                   {session?.user?.image ? (
                     <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <User size={16} />
                   )}
                 </div>
                 {session && (
                   <div className="hidden xl:flex flex-col items-start leading-none min-w-[132px]">
                     <span className="text-[9px] font-black uppercase tracking-[0.35em] text-amber-500/80">
                       Welcome Back
                     </span>
                     <span className="mt-1 text-sm font-bold text-white">
                       {displayName}
                     </span>
                     <span className="mt-1 inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                       {profileTone}
                     </span>
                   </div>
                 )}
                 <ChevronDown size={14} className={`text-white/30 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
               </button>

               <AnimatePresence>
                 {isProfileOpen && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     onMouseLeave={() => setIsProfileOpen(false)}
                     className="absolute right-0 mt-4 w-[min(20rem,calc(100vw-1.5rem))] bg-zinc-950 border border-white/10 rounded-[2rem] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[60] overflow-hidden"
                   >
                     <div className="absolute inset-0 opacity-[0.03] grain pointer-events-none" />
                     
                     <div className="space-y-1">
                       {session ? (
                         <>
                           <div className="mb-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/6 via-transparent to-amber-500/10 p-4">
                             <div className="flex items-start gap-3">
                               <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black shadow-xl overflow-hidden flex-shrink-0">
                                 {session.user?.image ? (
                                   <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                                 ) : (
                                   <User size={18} />
                                 )}
                               </div>
                               <div className="min-w-0 space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-500">Recognized Entity</p>
                                 <p className="text-white text-base font-bold truncate">{session.user?.name}</p>
                                 <div className="flex items-center gap-2">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                   <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                                     {profileTone}
                                   </p>
                                 </div>
                               </div>
                             </div>
                             <div className="mt-4 grid grid-cols-2 gap-2">
                               <div className="rounded-2xl border border-white/8 bg-black/30 px-3 py-3">
                                 <p className="text-[8px] font-black uppercase tracking-[0.24em] text-white/20">Status</p>
                                 <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                                   {session.user?.role === 'ADMIN' ? 'Admin' : 'Member'}
                                 </p>
                               </div>
                               <div className="rounded-2xl border border-white/8 bg-black/30 px-3 py-3">
                                 <p className="text-[8px] font-black uppercase tracking-[0.24em] text-white/20">Cart</p>
                                 <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                                   {totalItems} item{totalItems === 1 ? '' : 's'}
                                 </p>
                               </div>
                             </div>
                           </div>

                          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-white/60 hover:text-black transition-all group">
                            <History size={16} className="group-hover:rotate-12 duration-300" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ritual History</span>
                          </Link>

                          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-white/60 hover:text-black transition-all group">
                            <House size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Home</span>
                          </Link>

                           {session.user?.role === 'ADMIN' && (
                             <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-500 text-white/60 hover:text-black transition-all group">
                               <ShieldCheck size={16} />
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Command Center</span>
                             </Link>
                           )}

                           <Link href="/rewards" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-white/60 hover:text-black transition-all group">
                             <Zap size={16} />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Soul Points</span>
                           </Link>

                           <button 
                             onClick={() => signOut()}
                             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all group mt-2 border-t border-white/5 pt-4 text-left"
                           >
                             <LogOut size={16} />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Ceremony</span>
                           </button>
                         </>
                       ) : (
                         <>
                           <Link href="/login" className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white text-black transition-all group shadow-xl">
                             <LogIn size={16} />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initiate Link</span>
                           </Link>
                           <p className="px-4 pt-4 text-[8px] font-black uppercase tracking-[0.3em] text-white/20 text-center leading-relaxed">
                             Connect your essence for <span className="text-amber-500">1.5x points</span> today.
                           </p>
                         </>
                       )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <button 
              className="lg:hidden min-h-[44px] min-w-[44px] p-3 bg-white/5 rounded-2xl text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-zinc-950 border-l border-white/10 z-[101] p-5 sm:p-7 lg:p-12 flex flex-col shadow-2xl"
            >
               <div className="absolute inset-0 opacity-[0.02] grain pointer-events-none" />
               
               <div className="flex justify-between items-center mb-8 sm:mb-12 lg:mb-16 relative gap-4">
                  <div className="space-y-2">
                    <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[9px]">Your Manifestation</p>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-black text-white italic uppercase tracking-tighter">Luxury <span className="text-white/20">Cart</span></h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                    <X size={24} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-12">
                       <ShoppingBag size={80} strokeWidth={1} className="text-white/5" />
                        <div className="text-center space-y-4">
                          <p className="section-title text-white italic">Your ritual hasn&apos;t <br /><span className="text-white/20">started yet</span></p>
                          <Link href="/menu" onClick={() => setIsCartOpen(false)} className="label-text text-amber-500 hover:text-white transition-all underline underline-offset-8">Browse Menu</Link>
                       </div>
                    </div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="flex gap-3 sm:gap-4 lg:gap-6 group hover:translate-x-2 transition-transform duration-500">
                         <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex-shrink-0">
                           <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                         </div>
                         <div className="flex-1 py-1 space-y-3">
                            <div className="flex justify-between">
                               <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">{item.name}</h3>
                               <p className="text-sm font-black text-white/40 font-playfair italic">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                               <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl min-h-[44px]">
                                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-white/20 hover:text-white">-</button>
                                  <span className="text-[10px] font-black text-white">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/20 hover:text-white">+</button>
                               </div>
                               <button onClick={() => removeItem(item.id)} className="text-[9px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest transition-colors">Terminate</button>
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>

               {items.length > 0 && (
                 <div className="mt-12 pt-12 border-t border-white/5 space-y-8 relative">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Total Souls Exchanged</p>
                         <p className="text-5xl font-playfair font-black text-white italic tracking-tighter leading-none">${totalAmount.toFixed(2)}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest transition-all hover:tracking-[0.3em]">PROMO-2026 ACTIVE</p>
                       </div>
                    </div>
                    
                    <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="w-full min-h-[48px] py-4 sm:py-5 bg-white hover:bg-amber-500 text-black rounded-3xl font-black uppercase tracking-[0.24em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95">
                      Confirm Ritual <Zap size={18} />
                    </Link>
                 </div>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[49] bg-black/95 backdrop-blur-xl px-6 py-24 lg:hidden flex flex-col gap-6"
          >
            <div className="space-y-3 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-3xl border px-5 py-4 min-h-[44px] text-2xl sm:text-3xl font-playfair font-black italic tracking-tight uppercase transition-all ${
                    pathname === link.href ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'text-white/70 border-white/10 bg-white/[0.03]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto grid gap-3">
              {session ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="min-h-[44px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-black uppercase tracking-[0.22em] text-white/80">
                    Profile
                  </Link>
                  <Link href="/rewards" onClick={() => setIsOpen(false)} className="min-h-[44px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-black uppercase tracking-[0.22em] text-white/80">
                    Rewards
                  </Link>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="min-h-[44px] rounded-2xl bg-white px-4 py-3 text-center text-sm font-black uppercase tracking-[0.22em] text-black">
                  Initiate Link
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
