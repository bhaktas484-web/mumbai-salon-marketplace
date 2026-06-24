import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User }    from "../modules/auth/user.model";
import { Salon }   from "../modules/salons/salon.model";
import { Service } from "../modules/salons/service.model";
import { logger }  from "./logger";

const SALONS_DATA = [
  {
    name: "Mirrors Salon & Spa",
    tagline: "Where luxury meets artistry",
    description: "Mumbai's most celebrated luxury salon since 2008.",
    tier: "Luxury", gender: "Unisex",
    location: { type:"Point", coordinates:[72.8295,19.0596], address:"14 Linking Road, Bandra West", area:"Bandra", pincode:"400050" },
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    images: [{ url:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800", publicId:"mirror1", isPrimary:true }],
    phone:"+91 98200 12345", email:"hello@mirrorssalon.in",
    amenities:["Parking","AC","WiFi","Card Payment","UPI","Beverages"],
    tags:["Top Rated","Trending","Bridal Specialist"],
    isVerified:true, isActive:true, isFeatured:true,
    rating:{ overall:4.9, cleanliness:5.0, service:4.9, valueForMoney:4.6, ambiance:4.8, totalReviews:1243 },
    minPrice: 1200,
    services: [
      { name:"Haircut & Blowdry",  category:"Hair",          durationMinutes:60,  price:1200,             gender:"Unisex", isPopular:true  },
      { name:"Global Hair Colour", category:"Hair",          durationMinutes:120, price:3500, discountedPrice:2999, gender:"Unisex" },
      { name:"Keratin Treatment",  category:"Hair",          durationMinutes:180, price:5500,             gender:"Unisex", isPopular:true  },
      { name:"Balayage",           category:"Hair",          durationMinutes:150, price:6000, discountedPrice:4999, gender:"Women"  },
      { name:"Classic Facial",     category:"Skin",          durationMinutes:60,  price:1800,             gender:"Unisex", isPopular:true  },
      { name:"Hydrafacial",        category:"Skin",          durationMinutes:75,  price:3500,             gender:"Unisex" },
      { name:"Swedish Massage",    category:"Spa & Massage", durationMinutes:60,  price:2500,             gender:"Unisex", isPopular:true  },
      { name:"Deep Tissue Massage",category:"Spa & Massage", durationMinutes:90,  price:3800,             gender:"Unisex" },
    ],
  },
  {
    name: "Enrich Salon",
    tagline: "Premium beauty for everyone",
    description: "Award-winning premium salon chain across Mumbai.",
    tier: "Premium", gender: "Unisex",
    location: { type:"Point", coordinates:[72.8269,19.0990], address:"Juhu Tara Road, Juhu", area:"Juhu", pincode:"400049" },
    coverImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
    images: [{ url:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800", publicId:"enrich1", isPrimary:true }],
    phone:"+91 98201 54321",
    amenities:["AC","Card Payment","UPI","WiFi"],
    tags:["Trending","Premium"],
    isVerified:true, isActive:true, isFeatured:true,
    rating:{ overall:4.7, cleanliness:4.8, service:4.7, valueForMoney:4.5, ambiance:4.6, totalReviews:892 },
    minPrice: 700,
    services: [
      { name:"Haircut",   category:"Hair",  durationMinutes:45, price:700,  gender:"Unisex", isPopular:true },
      { name:"Hair Spa",  category:"Hair",  durationMinutes:90, price:2200, gender:"Unisex" },
      { name:"Nail Art",  category:"Nails", durationMinutes:60, price:1200, gender:"Women",  isPopular:true },
      { name:"Manicure",  category:"Nails", durationMinutes:45, price:800,  gender:"Women"  },
      { name:"Pedicure",  category:"Nails", durationMinutes:60, price:900,  gender:"Women"  },
    ],
  },
  {
    name: "Green Trends",
    tagline: "Fresh looks, great prices",
    description: "Affordable quality salon serving Andheri since 2015.",
    tier: "Standard", gender: "Unisex",
    location: { type:"Point", coordinates:[72.8479,19.1197], address:"Andheri West, Near Station", area:"Andheri", pincode:"400058" },
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    images: [{ url:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800", publicId:"gt1", isPrimary:true }],
    phone:"+91 98202 11111",
    amenities:["AC","UPI","Card Payment"],
    tags:["Budget Friendly","New"],
    isVerified:true, isActive:true, isFeatured:true,
    rating:{ overall:4.6, cleanliness:4.5, service:4.7, valueForMoney:4.8, ambiance:4.4, totalReviews:654 },
    minPrice: 250,
    services: [
      { name:"Ladies Haircut",   category:"Hair",                  durationMinutes:45, price:400,  gender:"Women",  isPopular:true },
      { name:"Gents Haircut",    category:"Hair",                  durationMinutes:30, price:250,  gender:"Men",    isPopular:true },
      { name:"Full Body Waxing", category:"Threading & Waxing",    durationMinutes:90, price:1200, gender:"Women" },
      { name:"Threading",        category:"Threading & Waxing",    durationMinutes:20, price:80,   gender:"Women",  isPopular:true },
      { name:"Basic Facial",     category:"Skin",                  durationMinutes:45, price:600,  gender:"Unisex" },
    ],
  },
  {
    name: "Juice Salon",
    tagline: "Color & cuts done right",
    description: "Trendy salon in Powai known for creative hair coloring and cuts.",
    tier: "Premium", gender: "Unisex",
    location: { type:"Point", coordinates:[72.9084,19.1195], address:"Hiranandani Gardens, Powai", area:"Powai", pincode:"400076" },
    coverImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80",
    images: [{ url:"https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800", publicId:"juice1", isPrimary:true }],
    phone:"+91 98203 22222",
    amenities:["AC","WiFi","Card Payment","UPI","Parking"],
    tags:["Trending","Hair Specialist"],
    isVerified:true, isActive:true, isFeatured:true,
    rating:{ overall:4.8, cleanliness:4.9, service:4.8, valueForMoney:4.5, ambiance:4.7, totalReviews:534 },
    minPrice: 800,
    services: [
      { name:"Creative Haircut",    category:"Hair", durationMinutes:60,  price:1500,             gender:"Unisex", isPopular:true },
      { name:"Ombre Colour",        category:"Hair", durationMinutes:180, price:5000, discountedPrice:3999, gender:"Unisex", isPopular:true },
      { name:"Highlights",          category:"Hair", durationMinutes:120, price:3500,             gender:"Unisex" },
      { name:"Smoothening",         category:"Hair", durationMinutes:180, price:6000, discountedPrice:4500, gender:"Unisex" },
      { name:"Head Massage",        category:"Spa & Massage", durationMinutes:30, price:800, gender:"Unisex", isPopular:true },
    ],
  },
  {
    name: "Lakmé Salon",
    tagline: "India's beauty experts",
    description: "India's most trusted salon brand with expert stylists in South Mumbai.",
    tier: "Premium", gender: "Women",
    location: { type:"Point", coordinates:[72.8258,18.9667], address:"Colaba Causeway, Colaba", area:"Colaba", pincode:"400005" },
    coverImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    images: [{ url:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800", publicId:"lakme1", isPrimary:true }],
    phone:"+91 98204 33333",
    amenities:["AC","Card Payment","UPI","Beverages"],
    tags:["Top Rated","Bridal Specialist","Makeup"],
    isVerified:true, isActive:true, isFeatured:true,
    rating:{ overall:4.8, cleanliness:4.9, service:4.8, valueForMoney:4.4, ambiance:4.7, totalReviews:1102 },
    minPrice: 500,
    services: [
      { name:"Bridal Makeup",       category:"Makeup", durationMinutes:120, price:15000, discountedPrice:12000, gender:"Women", isPopular:true },
      { name:"Party Makeup",        category:"Makeup", durationMinutes:60,  price:3500,  gender:"Women", isPopular:true },
      { name:"Ladies Haircut",      category:"Hair",   durationMinutes:45,  price:800,   gender:"Women" },
      { name:"Saree Draping",       category:"Makeup", durationMinutes:30,  price:1500,  gender:"Women" },
      { name:"Skin Brightening Facial", category:"Skin", durationMinutes:60, price:2500, gender:"Women", isPopular:true },
    ],
  },
  {
    name: "Naturals Salon",
    tagline: "Natural beauty, naturally yours",
    description: "South India's largest salon chain now in Mumbai. Affordable and reliable.",
    tier: "Standard", gender: "Women",
    location: { type:"Point", coordinates:[72.8556,19.0176], address:"Dadar West, Near Station", area:"Dadar", pincode:"400028" },
    coverImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    images: [{ url:"https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800", publicId:"naturals1", isPrimary:true }],
    phone:"+91 98205 44444",
    amenities:["AC","UPI","Card Payment"],
    tags:["Budget Friendly","Trusted"],
    isVerified:true, isActive:true, isFeatured:false,
    rating:{ overall:4.5, cleanliness:4.4, service:4.6, valueForMoney:4.9, ambiance:4.3, totalReviews:445 },
    minPrice: 200,
    services: [
      { name:"Haircut",             category:"Hair",               durationMinutes:30, price:350,  gender:"Women", isPopular:true },
      { name:"Hair Colour (Roots)", category:"Hair",               durationMinutes:60, price:1200, gender:"Women" },
      { name:"Eyebrow Threading",   category:"Threading & Waxing", durationMinutes:15, price:80,   gender:"Women", isPopular:true },
      { name:"Upper Lip",           category:"Threading & Waxing", durationMinutes:10, price:50,   gender:"Women" },
      { name:"Full Arms Waxing",    category:"Threading & Waxing", durationMinutes:30, price:400,  gender:"Women" },
      { name:"Cleanup",             category:"Skin",               durationMinutes:30, price:500,  gender:"Women", isPopular:true },
    ],
  },
];

async function seed() {
  await connectDB();
  logger.info("🌱 Seeding database...");

  /* Clear existing */
  await Promise.all([
    Salon.deleteMany({}),
    Service.deleteMany({}),
  ]);
  logger.info("🗑️  Cleared existing salons and services");

  /* Create admin user (upsert so it survives re-runs) */
  const admin = await User.findOneAndUpdate(
    { email: "admin@glamr.in" },
    { name:"Glamr Admin", email:"admin@glamr.in", password:"Admin@1234", role:"admin", isEmailVerified:true },
    { upsert:true, new:true, setDefaultsOnInsert:true }
  );
  logger.info(`✅ Admin: ${admin.email}`);

  const owner = await User.findOneAndUpdate(
    { email: "owner@mirrorssalon.in" },
    { name:"Priya Sharma", email:"owner@mirrorssalon.in", password:"Owner@1234", role:"salon_owner", isEmailVerified:true },
    { upsert:true, new:true, setDefaultsOnInsert:true }
  );
  logger.info(`✅ Owner: ${owner.email}`);

  await User.findOneAndUpdate(
    { email: "customer@glamr.in" },
    { name:"Rahul Mumbai", email:"customer@glamr.in", password:"Test@1234", role:"customer", isEmailVerified:true },
    { upsert:true, new:true, setDefaultsOnInsert:true }
  );
  logger.info("✅ Test customer: customer@glamr.in");

  /* Create salons + services */
  for (const data of SALONS_DATA) {
    const { services, ...salonData } = data;
    const salon = await Salon.create({ ...salonData, owner: owner._id });
    await Service.insertMany(services.map(s => ({ ...s, salon: salon._id })));
    logger.info(`✅ ${salon.name} — ${services.length} services`);
  }

  logger.info("🎉 Seeding complete! 6 salons added.");
  logger.info("────────────────────────────────────");
  logger.info("Test accounts:");
  logger.info("  Admin:    admin@glamr.in        / Admin@1234");
  logger.info("  Owner:    owner@mirrorssalon.in / Owner@1234");
  logger.info("  Customer: customer@glamr.in     / Test@1234");

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => {
  logger.error("Seed failed:", err);
  process.exit(1);
});