import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const mood = searchParams.get('mood') || 'chill'
    const timeOfDay = new Date().getHours() // 0-23
    
    // 1. Fetch products matching mood
    let products = await prisma.product.findMany({
      where: {
        moodTags: { has: mood },
        isAvailable: true,
      },
      take: 5,
    })

    // 2. Refine based on time of day
    // Morning (5-11): Prefer high intensity coffee
    // Afternoon (12-17): Prefer food and seasonal drinks
    // Evening (18-23): Prefer snacks or chill drinks
    if (timeOfDay < 11) {
       products = products.sort((a, b) => b.intensity - a.intensity)
    } else if (timeOfDay > 18) {
       products = products.filter(p => p.intensity <= 3)
    }

    // 3. AI Explanation Generation (Simulated/MOCKED but using mood-based logic)
    const recommendations = products.map(p => {
       let explanation = ""
       const timeStr = timeOfDay < 12 ? "morning ritual" : "afternoon pause"
       
       if (mood === 'tired') {
          explanation = `Since you're feeling a bit drained, our ${p.name} with intensity level ${p.intensity} is the perfect energetic catalyst for your ${timeStr}.`
       } else if (mood === 'focused') {
          explanation = `A strategic choice. The balanced profile of ${p.name} aligns with your deep-work objectives.`
       } else if (mood === 'adventurous') {
          explanation = `The ${p.name} breaks convention with its ${p.category} fusion—ideal for your exploratory spirit.`
       } else {
          explanation = `Our ${p.name} is a sanctuary in a cup, designed to amplify your current ${mood} resonance.`
       }

       return {
          ...p,
          aiExplanation: explanation
       }
    })

    // 4. Custom fallback if none found
    if (recommendations.length === 0) {
       const random = await prisma.product.findMany({ take: 3 })
       return NextResponse.json(random.map(r => ({ ...r, aiExplanation: "A classic choice for any timeline." })))
    }

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json({ error: 'Failed to generate wisdom' }, { status: 500 })
  }
}
