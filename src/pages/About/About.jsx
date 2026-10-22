import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Users,
  Target,
  Eye,
  CheckCircle2,
  Stethoscope,
  Clock3,
  Sparkles,
} from "lucide-react";
import "./About.css";

const values = [
  {
    icon: HeartPulse,
    title: "Patient First",
    description:
      "Every recovery journey is unique. We focus on individual needs, comfort, and meaningful progress.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description:
      "We believe in transparent communication, responsible care, and building confidence throughout recovery.",
  },
  {
    icon: Target,
    title: "Personalized Care",
    description:
      "Rehabilitation plans should reflect each person's goals, abilities, and recovery requirements.",
  },
  {
    icon: Sparkles,
    title: "Continuous Progress",
    description:
      "We celebrate small improvements and encourage consistent effort toward better mobility and independence.",
  },
];

const benefits = [
  "Personalized rehabilitation journeys",
  "Easy access to physiotherapy services",
  "A focus on mobility and everyday independence",
  "Clear communication throughout recovery",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <main className="rehab-about">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-container about-hero-grid">
          <motion.div
            className="about-hero-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="about-eyebrow">
              <Activity size={16} />
              ABOUT REHABICS
            </span>

            <h1>
              Better movement.
              <br />
              <span>Better living.</span>
            </h1>

            <p>
              We are building a more approachable rehabilitation experience
              that helps patients connect with physiotherapy care and work
              toward a more active, confident life.
            </p>

            <div className="about-hero-actions">
              <Link to="/services" className="about-btn about-btn-primary">
                Explore Our Services
                <ArrowRight size={18} />
              </Link>

              <Link to="/contact" className="about-btn about-btn-secondary">
                Get in Touch
              </Link>
            </div>

            <div className="about-trust-note">
              <span className="about-trust-icon">
                <CheckCircle2 size={17} />
              </span>
              <span>Care that puts your recovery journey first</span>
            </div>
          </motion.div>

          <motion.div
            className="about-hero-visual"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="about-image-frame">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=85"
                alt="Healthcare professional supporting patient care"
              />

              <div className="about-image-overlay" />

              <div className="about-floating-card">
                <div className="about-floating-icon">
                  <HeartPulse size={22} />
                </div>
                <div>
                  <strong>Your journey matters</strong>
                  <span>Care with purpose</span>
                </div>
              </div>
            </div>

            <div className="about-hero-decoration about-decoration-one" />
            <div className="about-hero-decoration about-decoration-two" />
          </motion.div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="about-intro section-space">
        <div className="about-container about-intro-grid">
          <motion.div
            className="about-section-heading"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="about-eyebrow">WHO WE ARE</span>
            <h2>
              Recovery should feel like a <span>journey, not a struggle.</span>
            </h2>
          </motion.div>

          <motion.div
            className="about-intro-copy"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <p>
              Rehabics is designed around a simple idea: accessing
              rehabilitation care should feel clear, supportive, and
              patient-focused.
            </p>
            <p>
              Whether someone is working to improve mobility, regain strength,
              or return to everyday activities, the right support and
              consistency can make the journey easier to navigate.
            </p>
            <p>
              Our goal is to bring patients and physiotherapy professionals
              together through a convenient, thoughtful digital experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="about-purpose section-space">
        <div className="about-container">
          <div className="about-purpose-grid">
            <motion.article
              className="about-purpose-card about-mission-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="about-purpose-icon">
                <Target size={26} />
              </div>
              <span className="about-card-label">OUR MISSION</span>
              <h3>Make rehabilitation more accessible.</h3>
              <p>
                To create a patient-focused platform that simplifies the
                journey toward finding physiotherapy support and staying
                engaged with recovery goals.
              </p>
              <div className="about-card-watermark">
                <Target size={100} />
              </div>
            </motion.article>

            <motion.article
              className="about-purpose-card about-vision-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="about-purpose-icon">
                <Eye size={26} />
              </div>
              <span className="about-card-label">OUR VISION</span>
              <h3>A future with more confident movement.</h3>
              <p>
                To help make quality rehabilitation experiences easier to
                discover, more convenient to access, and more connected to
                everyday life.
              </p>
              <div className="about-card-watermark">
                <Eye size={100} />
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="about-values section-space">
        <div className="about-container">
          <motion.div
            className="about-centered-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="about-eyebrow">WHAT GUIDES US</span>
            <h2>
              The values behind <span>every step.</span>
            </h2>
            <p>
              Thoughtful principles that shape the experience we want to
              create for patients and physiotherapy professionals.
            </p>
          </motion.div>

          <motion.div
            className="about-values-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.article
                  className="about-value-card"
                  variants={itemVariants}
                  key={value.title}
                  whileHover={{ y: -7 }}
                >
                  <div className="about-value-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                  <div className="about-value-arrow">
                    <ArrowRight size={18} />
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* PATIENT EXPERIENCE */}
      <section className="about-experience section-space">
        <div className="about-container about-experience-grid">
          <motion.div
            className="about-experience-visual"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
          >
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=85"
              alt="A welcoming healthcare environment"
              loading="lazy"
            />

            <div className="about-experience-badge">
              <Users size={20} />
              <span>People at the heart of care</span>
            </div>
          </motion.div>

          <motion.div
            className="about-experience-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.span className="about-eyebrow" variants={itemVariants}>
              THE REHABICS APPROACH
            </motion.span>

            <motion.h2 variants={itemVariants}>
              Your recovery is personal. Your care should be too.
            </motion.h2>

            <motion.p variants={itemVariants}>
              Every person has different goals, challenges, and circumstances.
              Rehabics aims to support that individuality with a more
              connected and convenient rehabilitation experience.
            </motion.p>

            <motion.div className="about-benefits-list" variants={itemVariants}>
              {benefits.map((benefit) => (
                <div className="about-benefit-item" key={benefit}>
                  <CheckCircle2 size={19} />
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/services" className="about-text-link">
                Discover how it works
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="about-process section-space">
        <div className="about-container">
          <motion.div
            className="about-centered-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="about-eyebrow">YOUR NEXT STEPS</span>
            <h2>
              A clearer path to <span>care.</span>
            </h2>
            <p>
              A simple starting point for connecting with the services you
              need.
            </p>
          </motion.div>

          <div className="about-process-grid">
            <motion.article
              className="about-process-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="about-step-number">01</span>
              <div className="about-process-icon">
                <Users size={24} />
              </div>
              <h3>Explore</h3>
              <p>
                Discover the available physiotherapy services and find the
                information that fits your needs.
              </p>
            </motion.article>

            <motion.article
              className="about-process-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="about-step-number">02</span>
              <div className="about-process-icon">
                <Stethoscope size={24} />
              </div>
              <h3>Connect</h3>
              <p>
                Take the next step toward connecting with a physiotherapy
                professional through the available platform options.
              </p>
            </motion.article>

            <motion.article
              className="about-process-card"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="about-step-number">03</span>
              <div className="about-process-icon">
                <Clock3 size={24} />
              </div>
              <h3>Keep progressing</h3>
              <p>
                Stay focused on your recovery goals and follow the guidance
                provided by your healthcare professional.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="about-container">
          <motion.div
            className="about-cta-card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-cta-content">
              <span className="about-cta-label">
                YOUR JOURNEY STARTS HERE
              </span>
              <h2>Take the next step toward better movement.</h2>
              <p>
                Explore our services and discover the rehabilitation support
                available through Rehabics.
              </p>
            </div>

            <div className="about-cta-actions">
              <Link to="/services" className="about-btn about-cta-primary">
                Explore Services
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="about-cta-contact">
                Have questions? Contact us
              </Link>
            </div>

            <div className="about-cta-decoration" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}