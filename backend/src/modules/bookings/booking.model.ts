import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  bookingNumber: string;
  user:          mongoose.Types.ObjectId;
  salon:         mongoose.Types.ObjectId;
  salonName:     string;
  salonAddress:  string;
  items: Array<{
    service:         mongoose.Types.ObjectId;
    serviceName:     string;
    stylist?:        string;
    price:           number;
    durationMinutes: number;
  }>;
  scheduledDate:       string;
  scheduledTime:       string;
  endTime:             string;
  totalDurationMinutes:number;
  subtotal:     number;
  discountAmount:number;
  couponCode?:  string;
  taxAmount:    number;
  total:        number;
  status:       "pending"|"confirmed"|"in_progress"|"completed"|"cancelled"|"no_show";
  payment: {
    razorpayOrderId?:   string;
    razorpayPaymentId?: string;
    amount:             number;
    method?:            string;
    status:             "unpaid"|"paid"|"refunded"|"failed";
    paidAt?:            Date;
  };
  notes?:        string;
  cancelReason?: string;
  cancelledBy?:  "customer"|"salon"|"admin";
  createdAt:     Date;
  updatedAt:     Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, unique: true },
    user:          { type: Schema.Types.ObjectId, ref: "User",  required: true },
    salon:         { type: Schema.Types.ObjectId, ref: "Salon", required: true },
    salonName:     { type: String, required: true },
    salonAddress:  { type: String, required: true },

    items: [{
      service:         { type: Schema.Types.ObjectId, ref: "Service", required: true },
      serviceName:     { type: String, required: true },
      stylist:         { type: String },
      price:           { type: Number, required: true },
      durationMinutes: { type: Number, required: true },
    }],

    scheduledDate:        { type: String, required: true },
    scheduledTime:        { type: String, required: true },
    endTime:              { type: String, required: true },
    totalDurationMinutes: { type: Number, required: true },

    subtotal:      { type: Number, required: true },
    discountAmount:{ type: Number, default: 0 },
    couponCode:    { type: String },
    taxAmount:     { type: Number, required: true },
    total:         { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending","confirmed","in_progress","completed","cancelled","no_show"],
      default: "pending",
    },

    payment: {
      razorpayOrderId:   { type: String },
      razorpayPaymentId: { type: String },
      amount:            { type: Number, required: true },
      method:            { type: String },
      status:            { type: String, enum: ["unpaid","paid","refunded","failed"], default: "unpaid" },
      paidAt:            { type: Date },
    },

    notes:        { type: String },
    cancelReason: { type: String },
    cancelledBy:  { type: String, enum: ["customer","salon","admin"] },
  },
  { timestamps: true }
);

/* ── Auto-generate booking number ────────────────────── */
bookingSchema.pre("save", function (next) {
  if (!this.bookingNumber) {
    const date   = new Date();
    const yymm   = `${String(date.getFullYear()).slice(2)}${String(date.getMonth()+1).padStart(2,"0")}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    this.bookingNumber = `GLM-${yymm}-${random}`;
  }
  next();
});

/* ── Indexes ─────────────────────────────────────────── */
bookingSchema.index({ user:  1, createdAt: -1 });
bookingSchema.index({ salon: 1, scheduledDate: 1 });
bookingSchema.index({ salon: 1, status: 1 });
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ "payment.razorpayOrderId": 1 });

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);