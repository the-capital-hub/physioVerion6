import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import AIFloatingButton from "./components/AIFloatingButton/AIFloatingButton";
import Auth from "./pages/Auth/Auth";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import Appointment from "./pages/Appointment/Appointment";
import Therapists from "./pages/thepoist/Therapists";
import PatientPanel from "./pages/PatientPanel/PatientPanel";
import DoctorPanel from "./pages/DoctorPanel/DoctorPanel";
import AdminPanel from "./pages/AdminPanel/AdminPanel";

// Patient portal files

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <ScrollToTop/>

      <main>{children}</main>
      <Footer />
      <AIFloatingButton />
    </>
  );
}

function DashboardPlaceholder({ title, description }) {
  return (
    <PublicLayout>
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Dashboard abhi development mein hai.</p>
      </section>
    </PublicLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Authentication */}
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Auth initialMode="login" />
            </PublicLayout>
          }
        />
        <Route path="/register" element={<Auth />} />

        <Route
          path="/appointment"
          element={
            <PublicLayout>
              <Appointment/>
            </PublicLayout>
          }
        />

        {/* Public pages */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/services"
          element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          }
        />

        <Route
          path="/therapists"
          element={
            <PublicLayout>
              <Therapists/>
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* Patient portal */}

        <Route path="/patient/*" element={<PatientPanel />} />






        {/* <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="exercises" element={<PatientExercises />} />
          <Route path="progress" element={<PatientProgress />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="settings" element={<PatientSettings />} />
        </Route> */}

        {/* Physiotherapist portal */}
            <Route path="/doctor/*" element={<DoctorPanel />} />



        {/* <Route path="/physio" element={<PhysioLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PhysioDashboard />} />
          <Route path="appointments" element={<PhysioAppointments />} />
          <Route path="patients" element={<PhysioPatients />} />
          <Route path="treatment-plans" element={<PhysioTreatmentPlans />} />
          <Route path="progress" element={<PhysioProgress />} />
          <Route path="schedule" element={<PhysioSchedule />} />
          <Route path="profile" element={<PhysioProfile />} />
          <Route path="settings" element={<PhysioSettings />} />
        </Route> */}

        {/* Admin portal */}


        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="physiotherapists" element={<AdminPhysiotherapists />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="treatment-plans" element={<AdminTreatmentPlans />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route> */}


<Route path="/admin/*" element={<AdminPanel />} />
        {/* 404 */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <section style={{ padding: 40, textAlign: "center" }}>
                <h1>404 — Page Not Found</h1>
              </section>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
