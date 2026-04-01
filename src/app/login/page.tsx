'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Coffee, Lock, Mail, User, Loader2, ShieldCheck, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (res?.error) {
          toast.error("Invalid credentials. Please try again.")
        } else {
          toast.success("Welcome back.")
          router.push('/')
          router.refresh()
        }
      } else {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (res.ok) {
          toast.success("Account created. Please sign in.")
          setIsLogin(true)
        } else {
          const data = await res.json()
          toast.error(data.error || "Registration failed.")
        }
      }
    } catch (err) {
      toast.error("Connection error. Try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0A0705] z-[1000] flex items-center justify-center p-8 overflow-y-auto">
      <div className="absolute inset-0 opacity-[0.03] grain pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-950 border border-white/5 rounded-[4rem] p-16 space-y-16 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-150 rotate-12 -z-10 text-white">
          <Coffee size={300} fill="currentColor" />
        </div>

        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center gap-4 group">
            <div className="w-14 h-14 bg-white text-black rounded-3xl flex items-center justify-center transition-all group-hover:bg-amber-500 group-hover:rotate-6">
              <Coffee size={32} />
            </div>
          </Link>
          <div className="space-y-4">
            <h1 className="section-title text-white italic capitalize leading-none">{isLogin ? "Welcome Back" : "Join The Collective"}</h1>
            <p className="label-text">Secure Access Portal — Protocol v2.5</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-5 focus-within:border-white/20 transition-all">
              <User className="text-white/20" size={20} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent outline-none text-white text-sm font-medium tracking-wide placeholder:text-white/10"
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-5 focus-within:border-white/20 transition-all">
            <Mail className="text-white/20" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-transparent outline-none text-white text-sm font-medium tracking-wide placeholder:text-white/10"
            />
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-5 focus-within:border-white/20 transition-all">
            <Lock className="text-white/20" size={20} />
            <input 
              type="password" 
              placeholder="Private Key (Password)" 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-transparent outline-none text-white text-sm font-medium tracking-wide placeholder:text-white/10"
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full py-7 bg-white hover:bg-amber-500 text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95 disabled:opacity-50 mt-12"
          >
            {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (isLogin ? "Enter Collective" : "Initialize Link")}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="text-center space-y-8">
          <p className="label-text">
            {isLogin ? "New to Aurora? " : "Already recognized? "} 
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-amber-500 hover:underline underline-offset-4"
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>

          <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-[0.4em] text-white/10">
            <ShieldCheck size={14} className="text-green-500/40" /> Resonance Encryption Active
          </div>
        </div>
      </motion.div>
    </div>
  )
}
