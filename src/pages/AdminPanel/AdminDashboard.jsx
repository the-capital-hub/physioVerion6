
import { motion } from "framer-motion";
import {
  Users, UserRound, CalendarCheck, IndianRupee,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Clock, CheckCircle2
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";
import "./AdminPanel.css";

const stats = [
  {
    title: "Total Patients", value: "1,284", change: "+12.8%",
    note: "vs. last month", icon: Users, positive: true
  },
  {
    title: "Physiotherapists", value: "48", change: "+4.2%",
    note: "vs. last month", icon: UserRound, positive: true
  },
  {
    title: "Appointments", value: "356", change: "+8.1%",
    note: "vs. last month", icon: CalendarCheck, positive: true
  },
  {
    title: "Revenue", value: "₹2.48L", change: "-2.4%",
    note: "vs. last month", icon: IndianRupee, positive: false
  },
];

const weeklyData = [
  { day: "Mon", appointments: 35, patients: 22 },
  { day: "Tue", appointments: 48, patients: 30 },
  { day: "Wed", appointments: 40, patients: 26 },
  { day: "Thu", appointments: 65, patients: 42 },
  { day: "Fri", appointments: 54, patients: 35 },
  { day: "Sat", appointments: 76, patients: 49 },
  { day: "Sun", appointments: 44, patients: 28 },
];

const distribution = [
  { name: "Completed", value: 62, color: "#198754" },
  { name: "Upcoming", value: 25, color: "#2563eb" },
  { name: "Cancelled", value: 13, color: "#e5a23d" },
];

const appointments = [
  { name: "Ananya Sharma", service: "Knee Rehabilitation", therapist: "Dr. Rahul Verma", date: "Today, 10:30 AM", status: "Confirmed", initials: "AS" },
  { name: "Rohan Kumar", service: "Sports Injury", therapist: "Dr. Priya Singh", date: "Today, 11:00 AM", status: "Pending", initials: "RK" },
  { name: "Meera Patel", service: "Back Pain Therapy", therapist: "Dr. Amit Das", date: "Today, 12:15 PM", status: "Confirmed", initials: "MP" },
  { name: "Arjun Rao", service: "Post Surgery Rehab", therapist: "Dr. Neha Gupta", date: "Today, 02:00 PM", status: "Cancelled", initials: "AR" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="admin-muted">Welcome back! Here's what's happening with Rehabics today.</p>
        </div>
        <button className="admin-primary-button" onClick={() => window.print()}>
          Export report
        </button>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive ? ArrowUpRight : ArrowDownRight;
          return (
            <motion.article
              className="admin-stat-card"
              key={stat.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <div className="admin-stat-top">
                <span>{stat.title}</span>
                <span className="admin-stat-icon"><Icon size={19} /></span>
              </div>
              <h2>{stat.value}</h2>
              <div className="admin-stat-foot">
                <span className={stat.positive ? "admin-positive" : "admin-negative"}>
                  <ChangeIcon size={14} /> {stat.change}
                </span>
                <span>{stat.note}</span>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <div>
              <h2>Appointment Overview</h2>
              <p>Weekly appointment activity</p>
            </div>
            <span className="admin-select-label">This week</span>
          </div>

          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="appointmentsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#edf0f5" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#8490a4", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8490a4", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#2563eb" strokeWidth={2.5} fill="url(#appointmentsFill)" />
                <Area type="monotone" dataKey="patients" stroke="#21a6a1" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-chart-legend">
            <span><i className="legend-blue" /> Appointments</span>
            <span><i className="legend-teal" /> Patients</span>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-heading">
            <div>
              <h2>Appointment Status</h2>
              <p>Overall distribution</p>
            </div>
            <MoreHorizontal size={20} />
          </div>
          <div className="admin-donut-wrap">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={57}
                  outerRadius={79}
                  paddingAngle={4}
                  stroke="none"
                >
                  {distribution.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="admin-donut-center">
              <strong>356</strong><span>Total</span>
            </div>
          </div>
          <div className="admin-distribution-list">
            {distribution.map((item) => (
              <div key={item.name}>
                <span><i style={{ background: item.color }} />{item.name}</span>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-card admin-table-card">
        <div className="admin-card-heading">
          <div>
            <h2>Recent Appointments</h2>
            <p>Latest bookings across your platform</p>
          </div>
          <button className="admin-text-button" onClick={() => window.location.href = "/admin/appointments"}>
            View all
          </button>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Patient</th><th>Service</th><th>Physiotherapist</th><th>Date & Time</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.name}>
                  <td>
                    <div className="admin-person-cell">
                      <span className="admin-person-avatar">{item.initials}</span>
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td>{item.service}</td>
                  <td>{item.therapist}</td>
                  <td><span className="admin-date-cell"><Clock size={13} />{item.date}</span></td>
                  <td><span className={`admin-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="admin-bottom-note">
        <CheckCircle2 size={17} />
        <span>Dashboard is showing sample data. Connect your API to display live information.</span>
      </div>
    </div>
  );
}
