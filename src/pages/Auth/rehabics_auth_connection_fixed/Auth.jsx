
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  ShieldCheck,
  UserRound,
  Stethoscope,
  Mail,
  LockKeyhole,
  Phone,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import "./Auth.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  remember: true,
  agree: false,
};

const roles = [
  {
    value: "patient",
    title: "Patient",
    description: "Find care and manage your recovery",
    Icon: UserRound,
  },
  {
    value: "physiotherapist",
    title: "Physiotherapist",
    description: "Manage patients and appointments",
    Icon: Stethoscope,
  },
];

// Handles common backend role formats.
const normalizeRole = (value) => {
  if (!value || typeof value !== "string") return "";

  return value
    .toLowerCase()
    .trim()
    .replace(/^role[_\s-]?/, "");
};

// Accepts a role string or a user object.
const getDashboardPath = (user) => {
  const rawRole =
    typeof user === "string"
      ? user
      : user?.role ??
        user?.userType ??
        user?.user_type ??
        user?.accountType ??
        user?.type ??
        user?.profile?.role ??
        "";

  const role = normalizeRole(rawRole);

  if (role === "patient") {
    return "/patient/dashboard";
  }

  if (["physio", "physiotherapist"].includes(role)) {
    return "/physio/dashboard";
  }

  if (["admin", "administrator"].includes(role)) {
    return "/admin/dashboard";
  }

  return null;
};

export default function Auth({ initialMode = "login" }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const isRegister = mode === "register";

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    clearMessage();
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    clearMessage();

    setShowPassword(false);
    setShowConfirmPassword(false);

    setForm((previous) => ({
      ...previous,
      password: "",
      confirmPassword: "",
    }));

    const nextPath =
      nextMode === "register" ? "/register" : "/login";

    // Keep the browser URL synchronized with the selected mode.
    navigate(nextPath, { replace: true });
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.password) {
      return "Please enter your password.";
    }

    if (form.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (isRegister) {
      if (!form.name.trim()) {
        return "Please enter your full name.";
      }

      if (!form.phone.trim()) {
        return "Please enter your phone number.";
      }

      if (form.password !== form.confirmPassword) {
        return "Passwords do not match.";
      }

      if (!form.agree) {
        return "Please accept the Terms and Privacy Policy.";
      }
    }

    return "";
  };

  const saveSession = (token, user) => {
    // Clear any previous session before saving this one.
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    const storage = form.remember ? localStorage : sessionStorage;

    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    setLoading(true);
    clearMessage();

    try {
      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const payload = isRegister
        ? {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            password: form.password,
            role,
          }
        : {
            email: form.email.trim().toLowerCase(),
            password: form.password,
          };

      let response;
      try {
        response = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (networkError) {
        throw new Error(
          `Cannot reach Rehabics backend at ${API_URL}. Start the backend and check VITE_API_URL and CORS settings.`
        );
      }

      // Some servers return an empty or non-JSON error response.
      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `The server returned an invalid response (${response.status}).`
          );
        }
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            data.error ||
            `Request failed (${response.status}). Please try again.`
        );
      }

      // Registration succeeds, then the user can sign in.
      if (isRegister) {
        setMessage(
          data.message ||
            "Registration successful! Please log in with your new account."
        );
        setMessageType("success");

        setForm((previous) => ({
          ...previous,
          name: "",
          phone: "",
          password: "",
          confirmPassword: "",
          agree: false,
        }));

        setMode("login");
        setShowPassword(false);
        setShowConfirmPassword(false);

        navigate("/login", { replace: true });
        return;
      }

      // Support common response formats:
      // { token, user }, { accessToken, user },
      // { data: { token, user } }, or { data: { accessToken, user } }.
      const result = data.data ?? data;

      const token =
        result.token ??
        result.accessToken ??
        result.access_token ??
        result.jwt;

      const user =
        result.user ??
        result.account ??
        result.profile;

      if (!token || !user || typeof user !== "object") {
        throw new Error(
          "Login response is missing the token or user details. Check your backend login response."
        );
      }

      // Pass the complete user object, not only user.role.
      const dashboardPath = getDashboardPath(user);

      if (!dashboardPath) {
        throw new Error(
          `Login succeeded, but the account role was not recognized. Received role: "${
            user.role ??
            user.userType ??
            user.user_type ??
            user.accountType ??
            user.type ??
            "missing"
          }". Check the backend user response.`
        );
      }

      saveSession(token, user);

      setMessage("Login successful. Redirecting...");
      setMessageType("success");

      navigate(dashboardPath, { replace: true });
    } catch (error) {
      console.error("Rehabics authentication error:", error);

      setMessage(
        error.message ||
          "Unable to connect to the server. Please check your backend connection."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rehabAuth">
      <div className="authBackdrop">
        <span className="authBackdropOne" />
        <span className="authBackdropTwo" />
      </div>

      <div className="authShell">
        {/* Left visual panel */}
        <aside className="authVisual">
          <Link to="/" className="authBrand">
            <span className="authBrandIcon">
              <Activity size={25} />
            </span>

            <span>
              <strong>Rehabics</strong>
              <small>MOVE BETTER. LIVE BETTER.</small>
            </span>
          </Link>

          <div className="authVisualContent">
            <span className="authEyebrow">
              <HeartPulse size={16} />
              YOUR RECOVERY, REIMAGINED
            </span>

            <h1>
              Every step
              <br />
              brings you
              <br />
              <span>closer to better.</span>
            </h1>

            <p>
              Your journey to better movement starts here.
              Connect with trusted physiotherapy care and make
              progress at your own pace.
            </p>

            <div className="authBenefits">
              <div className="authBenefit">
                <span className="authBenefitIcon">
                  <CheckCircle2 size={19} />
                </span>

                <span>
                  <strong>Personalized care</strong>
                  <small>Support built around your needs</small>
                </span>
              </div>

              <div className="authBenefit">
                <span className="authBenefitIcon">
                  <ShieldCheck size={19} />
                </span>

                <span>
                  <strong>Secure access</strong>
                  <small>Your account, protected</small>
                </span>
              </div>
            </div>
          </div>

          <div className="authVisualFooter">
            <span className="authFooterDot" />
            Better movement. Better living.
            <span>© {new Date().getFullYear()} Rehabics</span>
          </div>

          <div className="authDecor authDecorOne" />
          <div className="authDecor authDecorTwo" />
        </aside>

        {/* Right form panel */}
        <div className="authFormPanel">
          <div className="authMobileBrand">
            <span className="authBrandIcon">
              <Activity size={23} />
            </span>
            <strong>Rehabics</strong>
          </div>

          <div className="authFormTop">
            <span className="authFormEyebrow">
              {isRegister ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
            </span>

            <h2>
              {isRegister ? "Start your journey" : "Good to see you"}
              <span>.</span>
            </h2>

            <p>
              {isRegister
                ? "Create your account and take the next step."
                : "Sign in to continue your recovery journey."}
            </p>
          </div>

          <div className="authModeSwitch">
            <button
              type="button"
              className={!isRegister ? "active" : ""}
              onClick={() => changeMode("login")}
              aria-pressed={!isRegister}
            >
              Sign in
            </button>

            <button
              type="button"
              className={isRegister ? "active" : ""}
              onClick={() => changeMode("register")}
              aria-pressed={isRegister}
            >
              Create account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              className="authForm"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {isRegister && (
                <>
                  <div className="authRoleLabel">
                    I want to join Rehabics as
                  </div>

                  <div className="authRoleOptions">
                    {roles.map(({ value, title, description, Icon }) => (
                      <button
                        type="button"
                        key={value}
                        className={`authRoleCard ${
                          role === value ? "selected" : ""
                        }`}
                        onClick={() => setRole(value)}
                        aria-pressed={role === value}
                      >
                        <span className="authRoleIcon">
                          <Icon size={21} />
                        </span>

                        <span className="authRoleText">
                          <strong>{title}</strong>
                          <small>{description}</small>
                        </span>

                        <span className="authRoleRadio">
                          {role === value && <span />}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {isRegister && (
                <div className="authField">
                  <label htmlFor="auth-name">Full name</label>

                  <div className="authInputWrap">
                    <UserRound size={18} />

                    <input
                      id="auth-name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={updateField}
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="authField">
                <label htmlFor="auth-email">Email address</label>

                <div className="authInputWrap">
                  <Mail size={18} />

                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={updateField}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div className="authField">
                  <label htmlFor="auth-phone">Phone number</label>

                  <div className="authInputWrap">
                    <Phone size={18} />

                    <input
                      id="auth-phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={updateField}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="authField">
                <div className="authLabelRow">
                  <label htmlFor="auth-password">Password</label>

                  {!isRegister && (
                    <button
                      type="button"
                      className="authTextButton"
                      onClick={() => {
                        setMessage(
                          "Please contact support or use your backend's password-reset flow."
                        );
                        setMessageType("error");
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="authInputWrap">
                  <LockKeyhole size={18} />

                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={updateField}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="authEyeButton"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="authField">
                  <label htmlFor="auth-confirm-password">
                    Confirm password
                  </label>

                  <div className="authInputWrap">
                    <LockKeyhole size={18} />

                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Enter your password again"
                      value={form.confirmPassword}
                      onChange={updateField}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      className="authEyeButton"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!isRegister ? (
                <label className="authCheckRow">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={updateField}
                  />

                  <span>Remember me on this device</span>
                </label>
              ) : (
                <label className="authCheckRow authTerms">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={updateField}
                    required
                  />

                  <span>
                    I agree to the <Link to="/terms">Terms of Service</Link>{" "}
                    and <Link to="/privacy">Privacy Policy</Link>.
                  </span>
                </label>
              )}

              <AnimatePresence>
                {message && (
                  <motion.div
                    className={`authMessage ${
                      messageType === "success" ? "success" : "error"
                    }`}
                    role="status"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {messageType === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}

                    <span>{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="authSubmit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="authSpinner" size={19} />
                    Please wait...
                  </>
                ) : (
                  <>
                    {isRegister ? "Create my account" : "Sign in to Rehabics"}
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              <div className="authSecureNote">
                <ShieldCheck size={16} />
                Your information is transmitted securely.
              </div>
            </motion.form>
          </AnimatePresence>

          <div className="authBottomText">
            {isRegister ? "Already have an account?" : "New to Rehabics?"}{" "}
            <button
              type="button"
              onClick={() =>
                changeMode(isRegister ? "login" : "register")
              }
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
