import { prisma } from '@/lib/prisma'
import { MapPin, Clock, Navigation, Star, Coffee } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LocationsPage() {
  const stores = await prisma.store.findMany()

  return (
    <div className="pt-40 pb-40 px-6 max-w-7xl mx-auto space-y-32">
      {/* Header */}
      <section className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 opacity-10 blur-[120px] w-80 h-80 bg-amber-500 rounded-full" />
        <h1 className="hero-title text-white">
          Our <span className="text-amber-500">Sanctuaries</span>
        </h1>
        <p className="body-text-sm max-w-xl mx-auto italic font-light tracking-wide">
          Spaces designed for architectural pause and coffee-infused silence. <br />
          Experience the Aurora ritual at any of our Bangalore locations.
        </p>
      </section>

      {/* Locations Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {stores.map((store) => (
          <div key={store.id} className="bg-zinc-950 border border-white/5 rounded-[3.5rem] p-12 space-y-12 group transition-all hover:border-white/10 hover:bg-zinc-950/80">
            <div className="space-y-6">
                <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center text-white/20 group-hover:text-amber-500 transition-all duration-700">
                   <MapPin size={36} />
                </div>
                <div className="space-y-3">
                  <h2 className="card-title text-white italic capitalize group-hover:text-amber-500 transition-colors">{store.name}</h2>
                  <p className="body-text-sm italic leading-relaxed h-12">{store.address}</p>
                </div>
            </div>

            <div className="space-y-8 pt-10 border-t border-white/5">
               <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500/40">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="label-text text-white/20">Operational Hours</p>
                      <p className="text-sm font-bold text-white uppercase tracking-widest mt-0.5">{store.hours}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500/40">
                      <Star size={16} />
                    </div>
                    <div>
                      <p className="label-text text-white/20">Collective Rating</p>
                      <p className="text-sm font-bold text-white uppercase tracking-widest mt-0.5">4.9 / 5.0 Precision</p>
                    </div>
                  </div>
               </div>

               <a 
                 href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full bg-white hover:bg-amber-500 text-black py-6 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl"
               >
                 <Navigation size={14} fill="currentColor" />
                 Get Directions
               </a>
            </div>
          </div>
        ))}
      </section>

      {/* Narrative Map View */}
      <section className="w-full h-[600px] rounded-[4rem] overflow-hidden border border-white/5 relative group bg-black shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=2000" 
            alt="Bangalore Map" 
            className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[4000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-center gap-8 p-12 text-center">
             <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 ritual-pulse">
                <MapPin size={48} />
             </div>
             <div className="space-y-4">
               <h2 className="section-title text-white italic">The Bangalore Network</h2>
               <p className="label-text tracking-[0.6em]">Scaling Specialty Frequencies</p>
             </div>
          </div>
      </section>
    </div>
  )
}
