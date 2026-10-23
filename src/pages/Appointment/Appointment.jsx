import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Video,
} from "lucide-react";
import "./Appointment.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  appointmentType: "Online physiotherapy",
  preferredDate: "",
  preferredTime: "Morning (9 AM to 12 PM)",
  notes: "",
};

export default function Appointment() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const today = useMemo(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      `Rehabics appointment request: ${form.fullName}`,
    );
    const body = encodeURIComponent(
      `Hello Rehabics team,\n\nI would like to request an appointment.\n\nName: ${form.fullName}\nEmail: ${form.email}\nPhone: ${form.phone}\nAppointment type: ${form.appointmentType}\nPreferred date: ${form.preferredDate}\nPreferred time: ${form.preferredTime}\nAdditional notes: ${form.notes || "None"}\n\nPlease contact me to confirm availability.\n`,
    );
    window.location.href = `mailto:hello@rehabics.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="rehabics-appointment">
      <section className="ap-hero">
        <div className="ap-glow ap-glow-one" />
        <div className="ap-container ap-hero-grid">
          <motion.div
            className="ap-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="ap-eyebrow">
              <Sparkles size={14} /> Your recovery starts here
            </span>
            <h1>
              Make time for <span>your wellbeing.</span>
            </h1>
            <p>
              Request a physiotherapy appointment that works for your schedule.
              Tell us what you need and our team can follow up to confirm the
              details.
            </p>
            <div className="ap-hero-points">
              <span>
                <CheckCircle2 size={16} /> Personalised care
              </span>
              <span>
                <CheckCircle2 size={16} /> Flexible appointment request
              </span>
            </div>
            <Link className="ap-hero-link" to="/services">
              Explore our services <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div
            className="ap-hero-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=90"
              alt="Physiotherapist discussing a care plan with a patient"
            />
            <div className="ap-visual-shade" />
            <div className="ap-floating-card">
              <span className="ap-floating-icon">
                <CalendarDays size={20} />
              </span>
              <div>
                <b>Plan your visit</b>
                <small>Choose your preferred date and time</small>
              </div>
            </div>
            <div className="ap-image-badge">
              <HeartPulse size={17} /> Care with purpose
            </div>
          </motion.div>
        </div>
      </section>

      <section className="ap-process">
        <div className="ap-container ap-process-grid">
          <div className="ap-process-item">
            <span>01</span>
            <div>
              <b>Share your preference</b>
              <small>Choose a service and suitable time.</small>
            </div>
          </div>
          <div className="ap-process-item">
            <span>02</span>
            <div>
              <b>Our team follows up</b>
              <small>We can discuss your request.</small>
            </div>
          </div>
          <div className="ap-process-item">
            <span>03</span>
            <div>
              <b>Confirm your session</b>
              <small>Your booking is confirmed separately.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="ap-booking-section" id="appointment-form">
        <div className="ap-container ap-booking-grid">
          <motion.aside
            className="ap-side"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
          >
            <span className="ap-section-label">Appointment request</span>
            <h2>
              Let’s find a time that <span>works for you.</span>
            </h2>
            <p>
              Complete the details below. Your preferred slot is a request only
              and will need confirmation from the Rehabics team.
            </p>
            <div className="ap-benefit">
              <span>
                <Video size={19} />
              </span>
              <div>
                <b>Online sessions</b>
                <small>Request a remote consultation where available.</small>
              </div>
            </div>
            <div className="ap-benefit">
              <span>
                <UserRound size={19} />
              </span>
              <div>
                <b>Physiotherapy support</b>
                <small>
                  Tell us which type of support you are looking for.
                </small>
              </div>
            </div>
            <div className="ap-benefit">
              <span>
                <ShieldCheck size={19} />
              </span>
              <div>
                <b>Privacy first</b>
                <small>
                  Avoid adding sensitive medical information in this form.
                </small>
              </div>
            </div>
            <div className="ap-help-card">
              <span>
                <Phone size={17} />
              </span>
              <div>
                <b>Need help first?</b>
                <small>Send a general enquiry and we can guide you.</small>
                <Link to="/contact">
                  Contact our team <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.aside>

          <motion.form
            className="ap-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45 }}
          >
            <div className="ap-form-head">
              <div>
                <span>BOOKING DETAILS</span>
                <h3>Request an appointment</h3>
                <p>Fields marked with * are required.</p>
              </div>
              <span className="ap-form-icon">
                <CalendarDays size={21} />
              </span>
            </div>
            <div className="ap-form-fields">
              <label>
                Full name <i>*</i>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email address <i>*</i>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Phone number <i>*</i>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </label>
              <label>
                Appointment type <i>*</i>
                <select
                  name="appointmentType"
                  value={form.appointmentType}
                  onChange={updateField}
                  required
                >
                  <option>Online physiotherapy</option>
                  <option>In clinic physiotherapy</option>
                  <option>Initial consultation</option>
                  <option>Follow up session</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>
                Preferred date <i>*</i>
                <input
                  type="date"
                  name="preferredDate"
                  value={form.preferredDate}
                  onChange={updateField}
                  min={today}
                  required
                />
              </label>
              <label>
                Preferred time <i>*</i>
                <select
                  name="preferredTime"
                  value={form.preferredTime}
                  onChange={updateField}
                  required
                >
                  <option>Morning (9 AM to 12 PM)</option>
                  <option>Afternoon (12 PM to 4 PM)</option>
                  <option>Evening (4 PM to 7 PM)</option>
                  <option>Flexible</option>
                </select>
              </label>
              <label className="ap-full-field">
                Anything else we should know?
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  placeholder="Optional: share a brief note about your request"
                  rows={3}
                />
              </label>
            </div>
            <button className="ap-submit" type="submit">
              Prepare appointment request <ArrowRight size={16} />
            </button>
            {submitted && (
              <p className="ap-feedback" role="status">
                Your email app should open with your appointment request
                prepared. Please review and send it. Your slot is not confirmed
                yet.
              </p>
            )}
            <p className="ap-disclaimer">
              <ShieldCheck size={14} /> This form requests an appointment. It
              does not confirm availability or replace professional medical
              advice.
            </p>
          </motion.form>
        </div>
      </section>

      <section className="ap-bottom">
        <div className="ap-container ap-bottom-inner">
          <span className="ap-bottom-symbol">
            <HeartPulse size={25} />
          </span>
          <div>
            <span className="ap-section-label">One step at a time</span>
            <h2>Ready to take the next step?</h2>
            <p>Learn about Rehabics services or ask our team a question.</p>
          </div>
          <div className="ap-bottom-actions">
            <Link to="/services">
              View services <ArrowRight size={15} />
            </Link>
            <Link to="/contact">
              Contact us <Mail size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
