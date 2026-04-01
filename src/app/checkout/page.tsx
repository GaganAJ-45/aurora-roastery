'use client'

import React, { useState, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2, AlertCircle, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [formData, setFormData] = useState({
    storeId: '',
    pickupTime: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    promoCode: '',
  })
  const [discount, setDiscount] = useState(0)

  // Pre-fill if needed or redirect
  useEffect(() => {
    if (items.length === 0 && !isCompleted) {
      router.push('/menu')
    }
  }, [isCompleted, items, router])

  const stores = [
    { id: 'indiranagar', name: 'Indiranagar - 100 Feet Rd', time: '15-20 mins' },
    { id: 'koramangala', name: 'Koramangala - 80 Feet Rd', time: '10-15 mins' },
    { id: 'whitefield', name: 'Whitefield - ITPL Main Rd', time: '25-30 mins' },
  ]

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate complex validation
    if (!formData.storeId) return toast.error("Choose your sanctuary (store location).")
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) return toast.error("Card number must be 16 digits.")

    setIsProcessing(true)
    
    // Simulate real-world delay for "premium" feel
    await new Promise(resolve => setTimeout(resolve, 3500))

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
          storeId: formData.storeId,
          totalAmount: totalPrice(),
          status: 'PENDING',
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
        clearCart()
        toast.success("Transaction accepted. Your brew ritual begins soon.")
      } else {
        const payload = await response.json().catch(() => null)

        if (response.status === 409) {
          clearCart()
          toast.error(payload?.error || "Your cart was outdated. Please add your items again.")
          router.push('/menu')
        } else if (response.status === 401) {
          toast.error(payload?.error || "Please sign in again before placing your order.")
          router.push('/login')
        } else {
          toast.error(payload?.error || "Internal connection error. Please try again.")
        }
      }
    } catch {
      toast.error("Something went wrong with the connection.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="pt-40 pb-40 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-pulse"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="font-playfair text-6xl font-black text-white italic">Order Manifested</h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto font-light leading-relaxed">
            Your specialty coffee ritual has been successfully scheduled. We&apos;ll notify you when it&apos;s ready to be savored.
          </p>
        </div>

        <div className="flex gap-6 mt-8">
          <Link href="/profile" className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-amber-400 transition-all">
            View History
          </Link>
          <Link href="/menu" className="px-10 py-4 bg-white/5 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all">
            Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
      {/* Left Wall: Information */}
      <div className="space-y-16">
        <section className="space-y-4">
          <span className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs">Checkout Initiation</span>
          <h1 className="font-playfair text-6xl font-bold text-white italic">Confirm <span className="underline underline-offset-[12px] decoration-white/10">Order</span></h1>
        </section>

        {/* Store Selection */}
        <section className="space-y-8">
          <h2 className="text-white uppercase tracking-widest text-sm font-black flex items-center gap-4">
            <span className="w-8 h-[1px] bg-white/10" /> 1. Select Sanctuary
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {stores.map(store => (
              <button
                key={store.id}
                onClick={() => setFormData({ ...formData, storeId: store.id })}
                className={`p-6 rounded-3xl border text-left transition-all flex justify-between items-center group ${
                  formData.storeId === store.id ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-900/5' : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className={`p-3 rounded-2xl ${formData.storeId === store.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/20 group-hover:text-white'}`}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold">{store.name}</p>
                    <p className="text-white/30 text-xs uppercase tracking-widest mt-1">Ready in ~{store.time}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.storeId === store.id ? 'border-amber-500' : 'border-white/10'}`}>
                  {formData.storeId === store.id && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Mock Payment */}
        <section className="space-y-8">
          <h2 className="text-white uppercase tracking-widest text-sm font-black flex items-center gap-4">
            <span className="w-8 h-[1px] bg-white/10" /> 2. Soul-Transaction
          </h2>
          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <CreditCard size={120} />
            </div>

            <div className="flex items-center gap-3 text-amber-500/80 mb-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">Demo purposes only. Enter any 16-digit card.</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="CARD NUMBER (XXXX XXXX XXXX XXXX)"
                maxLength={19}
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 outline-none focus:border-amber-500 transition-colors uppercase font-mono tracking-widest"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="EXPIRY (MM/YY)"
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 outline-none focus:border-amber-500 transition-colors uppercase font-mono tracking-widest"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 outline-none focus:border-amber-500 transition-colors uppercase font-mono tracking-widest"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h2 className="text-white uppercase tracking-widest text-sm font-black flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-white/10" /> 3. Ritual Bonus (Promo)
            </h2>
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                placeholder="PROMO CODE" 
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 outline-none focus:border-amber-500 transition-colors uppercase font-black tracking-widest text-[10px]"
              />
              <button 
                type="button"
                onClick={() => {
                  if (['WELCOME10', 'AURORA20'].includes(formData.promoCode)) {
                    setDiscount(formData.promoCode === 'WELCOME10' ? 10 : 20)
                    toast.success("Frequency accepted. Discount applied.")
                  } else {
                    toast.error("Frequency conflict. Code invalid.")
                  }
                }}
                className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Right Wall: Summary Sticky */}
      <div className="lg:sticky lg:top-32 h-fit">
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl relative">
          <div className="absolute inset-0 opacity-[0.02] grain pointer-events-none" />
          
          <h2 className="text-2xl font-playfair font-black text-white italic underline underline-offset-8 decoration-white/5">Order Manifest</h2>

          <div className="space-y-6 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mt-1">Qty {item.quantity}</p>
                  </div>
                </div>
                <p className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t border-white/5">
            <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-black text-white/30">
              <span>Ritual Total</span>
              <span>${totalPrice().toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-black text-amber-500/80">
                <span>Resonance Discount</span>
                <span>-${discount === 10 ? (totalPrice() * 0.1).toFixed(2) : (totalPrice() * 0.2).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-black text-white/30">
              <span>Service Fee</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-2xl font-playfair font-black text-white pt-4">
              <span>Balance</span>
              <span className="text-amber-500">${totalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm transition-all relative overflow-hidden flex items-center justify-center ${
              isProcessing ? 'bg-zinc-800 text-white/50 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-black shadow-xl shadow-amber-900/20 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              "Manifest Order"
            )}
          </button>

          <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.3em] leading-relaxed">
            By ordering, you accept the terms of the Aurora Guild. Reward points will be credited upon collection.
          </p>
        </div>
      </div>
    </div>
  )
}
