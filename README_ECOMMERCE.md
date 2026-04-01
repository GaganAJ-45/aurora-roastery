# Aurora Roastery - E-Commerce Implementation

This is a premium, cinematic e-commerce system for Aurora Roastery, built with Next.js 14, Prisma, PostgreSQL, and NextAuth.

## 🚀 Setup Instructions

### 1. Environment Configuration
Ensure your `.env` file matches your local PostgreSQL setup:
```env
DATABASE_URL="postgresql://postgres@localhost:5432/matcha_coffee"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Migration
Synchronize your database with the Prisma schema:
```bash
npx prisma migrate dev --name init
```

### 3. Seeding the Database
Populate your database with 25+ products, 3 Bangalore locations, test users, and sample orders:
```bash
npx prisma db seed
```

### 4. Installation & Running
```bash
npm install
npm run dev
```

## 💎 Features Implemented

- **Cinematic Scrollytelling**: High-end landing page with GSAP/Canvas integration.
- **Glassmorphic Cart**: Real-time Zustand-powered shopping cart with persistence.
- **Secure Auth**: NextAuth.js with custom credentials and registration flow.
- **AI Oracle**: Recommendation engine based on user mood and time of day.
- **Guild Rewards**: Multi-tier loyalty system with automated point accumulation.
- **Admin Command Center**: Visual dashboard for monitoring revenue, orders, and mood resonance.
- **Responsive Ritual**: Fully optimized for mobile and desktop luxury experiences.

## 🔑 Admin Credentials
- **Email**: `admin@aurora.com`
- **Password**: `admin123`

## 📦 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **State**: Zustand + TanStack Query
- **Styling**: Tailwind CSS 4.0 + Framer Motion
- **Auth**: NextAuth.js (v4)
- **Icons**: Lucide React

---