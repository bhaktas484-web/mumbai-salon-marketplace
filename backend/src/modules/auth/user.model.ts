import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/* ── Interface ───────────────────────────────────────── */
export interface IUser extends Document {
  _id:             mongoose.Types.ObjectId;
  name:            string;
  email:           string;
  phone?:          string;
  password?:       string;
  avatar?:         string;
  role:            "customer" | "salon_owner" | "admin";
  authProvider:    "email" | "google" | "phone";
  googleId?:       string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive:        boolean;
  loyaltyPoints:   number;
  totalBookings:   number;
  refreshToken?:   string;
  passwordResetToken?:   string;
  passwordResetExpires?: Date;
  emailVerifyToken?:     string;
  emailVerifyExpires?:   Date;
  lastLoginAt?:    Date;
  preferences: {
    preferredAreas:       string[];
    preferredGender:      "Women" | "Men" | "Unisex" | null;
    notificationsEnabled: boolean;
    smsEnabled:           boolean;
    emailEnabled:         boolean;
    reminderMinutes:      15 | 30 | 60 | 120;
  };
  savedAddresses: Array<{
    label:      string;
    area:       string;
    fullAddress:string;
    pincode:    string;
    isDefault:  boolean;
  }>;
  favouriteSalons: mongoose.Types.ObjectId[];
  createdAt:       Date;
  updatedAt:       Date;
  /* Methods */
  comparePassword(candidate: string): Promise<boolean>;
  toSafeJSON(): Omit<IUser, "password" | "refreshToken" | "passwordResetToken">;
}

/* ── Schema ──────────────────────────────────────────── */
const userSchema = new Schema<IUser>(
  {
    name:  { type: String, required: [true, "Name is required"], trim: true, maxlength: [60, "Name max 60 chars"] },
    email: {
      type:     String, required: [true, "Email is required"],
      unique:   true,   lowercase: true, trim: true,
      match:    [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type:   String,
      sparse: true,
      match:  [/^\+?[1-9]\d{9,14}$/, "Invalid phone number"],
    },
    password:     { type: String, select: false, minlength: [8, "Password min 8 chars"] },
    avatar:       { type: String, default: null },
    role:         { type: String, enum: ["customer","salon_owner","admin"], default: "customer" },
    authProvider: { type: String, enum: ["email","google","phone"],         default: "email"    },
    googleId:     { type: String, sparse: true },

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive:        { type: Boolean, default: true  },
    loyaltyPoints:   { type: Number,  default: 0,    min: 0 },
    totalBookings:   { type: Number,  default: 0,    min: 0 },

    /* Tokens (never sent to client) */
    refreshToken:          { type: String,  select: false },
    passwordResetToken:    { type: String,  select: false },
    passwordResetExpires:  { type: Date,    select: false },
    emailVerifyToken:      { type: String,  select: false },
    emailVerifyExpires:    { type: Date,    select: false },

    lastLoginAt: { type: Date },

    preferences: {
      preferredAreas:       { type: [String], default: [] },
      preferredGender:      { type: String, default: null },
      notificationsEnabled: { type: Boolean, default: true  },
      smsEnabled:           { type: Boolean, default: true  },
      emailEnabled:         { type: Boolean, default: true  },
      reminderMinutes:      { type: Number,  default: 60, enum: [15, 30, 60, 120] },
    },

    savedAddresses: [
      {
        label:       { type: String, required: true },
        area:        { type: String, required: true },
        fullAddress: { type: String, required: true },
        pincode:     { type: String, required: true },
        isDefault:   { type: Boolean, default: false },
      },
    ],

    favouriteSalons: [{ type: Schema.Types.ObjectId, ref: "Salon" }],
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

/* ── Pre-save: hash password ─────────────────────────── */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err as Error);
  }
});

/* ── Pre-save: update lastLoginAt on refresh token change */
userSchema.pre("save", function (next) {
  if (this.isModified("refreshToken") && this.refreshToken) {
    this.lastLoginAt = new Date();
  }
  next();
});

/* ── Instance method: compare password ───────────────── */
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password as string);
};

/* ── Instance method: safe JSON (strips secrets) ─────── */
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject() as Record<string, unknown>;
  delete obj["password"];
  delete obj["refreshToken"];
  delete obj["passwordResetToken"];
  delete obj["passwordResetExpires"];
  delete obj["emailVerifyToken"];
  delete obj["emailVerifyExpires"];
  return obj;
};

/* ── Indexes ─────────────────────────────────────────── */
userSchema.index({ email:    1 });
userSchema.index({ role:     1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ phone:    1 }, { sparse: true });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>("User", userSchema);