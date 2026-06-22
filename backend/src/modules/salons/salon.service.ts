import crypto from "crypto";
import { Salon } from "./salon.model";
import { Service } from "./service.model";
import { AppError } from "../../utils/AppError";
import { cache, CacheKey } from "../../config/redis";

/* ══════════════════════════════════════════════════════
   LIST SALONS (with filters)
══════════════════════════════════════════════════════ */
export async function listSalons(
  filters: Record<string, string | string[]>,
  page     = 1,
  pageSize = 12
) {
  const query: Record<string, unknown> = { isActive: true };

  /* Text search */
  if (filters["search"] && typeof filters["search"] === "string") {
    query["$text"] = { $search: filters["search"] };
  }

  /* Area filter */
  if (filters["area"] && typeof filters["area"] === "string") {
    query["location.area"] = { $regex: filters["area"], $options: "i" };
  }

  /* Gender filter */
  if (filters["gender"] && typeof filters["gender"] === "string") {
    query["gender"] = filters["gender"];
  }

  /* Tier filter */
  if (filters["tier"] && typeof filters["tier"] === "string") {
    query["tier"] = filters["tier"];
  }

  /* Min rating filter */
  if (filters["minRating"] && typeof filters["minRating"] === "string") {
    query["rating.overall"] = { $gte: Number(filters["minRating"]) };
  }

  /* Max price filter */
  if (filters["maxPrice"] && typeof filters["maxPrice"] === "string") {
    query["minPrice"] = { $lte: Number(filters["maxPrice"]) };
  }

  /* Verified only */
  if (filters["verified"] === "true") {
    query["isVerified"] = true;
  }

  /* Sort */
  let sort: Record<string, 1 | -1> = { "rating.overall": -1 };
  switch (filters["sortBy"]) {
    case "price_asc":  sort = { minPrice: 1 };           break;
    case "price_desc": sort = { minPrice: -1 };          break;
    case "newest":     sort = { createdAt: -1 };         break;
    case "rating":     sort = { "rating.overall": -1 };  break;
  }

  /* Cache key based on query hash */
  const cacheKey = CacheKey.salons(
    crypto.createHash("md5").update(JSON.stringify({ query, sort, page, pageSize })).digest("hex")
  );

  const cached = await cache.get<{ salons: unknown[]; total: number }>(cacheKey);
  if (cached) return { ...cached, page, pageSize };

  const skip = (page - 1) * pageSize;

  const [salons, total] = await Promise.all([
    Salon.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select("-bankDetails -__v")
      .lean(),
    Salon.countDocuments(query),
  ]);

  const result = { salons, total, page, pageSize };
  await cache.set(cacheKey, { salons, total }, 120); // 2 min TTL
  return result;
}

/* ══════════════════════════════════════════════════════
   GET SALON BY SLUG
══════════════════════════════════════════════════════ */
export async function getSalonBySlug(slug: string) {
  const cacheKey = CacheKey.salon(slug);
  const cached   = await cache.get<unknown>(cacheKey);
  if (cached) return cached;

  const salon = await Salon.findOne({ slug, isActive: true })
    .select("-bankDetails -__v")
    .lean();

  if (!salon) throw AppError.notFound("Salon");

  await cache.set(cacheKey, salon, 300); // 5 min TTL
  return salon;
}

/* ══════════════════════════════════════════════════════
   GET FEATURED SALONS
══════════════════════════════════════════════════════ */
export async function getFeaturedSalons() {
  const cacheKey = CacheKey.featured();
  const cached   = await cache.get<unknown[]>(cacheKey);
  if (cached) return cached;

  const salons = await Salon.find({ isFeatured: true, isActive: true })
    .sort({ "rating.overall": -1 })
    .limit(8)
    .select("name slug tagline coverImage location.area rating.overall tier gender minPrice isVerified")
    .lean();

  await cache.set(cacheKey, salons, 600); // 10 min TTL
  return salons;
}

/* ══════════════════════════════════════════════════════
   GET TRENDING SALONS
══════════════════════════════════════════════════════ */
export async function getTrendingSalons(area?: string) {
  const cacheKey = CacheKey.trending(area);
  const cached   = await cache.get<unknown[]>(cacheKey);
  if (cached) return cached;

  const query: Record<string, unknown> = { isActive: true };
  if (area) query["location.area"] = { $regex: area, $options: "i" };

  const salons = await Salon.find(query)
    .sort({ totalBookings: -1, "rating.overall": -1 })
    .limit(10)
    .select("name slug tagline coverImage location.area rating.overall tier gender minPrice totalBookings isVerified")
    .lean();

  await cache.set(cacheKey, salons, 300);
  return salons;
}

/* ══════════════════════════════════════════════════════
   GET NEARBY SALONS (geospatial)
══════════════════════════════════════════════════════ */
export async function getNearbySalons(
  lat:    number,
  lng:    number,
  radiusKm = 5
) {
  const salons = await Salon.find({
    isActive: true,
    "location.coordinates": {
      $near: {
        $geometry:    { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radiusKm * 1000, // metres
      },
    },
  })
    .limit(20)
    .select("name slug tagline coverImage location rating.overall tier gender minPrice isVerified")
    .lean();

  return salons;
}

/* ══════════════════════════════════════════════════════
   CREATE SALON
══════════════════════════════════════════════════════ */
export async function createSalon(
  data:    Record<string, unknown>,
  ownerId: string
) {
  const salon = await Salon.create({ ...data, owner: ownerId });
  await cache.delPattern("salons:*");
  return salon;
}

/* ══════════════════════════════════════════════════════
   UPDATE SALON
══════════════════════════════════════════════════════ */
export async function updateSalon(
  slug:    string,
  data:    Record<string, unknown>,
  userId:  string
) {
  /* Prevent owner field from being overwritten */
  delete data["owner"];
  delete data["slug"];

  const salon = await Salon.findOne({ slug });
  if (!salon) throw AppError.notFound("Salon");

  if (salon.owner.toString() !== userId) {
    throw AppError.forbidden("You do not own this salon");
  }

  Object.assign(salon, data);
  await salon.save();

  /* Bust caches */
  await cache.del(CacheKey.salon(slug));
  await cache.delPattern("salons:*");

  return salon;
}

/* ══════════════════════════════════════════════════════
   GET SALON SERVICES
══════════════════════════════════════════════════════ */
export async function getSalonServices(salonId: string) {
  return Service.find({ salon: salonId, isActive: true })
    .sort({ category: 1, sortOrder: 1 })
    .lean();
}

/* ══════════════════════════════════════════════════════
   CREATE SERVICE
══════════════════════════════════════════════════════ */
export async function createService(
  salonId: string,
  data:    Record<string, unknown>
) {
  const salon = await Salon.findById(salonId);
  if (!salon) throw AppError.notFound("Salon");

  const service = await Service.create({ ...data, salon: salonId });
  return service;
}

/* ══════════════════════════════════════════════════════
   UPDATE SERVICE
══════════════════════════════════════════════════════ */
export async function updateService(
  serviceId: string,
  data:      Record<string, unknown>
) {
  const service = await Service.findByIdAndUpdate(
    serviceId,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!service) throw AppError.notFound("Service");
  return service;
}