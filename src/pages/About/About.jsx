import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  HeartPulse,
  ShieldCheck,
  Users,
  Target,
  Activity,
  Stethoscope,
  CheckCircle2,
  Compass,
  HandHeart,
  Lightbulb,
} from "lucide-react";
import "./About.css";

const values = [
  {
    icon: HandHeart,
    title: "Patient First",
    description:
      "Care starts by listening to your concerns, goals, and everyday challenges.",
  },
  {
    icon: Target,
    title: "Personalized Care",
    description:
      "A recovery approach shaped around your needs, ability, and progress.",
  },
  {
    icon: ShieldCheck,
    title: "Trust and Clarity",
    description:
      "Clear guidance that helps you understand each step of your recovery journey.",
  },
  {
    icon: Activity,
    title: "Progress With Purpose",
    description:
      "Practical movement goals that support confidence in everyday life.",
  },
];

const principles = [
  "Understand your needs and movement goals",
  "Build a plan around your individual assessment",
  "Practice guided exercises at a suitable pace",
  "Review progress and adapt the plan when needed",
];

const team = [
  {
    initials: "PT",
    role: "Physiotherapy Team",
    title: "Care built around people",
    description:
      "A patient focused approach to movement, recovery, and everyday wellbeing.",
  },
  {
    initials: "RC",
    role: "Recovery Coordination",
    title: "Support at every step",
    description:
      "Helping make the recovery journey easier to understand and navigate.",
  },
  {
    initials: "WC",
    role: "Wellness Community",
    title: "Movement for real life",
    description:
      "Encouraging healthy habits and steady progress beyond each session.",
  },
];

function SectionLabel({ children }) {
  return <span className="ab-label">{children}</span>;
}

const About=()=> {
  return (
    <main className="rehabics-about">
      <section className="ab-hero">
        <div className="ab-hero-orb ab-orb-one" />
        <div className="ab-hero-orb ab-orb-two" />
        <div className="ab-container ab-hero-grid">
          <motion.div
            className="ab-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="ab-pill">
              <Sparkles size={14} /> About Rehabics
            </span>
            <h1>
              Helping You Move Better. <span>Live Brighter.</span>
            </h1>
            <p>
              We believe recovery should feel personal, understandable, and
              focused on what matters to you. Rehabics brings thoughtful care
              and guided movement together for your recovery journey.
            </p>
            <div className="ab-actions">
              <Link to="/services" className="ab-btn ab-btn-primary">
                Explore Our Services <ArrowRight size={16} />
              </Link>
              <a href="#our-story" className="ab-btn ab-btn-outline">
                Discover Our Story
              </a>
            </div>
            <div className="ab-proof">
              <div className="ab-proof-icons">
                <span>
                  <HeartPulse size={16} />
                </span>
                <span>
                  <Users size={16} />
                </span>
                <span>
                  <Activity size={16} />
                </span>
              </div>
              <p>
                <b>Care with purpose</b>
                <small>Focused on your goals and progress</small>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="ab-hero-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1300&q=90"
              alt="Physiotherapist supporting a patient during a rehabilitation session"
            />
            <div className="ab-image-shade" />
            <div className="ab-float-card ab-float-care">
              <span>
                <HeartPulse size={19} />
              </span>
              <div>
                <b>People first</b>
                <small>Care shaped around you</small>
              </div>
            </div>
            <div className="ab-float-card ab-float-progress">
              <span>
                <Activity size={19} />
              </span>
              <div>
                <b>Progress focused</b>
                <small>One step at a time</small>
              </div>
            </div>
            <div className="ab-image-note">
              Your journey.
              <br />
              Your pace.
            </div>
          </motion.div>
        </div>

        <div className="ab-container ab-trust-row">
          <div>
            <span>
              <ShieldCheck size={19} />
            </span>
            <p>
              <b>Patient focused</b>
              <small>Your needs come first</small>
            </p>
          </div>
          <div>
            <span>
              <Stethoscope size={19} />
            </span>
            <p>
              <b>Guided support</b>
              <small>Clear, thoughtful care</small>
            </p>
          </div>
          <div>
            <span>
              <Target size={19} />
            </span>
            <p>
              <b>Personal goals</b>
              <small>Progress that matters</small>
            </p>
          </div>
        </div>
      </section>

      <section className="ab-section" id="our-story">
        <div className="ab-container ab-story-grid">
          <motion.div
            className="ab-story-visual"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=85"
              alt="Guided exercise in a modern rehabilitation setting"
              loading="lazy"
            />
            <div className="ab-story-stamp">
              <HeartPulse size={21} />
              <span>
                Movement
                <br />
                with meaning
              </span>
            </div>
          </motion.div>
          <motion.div
            className="ab-story-copy"
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Our Story</SectionLabel>
            <h2>Recovery is more than getting back on your feet.</h2>
            <p>
              It is about rebuilding confidence, understanding your body, and
              returning to the activities that make everyday life meaningful.
              Rehabics is designed around that bigger picture.
            </p>
            <p>
              Our approach brings professional guidance, individual goals, and
              practical movement together so the recovery journey feels clearer
              from the first step onward.
            </p>
            <div className="ab-story-highlight">
              <span>
                <CheckCircle2 size={18} />
              </span>
              <p>
                <b>A plan that starts with you</b>
                <small>
                  Your needs, your goals, and your pace guide the journey.
                </small>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="ab-section ab-mission-section">
        <div className="ab-container">
          <div className="ab-heading ab-heading-center">
            <SectionLabel>Our Purpose</SectionLabel>
            <h2>
              Care that keeps <span>you at the centre.</span>
            </h2>
            <p>
              Our purpose is to make the path toward better movement feel more
              personal, supportive, and clear.
            </p>
          </div>
          <div className="ab-purpose-grid">
            <motion.article
              className="ab-purpose-card ab-purpose-main"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="ab-purpose-icon">
                <Target size={22} />
              </span>
              <small>OUR MISSION</small>
              <h3>Make recovery feel personal.</h3>
              <p>
                Support people with thoughtful guidance and practical steps that
                reflect their individual recovery goals.
              </p>
              <div className="ab-purpose-decoration">
                <HeartPulse size={84} />
              </div>
            </motion.article>
            <motion.article
              className="ab-purpose-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="ab-purpose-icon">
                <Compass size={22} />
              </span>
              <small>OUR VISION</small>
              <h3>Help people move with confidence.</h3>
              <p>
                Encourage a future where people feel better informed and more
                confident about their movement and wellbeing.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="ab-section">
        <div className="ab-container">
          <div className="ab-heading">
            <SectionLabel>What Guides Us</SectionLabel>
            <h2>Values behind every step.</h2>
            <p>
              Thoughtful care is built on trust, collaboration, and a clear
              focus on the person.
            </p>
          </div>
          <div className="ab-values-grid">
            {values.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                className="ab-value-card"
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <span className="ab-value-icon">
                  <Icon size={21} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="ab-value-number">0{index + 1}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-section ab-approach-section">
        <div className="ab-container ab-approach-grid">
          <div className="ab-approach-copy">
            <SectionLabel>Our Approach</SectionLabel>
            <h2>
              Small steps. <span>Meaningful progress.</span>
            </h2>
            <p>
              Every recovery journey is different. A clear process can help you
              understand what comes next and work toward your goals at a
              suitable pace.
            </p>
            <Link to="/services" className="ab-text-link">
              Explore our services <ArrowRight size={15} />
            </Link>
          </div>
          <div className="ab-principles">
            {principles.map((principle, index) => (
              <div className="ab-principle" key={principle}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{principle}</p>
                <CheckCircle2 size={17} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-section">
        <div className="ab-container">
          <div className="ab-heading ab-heading-center">
            <SectionLabel>The People Behind the Journey</SectionLabel>
            <h2>Support that sees the person, not just the problem.</h2>
            <p>
              Rehabics is built around collaboration and supportive care
              throughout the recovery journey.
            </p>
          </div>
          <div className="ab-team-grid">
            {team.map(({ initials, role, title, description }, index) => (
              <motion.article
                className="ab-team-card"
                key={role}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <div className={`ab-team-art ab-team-art-${index + 1}`}>
                  <div className="ab-team-avatar">{initials}</div>
                  <span>
                    <Sparkles size={17} />
                  </span>
                </div>
                <div className="ab-team-copy">
                  <small>{role}</small>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </motion.article>
            ))}
          </div>
          <p className="ab-team-note">
            Replace these illustrative team cards with your actual team profiles
            before publishing.
          </p>
        </div>
      </section>

      <section className="ab-container ab-cta">
        <div className="ab-cta-art">
          <div className="ab-cta-ring">
            <HeartPulse size={45} />
          </div>
        </div>
        <div className="ab-cta-copy">
          <small>YOUR NEXT STEP STARTS HERE</small>
          <h2>Let’s move toward better, together.</h2>
          <p>
            Explore our physiotherapy services and find the next step for your
            recovery journey.
          </p>
        </div>
        <Link to="/login" className="ab-btn ab-btn-light">
          Get Started <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
export default About