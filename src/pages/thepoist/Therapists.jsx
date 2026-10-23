import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Award, BadgeCheck, CalendarDays, CheckCircle2,
  Clock3, Filter, MapPin, Search, ShieldCheck, SlidersHorizontal, Star,
  Stethoscope, Video
} from "lucide-react";
import "./Therapists.css";

const therapists = [
  {
    id: 1,
    name: "Dr. Aanya Sharma",
    role: "Senior Physiotherapist",
    focus: "Musculoskeletal",
    experience: "8 years experience",
    rating: "4.9",
    reviews: "120+ reviews",
    mode: ["Online", "In clinic"],
    availability: "Accepting enquiries",
    initials: "AS",
    tone: "lavender",
    bio: "Supports people working through back, neck, posture and movement related concerns.",
    tags: ["Back and neck pain", "Posture", "Mobility"]
  },
  {
    id: 2,
    name: "Dr. Rohan Mehta",
    role: "Sports Physiotherapist",
    focus: "Sports rehabilitation",
    experience: "6 years experience",
    rating: "4.8",
    reviews: "95+ reviews",
    mode: ["Online", "In clinic"],
    availability: "Accepting enquiries",
    initials: "RM",
    tone: "cyan",
    bio: "Focuses on return to activity, movement confidence and sports related rehabilitation.",
    tags: ["Sports injuries", "Strength", "Recovery"]
  },
  {
    id: 3,
    name: "Dr. Meera Iyer",
    role: "Neurological Physiotherapist",
    focus: "Neurological rehabilitation",
    experience: "9 years experience",
    rating: "4.9",
    reviews: "110+ reviews",
    mode: ["Online"],
    availability: "Accepting enquiries",
    initials: "MI",
    tone: "peach",
    bio: "Provides movement focused support for people with neurological rehabilitation goals.",
    tags: ["Balance", "Movement", "Daily function"]
  },
  {
    id: 4,
    name: "Dr. Kabir Verma",
    role: "Orthopaedic Physiotherapist",
    focus: "Post operative recovery",
    experience: "7 years experience",
    rating: "4.8",
    reviews: "84+ reviews",
    mode: ["Online", "In clinic"],
    availability: "Accepting enquiries",
    initials: "KV",
    tone: "mint",
    bio: "Helps people build a structured recovery routine after orthopaedic procedures and injuries.",
    tags: ["Joint mobility", "Rehabilitation", "Strength"]
  },
  {
    id: 5,
    name: "Dr. Nisha Rao",
    role: "Women’s Health Physiotherapist",
    focus: "Women’s health",
    experience: "5 years experience",
    rating: "4.7",
    reviews: "72+ reviews",
    mode: ["Online", "In clinic"],
    availability: "Accepting enquiries",
    initials: "NR",
    tone: "rose",
    bio: "Offers respectful, goal led support for women’s health and pelvic health related needs.",
    tags: ["Women’s health", "Core support", "Mobility"]
  },
  {
    id: 6,
    name: "Dr. Arjun Singh",
    role: "Rehabilitation Physiotherapist",
    focus: "General rehabilitation",
    experience: "6 years experience",
    rating: "4.8",
    reviews: "90+ reviews",
    mode: ["Online"],
    availability: "Accepting enquiries",
    initials: "AS",
    tone: "blue",
    bio: "Works with people to improve everyday movement, confidence and functional goals.",
    tags: ["Functional movement", "Mobility", "Recovery"]
  }
];

const specialties = [
  "All specialties",
  "Musculoskeletal",
  "Sports rehabilitation",
  "Neurological rehabilitation",
  "Post operative recovery",
  "Women’s health",
  "General rehabilitation"
];

export default function Therapists() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [mode, setMode] = useState("All appointment types");

  const filteredTherapists = useMemo(() => {
    const term = search.trim().toLowerCase();
    return therapists.filter((therapist) => {
      const matchesSearch = !term || [
        therapist.name, therapist.role, therapist.focus, therapist.bio,
        ...therapist.tags
      ].join(" ").toLowerCase().includes(term);
      const matchesSpecialty = specialty === "All specialties" || therapist.focus === specialty;
      const matchesMode = mode === "All appointment types" || therapist.mode.includes(mode);
      return matchesSearch && matchesSpecialty && matchesMode;
    });
  }, [search, specialty, mode]);

  return (
    <main className="rehabics-therapists">
      <section className="th-hero">
        <div className="th-hero-glow" />
        <div className="th-container th-hero-grid">
          <motion.div
            className="th-hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="th-eyebrow"><Stethoscope size={14} /> Meet your care team</span>
            <h1>Find a therapist who <span>gets your goals.</span></h1>
            <p>Explore physiotherapy specialties and find a care professional who may fit your needs, preferences and recovery goals.</p>
            <div className="th-hero-points">
              <span><CheckCircle2 size={16} /> Goal focused support</span>
              <span><CheckCircle2 size={16} /> Online options available</span>
            </div>
            <a className="th-hero-cta" href="#therapist-directory">Explore therapists <ArrowRight size={16} /></a>
          </motion.div>
          <motion.div
            className="th-hero-visual"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=90" alt="Physiotherapist consulting with a patient" />
            <div className="th-visual-overlay" />
            <div className="th-floating-card"><span><BadgeCheck size={20} /></span><div><b>Care built around you</b><small>Find a specialty to get started</small></div></div>
            <div className="th-image-note"><HeartIcon /> Progress, one step at a time</div>
          </motion.div>
        </div>
      </section>

      <section className="th-trust">
        <div className="th-container th-trust-grid">
          <div><span className="th-trust-icon"><ShieldCheck size={19} /></span><p><b>Care first</b><small>People centred support</small></p></div>
          <div><span className="th-trust-icon"><Video size={19} /></span><p><b>Flexible formats</b><small>Online and clinic options</small></p></div>
          <div><span className="th-trust-icon"><CalendarDays size={19} /></span><p><b>Next step planning</b><small>Send an appointment request</small></p></div>
        </div>
      </section>

      <section className="th-directory" id="therapist-directory">
        <div className="th-container">
          <div className="th-section-head">
            <div><span className="th-section-label">Therapist directory</span><h2>Meet the specialists</h2><p>Filter by specialty or appointment format to narrow your options.</p></div>
            <span className="th-result-count">{filteredTherapists.length} profiles</span>
          </div>

          <div className="th-filters">
            <label className="th-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, specialty or focus" aria-label="Search therapists" /></label>
            <label className="th-select-wrap"><SlidersHorizontal size={16} /><select value={specialty} onChange={(event) => setSpecialty(event.target.value)} aria-label="Filter by specialty">{specialties.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="th-select-wrap"><Filter size={16} /><select value={mode} onChange={(event) => setMode(event.target.value)} aria-label="Filter by appointment type"><option>All appointment types</option><option>Online</option><option>In clinic</option></select></label>
          </div>

          {filteredTherapists.length > 0 ? (
            <div className="th-cards">
              {filteredTherapists.map((therapist, index) => (
                <motion.article
                  className="th-card"
                  key={therapist.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.35, delay: (index % 3) * 0.05 }}
                >
                  <div className={`th-card-cover th-${therapist.tone}`}>
                    <span className="th-specialty-pill">{therapist.focus}</span>
                    <div className="th-avatar">{therapist.initials}</div>
                    <span className="th-verified"><BadgeCheck size={14} /> Profile preview</span>
                  </div>
                  <div className="th-card-body">
                    <div className="th-name-row"><div><h3>{therapist.name}</h3><p>{therapist.role}</p></div><span className="th-rating"><Star size={13} fill="currentColor" /> {therapist.rating}</span></div>
                    <div className="th-experience"><Award size={15} /> {therapist.experience} <span>•</span> {therapist.reviews}</div>
                    <p className="th-bio">{therapist.bio}</p>
                    <div className="th-tags">{therapist.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="th-card-footer"><span className="th-mode"><Video size={14} /> {therapist.mode.join(" + ")}</span><Link to="/appointment" className="th-book-link">Request session <ArrowUpRight size={15} /></Link></div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="th-empty"><Search size={25} /><h3>No matching profiles</h3><p>Try a different search term or reset your filters.</p><button type="button" onClick={() => { setSearch(""); setSpecialty("All specialties"); setMode("All appointment types"); }}>Clear filters</button></div>
          )}
          <p className="th-demo-note"><ShieldCheck size={15} /> These are sample directory profiles for layout preview. Confirm real therapist names, qualifications, ratings and availability before publishing.</p>
        </div>
      </section>

      <section className="th-bottom">
        <div className="th-container th-bottom-inner">
          <span className="th-bottom-icon"><CalendarDays size={25} /></span>
          <div><span className="th-section-label">Your next step</span><h2>Found a specialty that fits?</h2><p>Send a request and the team can follow up about availability.</p></div>
          <div className="th-bottom-actions"><Link to="/appointment">Request appointment <ArrowRight size={15} /></Link><Link to="/contact">Ask a question</Link></div>
        </div>
      </section>
    </main>
  );
}

function HeartIcon() {
  return <span className="th-heart-icon" aria-hidden="true">♡</span>;
}
