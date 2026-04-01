export const siteConfig = {
  brand: {
    name: "Aurora Roastery",
    tagline: "From Bean to Perfection",
    primaryColor: "#6F4E37",
    accentColor: "#C8A27C",
    logo: "☕",
  },

  navigation: [
    { label: "Menu", href: "#menu" },
    { label: "Rewards", href: "#rewards" },
    { label: "Find a Store", href: "#locations" },
    { label: "Sign In", href: "#signin" },
  ],

  heroScrollTexts: [
    "BREWED TO\nPERFECTION.",
    "From Bean to Perfection",
    "Roasted with Precision",
    "Ground to Unlock Aroma",
    "Brewed to Excellence",
    "Every Drop Tells a Story",
    "Coffee, Reimagined",
    "Begin Your Ritual",
  ],

  seasonalDrinks: [
    {
      name: "Caramel Cloud Cold Brew",
      description: "24-hour cold steeped with silky caramel foam",
      tag: "New",
      color: "#C8A27C",
      emoji: "🧊",
    },
    {
      name: "Spiced Vanilla Oat Latte",
      description: "Warm spices meet smooth oat milk in perfect harmony",
      tag: "Seasonal",
      color: "#D4A96A",
      emoji: "🌿",
    },
    {
      name: "Mocha Orange Espresso",
      description: "Bold espresso with dark chocolate and citrus zest",
      tag: "Limited",
      color: "#8B5E3C",
      emoji: "🍊",
    },
  ],

  blends: [
    {
      name: "House Blend",
      description: "Balanced & smooth",
      detail: "A medium roast that brings harmony to every cup. Notes of hazelnut, caramel, and a bright citrus finish.",
      intensity: 60,
    },
    {
      name: "Midnight Roast",
      description: "Dark & bold",
      detail: "Our darkest roast — deep, smoky, and commanding. Tastes of dark chocolate and toasted oak.",
      intensity: 95,
    },
    {
      name: "Sunrise Latte",
      description: "Soft & bright",
      detail: "A light roast crafted for mornings. Delicate floral notes with honey sweetness and a gentle finish.",
      intensity: 35,
    },
  ],

  features: [
    {
      icon: "🌱",
      title: "Sustainability",
      description: "100% ethically sourced, direct-trade beans from family farms.",
    },
    {
      icon: "🍵",
      title: "Brew Bar",
      description: "Handcrafted pours by our certified master baristas.",
    },
    {
      icon: "✨",
      title: "Coffee Club",
      description: "Exclusive members get early access and rewards.",
    },
  ],

  rewards: [
    { step: 1, icon: "📝", title: "Sign Up", description: "Create your Aurora account in seconds" },
    { step: 2, icon: "☕", title: "Sip & Earn", description: "Get stars with every purchase you make" },
    { step: 3, icon: "🎁", title: "Redeem", description: "Exchange stars for free drinks and exclusives" },
  ],

  reviews: [
    {
      name: "Rahul Sharma",
      role: "Coffee Enthusiast",
      rating: 5,
      text: "The smoothest coffee experience I've ever had in Bangalore. The ambiance and taste are absolutely unmatched. Aurora is in a completely different league.",
      avatar: "RS",
    },
    {
      name: "Ananya Reddy",
      role: "Food Blogger",
      rating: 5,
      text: "Absolutely love the seasonal drinks. The caramel cold brew is a must-try! I come here every single week — it never disappoints.",
      avatar: "AR",
    },
    {
      name: "Karthik N",
      role: "Startup Founder",
      rating: 4,
      text: "Great place to relax and work. Premium feel and excellent service. My go-to spot for important meetings and deep work sessions.",
      avatar: "KN",
    },
    {
      name: "Priya Menon",
      role: "Designer",
      rating: 5,
      text: "The Midnight Roast changed my entire relationship with coffee. The depth of flavour is extraordinary. World-class quality in Bangalore!",
      avatar: "PM",
    },
    {
      name: "Aditya Kumar",
      role: "Tech Lead",
      rating: 5,
      text: "A truly premium café experience. From pour-overs to cold brews, every drink is a masterclass. The Indiranagar branch is my office.",
      avatar: "AK",
    },
  ],

  locations: [
    {
      name: "Aurora Roastery Indiranagar",
      address: "100 Feet Road, Indiranagar, Bangalore - 560038",
      hours: "7:00 AM – 10:00 PM",
      phone: "+91 80 4567 8901",
      tag: "Flagship",
    },
    {
      name: "Aurora Roastery Koramangala",
      address: "7th Block, Koramangala, Bangalore - 560095",
      hours: "7:30 AM – 10:30 PM",
      phone: "+91 80 4567 8902",
      tag: "Popular",
    },
    {
      name: "Aurora Roastery Whitefield",
      address: "ITPL Main Road, Whitefield, Bangalore - 560066",
      hours: "8:00 AM – 9:00 PM",
      phone: "+91 80 4567 8903",
      tag: "New",
    },
  ],

  aiSuggestions: {
    moods: {
      tired: { drink: "Double Espresso Shot", reason: "High caffeine, bold flavour to wake you up instantly." },
      happy: { drink: "Caramel Cloud Cold Brew", reason: "Light, sweet, and celebratory." },
      focused: { drink: "House Blend Pour-Over", reason: "Smooth, balanced — perfect for deep work." },
      chill: { drink: "Sunrise Latte", reason: "Soft and gentle, ideal for unwinding." },
      adventurous: { drink: "Mocha Orange Espresso", reason: "Unexpected, bold, and exciting." },
    },
  },
};
