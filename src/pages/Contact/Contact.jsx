import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import "./Contact.css";

const contactDetails = [
  {
    icon: Phone,
    title: "Call our team",
    detail: "Speak with our care team",
    action: "tel:+910000000000",
    actionLabel: "Call us",
  },
  {
    icon: Mail,
    title: "Email us",
    detail: "Send us your questions",
    action: "mailto:hello@rehabics.com",
    actionLabel: "Send an email",
  },
  {
    icon: MapPin,
    title: "Visit us",
    detail: "Ask us about clinic locations",
    action: "#contact-form",
    actionLabel: "Send an enquiry",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  reason: "Physiotherapy enquiry",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Rehabics enquiry: ${form.reason}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "Not provided"}\nReason: ${form.reason}\n\nMessage:\n${form.message}`,
    );
    window.location.href = `mailto:hello@rehabics.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="rehabics-contact">
      <section className="ct-hero">
        <div className="ct-orb ct-orb-one" />
        <div className="ct-orb ct-orb-two" />
        <div className="ct-container ct-hero-grid">
          <motion.div
            className="ct-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="ct-pill">
              <Sparkles size={14} /> Contact Rehabics
            </span>
            <h1>
              Let’s talk about <span>your next step.</span>
            </h1>
            <p>
              Questions about physiotherapy or your recovery journey? Reach out
              to our team. We’re here to help you understand the options and
              find a suitable next step.
            </p>
            <a className="ct-text-link" href="#contact-form">
              Send us a message <ArrowRight size={16} />
            </a>
            <div className="ct-hero-note">
              <span>
                <ShieldCheck size={19} />
              </span>
              <p>
                <b>Your enquiry matters</b>
                <small>Share only the information needed to contact you.</small>
              </p>
            </div>
          </motion.div>
          <motion.div
            className="ct-hero-image"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1300&q=90"
              alt="Healthcare professional talking with a patient"
            />
            <div className="ct-image-overlay" />
            <div className="ct-image-card">
              <span>
                <MessageCircle size={19} />
              </span>
              <div>
                <b>We’re listening</b>
                <small>Let’s find the right next step</small>
              </div>
            </div>
            <div className="ct-image-tag">
              <HeartPulseFallback /> Care starts
              <br />
              with a conversation
            </div>
          </motion.div>
        </div>
      </section>

      <section className="ct-contact-cards">
        <div className="ct-container ct-cards-grid">
          {contactDetails.map(
            ({ icon: Icon, title, detail, action, actionLabel }, index) => (
              <motion.article
                className="ct-info-card"
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <span className="ct-info-icon">
                  <Icon size={21} />
                </span>
                <div className="ct-info-copy">
                  <h2>{title}</h2>
                  <p>{detail}</p>
                  <a href={action}>
                    {actionLabel} <ArrowRight size={14} />
                  </a>
                </div>
              </motion.article>
            ),
          )}
        </div>
      </section>

      <section className="ct-section" id="contact-form">
        <div className="ct-container ct-form-grid">
          <motion.div
            className="ct-form-intro"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
          >
            <span className="ct-label">Get in touch</span>
            <h2>
              Tell us how we can <span>help you.</span>
            </h2>
            <p>
              Fill in the form and your email app will open with your message
              prepared. You can review it before sending.
            </p>
            <div className="ct-availability">
              <span>
                <Clock3 size={18} />
              </span>
              <div>
                <b>Prefer a quick conversation?</b>
                <small>
                  Use the contact options above to reach out directly.
                </small>
              </div>
            </div>
            <div className="ct-assurance">
              <CheckCircle2 size={17} /> No account required to send an enquiry
            </div>
            <div className="ct-assurance">
              <ShieldCheck size={17} /> Please do not include urgent or highly
              sensitive medical details
            </div>
          </motion.div>

          <motion.form
            className="ct-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45 }}
          >
            <div className="ct-form-heading">
              <div>
                <span>CONTACT FORM</span>
                <h3>Send an enquiry</h3>
              </div>
              <span className="ct-form-heading-icon">
                <Send size={18} />
              </span>
            </div>
            <div className="ct-fields">
              <label>
                Full name <span>*</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Email address <span>*</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="Your contact number"
                  autoComplete="tel"
                />
              </label>
              <label>
                What can we help with? <span>*</span>
                <select
                  name="reason"
                  value={form.reason}
                  onChange={updateField}
                  required
                >
                  <option>Physiotherapy enquiry</option>
                  <option>Online consultation</option>
                  <option>Services and pricing</option>
                  <option>Technical support</option>
                  <option>Other question</option>
                </select>
              </label>
              <label className="ct-field-full">
                Your message <span>*</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  placeholder="Tell us briefly how we can help..."
                  rows={4}
                  required
                />
              </label>
            </div>
            <button type="submit" className="ct-submit">
              Prepare email <ArrowRight size={16} />
            </button>
            {submitted && (
              <p className="ct-form-feedback" role="status">
                Your email app should open with the enquiry prepared. Please
                review and send it there.
              </p>
            )}
            <p className="ct-form-privacy">
              By contacting us, you agree to use this form for general enquiries
              only.
            </p>
          </motion.form>
        </div>
      </section>

      <section className="ct-bottom">
        <div className="ct-container ct-bottom-inner">
          <div className="ct-bottom-icon">
            <Stethoscope size={26} />
          </div>
          <div>
            <span className="ct-label">Need a place to start?</span>
            <h2>Explore the care that fits your goals.</h2>
            <p>Learn more about the services available through Rehabics.</p>
          </div>
          <Link to="/services" className="ct-bottom-btn">
            Explore services <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function HeartPulseFallback() {
  return <HeartIcon />;
}

function HeartIcon() {
  return <span aria-hidden="true">♡</span>;
}
