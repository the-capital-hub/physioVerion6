import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  HeartPulse,
  PersonStanding,
  ShieldCheck,
  Footprints,
  ChartNoAxesColumnIncreasing,
  Target,
  Users,
  CalendarDays,
  ClipboardCheck,
  Plus,
  Sparkles,
  Stethoscope,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import "./Services.css";

const services = [
  {
    id: "back-neck-pain",
    title: "Back and Neck Pain",
    short: "Relieve pain and improve mobility with targeted care.",
    detail:
      "Targeted treatment to help reduce discomfort, improve posture, and restore everyday mobility.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=850&q=85",
    icon: Activity,
    benefits: [
      "Movement and posture assessment",
      "Personalized mobility exercises",
      "Guidance for everyday activities",
    ],
  },
  {
    id: "sports-injury",
    title: "Sports Injury Rehabilitation",
    short: "Get back to your game safely and stronger.",
    detail:
      "Structured rehabilitation focused on strength, movement, and a gradual return to your sport.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=850&q=85",
    icon: Footprints,
    benefits: [
      "Functional movement assessment",
      "Progressive strength exercises",
      "Return to activity planning",
    ],
  },
  {
    id: "joint-knee",
    title: "Joint and Knee Rehabilitation",
    short: "Restore movement and build long term strength.",
    detail:
      "Support for improving joint mobility, stability, and confidence during everyday movement.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=850&q=85",
    icon: HeartPulse,
    benefits: [
      "Mobility and stability work",
      "Strength and balance exercises",
      "A plan matched to your goals",
    ],
  },
  {
    id: "post-surgery",
    title: "Post Surgery Recovery",
    short: "Guided rehabilitation for a confident recovery.",
    detail:
      "A guided recovery plan aligned with your procedure, current ability, and care team's advice.",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=850&q=85",
    icon: ShieldCheck,
    benefits: [
      "Individual recovery goals",
      "Guided movement progression",
      "Support for safe daily activity",
    ],
  },
  {
    id: "posture",
    title: "Posture Correction",
    short: "Improve posture and prevent future issues.",
    detail:
      "Build awareness of movement habits and practice exercises that support comfortable posture.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07a?auto=format&fit=crop&w=850&q=85",
    icon: PersonStanding,
    benefits: [
      "Posture and movement guidance",
      "Mobility and strengthening work",
      "Practical everyday tips",
    ],
  },
  {
    id: "mobility-strength",
    title: "Mobility and Strength Training",
    short: "Enhance flexibility, balance and endurance.",
    detail:
      "Progressive movement and strengthening support to help you work toward your personal activity goals.",
    image:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=850&q=85",
    icon: ChartNoAxesColumnIncreasing,
    benefits: [
      "Personalized exercise progression",
      "Balance and flexibility practice",
      "Progress reviews with your provider",
    ],
  },
];

const benefits = [
  {
    icon: Target,
    title: "Personalized Plans",
    desc: "Treatment goals shaped around your needs.",
  },
  {
    icon: Users,
    title: "Expert Physiotherapists",
    desc: "Guidance from qualified professionals.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Access",
    desc: "Choose care options that fit your routine.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Progress Tracking",
    desc: "Review your progress with your care team.",
  },
];

const steps = [
  {
    icon: CalendarDays,
    number: "01",
    title: "Book a Consultation",
    desc: "Choose a suitable time to get started.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Get Assessed",
    desc: "Discuss your needs, movement and goals.",
  },
  {
    icon: Footprints,
    number: "03",
    title: "Follow Your Plan",
    desc: "Practice your guided exercises.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    number: "04",
    title: "Review Progress",
    desc: "Adjust your plan with your provider.",
  },
];

const faqs = [
  {
    question: "What conditions do you treat?",
    answer:
      "Rehabics highlights support for back and neck pain, sports injuries, joint rehabilitation, post surgery recovery, posture, and mobility. Your physiotherapist can advise whether a service suits your needs.",
  },
  {
    question: "Do you offer online physiotherapy sessions?",
    answer:
      "Online consultations depend on the services enabled by your Rehabics team. Please check with your clinic for current availability.",
  },
  {
    question: "How many sessions will I need?",
    answer:
      "The number of sessions varies by person, condition, goals, and assessment. Your physiotherapist can discuss an appropriate plan with you.",
  },
  {
    question: "Can I book an appointment online?",
    answer:
      "Use the appointment button to continue to the booking or login flow configured in your Rehabics application.",
  },
];

function SectionLabel({ children }) {
  return <span className="sv-label">{children}</span>;
}

export default function Services() {
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <main className="rehabics-services">
      {/* Existing Navbar should be rendered by your shared layout, not here. */}
      <section className="sv-hero">
        <div className="sv-hero-blob sv-blob-a" />
        <div className="sv-container sv-hero-grid">
          <motion.div
            className="sv-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="sv-pill">
              <Sparkles size={14} /> Our Services
            </span>
            <h1>
              Expert Physiotherapy
              <br />
              Care for a{" "}
              <span>
                Healthier,
                <br className="sv-desktop-break" /> Stronger You.
              </span>
            </h1>
            <p>
              Specialized physiotherapy services designed to help you recover
              faster, move better, and live a pain free life.
            </p>
            <div className="sv-hero-actions">
              <Link to="/login" className="sv-btn sv-btn-primary">
                Book an Appointment <ArrowRight size={17} />
              </Link>
              <a href="#all-services" className="sv-btn sv-btn-outline">
                View All Services
              </a>
            </div>
            <div className="sv-proof">
              <div className="sv-proof-avatars">
                <span>R</span>
                <span>P</span>
                <span>+</span>
              </div>
              <p>
                <b>Personalized care</b>
                <small>support for your recovery journey</small>
              </p>
            </div>
          </motion.div>
          <motion.div
            className="sv-hero-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1300&q=90"
              alt="Physiotherapist guiding a patient through a mobility exercise"
            />
            <div className="sv-hero-float sv-float-plan">
              <span>
                <PersonStanding />
              </span>
              <div>
                <b>Personalized Plans</b>
                <small>Care for your goals</small>
              </div>
            </div>
            <div className="sv-hero-float sv-float-evidence">
              <span>
                <ChartNoAxesColumnIncreasing />
              </span>
              <div>
                <b>Progress Focused</b>
                <small>Step by step support</small>
              </div>
            </div>
            <div className="sv-hero-script">
              Move Better.
              <br />
              Live Brighter.
            </div>
          </motion.div>
        </div>
        <div className="sv-container sv-trust-row">
          <div>
            <span>
              <ShieldCheck />
            </span>
            <p>
              <b>Patient focused</b>
              <small>Care built around you</small>
            </p>
          </div>
          <div>
            <span>
              <Stethoscope />
            </span>
            <p>
              <b>Expert guidance</b>
              <small>Professional support</small>
            </p>
          </div>
          <div>
            <span>
              <HeartPulse />
            </span>
            <p>
              <b>Personalized care</b>
              <small>Goals that matter to you</small>
            </p>
          </div>
        </div>
      </section>

      <section className="sv-section" id="all-services">
        <div className="sv-container">
          <div className="sv-heading">
            <SectionLabel>Our Services</SectionLabel>
            <h2>Explore Our Physiotherapy Services</h2>
            <p>
              From pain relief to performance, find support for every stage of
              your recovery journey.
            </p>
          </div>
          <div className="sv-service-grid">
            {services.map(({ id, title, short, image, icon: Icon }, i) => (
              <motion.article
                className="sv-service-card"
                key={id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.42, delay: i * 0.045 }}
              >
                <a href={`#${id}`} className="sv-card-image">
                  <img src={image} alt={title} loading="lazy" />
                  <span>
                    <Icon size={20} />
                  </span>
                </a>
                <div className="sv-card-body">
                  <h3>{title}</h3>
                  <p>{short}</p>
                  <a href={`#${id}`} className="sv-link">
                    Learn More <ArrowRight size={14} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="sv-container sv-why">
        <div className="sv-why-copy">
          <SectionLabel>Why Choose Rehabics</SectionLabel>
          <h2>
            Care That
            <br />
            <span>Moves With You.</span>
          </h2>
          <p>
            We bring thoughtful technology and professional care together to
            support a more personal recovery experience.
          </p>
          <Link to="/login" className="sv-btn sv-btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
        <div className="sv-benefits">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div className="sv-benefit" key={title}>
              <span>
                <Icon />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="sv-why-image">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85"
            alt="Physiotherapy session in a clinical setting"
            loading="lazy"
          />
        </div>
      </section>

      <section className="sv-section sv-detail-section">
        <div className="sv-container">
          <div className="sv-heading">
            <SectionLabel>Detailed Services</SectionLabel>
            <h2>Our Services in Detail</h2>
            <p>
              Explore the kind of support available for your individual goals.
            </p>
          </div>
          <div className="sv-detail-grid">
            {services.map(
              ({ id, title, detail, image, benefits: items }, i) => (
                <motion.article
                  id={id}
                  className="sv-detail-card"
                  key={id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                >
                  <img src={image} alt="" loading="lazy" />
                  <div className="sv-detail-copy">
                    <h3>{title}</h3>
                    <p>{detail}</p>
                    <ul>
                      {items.slice(0, 2).map((item) => (
                        <li key={item}>
                          <CheckCircle2 size={13} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/login" className="sv-link">
                      Enquire Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="sv-section sv-process">
        <div className="sv-container sv-process-layout">
          <div className="sv-heading sv-process-heading">
            <SectionLabel>How It Works</SectionLabel>
            <h2>
              Your Recovery Journey
              <br />
              <span>in 4 Simple Steps.</span>
            </h2>
            <p>
              A simple, guided process to help you get moving with confidence.
            </p>
          </div>
          <div className="sv-steps">
            {steps.map(({ icon: Icon, number, title, desc }) => (
              <div className="sv-step" key={number}>
                <span>
                  <Icon />
                </span>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sv-container sv-cta">
        <div className="sv-cta-image">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=850&q=85"
            alt="Person practicing a mobility exercise"
            loading="lazy"
          />
        </div>
        <div className="sv-cta-copy">
          <small>YOUR RECOVERY JOURNEY STARTS HERE</small>
          <h2>Ready to Start Your Recovery?</h2>
          <p>
            Book an appointment with our team and take the first step towards
            better movement.
          </p>
        </div>
        <Link to="/login" className="sv-btn sv-btn-light">
          Book an Appointment <ArrowRight size={16} />
        </Link>
      </section>

      <section className="sv-section sv-faq-section">
        <div className="sv-container sv-faq-layout">
          <div className="sv-heading">
            <SectionLabel>FAQ</SectionLabel>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find answers to common questions about our physiotherapy services.
            </p>
          </div>
          <div className="sv-faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`sv-faq-item ${openFaq === i ? "sv-open" : ""}`}
                key={faq.question}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.question}</span>
                  <Plus size={17} />
                </button>
                {openFaq === i && <p>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Existing Footer should be rendered by your shared layout, not here. */}
    </main>
  );
}
