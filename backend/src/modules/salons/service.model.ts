import mongoose, { Document, Schema } from "mongoose";

export type ServiceCategory =
  | "Hair"
  | "Skin"
  | "Nails"
  | "Makeup"
  | "Spa & Massage"
  | "Threading & Waxing"
  | "Beard & Grooming"
  | "Bridal"
  | "Other";

export type ServiceGender = "Women" | "Men" | "Unisex";

/* ── Interface ───────────────────────────────────────── */
export interface IService extends Document {
  _id:             mongoose.Types.ObjectId;
  salon:           mongoose.Types.ObjectId;
  name:            string;
  description?:    string;
  category:        ServiceCategory;
  durationMinutes: number;
  price:           number;
  discountedPrice?: number;
  discountPercent?: number;
  gender:          ServiceGender;
  isPopular:       boolean;
  isActive:        boolean;
  imageUrl?:       string;
  sortOrder:       number;
  bookingCount:    number;
  createdAt:       Date;
  updatedAt:       Date;
  /* Virtual */
  effectivePrice:  number;
  hasDiscount:     boolean;
}

/* ── Schema ──────────────────────────────────────────── */
const serviceSchema = new Schema<IService>(
  {
    salon: {
      type:     Schema.Types.ObjectId,
      ref:      "Salon",
      required: [true, "Salon is required"],
      index:    true,
    },
    name: {
      type:      String,
      required:  [true, "Service name is required"],
      trim:      true,
      maxlength: [100, "Name max 100 chars"],
    },
    description: {
      type:      String,
      trim:      true,
      maxlength: [500, "Description max 500 chars"],
    },
    category: {
      type:     String,
      required: [true, "Category is required"],
      enum:     ["Hair","Skin","Nails","Makeup","Spa & Massage","Threading & Waxing","Beard & Grooming","Bridal","Other"],
      index:    true,
    },
    durationMinutes: {
      type:     Number,
      required: [true, "Duration is required"],
      min:      [5, "Min duration 5 minutes"],
      max:      [480, "Max duration 8 hours"],
    },
    price: {
      type:     Number,
      required: [true, "Price is required"],
      min:      [0, "Price cannot be negative"],
    },
    discountedPrice: {
      type:     Number,
      min:      [0, "Discounted price cannot be negative"],
      validate: {
        validator: function (this: IService, val: number) {
          return !val || val < this.price;
        },
        message: "Discounted price must be less than original price",
      },
    },
    discountPercent: { type: Number, min: 0, max: 100 },
    gender:    { type: String, enum: ["Women","Men","Unisex"], default: "Unisex" },
    isPopular: { type: Boolean, default: false },
    isActive:  { type: Boolean, default: true,  index: true  },
    imageUrl:  { type: String },
    sortOrder: { type: Number, default: 0, index: true },
    bookingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ── Virtuals ────────────────────────────────────────── */
serviceSchema.virtual("effectivePrice").get(function () {
  return this.discountedPrice ?? this.price;
});

serviceSchema.virtual("hasDiscount").get(function () {
  return !!this.discountedPrice && this.discountedPrice < this.price;
});

/* ── Pre-save: auto-calc discount percent ────────────── */
serviceSchema.pre("save", function (next) {
  if (this.discountedPrice && this.price > 0) {
    this.discountPercent = Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  } else {
    this.discountPercent = undefined;
  }
  next();
});

/* ── Post-save: update salon minPrice ────────────────── */
serviceSchema.post("save", async function () {
  try {
    const { Salon } = await import("./salon.model");
    const minResult = await mongoose.model("Service").aggregate([
      { $match: { salon: this.salon, isActive: true } },
      { $group: { _id: null, minPrice: { $min: { $ifNull: ["$discountedPrice", "$price"] } } } },
    ]) as Array<{ minPrice: number }>;

    if (minResult[0]) {
      await Salon.findByIdAndUpdate(this.salon, { minPrice: minResult[0].minPrice });
    }
  } catch { /* non-fatal */ }
});

/* ── Indexes ─────────────────────────────────────────── */
serviceSchema.index({ salon: 1, category: 1 });
serviceSchema.index({ salon: 1, isActive: 1, sortOrder: 1 });
serviceSchema.index({ salon: 1, gender: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ bookingCount: -1 });

export const Service = mongoose.model<IService>("Service", serviceSchema);