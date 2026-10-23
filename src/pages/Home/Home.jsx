import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  HeartPulse,
  PersonStanding,
  ShieldCheck,
  Users,
  Star,
  CalendarDays,
  ClipboardCheck,
  Footprints,
  ChartNoAxesColumnIncreasing,
  Target,
  Stethoscope,
  Clock3,
  Sparkles,
  Plus,
  CheckCircle2,
} from "lucide-react";
import "./Home.css";

const services = [
  {
    title: "Back and Neck Pain",
    desc: "Relieve pain and improve mobility with targeted care.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=85",
    icon: Activity,
  },
  {
    title: "Sports Injury Rehabilitation",
    desc: "Get back to your game safely and stronger.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85",
    icon: Footprints,
  },
  {
    title: "Joint and Knee Rehabilitation",
    desc: "Restore movement and build long term strength.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=85",
    icon: HeartPulse,
  },
  {
    title: "Post Surgery Recovery",
    desc: "Guided rehabilitation for a confident recovery.",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=700&q=85",
    icon: ShieldCheck,
  },
  {
    title: "Posture Correction",
    desc: "Improve posture and prevent future issues.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07a?auto=format&fit=crop&w=700&q=85",
    icon: PersonStanding,
  },
  {
    title: "Mobility and Strength",
    desc: "Enhance flexibility, balance and endurance.",
    image:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=700&q=85",
    icon: ChartNoAxesColumnIncreasing,
  },
];

const benefits = [
  {
    icon: Target,
    title: "Personalized Plans",
    desc: "Care tailored to your goals and condition.",
  },
  {
    icon: Users,
    title: "Expert Physiotherapists",
    desc: "Professional guidance focused on you.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Access",
    desc: "Care options that fit your routine.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Progress Tracking",
    desc: "See each step of your recovery journey.",
  },
];

const steps = [
  {
    icon: CalendarDays,
    n: "01",
    title: "Book Your Consultation",
    desc: "Choose a time that works for you.",
  },
  {
    icon: ClipboardCheck,
    n: "02",
    title: "Get Your Assessment",
    desc: "Share your condition and goals.",
  },
  {
    icon: Footprints,
    n: "03",
    title: "Follow Your Plan",
    desc: "Get guided exercises and support.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    n: "04",
    title: "Track Progress",
    desc: "Celebrate improvements along the way.",
  },
];

const team = [
  {
    name: "Dr. Priya Sharma",
    specialty: "Sports Physiotherapy",
    experience: "5+ Years Experience",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&q=85",
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Orthopedic Rehabilitation",
    experience: "6+ Years Experience",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=240&q=85",
  },
  {
    name: "Dr. Neha Verma",
    specialty: "Neurological Physiotherapy",
    experience: "4+ Years Experience",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=240&q=85",
  },
  {
    name: "Dr. Karan Singh",
    specialty: "Post Surgery Recovery",
    experience: "7+ Years Experience",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=240&q=85",
  },
];

const faqs = [
  {
    q: "How do I book a physiotherapy session?",
    a: "Use the appointment button to continue to your booking or sign in page. Your clinic can confirm available timings.",
  },
  {
    q: "Do you offer online consultations?",
    a: "Online consultations can be offered if enabled by your Rehabics team. Contact the clinic to confirm availability.",
  },
  {
    q: "How many sessions will I need?",
    a: "It depends on your condition, goals and assessment. Your physiotherapist can recommend a suitable plan.",
  },
  {
    q: "Can I reschedule my appointment?",
    a: "Please use the booking or patient dashboard flow configured in your account, or contact your clinic for help.",
  },
];

function SectionLabel({ children }) {
  return <span className="rehabics-label">{children}</span>;
}

export default function Home() {
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <main className="rehabics-home">
      {/* Keep your existing Navbar outside this component. */}
      <section className="rh-hero">
        <div className="rh-hero-orb rh-orb-one" />
        <div className="rh-hero-orb rh-orb-two" />
        <div className="rh-container rh-hero-grid">
          <motion.div
            className="rh-hero-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="rh-pill">
              <Sparkles size={14} /> Digital Physiotherapy Platform
            </span>
            <h1>
              Recover Stronger.
              <br />
              <span>Live Brighter.</span>
            </h1>
            <p>
              Personalized physiotherapy care to help you move better, recover
              confidently, and return to the activities you love.
            </p>
            <div className="rh-hero-actions">
              <Link className="rh-btn rh-btn-primary" to="/login">
                Book an Appointment <ArrowRight size={17} />
              </Link>
              <a className="rh-btn rh-btn-outline" href="#services">
                Explore Services
              </a>
            </div>
            <div className="rh-social-proof">
              <div className="rh-avatar-stack">
                {team.slice(0, 3).map((person) => (
                  <img key={person.name} src={person.image} alt="" />
                ))}
                <span>10K+</span>
              </div>
              <div>
                <strong>10,000+ people</strong>
                <small>are already on their recovery journey</small>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="rh-hero-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12 }}
          >
            <div className="rh-hero-image-wrap">
              <img
                className="rh-hero-image"
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=90"
                alt="Athlete working on strength and mobility"
              />
            </div>
            <div className="rh-float-card rh-float-care">
              <span className="rh-float-icon">
                <PersonStanding />
              </span>
              <div>
                <b>Personalized Care</b>
                <small>
                  Plans tailored
                  <br />
                  to your goals
                </small>
              </div>
            </div>
            <div className="rh-float-card rh-float-expert">
              <span className="rh-float-icon">
                <ShieldCheck />
              </span>
              <div>
                <b>Expert Guidance</b>
                <small>
                  Professional
                  <br />
                  support
                </small>
              </div>
            </div>
            <div className="rh-float-card rh-float-track">
              <span className="rh-float-icon">
                <ChartNoAxesColumnIncreasing />
              </span>
              <div>
                <b>Track Progress</b>
                <small>
                  See your
                  <br />
                  improvements
                </small>
              </div>
            </div>
            <div className="rh-handwritten">
              Move Better.
              <br />
              Live Brighter.
            </div>
          </motion.div>
        </div>
        <div className="rh-container rh-stats">
          <div className="rh-stat">
            <span>
              <Users />
            </span>
            <div>
              <b>10K+</b>
              <small>Happy Patients</small>
            </div>
          </div>
          <div className="rh-stat">
            <span>
              <Stethoscope />
            </span>
            <div>
              <b>500+</b>
              <small>Physiotherapists</small>
            </div>
          </div>
          <div className="rh-stat">
            <span>
              <Star />
            </span>
            <div>
              <b>4.8/5</b>
              <small>Average Rating</small>
            </div>
          </div>
          <div className="rh-stat">
            <span>
              <ShieldCheck />
            </span>
            <div>
              <b>Patient First</b>
              <small>Care you can trust</small>
            </div>
          </div>
        </div>
      </section>

      <section className="rh-section rh-services" id="services">
        <div className="rh-container">
          <div className="rh-section-head">
            <div>
              <SectionLabel>Our Services</SectionLabel>
              <h2>
                Physiotherapy for
                <br />
                <span>a Healthier, Stronger You.</span>
              </h2>
              <p>Specialized care for every stage of your recovery journey.</p>
            </div>
            <a className="rh-text-link" href="#services">
              View all services <ArrowRight size={16} />
            </a>
          </div>
          <div className="rh-service-grid">
            {services.map(({ title, desc, image, icon: Icon }, i) => (
              <motion.article
                className="rh-service-card"
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <div className="rh-service-image">
                  <img src={image} alt={title} loading="lazy" />
                  <span>
                    <Icon size={20} />
                  </span>
                </div>
                <div className="rh-service-body">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <Link to="/login">
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="rh-container rh-why">
        <div className="rh-why-copy">
          <SectionLabel>Why Choose Rehabics</SectionLabel>
          <h2>
            Care That
            <br />
            <span>Moves With You.</span>
          </h2>
          <p>
            We bring expert care and thoughtful technology together to make
            physiotherapy more accessible, personal, and effective.
          </p>
          <Link className="rh-btn rh-btn-primary" to="/login">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
        <div className="rh-benefit-grid">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div className="rh-benefit" key={title}>
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
        <div className="rh-why-image">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85"
            alt="Physiotherapist supporting a patient"
            loading="lazy"
          />
        </div>
      </section>

      <section className="rh-section rh-process">
        <div className="rh-container rh-process-layout">
          <div className="rh-process-intro">
            <SectionLabel>How It Works</SectionLabel>
            <h2>
              Your Recovery Journey
              <br />
              <span>in 4 Simple Steps.</span>
            </h2>
            <p>
              Start your path to better movement and a healthier life with a
              clear, supportive process.
            </p>
          </div>
          <div className="rh-steps">
            {steps.map(({ icon: Icon, n, title, desc }) => (
              <div className="rh-step" key={n}>
                <span className="rh-step-icon">
                  <Icon />
                </span>
                <b className="rh-step-number">{n}</b>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rh-section rh-team-section">
        <div className="rh-container">
          <div className="rh-section-head rh-team-heading">
            <div>
              <SectionLabel>Meet Our Experts</SectionLabel>
              <h2>Our Physiotherapists</h2>
              <p>Experienced. Compassionate. Committed to your recovery.</p>
            </div>
            <Link className="rh-text-link" to="/login">
              Meet the team <ArrowRight size={16} />
            </Link>
          </div>
          <div className="rh-team-grid">
            {team.map((person, i) => (
              <motion.article
                className="rh-team-card"
                key={person.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <img src={person.image} alt={person.name} loading="lazy" />
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.specialty}</p>
                  <small>{person.experience}</small>
                </div>
                <Link to="/login" aria-label={`View ${person.name}`}>
                  <ArrowRight size={17} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="rh-section rh-proof-section">
        <div className="rh-container rh-proof-grid">
          <div className="rh-proof-intro">
            <SectionLabel>Patient Stories</SectionLabel>
            <h2>
              Real People.
              <br />
              <span>Real Progress.</span>
            </h2>
            <p>
              Every recovery journey is personal. Care, consistency and support
              can make a difference.
            </p>
          </div>
          <article className="rh-testimonial">
            <div className="rh-quote-mark">“</div>
            <p>
              My recovery plan helped me understand each step and stay
              consistent with my exercises.
            </p>
            <div className="rh-reviewer">
              <div className="rh-reviewer-avatar">A</div>
              <div>
                <b>Patient Experience</b>
                <small>Rehabics community</small>
              </div>
              <span className="rh-stars">★★★★★</span>
            </div>
            <small className="rh-demo-note">
              Illustrative testimonial layout. Replace with approved patient
              feedback.
            </small>
          </article>
          <div className="rh-faq">
            <SectionLabel>Frequently Asked Questions</SectionLabel>
            <h2>Still Have Questions?</h2>
            <p>Find answers to common questions about our care.</p>
            {faqs.map((faq, i) => (
              <div
                className={`rh-faq-item ${openFaq === i ? "is-open" : ""}`}
                key={faq.q}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <Plus size={17} />
                </button>
                {openFaq === i && <p>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rh-container rh-final-cta">
        <div className="rh-cta-image">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=85"
            alt="Movement and exercise"
            loading="lazy"
          />
        </div>
        <div className="rh-cta-copy">
          <span>YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Your Journey to Better Movement Starts Here.</h2>
          <p>Take the first step towards a more active, confident life.</p>
        </div>
        <Link className="rh-btn rh-btn-light" to="/login">
          Book Your First Session <ArrowRight size={17} />
        </Link>
      </section>
      {/* Keep your existing Footer outside this component. */}
    </main>
  );
}
