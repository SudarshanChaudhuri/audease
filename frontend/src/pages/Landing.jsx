import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const features = [
  {
    title: "Real-time Availability",
    desc: "See current auditorium availability, avoid conflicts and reserve time slots instantly.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 6l-4 4 4 4" />
      </svg>
    ),
  },
  {
    title: "Smart Booking Assistant",
    desc: "Guided booking flow helps faculty and staff choose rooms, capacities and resources quickly.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
      </svg>
    ),
  },
  {
    title: "Approval Workflow",
    desc: "Admins can review and approve booking requests with configurable policies and escalation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      </svg>
    ),
  },
  {
    title: "Notifications",
    desc: "Automated email and in-app alerts for approvals, cancellations and upcoming bookings.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
      </svg>
    ),
  },
  {
    title: "Booking History & Analytics",
    desc: "Comprehensive logs and reporting for utilization, trends and institutional audits.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3v18M4 12h14" />
      </svg>
    ),
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-green-100 font-manrope">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-green-500 to-green-400 p-1 shadow-lg">
        <div className="bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
        <span className="font-bold text-xl text-green-200">A</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-200">AudEase</h1>
            <p className="text-sm text-green-300 -mt-1">Online Auditorium Booking System</p>
          </div>
        </div>

          <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 rounded-lg bg-black/60 text-green-200 border border-green-900 hover:scale-105 transform transition shadow-md text-sm font-medium">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black hover:scale-105 transform transition shadow-lg text-sm font-semibold">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1950&q=80"
            alt="Auditorium"
            className="w-full h-[760px] object-cover brightness-40 contrast-125"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="absolute inset-0 flex items-center"
          >
            <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 w-full">
                <div className="bg-black/60 backdrop-blur-md border border-green-900 rounded-2xl p-10 shadow-xl max-w-2xl flex-1 z-20">
                <h2 className="text-5xl md:text-6xl font-extrabold text-green-100 leading-tight">
                  Book smarter, faster, and conflict-free.
                </h2>
                <p className="mt-4 text-green-200 text-2xl md:text-3xl leading-relaxed">
                  AudEase — institutional auditorium booking designed for universities: conflict prevention, approval workflows and comprehensive audit trails.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="px-7 py-4 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-black font-bold shadow-md hover:scale-105 transform transition">
                    Book Now
                  </button>
                  <button className="px-7 py-4 rounded-lg bg-white/90 text-green-900 backdrop-blur-sm border border-white/80 font-semibold hover:bg-white/95 transform transition">
                    Watch Demo
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden md:flex flex-col gap-4"
              >
                <div className="w-48 h-32 rounded-xl bg-black/50 backdrop-blur-md border border-green-900 shadow-lg hover:scale-105 transform transition flex flex-col items-center justify-center text-green-200 p-4 text-center">
                  <span className="text-3xl mb-2">📅</span>
                  <span className="font-semibold">Live Availability</span>
                </div>
                <div className="w-48 h-32 rounded-xl bg-black/50 backdrop-blur-md border border-green-900 shadow-lg hover:scale-105 transform transition flex flex-col items-center justify-center text-green-200 p-4 text-center">
                  <span className="text-3xl mb-2">🔒</span>
                  <span className="font-semibold">Conflict Prevention</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <section>
          <div className="text-center mb-12">
            <h3 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200 inline-block">
              Why AudEase?
            </h3>
            <p className="text-green-300 mt-4 max-w-2xl mx-auto text-xl">
              A modern booking system built for venues, event organizers and universities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-green-900 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-tr from-green-600 to-green-400 rounded-xl text-white shadow-md">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-green-100">{f.title}</h4>
                    <p className="text-green-200 mt-2 leading-relaxed text-lg">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Role-based dashboards (Admin / Faculty / Student) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-green-900 shadow-xl">
              <h4 className="text-2xl font-bold text-green-100">Admin Dashboard</h4>
              <p className="mt-2 text-green-200">Manage bookings, set approval policies, review audit logs and configure institutional resources.</p>
            </motion.div>
            <motion.div whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-green-900 shadow-xl">
              <h4 className="text-2xl font-bold text-green-100">Faculty Dashboard</h4>
              <p className="mt-2 text-green-200">Quickly find available auditoriums, follow guided booking steps and request approvals when needed.</p>
            </motion.div>
            <motion.div whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-green-900 shadow-xl">
              <h4 className="text-2xl font-bold text-green-100">Student Access</h4>
              <p className="mt-2 text-green-200">Request bookings, view confirmed schedules and receive notifications for changes or approvals.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="mt-20">
          <div className="rounded-2xl p-8 md:p-12 bg-gradient-to-r from-green-700 to-green-600 text-black shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-3xl md:text-4xl font-bold text-white">Ready to simplify bookings?</h4>
              <p className="mt-2 text-green-100 text-lg">Sign up and start managing your auditorium events in minutes.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 rounded-xl bg-white text-green-800 font-bold shadow-md hover:scale-105 hover:shadow-lg transition duration-200">
                Start for Free
              </button>
              <button className="px-8 py-4 rounded-xl bg-black/30 text-white border border-green-400/30 font-semibold hover:bg-black/50 transition duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-800 text-sm text-green-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} AudEase — Online Auditorium Booking System</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-green-200 transition">Privacy Policy</a>
            <a href="#" className="hover:text-green-200 transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}