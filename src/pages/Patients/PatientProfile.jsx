
import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserRound,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import "./PatientDashboard.css";

function getSavedUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "{}"
    );
  } catch {
    return {};
  }
}

export default function PatientProfile() {
  const [saved] = useState(getSavedUser);

  const [form, setForm] = useState({
    name: saved.name || saved.fullName || "",
    email: saved.email || "",
    phone: saved.phone || "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setMessage("");
    setError("");
  };

  function submit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name || !email) {
      setError("Please enter your full name and email address.");
      setMessage("");
      return;
    }

    const updatedUser = {
      ...saved,
      name,
      email,
      phone,
    };

    try {
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Keep session user data consistent if it exists.
      if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setForm({ name, email, phone });
      setMessage(
        "Profile saved in this browser. Backend account details are unchanged."
      );
      setError("");
    } catch {
      setError("Unable to save your profile in this browser. Please try again.");
      setMessage("");
    }
  }

  const displayName = form.name.trim() || "Your name";
  const displayEmail = form.email.trim() || "your@email.com";

  return (
    <div className="patient-page patient-profile-page">
      <motion.div
        className="patient-page-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="patient-eyebrow">YOUR ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and contact details.</p>
        </div>

        <span className="patient-demo-pill">
          <ShieldCheck size={15} />
          Patient profile
        </span>
      </motion.div>

      <div className="patient-profile-grid">
        <motion.section
          className="patient-panel patient-profile-summary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="patient-profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <span className="patient-profile-summary-label">
            PATIENT ACCOUNT
          </span>

          <h2>{displayName}</h2>
          <p className="patient-profile-email">{displayEmail}</p>

          {form.phone.trim() && (
            <p className="patient-profile-phone">
              <Phone size={14} />
              {form.phone}
            </p>
          )}

          <span className="patient-profile-role">
            <UserRound size={14} />
            Patient
          </span>

          <div className="patient-profile-note">
            <ShieldCheck size={18} />
            <span>
              Keep your contact details up to date so your care team can reach
              you.
            </span>
          </div>
        </motion.section>

        <motion.section
          className="patient-panel patient-profile-edit"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="patient-panel-heading">
            <div>
              <h2>Personal information</h2>
              <p>Update the details displayed in your portal.</p>
            </div>
          </div>

          <form className="patient-profile-form" onSubmit={submit}>
            <label>
              Full name
              <div className="patient-input-wrap">
                <UserRound size={17} />
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Enter your full name"
                  maxLength={100}
                />
              </div>
            </label>

            <label>
              Email address
              <div className="patient-input-wrap">
                <Mail size={17} />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                />
              </div>
            </label>

            <label>
              Phone number
              <div className="patient-input-wrap">
                <Phone size={17} />
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="Enter your phone number"
                  maxLength={20}
                />
              </div>
            </label>

            <button className="patient-primary-button" type="submit">
              <Save size={17} />
              Save profile
            </button>

            {message && (
              <p className="patient-success-message" role="status">
                <CheckCircle2 size={16} />
                {message}
              </p>
            )}

            {error && (
              <p className="patient-profile-error" role="alert">
                <AlertCircle size={16} />
                {error}
              </p>
            )}
          </form>
        </motion.section>
      </div>

      <div className="patient-demo-note">
        <ShieldCheck size={18} />
        <p>
          <strong>Demo mode:</strong> profile changes are stored in this
          browser only. Connect your authenticated backend API to update the
          actual patient account securely.
        </p>
      </div>
    </div>
  );
}
