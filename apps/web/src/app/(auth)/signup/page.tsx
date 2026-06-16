"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Scissors, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input }  from "@/components/ui/Input";

export default function SignupPage() {
  const [form, setForm]       = useState({ name:"", email:"", phone:"", password:"" });
  const [showPass, setShowPass]= useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState<"form"|"otp">("form");
  const [otp, setOtp]         = useState(["","","","","",""]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({...p, [k]: e.target.value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep("otp");
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val;
    setOtp(next);
    if (val && i < 5) (document.getElementById(`otp-${i+1}`) as HTMLInputElement)?.focus();
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Form ──────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Scissors size={18} className="text-black rotate-45" />
          </div>
          <span className="font-display font-bold text-2xl">Glam<span className="text-gradient-gold">r</span></span>
        </Link>

        <div className="max-w-sm w-full">
          {step === "form" ? (
            <>
              <h1 className="font-display font-black text-3xl mb-2">Create account</h1>
              <p className="text-ink-muted mb-8">Join 50,000+ Mumbaikars on Glamr</p>

              <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-surface-border bg-surface-raised hover:border-surface-muted transition-all text-sm font-medium text-ink-secondary mb-6">
                <GoogleIcon /> Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-surface-border" />
                <span className="text-xs text-ink-disabled">or</span>
                <div className="flex-1 h-px bg-surface-border" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" value={form.name} onChange={set("name")} placeholder="Priya Shah" required />
                <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="priya@gmail.com" required autoComplete="email" />
                <Input label="Phone (optional)" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98200 00000" leftIcon={<Phone size={15} />} hint="For appointment reminders via SMS" />
                <Input
                  label="Password" type={showPass?"text":"password"}
                  value={form.password} onChange={set("password")}
                  placeholder="Min. 8 characters" required
                  rightIcon={showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  onRightIconClick={() => setShowPass(p=>!p)}
                />

                <p className="text-xs text-ink-muted">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-brand-400 hover:underline">Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
                </p>

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Create Account
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">📱</div>
              <h1 className="font-display font-black text-3xl mb-2">Verify your email</h1>
              <p className="text-ink-muted mb-8">
                We sent a 6-digit code to <span className="text-ink-primary font-medium">{form.email}</span>
              </p>

              <div className="flex gap-2 justify-between mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                     aria-label={`OTP digit ${i + 1}`}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold bg-surface-raised border border-surface-border rounded-xl text-ink-primary focus:border-brand-500 focus:ring-2 focus:ring-brand-500/12 outline-none transition-all"
                  />
                ))}
              </div>

              <Button variant="primary" size="lg" className="w-full" onClick={() => {}}>
                Verify & Continue
              </Button>

              <button onClick={() => setStep("form")} className="w-full mt-3 text-sm text-ink-muted hover:text-ink-primary transition-colors">
                ← Go back
              </button>

              <p className="text-sm text-center text-ink-muted mt-4">
                Didn&apos;t get it?{" "}
                <button className="text-brand-400 hover:text-brand-300 font-medium">Resend code</button>
              </p>
            </>
          )}

          <p className="text-sm text-ink-muted text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────── */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-surface-card border-l border-surface-border p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gold" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="text-6xl mb-6">💇</div>
          <h2 className="font-display font-black text-3xl mb-4">
            Your beauty journey <span className="text-gradient-gold">starts here</span>
          </h2>
          <p className="text-ink-muted">Discover Mumbai&apos;s finest salons and spas, curated just for you.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label:"1,200+", sub:"Verified Salons" },
              { label:"4.8★",   sub:"Average Rating" },
              { label:"50k+",   sub:"Happy Customers" },
              { label:"Free",   sub:"Cancellation" },
            ].map(({label,sub}) => (
              <div key={sub} className="card p-4 text-center">
                <p className="font-display font-black text-2xl text-brand-400">{label}</p>
                <p className="text-xs text-ink-muted mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}