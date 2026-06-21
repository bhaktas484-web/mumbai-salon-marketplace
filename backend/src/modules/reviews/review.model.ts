import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user:       mongoose.Types.ObjectId;
  salon:      mongoose.Types.ObjectId;
  booking:    mongoose.Types.ObjectId;
  rating:     number;
  comment:    string;
  images?:    string[];
  serviceUsed?:string;
  ratings: {
    cleanliness:   number;
    service:       number;
    valueForMoney: number;
    ambiance:      number;
  };
  isVerified: boolean;
  ownerReply?: {
    text:      string;
    repliedAt: Date;
  };
  createdAt:  Date;
  updatedAt:  Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user:    { type: Schema.Types.ObjectId, ref: "User",    required: true },
    salon:   { type: Schema.Types.ObjectId, ref: "Salon",   required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, minlength: 10, maxlength: 1000 },
    images:  [{ type: String }],
    serviceUsed: { type: String },
    ratings: {
      cleanliness:   { type: Number, min: 1, max: 5 },
      service:       { type: Number, min: 1, max: 5 },
      valueForMoney: { type: Number, min: 1, max: 5 },
      ambiance:      { type: Number, min: 1, max: 5 },
    },
    isVerified: { type: Boolean, default: true },
    ownerReply: {
      text:      { type: String },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true }
);

/* ── After save: recalculate salon rating ────────────── */
reviewSchema.post("save", async function () {
  const { Salon } = await import("../salons/salon.model");
  const stats = await mongoose.model("Review").aggregate([
    { $match: { salon: this.salon } },
    {
      $group: {
        _id:             "$salon",
        avgRating:       { $avg: "$rating" },
        avgCleanliness:  { $avg: "$ratings.cleanliness" },
        avgService:      { $avg: "$ratings.service" },
        avgValue:        { $avg: "$ratings.valueForMoney" },
        avgAmbiance:     { $avg: "$ratings.ambiance" },
        totalReviews:    { $sum: 1 },
      },
    },
  ]);

  if (stats[0]) {
    const s = stats[0] as {
      avgRating: number; avgCleanliness: number; avgService: number;
      avgValue: number; avgAmbiance: number; totalReviews: number;
    };
    await Salon.findByIdAndUpdate(this.salon, {
      "rating.overall":       Math.round(s.avgRating * 10) / 10,
      "rating.cleanliness":   Math.round((s.avgCleanliness ?? s.avgRating) * 10) / 10,
      "rating.service":       Math.round((s.avgService ?? s.avgRating) * 10) / 10,
      "rating.valueForMoney": Math.round((s.avgValue ?? s.avgRating) * 10) / 10,
      "rating.ambiance":      Math.round((s.avgAmbiance ?? s.avgRating) * 10) / 10,
      "rating.totalReviews":  s.totalReviews,
    });
  }
});

reviewSchema.index({ salon: 1, createdAt: -1 });
reviewSchema.index({ user:  1 });
reviewSchema.index({ booking: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);