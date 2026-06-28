"use client";

import { useState } from "react";
import { AlertTriangle, Activity, Zap, RotateCcw, Bell, BarChart2 } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen">

      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm tracking-tight">RN Health</span>
        </div>
        <a
          href="#waitlist"
          className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Now in development — join the waitlist
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Know exactly when your{" "}
          <span className="text-emerald-400">OTA update</span>{" "}
          broke production
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10">
          RN Health Dashboard correlates your Expo EAS releases with Sentry crash rates automatically —
          and alerts your Slack the moment something goes wrong.
        </p>

        {/* Waitlist Form */}
        <form
          id="waitlist"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {status === "loading"
              ? "Joining..."
              : status === "success"
              ? "You're in!"
              : "Join Waitlist"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-3 text-sm text-emerald-400">
            You&apos;re on the list. We&apos;ll notify you when we launch.
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">
            Something went wrong. Try again.
          </p>
        )}

        <p className="mt-4 text-xs text-white/25">No spam. Unsubscribe anytime.</p>
      </section>

      {/* Problem Section */}
      <section className="border-t border-white/10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/40 uppercase tracking-widest text-center mb-12">The Problem</p>
          <h2 className="text-3xl font-bold text-center mb-4">Your tools are scattered</h2>
          <p className="text-white/50 text-center max-w-xl mx-auto mb-14">
            You pushed an OTA update 2 hours ago. Users are complaining. You have no idea if the update caused it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { tool: "Sentry", label: "Crash reports", color: "text-orange-400" },
              { tool: "Expo EAS", label: "OTA releases", color: "text-blue-400" },
              { tool: "App Store", label: "User reviews", color: "text-yellow-400" },
            ].map((item) => (
              <div
                key={item.tool}
                className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
              >
                <p className={`text-sm font-semibold ${item.color} mb-1`}>{item.tool}</p>
                <p className="text-xs text-white/40">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 text-white/30 text-sm">
            Three tabs. Three tools. Zero correlation.
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/40 uppercase tracking-widest text-center mb-12">What you get</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <BarChart2 className="w-5 h-5 text-emerald-400" />,
                title: "Crash Rate per Bundle",
                desc: "See crash rate broken down by OTA bundle version, not just time.",
              },
              {
                icon: <Zap className="w-5 h-5 text-emerald-400" />,
                title: "Instant Spike Detection",
                desc: "Automatically detects when crash rate spikes after an OTA push.",
              },
              {
                icon: <Bell className="w-5 h-5 text-emerald-400" />,
                title: "Slack Alerts",
                desc: "Get notified in Slack the moment your threshold is crossed.",
              },
              {
                icon: <RotateCcw className="w-5 h-5 text-emerald-400" />,
                title: "One-Click Rollback",
                desc: "Roll back to the previous stable bundle from the alert or dashboard.",
              },
              {
                icon: <Activity className="w-5 h-5 text-emerald-400" />,
                title: "OTA Rollout Tracking",
                desc: "Live rollout % per bundle from Expo EAS in real time.",
              },
              {
                icon: <AlertTriangle className="w-5 h-5 text-emerald-400" />,
                title: "Warning Banner",
                desc: "Dashboard shows a red flag when a new bundle looks unstable.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-12">How it works</p>
          <div className="flex flex-col gap-8">
            {[
              { step: "01", title: "Connect your tools", desc: "Add your Sentry API key and Expo EAS token. Takes 2 minutes." },
              { step: "02", title: "Push your OTA update", desc: "As usual. We start monitoring crash rate automatically from that moment." },
              { step: "03", title: "Get alerted instantly", desc: "If crash rate spikes beyond your threshold, Slack alert fires with a rollback link." },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 text-left">
                <span className="text-2xl font-bold text-emerald-500/30 font-mono w-10 shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-white/10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-white/40 uppercase tracking-widest text-center mb-12">Pricing</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                plan: "Free",
                price: "$0",
                desc: "For solo devs getting started",
                features: ["1 project", "7-day history", "Basic dashboard"],
                highlight: false,
              },
              {
                plan: "Pro",
                price: "$29",
                desc: "For indie teams shipping fast",
                features: ["5 projects", "30-day history", "Slack alerts", "One-click rollback"],
                highlight: true,
              },
              {
                plan: "Team",
                price: "$79",
                desc: "For growing RN teams",
                features: ["Unlimited projects", "90-day history", "Slack + Email alerts", "Team members"],
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.plan}
                className={`rounded-xl p-6 border ${
                  p.highlight
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {p.highlight && (
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full mb-3 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-lg">{p.plan}</h3>
                <p className="text-3xl font-bold mt-1">
                  {p.price}
                  <span className="text-sm font-normal text-white/40">/mo</span>
                </p>
                <p className="text-xs text-white/40 mt-1 mb-5">{p.desc}</p>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 py-24 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Stop guessing. Start knowing.</h2>
        <p className="text-white/50 text-sm mb-8">Join the waitlist — early access coming soon.</p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors whitespace-nowrap"
          >
            {status === "success" ? "You're in!" : "Join Waitlist"}
          </button>
        </form>
        {status === "success" && (
          <p className="mt-3 text-sm text-emerald-400">You&apos;re on the list.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-white/25">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-white/40">RN Health Dashboard</span>
        </div>
        Built for React Native teams · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
