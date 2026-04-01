'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Star, Coffee, Gift, Percent, Trophy, ChevronRight, Zap, Leaf } from 'lucide-react'

type Reward = {
  id: string
  name: string
  pts: number
  icon: LucideIcon
  desc: string
}

export default function RewardsPage() {
  // Mock points for demo (in production, fetch from user model)
  const userPoints = 150 
  const nextTier = 500
  const progress = (userPoints / nextTier) * 100

  const tiers = [
    { name: 'Bronze', range: '0-100', icon: <Leaf className="w-5 h-5" />, color: 'bg-orange-800' },
    { name: 'Silver', range: '101-500', icon: <Zap className="w-5 h-5" />, color: 'bg-zinc-400' },
    { name: 'Gold', range: '501+', icon: <Trophy className="w-5 h-5" />, color: 'bg-amber-400' },
  ]

  const rewards: Reward[] = [
    { id: 'drink', name: 'Free Specialty Drink', pts: 50, icon: Coffee, desc: 'Any drink of your choice, any size.' },
    { id: 'pastry', name: 'Free French Pastry', pts: 30, icon: Gift, desc: 'Our handmade croissants or baguettes.' },
    { id: 'discount', name: '20% Off Your Order', pts: 100, icon: Percent, desc: 'Valid for your entire purchase.' },
  ]

  return (
    <div className="pt-40 pb-40 px-6 max-w-7xl mx-auto space-y-24">
      {/* Header */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-10 blur-[120px] w-96 h-96 bg-amber-500 rounded-full" />
        <h1 className="hero-title text-white">
          Aurora <span className="text-amber-500 italic">Rewards</span>
        </h1>
        <p className="body-text-sm max-w-lg mx-auto italic font-light">
          The art of loyalty. Every sip brings you closer to exclusive perks and premium membership experiences.
        </p>
      </section>

      {/* Points & Progress */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-zinc-950/50 border border-white/5 rounded-[4rem] p-16 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-150 rotate-12 -z-10 text-white">
          <Star size={300} fill="currentColor" />
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <span className="label-text text-amber-500">Membership Balance</span>
            <div className="flex items-end gap-3">
              <span className="text-8xl font-playfair font-black text-white italic tracking-tighter">{userPoints}</span>
              <span className="text-2xl font-bold text-white/20 mb-5 tracking-widest">PTS</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center label-text">
              <span>Tier Progress: Silver</span>
              <span>Next Life: Gold ({nextTier} PTS)</span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-4">
          <h3 className="label-text flex items-center gap-4">
            <span className="w-12 h-[1px] bg-white/10" /> Active Membership Perks
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex items-center justify-between group hover:border-amber-500/30 transition-all">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">1.2x Point Multiplier</p>
                  <p className="label-text mt-1">Tier: Silver Member</p>
                </div>
              </div>
              <ChevronRight className="text-white/10 group-hover:text-amber-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Grid */}
      <section className="space-y-16">
        <h2 className="section-title text-white text-center italic tracking-tight">Available <span className="text-amber-500">Rewards</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-zinc-950 border border-white/5 rounded-[3rem] p-12 space-y-8 group hover:border-white/10 transition-all relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full" />
               
               <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-amber-500 transition-all duration-700">
                  <reward.icon size={40} />
                </div>
               
               <div className="space-y-3">
                 <h3 className="card-title text-white italic">{reward.name}</h3>
                 <p className="body-text-sm italic leading-relaxed">{reward.desc}</p>
               </div>

               <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-black text-3xl">{reward.pts}</span>
                    <span className="label-text text-white/20">PTS</span>
                  </div>
                  <button 
                  disabled={userPoints < reward.pts}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    userPoints >= reward.pts ? 'bg-white text-black hover:bg-amber-400' : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}>
                    Redeem
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers Explanation */}
      <section className="space-y-16 bg-zinc-950/50 border border-white/5 rounded-[4rem] p-16">
        <h2 className="section-title text-center text-white italic">Tier <span className="text-white/20">Hierarchy</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {tiers.map(tier => (
                <div key={tier.name} className="space-y-8 group">
                   <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-black shadow-2xl transition-transform group-hover:scale-110 duration-700 ${tier.color}`}>
                      {tier.icon}
                   </div>
                   <div className="space-y-3">
                     <h3 className="card-title text-white uppercase tracking-[0.2em]">{tier.name}</h3>
                     <p className="label-text">{tier.range} PTS Required</p>
                   </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  )
}
