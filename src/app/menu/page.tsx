import Link from 'next/link'
import { Category } from '@prisma/client'
import { Coffee } from 'lucide-react'
import MenuGrid from '@/components/MenuGrid'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mood?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const normalizedCategory = resolvedSearchParams.category?.toUpperCase()
  const category = Object.values(Category).includes(normalizedCategory as Category)
    ? (normalizedCategory as Category)
    : undefined
  const mood = resolvedSearchParams.mood?.toLowerCase()

  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      ...(category ? { category } : {}),
      ...(mood ? { moodTags: { has: mood } } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  const categories = Object.values(Category)
  const moods = ['tired', 'happy', 'focused', 'chill', 'adventurous']
  const resultLabel = category ? `${category.toLowerCase()} selections` : 'all products'

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto space-y-16">
      <section className="text-center space-y-4">
        <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">The Signature Series</span>
        <h1 className="font-playfair text-6xl md:text-8xl font-black text-white tracking-widest leading-none italic uppercase underline underline-offset-[24px] decoration-white/5">
          Ritual <span className="text-amber-500">Menu</span>
        </h1>
      </section>

      <section className="flex flex-col gap-8 items-center justify-between border-y border-white/5 py-10 sticky top-28 bg-black/40 backdrop-blur-3xl z-40 rounded-3xl px-8 shadow-2xl lg:flex-row">
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/menu"
            className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              !category ? 'bg-white text-black border-white' : 'bg-transparent text-white/30 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/menu?category=${cat}`}
              className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                category === cat ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-white/30 border-white/5 hover:border-amber-500/20 hover:text-white'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 lg:items-end">
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Mood Alignment</span>
            <div className="flex gap-2">
              {moods.map((entryMood) => (
                <Link
                  key={entryMood}
                  href={`/menu?mood=${entryMood}`}
                  className={`p-2 rounded-xl transition-all ${
                    mood === entryMood ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-white/5 text-white/20 border border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                  title={entryMood}
                >
                  <div className={`w-2 h-2 rounded-full ${mood === entryMood ? 'bg-amber-400' : 'bg-white/10'}`} />
                </Link>
              ))}
            </div>
          </div>

          <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/20 text-center lg:text-right">
            Showing {products.length} {resultLabel}
          </p>
        </div>
      </section>

      <MenuGrid products={products} />

      {products.length === 0 && (
        <div className="py-40 text-center space-y-8 max-w-xl mx-auto">
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-white/10 border border-white/5">
            <Coffee size={40} />
          </div>
          <div className="space-y-2">
            <p className="text-white text-2xl font-playfair font-black italic tracking-widest text-white/40 uppercase">No resonance detected.</p>
            <p className="text-white/20 text-xs font-black tracking-widest uppercase">The current filter set doesn&apos;t align with our current inventory rituals.</p>
          </div>
          <Link href="/menu" className="inline-block text-amber-500 font-black tracking-widest uppercase text-xs hover:underline underline-offset-[12px] decoration-amber-500/30">
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  )
}
