import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

/* ── Sub-types ───────────────────────────────────────── */
export interface IWorkingHours {
  open:     string;   // "09:00"
  close:    string;   // "21:00"
  isClosed: boolean;
}

export interface ISalonImage {
  url:       string;
  publicId:  string;
  alt?:      string;
  isPrimary: boolean;
}

export interface IStylist {
  name:        string;
  avatar?:     string;
  specialties: string[];
  experience:  number;
  bio?:        string;
}

/* ── Main interface ──────────────────────────────────── */
export interface ISalon extends Document {
  _id:         mongoose.Types.ObjectId;
  name:        string;
  slug:        string;
  tagline?:    string;
  description: string;
  owner:       mongoose.Types.ObjectId;

  tier:   "Standard" | "Premium" | "Luxury";
  gender: "Women" | "Men" | "Unisex";

  location: {
    type:        "Point";
    coordinates: [number, number];   // [longitude, latitude]
    address:     string;
    landmark?:   string;
    area:        string;
    city:        string;
    pincode:     string;
  };

  images:     ISalonImage[];
  coverImage: string;
  logoUrl?:   string;

  phone:            string;
  email?:           string;
  website?:         string;
  instagramHandle?: string;
  whatsapp?:        string;

  workingHours: {
    monday:    IWorkingHours;
    tuesday:   IWorkingHours;
    wednesday: IWorkingHours;
    thursday:  IWorkingHours;
    friday:    IWorkingHours;
    saturday:  IWorkingHours;
    sunday:    IWorkingHours;
  };

  stylists:  IStylist[];
  amenities: string[];
  tags:      string[];

  rating: {
    overall:       number;
    cleanliness:   number;
    service:       number;
    valueForMoney: number;
    ambiance:      number;
    totalReviews:  number;
    distribution:  {
      five:  number;
      four:  number;
      three: number;
      two:   number;
      one:   number;
    };
  };

  isVerified:     boolean;
  isActive:       boolean;
  isFeatured:     boolean;
  totalBookings:  number;
  minPrice:       number;

  bankDetails?: {
    accountName:   string;
    accountNumber: string;
    ifscCode:      string;
    bankName:      string;
  };

  createdAt: Date;
  updatedAt: Date;
}

/* ── Sub-schemas ─────────────────────────────────────── */
const workingHoursSchema = new Schema<IWorkingHours>(
  { open: { type: String, default: "10:00" }, close: { type: String, default: "20:00" }, isClosed: { type: Boolean, default: false } },
  { _id: false }
);

const imageSchema = new Schema<ISalonImage>(
  { url: { type: String, required: true }, publicId: { type: String, required: true }, alt: String, isPrimary: { type: Boolean, default: false } },
  { _id: false }
);

const stylistSchema = new Schema<IStylist>(
  { name: { type: String, required: true }, avatar: String, specialties: [String], experience: { type: Number, default: 0 }, bio: String },
  { _id: true }
);

/* ── Main schema ─────────────────────────────────────── */
const salonSchema = new Schema<ISalon>(
  {
    name:        { type: String, required: [true, "Salon name required"], trim: true, maxlength: 100 },
    slug:        { type: String, unique: true, index: true },
    tagline:     { type: String, trim: true, maxlength: 120 },
    description: { type: String, required: [true, "Description required"], maxlength: 2000 },
    owner:       { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    tier:   { type: String, enum: ["Standard","Premium","Luxury"], default: "Standard" },
    gender: { type: String, enum: ["Women","Men","Unisex"],        default: "Unisex"   },

    location: {
      type:        { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type:     [Number],
        required: [true, "Coordinates required"],
        validate: {
          validator: (v: number[]) => v.length === 2 && Math.abs(v[0]!) <= 180 && Math.abs(v[1]!) <= 90,
          message:   "coordinates must be [longitude, latitude]",
        },
      },
      address:  { type: String, required: true },
      landmark: String,
      area:     { type: String, required: true, index: true },
      city:     { type: String, default: "Mumbai" },
      pincode:  { type: String, required: true, match: [/^\d{6}$/, "Pincode must be 6 digits"] },
    },

    images:     { type: [imageSchema],  default: [] },
    coverImage: { type: String, default: "" },
    logoUrl:    String,

    phone:            { type: String, required: [true, "Phone required"] },
    email:            { type: String, lowercase: true },
    website:          String,
    instagramHandle:  String,
    whatsapp:         String,

    workingHours: {
      monday:    { type: workingHoursSchema, default: {} },
      tuesday:   { type: workingHoursSchema, default: {} },
      wednesday: { type: workingHoursSchema, default: {} },
      thursday:  { type: workingHoursSchema, default: {} },
      friday:    { type: workingHoursSchema, default: {} },
      saturday:  { type: workingHoursSchema, default: { open: "09:00", close: "21:00" } },
      sunday:    { type: workingHoursSchema, default: { open: "10:00", close: "18:00" } },
    },

    stylists:  { type: [stylistSchema], default: [] },
    amenities: { type: [String],        default: [] },
    tags:      { type: [String],        default: [] },

    rating: {
      overall:       { type: Number, default: 0, min: 0, max: 5 },
      cleanliness:   { type: Number, default: 0 },
      service:       { type: Number, default: 0 },
      valueForMoney: { type: Number, default: 0 },
      ambiance:      { type: Number, default: 0 },
      totalReviews:  { type: Number, default: 0 },
      distribution: {
        five:  { type: Number, default: 0 },
        four:  { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two:   { type: Number, default: 0 },
        one:   { type: Number, default: 0 },
      },
    },

    isVerified:    { type: Boolean, default: false, index: true },
    isActive:      { type: Boolean, default: true,  index: true },
    isFeatured:    { type: Boolean, default: false },
    totalBookings: { type: Number,  default: 0 },
    minPrice:      { type: Number,  default: 0 },

    bankDetails: {
      accountName:   String,
      accountNumber: { type: String },
      ifscCode:      String,
      bankName:      String,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ── Virtual: isOpenNow ──────────────────────────────── */
salonSchema.virtual("isOpenNow").get(function () {
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;
  const now  = new Date();
  const day  = days[now.getDay()]!;
  const wh   = this.workingHours[day];
  if (!wh || wh.isClosed) return false;

  const current = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  return current >= wh.open && current < wh.close;
});

/* ── Pre-save: auto-generate slug ────────────────────── */
salonSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  const base = slugify(this.name, { lower: true, strict: true });
  let slug   = base;
  let count  = 1;

  while (await mongoose.model("Salon").findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }

  this.slug = slug;
  next();
});

/* ── Indexes ─────────────────────────────────────────── */
salonSchema.index({ "location.coordinates": "2dsphere" });
salonSchema.index({ "location.area": 1, isActive: 1 });
salonSchema.index({ "rating.overall": -1 });
salonSchema.index({ tags: 1 });
salonSchema.index({ tier: 1, gender: 1 });
salonSchema.index({ isFeatured: 1, isActive: 1 });
salonSchema.index({ totalBookings: -1 });
salonSchema.index({ minPrice: 1 });
salonSchema.index(
  { name: "text", description: "text", "location.area": "text", tags: "text" },
  { weights: { name: 10, "location.area": 5, tags: 3, description: 1 } }
);

export const Salon = mongoose.model<ISalon>("Salon", salonSchema);