import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { 
  ShoppingBag,
  Star,
  LogOut,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { store: true, items: { include: { product: true } } }
      },
      rewardHistory: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) return null

  return (
    <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto space-y-16">
      {/* A. Top Section: Identity & Stats */}
      <section className="bg-zinc-950 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
        <div className="absolute inset-0 opacity-[0.02] grain pointer-events-none" />
        
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <img 
            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=fcd34d&color=000&size=200`} 
            alt={user.name || ''} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
           <div>
             <h1 className="text-4xl font-playfair font-black text-white italic tracking-tight">{user.name}</h1>
             <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em] mt-1">{user.email}</p>
           </div>
           <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
             <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
               <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{user.points} Soul-Points</span>
             </div>
             <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 text-white/40">
               <ShoppingBag className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">{user.orders.length} Ritual Scans</span>
             </div>
           </div>
        </div>

        <Link href="/api/auth/signout" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500/40 hover:text-red-500 transition-all p-4">
          Exit Ceremony <LogOut size={14} />
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* B. Orders Section: Clean List */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-playfair font-black text-white italic uppercase tracking-widest">Order Chronicles</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="space-y-6">
            {user.orders.length === 0 ? (
              <p className="text-white/20 italic text-sm">No rituals captured yet.</p>
            ) : (
              user.orders.map(order => (
                <div key={order.id} className="bg-zinc-950 border border-white/5 rounded-3xl p-8 flex justify-between items-center group hover:border-white/10 transition-all">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Batch #{order.id.substring(0, 8)}</p>
                    <h3 className="text-lg font-bold text-white italic font-playfair">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
                    <p className="text-[10px] text-white/30 font-medium">Items: {order.items.map(i => i.product.name).join(', ')}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xl font-playfair font-black text-white">${order.totalAmount.toFixed(2)}</p>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5 ${
                      order.status === 'COMPLETED' ? 'text-green-400' : 'text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* C. Rewards Activity: Simple Timeline */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-playfair font-black text-white italic uppercase tracking-widest">Soul Logs</h2>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="relative space-y-8 pl-6 border-l border-white/5">
            {user.rewardHistory.map(entry => (
              <div key={entry.id} className="relative group">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-amber-500 shadow-xl shadow-amber-500/20" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{entry.points} PTS GAINED</p>
                    <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Today</span>
                  </div>
                  <p className="text-sm text-white/40 italic font-light leading-relaxed">&ldquo;{entry.description}&rdquo;</p>
                </div>
              </div>
            ))}
            {user.rewardHistory.length === 0 && (
              <p className="text-white/20 italic text-sm">Quiet logs.</p>
            )}
          </div>

          <Link href="/rewards" className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
             View Rewards Hub <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
