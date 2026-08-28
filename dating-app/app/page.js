"use client";

import { useState } from "react";

export default function HomePage() {
  const [form, setForm] = useState({
    codeName: "",
    email: "",
    gender: "",
    remarks: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(data.message);

      setForm({
        codeName: "",
        email: "",
        gender: "",
        remarks: "",
      });
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen paper-seam flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Eyebrow */}
        <p className="text-center text-mist text-xs tracking-[0.3em] uppercase mb-4">
          Entry by introduction only
        </p>

        {/* Hero */}
        <h1 className="text-center font-display text-5xl sm:text-6xl italic text-parchment leading-tight mb-3">
          Say hello,
          <br />
          anonymously.
        </h1>

        <p className="text-center text-mist text-sm max-w-sm mx-auto mb-10">
          Leave a code name, an email, and a few words about yourself.
          We'll verify you're real, then quietly make the introduction.
        </p>

        {/* Card */}
        <div className="relative bg-parchment text-ink rounded-2xl shadow-2xl px-7 py-8 sm:px-9 sm:py-10">

          {/* Seal */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-rose shadow-md border-4 border-ink/90" />

          {status === "success" ? (
            <div className="text-center py-6">
              <p className="font-display italic text-3xl text-roseDeep mb-2">
                Almost there
              </p>

              <p className="text-ink/70 text-sm">
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Code Name */}
              <div>
                <label
                  htmlFor="codeName"
                  className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
                >
                  Code name
                </label>

                <input
                  id="codeName"
                  name="codeName"
                  type="text"
                  required
                  value={form.codeName}
                  onChange={handleChange}
                  placeholder="e.g. Blue Fox"
                  className="w-full border-b border-ink/20 bg-transparent py-2 outline-none focus:border-roseDeep transition-colors placeholder:text-ink/30"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border-b border-ink/20 bg-transparent py-2 outline-none focus:border-roseDeep transition-colors placeholder:text-ink/30"
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  required
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border-b border-ink/20 bg-transparent py-2 outline-none focus:border-roseDeep transition-colors"
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label
                  htmlFor="remarks"
                  className="block text-xs uppercase tracking-widest text-ink/60 mb-1"
                >
                  Remarks
                </label>

                <textarea
                  id="remarks"
                  name="remarks"
                  rows={3}
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="A line or two about you..."
                  className="w-full border-b border-ink/20 bg-transparent py-2 outline-none focus:border-roseDeep transition-colors placeholder:text-ink/30 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-roseDeep hover:bg-rose transition-colors text-parchment py-3 rounded-lg font-medium tracking-wide disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Submit"}
              </button>

              {/* Error */}
              {status === "error" && (
                <p className="text-center text-sm text-red-600">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-mist text-xs mt-8">
          No dashboards. No matching algorithms. Just a quiet note, verified.
        </p>

      </div>
    </main>
  );
}