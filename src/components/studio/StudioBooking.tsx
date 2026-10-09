import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Send, RefreshCw } from 'lucide-react';

interface StudioBookingProps {
  initialService?: string;
}

export const StudioBooking: React.FC<StudioBookingProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: initialService || 'Wedding Photography',
    preferredDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync if initialService changes from props
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const serviceOptions = [
    'Wedding Photography',
    'Portrait Photography',
    'Pre-Wedding Photography',
    'Product Photography',
    'Event Photography',
    'Cinematic Videography',
  ];

  // Min date today
  const todayStr = new Date().toISOString().split('T')[0];

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please provide your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 7) {
      errs.phone = 'Please provide a valid phone number with area/country code.';
    }

    if (!formData.service) {
      errs.service = 'Please select a photography service.';
    }

    if (!formData.preferredDate) {
      errs.preferredDate = 'Please select a preferred date for your commission.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate brief network latency for realistic feel
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      service: 'Wedding Photography',
      preferredDate: '',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="booking" className="relative py-28 bg-[#08080a] text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
              Commission Our Studio
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
            Begin Your <span className="text-zinc-400 italic">Visual Narrative.</span>
          </h2>

          <p className="text-zinc-400 text-sm mt-3 font-light">
            We accept a limited number of bespoke commissions each season to ensure uncompromising
            artistic dedication.
          </p>
        </div>

        {/* Main Booking Container */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0e0e14] shadow-2xl p-6 sm:p-10 md:p-12 relative">
          {isSubmitted ? (
            /* Submission Feedback Notice (Clearly marked as frontend demo) */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 px-4 flex flex-col items-center text-center max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center text-amber-300 mb-6 shadow-xl shadow-amber-400/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-serif text-white mb-2">
                Consultation Request Received
              </h3>

              <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-[11px] font-mono text-amber-300 uppercase tracking-widest my-3">
                ✦ Frontend Prototype Demo Notice
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-light">
                Thank you, <strong className="text-white font-medium">{formData.fullName}</strong>.
                Your inquiry for <strong className="text-amber-300 font-medium">{formData.service}</strong> on{' '}
                <strong className="text-white font-medium">{formData.preferredDate}</strong> has been
                validated successfully.
              </p>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 text-left text-xs text-zinc-400 space-y-1 mb-8 w-full font-mono">
                <div className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider mb-2">
                  Simulated Commission Payload:
                </div>
                <div>• Name: {formData.fullName}</div>
                <div>• Contact: {formData.email} | {formData.phone}</div>
                <div>• Discipline: {formData.service}</div>
                <div>• Target Date: {formData.preferredDate}</div>
                {formData.message && <div>• Notes: {formData.message}</div>}
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono tracking-wider transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Submit Another Inquiry</span>
              </button>
            </motion.div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs uppercase font-mono tracking-wider text-zinc-300 mb-2"
                  >
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="e.g. Vivienne Westwood"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border ${
                      errors.fullName ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-400'
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase font-mono tracking-wider text-zinc-300 mb-2"
                  >
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="e.g. vivienne@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border ${
                      errors.email ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-400'
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase font-mono tracking-wider text-zinc-300 mb-2"
                  >
                    Phone Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="e.g. +1 (555) 234-5678"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border ${
                      errors.phone ? 'border-red-500/80' : 'border-zinc-800 focus:border-amber-400'
                    } text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.phone && (
                    <p
                      id="phone-error"
                      role="alert"
                      className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Photography Service Selection */}
                <div>
                  <label
                    htmlFor="service"
                    className="block text-xs uppercase font-mono tracking-wider text-zinc-300 mb-2"
                  >
                    Photography Service <span className="text-amber-400">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 text-white text-sm focus:outline-none transition-colors"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-zinc-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label
                  htmlFor="preferredDate"
                  className="block text-xs uppercase font-mono tracking-wider text-zinc-300 mb-2"
                >
                  Preferred Session / Event Date <span className="text-amber-400">*</span>
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  min={todayStr}
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  aria-invalid={!!errors.preferredDate}
                  aria-describedby={errors.preferredDate ? 'date-error' : undefined}
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border ${
                    errors.preferredDate
                      ? 'border-red-500/80'
                      : 'border-zinc-800 focus:border-amber-400'
                  } text-white text-sm focus:outline-none transition-colors`}
                />
                {errors.preferredDate && (
                  <p
                    id="date-error"
                    role="alert"
                    className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.preferredDate}
                  </p>
                )}
              </div>

              {/* Additional Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase font-mono tracking-wider text-zinc-300 mb-2"
                >
                  Project Vision & Additional Notes (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Share details regarding location, aesthetic preferences, estimated guest count, or timeline..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-400 text-white placeholder-zinc-600 text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 active:scale-[0.99] text-zinc-950 font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Validating Commission Details...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-zinc-950" />
                      <span>Request Private Consultation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Note on demo nature */}
              <p className="text-center text-[11px] font-mono text-zinc-500">
                ✦ Client inquiries are validated with strict accessibility standards. Architecture
                ready for REST / GraphQL backend dispatch.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
