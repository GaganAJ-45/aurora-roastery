import 'dotenv/config'
import { PrismaClient, Role, OrderStatus, Category } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('password123', 10)

  // 1. CLEANUP
  await prisma.rewardHistory.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()

  // 2. STORES
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Aurora Roastery - Indiranagar',
        address: '100 Feet Rd, HAL 2nd Stage, Indiranagar',
        hours: '7:00 AM - 11:00 PM',
        latitude: 12.9716,
        longitude: 77.6412,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Aurora Roastery - Koramangala',
        address: '80 Feet Rd, 4th Block, Koramangala',
        hours: '7:00 AM - 12:00 AM',
        latitude: 12.9344,
        longitude: 77.6101,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Aurora Roastery - Whitefield',
        address: 'ITPL Main Rd, KIADB Export Promotion Industrial Area',
        hours: '8:00 AM - 10:00 PM',
        latitude: 12.9845,
        longitude: 77.7477,
      },
    }),
  ])

  // 3. USERS
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aurora.com',
      name: 'Aurora Admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  const testUsers = await Promise.all([
    prisma.user.create({
      data: { email: 'gagan@example.com', name: 'Gagan AJ', password: userPassword, points: 150 },
    }),
    prisma.user.create({
      data: { email: 'maya@example.com', name: 'Maya Sharma', password: userPassword, points: 45 },
    }),
  ])

  // 4. PRODUCTS (26 UNIQUE High-Res Items)
  const productsData = [
    // --- COFFEE ---
    {
      name: 'Caramel Cloud Cold Brew',
      description: 'Velvety caramel cold foam over our signature 18-hour cold brew.',
      price: 6.5,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800',
      category: Category.SEASONAL,
      moodTags: ['happy', 'chill'],
      intensity: 3,
    },
    {
      name: 'Spiced Vanilla Oat Latte',
      description: 'Warm spices infused with creamy oat milk and premium espresso.',
      price: 5.75,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['chill', 'focused'],
      intensity: 2,
    },
    {
      name: 'Mocha Orange Espresso',
      description: 'Zesty orange zest combined with rich dark chocolate espresso.',
      price: 6.25,
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800',
      category: Category.SEASONAL,
      moodTags: ['adventurous', 'happy'],
      intensity: 4,
    },
    {
      name: 'Midnight Onyx Espresso',
      description: 'Our darkest roast, bold and chocolatey with a smoky finish.',
      price: 4.5,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['tired', 'focused'],
      intensity: 5,
    },
    {
      name: 'Lavender Honey Latte',
      description: 'Floral lavender and local honey swirled with silky steamed milk.',
      price: 5.95,
      image: 'https://images.unsplash.com/photo-1593967858208-67ddb5b4c406?auto=format&fit=crop&q=80&w=800',
      category: Category.SEASONAL,
      moodTags: ['chill', 'happy'],
      intensity: 2,
    },
    {
      name: 'Nitro Cherry Fizz',
      description: 'Nitro cold brew with a splash of black cherry and bubbly tonic.',
      price: 6.75,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800',
      category: Category.SEASONAL,
      moodTags: ['adventurous', 'tired'],
      intensity: 3,
    },
    {
      name: 'Golden Turmeric Latte',
      description: 'Anti-inflammatory turmeric mixed with ginger, cinnamon, and oat milk.',
      price: 5.5,
      image: 'https://images.unsplash.com/photo-1614961909013-1e2212a2ca87?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['chill', 'focused'],
      intensity: 1,
    },
    {
      name: 'Double Shot Flat White',
      description: 'Pure espresso art. Two shots of Ristretto with velvety micro-foam.',
      price: 4.95,
      image: 'https://images.unsplash.com/photo-1512568448817-bb9a91c78abe?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['focused', 'tired'],
      intensity: 4,
    },
    {
      name: 'Rosemary Salt Latte',
      description: 'A daring mix of earthy rosemary and sea salt with deep espresso.',
      price: 5.95,
      image: 'https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&q=80&w=800',
      category: Category.SEASONAL,
      moodTags: ['adventurous', 'focused'],
      intensity: 4,
    },
    {
      name: 'Classic Cappuccino',
      description: 'Equal parts espresso, steamed milk, and airy foam.',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1536768139911-e290a59011e4?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['focused', 'chill'],
      intensity: 3,
    },

    // --- FOOD ---
    {
      name: 'Truffle Mushroom Toast',
      description: 'Sourdough topped with creamy truffle mushrooms and thyme.',
      price: 8.5,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['happy', 'chill'],
      intensity: 1,
    },
    {
      name: 'Matcha Croissant',
      description: 'Flaky butter croissant filled with premium Uji matcha cream.',
      price: 4.25,
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['happy', 'adventurous'],
      intensity: 1,
    },
    {
      name: 'Avocado Everything Bagel',
      description: 'Toasted bagel with smashed avocado, radish, and chili flakes.',
      price: 7.25,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['focused', 'happy'],
      intensity: 1,
    },
    {
      name: 'Smoked Salmon Crepe',
      description: 'Luxury crepes with Philadelphia cheese, capers, and smoked salmon.',
      price: 10.5,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['adventurous', 'happy'],
      intensity: 1,
    },
    {
      name: 'Eggs Benedict Sandwich',
      description: 'Poached egg, hollandaise, and ham on a toasted English muffin.',
      price: 9.95,
      image: 'https://images.unsplash.com/photo-1600326145359-3a44909d1a39?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['happy', 'tired'],
      intensity: 1,
    },
    {
      name: 'Quinoa Energy Bowl',
      description: 'Power-packed bowl with berries, nuts, and almond milk soak.',
      price: 8.95,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['focused', 'happy'],
      intensity: 1,
    },
    {
      name: 'Pistachio Baklava',
      description: 'Crispy layers of filo with honey and crunchy pistachio.',
      price: 5.5,
      image: 'https://images.unsplash.com/photo-1519676867240-f031ee04a66b?auto=format&fit=crop&q=80&w=800',
      category: Category.FOOD,
      moodTags: ['happy', 'chill'],
      intensity: 1,
    },

    // --- MERCHANDISE ---
    {
      name: 'Aurora Ceramic Mug',
      description: 'Handcrafted stoneware mug with a minimalist nebula glaze.',
      price: 18.0,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcc3d1?auto=format&fit=crop&q=80&w=800',
      category: Category.MERCHANDISE,
      moodTags: ['chill'],
      intensity: 1,
    },
    {
      name: 'Travel Porter Tumbler',
      description: 'Insulated stainless steel tumbler that keeps coffee hot for 12 hours.',
      price: 25.0,
      image: 'https://images.unsplash.com/photo-1517254456976-ee8682099819?auto=format&fit=crop&q=80&w=800',
      category: Category.MERCHANDISE,
      moodTags: ['focused', 'adventurous'],
      intensity: 1,
    },
    {
      name: 'Aurora Canvas Tote',
      description: 'Heavyweight cotton tote for your laptop and daily essentials.',
      price: 15.0,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      category: Category.MERCHANDISE,
      moodTags: ['happy', 'chill'],
      intensity: 1,
    },
    {
      name: 'Whole Bean: Aurora Reserve',
      description: 'Single-origin Ethiopian beans with notes of jasmine and citrus.',
      price: 22.0,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
      category: Category.MERCHANDISE,
      moodTags: ['adventurous', 'focused'],
      intensity: 3,
    },
    {
      name: 'Aurora Brew Kit',
      description: 'V60 starter kit with paper filters and a sample coffee bag.',
      price: 35.0,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
      category: Category.MERCHANDISE,
      moodTags: ['adventurous', 'focused'],
      intensity: 1,
    },
    {
      name: 'Enamel Pin: Roaster',
      description: 'A cute tiny enamel pin of an Aurora coffee bean.',
      price: 8.0,
      image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&q=80&w=800',
      category: Category.MERCHANDISE,
      moodTags: ['happy'],
      intensity: 1,
    },
    {
      name: 'Dark Mocha Macchiato',
      description: 'Layered espresso with dark chocolate and steamed whole milk.',
      price: 5.45,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['tired', 'focused'],
      intensity: 4,
    },
    {
      name: 'Coconut Sky Cold Brew',
      description: 'Cold brew topped with coconut milk foam and blue butterfly pea syrup.',
      price: 6.25,
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
      category: Category.SEASONAL,
      moodTags: ['chill', 'happy'],
      intensity: 2,
    },
    {
      name: 'Vanilla Bean Frappé',
      description: 'Blended icy coffee with real vanilla bean specks and whipped cream.',
      price: 5.85,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53a?auto=format&fit=crop&q=80&w=800',
      category: Category.COFFEE,
      moodTags: ['happy', 'chill'],
      intensity: 2,
    },
  ]

  const products = await prisma.product.createManyAndReturn({
    data: productsData,
  })

  // 5. REVIEWS & ORDERS
  for (let i = 0; i < 10; i++) {
    const user = testUsers[i % testUsers.length]
    const store = stores[i % stores.length]
    const p = products[i % products.length]
    
    await prisma.order.create({
      data: {
        userId: user.id,
        storeId: store.id,
        totalAmount: p.price,
        status: OrderStatus.COMPLETED,
        items: {
          create: [{ productId: p.id, quantity: 1, price: p.price }],
        },
      },
    })
  }

  console.log('✅ Catalog synchronized with unique archetypes.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
