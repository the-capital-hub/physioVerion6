
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  HeartPulse,
  ShieldCheck,
  CalendarCheck,
  ClipboardCheck,
  Stethoscope,
  Footprints,
  CheckCircle2,
  Clock3,
  Sparkles,
  Plus,
  Minus,
  MoveRight,
  Menu,
  MessageCircle,
  Target,
  UsersRound,
} from "lucide-react";

import "./Home.css";

const services = [
  {
    icon: Activity,
    number: "01",
    title: "Pain Management",
    description:
      "Understand your discomfort and explore suitable ways to improve everyday movement.",
    tag: "Move with confidence",
  },
  {
    icon: Footprints,
    number: "02",
    title: "Mobility & Rehabilitation",
    description:
      "Work towards better mobility, flexibility and functional movement with guided support.",
    tag: "Progress at your pace",
  },
  {
    icon: HeartPulse,
    number: "03",
    title: "Personalised Physiotherapy",
    description:
      "Explore care options shaped around your concerns, assessment and individual goals.",
    tag: "Care centred on you",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about yourself",
    description:
      "Share your concerns, your movement goals and what you would like help with.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Connect with a professional",
    description:
      "Explore suitable services and discuss your needs with a physiotherapy professional.",
    icon: Stethoscope,
  },
  {
    number: "03",
    title: "Plan your next step",
    description:
      "Understand your options and work towards goals agreed with your care professional.",
    icon: Target,
  },
];

const benefits = [
  {
    icon: UsersRound,
    title: "Patient-first approach",
    description:
      "Your concerns, preferences and everyday goals deserve to be heard.",
  },
  {
    icon: ShieldCheck,
    title: "Informed care",
    description:
      "Understand the options discussed with you and feel comfortable asking questions.",
  },
  {
    icon: ClipboardCheck,
    title: "A clearer care journey",
    description:
      "Know what to prepare, what to ask and what your next steps may look like.",
  },
];

const faqs = [
  {
    question: "How do I get started with Rehabics?",
    answer:
      "Start by exploring our services or visiting the appointment page. You can enquire about available options and confirm the arrangements before your visit.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer:
      "If available, bring relevant medical reports, prescriptions and previous assessment notes. It can also help to write down your concerns and questions.",
  },
  {
    question: "Can I find a physiotherapist through Rehabics?",
    answer:
      "Use the therapist page to explore the options available in your application. Availability and appointment details should be confirmed before booking.",
  },
  {
    question: "Will my treatment plan be personalised?",
    answer:
      "Care recommendations depend on your individual circumstances and an appropriate professional assessment. Your goals can help guide discussions about suitable options.",
  },
  {
    question: "How long does recovery take?",
    answer:
      "Recovery varies from person to person and depends on many factors. Your healthcare professional can discuss realistic expectations after assessing your needs.",
  },
];

function Eyebrow({ children }) {
  return (
    <span className="home-eyebrow">
      <span className="home-eyebrow-dot" />
      {children}
    </span>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.12 },
          transition: {
            duration: 0.55,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        };

  return (
    <main className="rehab-home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-glow home-hero-glow-one" />
        <div className="home-hero-glow home-hero-glow-two" />

        <div className="home-container home-hero-layout">
          <motion.div className="home-hero-copy" {...reveal()}>
            <Eyebrow>YOUR JOURNEY. YOUR WELLBEING.</Eyebrow>

            <h1>
              A better way
              <br />
              to <span>move forward.</span>
            </h1>

            <p className="home-hero-description">
              Your movement matters. Explore physiotherapy services,
              understand your care options and take your next step with
              Rehabics.
            </p>

            <div className="home-hero-actions">
              <Link to="/appointment" className="home-button-primary">
                Book an appointment
                <ArrowRight size={18} />
              </Link>

              <Link to="/services" className="home-button-secondary">
                Explore services
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="home-hero-trust">
              <span className="home-trust-icon">
                <ShieldCheck size={17} />
              </span>
              <span>
                <strong>Care that starts with listening</strong>
                <small>Understand your options, one step at a time</small>
              </span>
            </div>
          </motion.div>

          <motion.div
            className="home-hero-visual"
            {...reveal(0.12)}
          >
            <div className="home-hero-image-wrap">
              <img
                className="home-hero-image"
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=85"
                alt="Healthcare professional supporting a patient"
                fetchPriority="high"
              />

              <div className="home-hero-image-overlay" />

              <div className="home-image-label">
                <span className="home-image-label-icon">
                  <HeartPulse size={21} />
                </span>
                <span>
                  <strong>Your goals matter</strong>
                  <small>Care centred on your needs</small>
                </span>
              </div>

              <span className="home-image-index">
                REHABICS / WELLBEING
              </span>
            </div>

            <motion.div
              className="home-floating-card home-floating-card-top"
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="home-floating-icon">
                <Activity size={19} />
              </span>
              <span>
                <strong>Every step counts</strong>
                <small>Your journey, at your pace</small>
              </span>
            </motion.div>

            <div className="home-floating-card home-floating-card-bottom">
              <span className="home-floating-check">
                <CheckCircle2 size={19} />
              </span>
              <span>
                <strong>Start with a conversation</strong>
                <small>Find out what works for you</small>
              </span>
            </div>
          </motion.div>
        </div>

        <div className="home-hero-bottom">
          <span>MOVE BETTER</span>
          <span className="home-hero-bottom-line" />
          <span>FEEL MORE CONFIDENT</span>
          <span className="home-hero-bottom-line" />
          <span>TAKE THE NEXT STEP</span>
        </div>
      </section>

      {/* Intro strip */}
      <section className="home-intro-strip">
        <div className="home-container home-intro-grid">
          <div className="home-intro-heading">
            <span className="home-intro-mark">
              <HeartPulse size={23} />
            </span>
            <span>
              <strong>Welcome to Rehabics</strong>
              <small>Your partner in understanding your care options</small>
            </span>
          </div>

          <p>
            A more informed care journey begins with understanding your
            needs, asking questions and exploring your options.
          </p>

          <Link to="/about" className="home-intro-link">
            About Rehabics <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="home-section home-services" id="home-services">
        <div className="home-container">
          <motion.div
            className="home-section-heading"
            {...reveal()}
          >
            <div>
              <Eyebrow>HOW WE CAN HELP</Eyebrow>
              <h2>
                Support for your
                <br />
                <span>next chapter.</span>
              </h2>
            </div>

            <div className="home-section-heading-side">
              <p>
                Explore our areas of support and discover where your
                physiotherapy journey could begin.
              </p>
              <Link to="/services" className="home-text-link">
                View all services <MoveRight size={17} />
              </Link>
            </div>
          </motion.div>

          <div className="home-service-grid">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  className="home-service-card"
                  key={service.number}
                  {...reveal(index * 0.08)}
                >
                  <div className="home-service-card-top">
                    <span className="home-service-icon">
                      <Icon size={24} />
                    </span>
                    <span className="home-service-number">
                      {service.number}
                    </span>
                  </div>

                  <span className="home-service-tag">
                    {service.tag}
                  </span>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <Link
                    to="/services"
                    className="home-service-link"
                    aria-label={`Explore ${service.title}`}
                  >
                    Explore service <ArrowUpRight size={17} />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / patient-first */}
      <section className="home-section home-about">
        <div className="home-container home-about-layout">
          <motion.div className="home-about-visual" {...reveal()}>
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1000&q=85"
              alt="Bright, modern healthcare environment"
              loading="lazy"
            />

            <div className="home-about-image-shade" />

            <div className="home-about-note">
              <span className="home-about-note-icon">
                <Sparkles size={20} />
              </span>
              <span>
                <strong>Your care. Your questions.</strong>
                <small>Be part of the conversation</small>
              </span>
            </div>

            <div className="home-about-outline" />
          </motion.div>

          <motion.div
            className="home-about-copy"
            {...reveal(0.1)}
          >
            <Eyebrow>A MORE PERSONAL APPROACH</Eyebrow>

            <h2>
              You are more than
              <br />
              <span>a condition.</span>
            </h2>

            <p>
              Your daily routines, priorities and personal goals all matter.
              Rehabics helps you explore your care options with clearer
              information and a focus on what matters to you.
            </p>

            <div className="home-about-points">
              <div>
                <span><CheckCircle2 size={18} /></span>
                <p>
                  <strong>Start by being heard</strong>
                  <small>
                    Share your concerns and the activities you want to work
                    towards.
                  </small>
                </p>
              </div>

              <div>
                <span><CheckCircle2 size={18} /></span>
                <p>
                  <strong>Understand your options</strong>
                  <small>
                    Ask questions and discuss suitable next steps with a
                    professional.
                  </small>
                </p>
              </div>

              <div>
                <span><CheckCircle2 size={18} /></span>
                <p>
                  <strong>Keep your goals in focus</strong>
                  <small>
                    Make informed decisions with guidance appropriate to
                    your needs.
                  </small>
                </p>
              </div>
            </div>

            <Link to="/about" className="home-button-primary">
              Discover our approach <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Journey */}
      <section className="home-section home-journey">
        <div className="home-container">
          <motion.div
            className="home-centered-heading"
            {...reveal()}
          >
            <Eyebrow>YOUR JOURNEY STARTS HERE</Eyebrow>
            <h2>
              Three steps to a
              <br />
              <span>clearer next step.</span>
            </h2>
            <p>
              Getting started does not need to feel complicated. Begin
              with a conversation and take it from there.
            </p>
          </motion.div>

          <div className="home-steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  className="home-step-card"
                  key={step.number}
                  {...reveal(index * 0.09)}
                >
                  <div className="home-step-top">
                    <span className="home-step-number">
                      {step.number}
                    </span>
                    <span className="home-step-icon">
                      <Icon size={23} />
                    </span>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  {index < steps.length - 1 && (
                    <span className="home-step-connector">
                      <ArrowRight size={17} />
                    </span>
                  )}
                </motion.article>
              );
            })}
          </div>

          <motion.div className="home-journey-cta" {...reveal()}>
            <div>
              <strong>Not sure where to begin?</strong>
              <p>
                Start by exploring the available services or contacting
                our team.
              </p>
            </div>

            <Link to="/contact" className="home-button-light">
              Ask us a question <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="home-section home-benefits">
        <div className="home-container">
          <motion.div
            className="home-section-heading"
            {...reveal()}
          >
            <div>
              <Eyebrow>THE REHABICS APPROACH</Eyebrow>
              <h2>
                Clarity in every
                <br />
                <span>step you take.</span>
              </h2>
            </div>

            <p className="home-benefits-intro">
              Good care starts with communication, informed decisions and
              an understanding of what matters most to you.
            </p>
          </motion.div>

          <div className="home-benefit-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.article
                  className="home-benefit-card"
                  key={benefit.title}
                  {...reveal(index * 0.08)}
                >
                  <span className="home-benefit-icon">
                    <Icon size={24} />
                  </span>

                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-section home-faq">
        <div className="home-container home-faq-layout">
          <motion.div className="home-faq-intro" {...reveal()}>
            <Eyebrow>GOOD TO KNOW</Eyebrow>

            <h2>
              Questions?
              <br />
              <span>Start here.</span>
            </h2>

            <p>
              Find useful information before your first appointment. If
              you need more help, our contact page is the next step.
            </p>

            <Link to="/contact" className="home-text-link">
              Contact our team <ArrowRight size={17} />
            </Link>
          </motion.div>

          <motion.div className="home-faq-list" {...reveal(0.08)}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              const answerId = `home-faq-answer-${index}`;

              return (
                <article
                  className={`home-faq-item ${isOpen ? "is-open" : ""}`}
                  key={faq.question}
                >
                  <h3>
                    <button
                      type="button"
                      className="home-faq-question"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() =>
                        setOpenFaq(isOpen ? -1 : index)
                      }
                    >
                      <span>{faq.question}</span>
                      <span className="home-faq-toggle">
                        {isOpen ? (
                          <Minus size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    className="home-faq-answer"
                    id={answerId}
                    hidden={!isOpen}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="home-final-cta">
        <div className="home-container">
          <motion.div
            className="home-final-panel"
            {...reveal()}
          >
            <div className="home-final-glow" />

            <div className="home-final-icon">
              <HeartPulse size={27} />
            </div>

            <div className="home-final-copy">
              <span>YOUR NEXT STEP STARTS HERE</span>
              <h2>
                Let's move towards
                <br />
                <span>what matters to you.</span>
              </h2>
              <p>
                Explore your options, ask a question or arrange an
                appointment when you are ready.
              </p>
            </div>

            <div className="home-final-actions">
              <Link to="/appointment" className="home-button-light">
                Book an appointment <ArrowRight size={18} />
              </Link>

              <Link to="/contact" className="home-final-contact">
                Have a question? Contact us
              </Link>
            </div>

            <span className="home-final-watermark">REHABICS</span>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
