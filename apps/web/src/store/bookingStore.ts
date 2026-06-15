import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { BookingDraft, BookingItem, TimeSlot } from "@/types/booking";

interface BookingStore {
  draft: BookingDraft | null;

  /* Actions */
  startBooking: (salonId: string, salonSlug: string, salonName: string) => void;
  addService:   (item: BookingItem) => void;
  removeService:(serviceId: string) => void;
  setDate:      (date: string) => void;
  setSlot:      (slot: TimeSlot) => void;
  setNotes:     (notes: string) => void;
  setCoupon:    (code: string) => void;
  nextStep:     () => void;
  prevStep:     () => void;
  clearDraft:   () => void;

  /* Computed helpers */
  totalPrice:    () => number;
  totalDuration: () => number;
}

const STEPS: BookingDraft["step"][] = ["services", "datetime", "confirm", "payment"];

export const useBookingStore = create<BookingStore>()(
  devtools(
    persist(
      (set, get) => ({
        draft: null,

        startBooking: (salonId, salonSlug, salonName) =>
          set({
            draft: {
              salonId, salonSlug, salonName,
              selectedServices: [],
              step: "services",
            },
          }),

        addService: (item) =>
          set((s) => {
            if (!s.draft) return s;
            const exists = s.draft.selectedServices.some((i) => i.serviceId === item.serviceId);
            if (exists) return s;
            return {
              draft: {
                ...s.draft,
                selectedServices: [...s.draft.selectedServices, item],
              },
            };
          }),

        removeService: (serviceId) =>
          set((s) => ({
            draft: s.draft
              ? { ...s.draft, selectedServices: s.draft.selectedServices.filter((i) => i.serviceId !== serviceId) }
              : null,
          })),

        setDate: (date) =>
          set((s) => ({ draft: s.draft ? { ...s.draft, selectedDate: date } : null })),

        setSlot: (slot) =>
          set((s) => ({ draft: s.draft ? { ...s.draft, selectedSlot: slot } : null })),

        setNotes: (notes) =>
          set((s) => ({ draft: s.draft ? { ...s.draft, notes } : null })),

        setCoupon: (couponCode) =>
          set((s) => ({ draft: s.draft ? { ...s.draft, couponCode } : null })),

        nextStep: () =>
          set((s) => {
            if (!s.draft) return s;
            const idx = STEPS.indexOf(s.draft.step);
            const next = STEPS[idx + 1];
            return next ? { draft: { ...s.draft, step: next } } : s;
          }),

        prevStep: () =>
          set((s) => {
            if (!s.draft) return s;
            const idx = STEPS.indexOf(s.draft.step);
            const prev = STEPS[idx - 1];
            return prev ? { draft: { ...s.draft, step: prev } } : s;
          }),

        clearDraft: () => set({ draft: null }),

        totalPrice: () =>
          get().draft?.selectedServices.reduce((sum, i) => sum + i.price, 0) ?? 0,

        totalDuration: () =>
          get().draft?.selectedServices.reduce((sum, i) => sum + i.durationMinutes, 0) ?? 0,
      }),
      { name: "glamr:booking-draft" }
    ),
    { name: "BookingStore" }
  )
);