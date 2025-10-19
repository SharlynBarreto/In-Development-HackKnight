import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

export default function Welcome() {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    salary: '',
    email: '',
    name: '',
    location: ''
  });

  const handleGetStarted = () => {
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(formData));
    navigate('/home');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: "linear-gradient(180deg, #0ea5e9 0%, #38bdf8 40%, #e0f2fe 100%)"
      }}
    >
      
      {/* Animated Clouds Background */}
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <motion.img
        src="/clouds.png"
        alt="Clouds"
        className="absolute top-0 left-0 w-[200%] h-auto opacity-100 object-cover"
        style={{ imageRendering: 'auto' }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0.6, y: 12, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: prefersReduced ? 0 : 0.8, ease }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            <motion.h1
              className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700"
              initial={{ opacity: 0.4, y: 50, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: prefersReduced ? 0 : 2.4, ease, delay: 0.2 }}
            >
              <div className="text-center">
                <div>Welcome</div>
                <div>to</div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <img
                  src="/up_logo.png"
                  alt="Up Logo"
                  className="h-50 w-50 object-contain"
                />
                <span>UP! Real Estate</span>
              </div>
            </motion.h1>
            <motion.h6
              className="text-xl text-white mt-6 text-center max-w-2xl drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReduced ? 0 : 1.2, ease, delay: 0.8 }}
            >
              Your journey to smart real estate investing starts here.
            </motion.h6>
            <motion.h5
              className="text-md text-white text-center max-w-md"
            >
              2025 Hack Knight Submission. 
            </motion.h5>
            <motion.button
              onClick={handleGetStarted}
              className="px-8 py-3.5 bg-white text-black text-md font-medium rounded-2xl hover:bg-gray-800 hover:text-white transition-colors shadow-md hover:shadow-lg w-1/2"
              initial={{ opacity: 0, y: 20, scale: 1.45 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: prefersReduced ? 0 : 1.8, ease, delay: 0.6 }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: prefersReduced ? 0 : 0.3, ease }}
            className="w-full max-w-2xl px-8 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Let's Get to Know You
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                UP helps you find the perfect investment property based on your income and preferences. 
                We analyze rental income potential, property appreciation, and flip opportunities to 
                maximize your returns. Let's start by understanding your financial goals.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Annual Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="75,000"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Austin, TX"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-4 pt-4"
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Continue to Properties
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content Section - Only show on step 1 */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-sm mb-4"
          >
            ↓ Scroll to learn more ↓
          </motion.div>
        </motion.div>
      )}
      {/* Description Section */}
      {step === 1 && (
        <div className="absolute top-[100vh] left-0 right-0 bg-white py-20 z-20">
          <div className="max-w-4xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                Smart Real Estate Investment Analysis
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                UP! Real Estate is an innovative platform designed to help investors make data-driven 
                decisions in the real estate market. Our sophisticated algorithm analyzes three primary 
                investment strategies: Airbnb short-term rentals, long-term lease opportunities, and 
                fix-and-flip projects.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We leverage market data, rental trends, and property appreciation rates to calculate 
                accurate ROI projections. Each property is analyzed across all three strategies, with 
                color-coded rankings showing you the best investment approach at a glance: green for 
                the highest returns, yellow for moderate returns, and red for lower returns.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're a first-time investor or a seasoned professional, UP! Real Estate 
                provides the insights you need to maximize your investment potential and build wealth 
                through smart property decisions.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 mt-16"
            >
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Driven</h3>
                <p className="text-gray-600">Real market data and trends power our calculations</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ROI Focused</h3>
                <p className="text-gray-600">Compare strategies to maximize your returns</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">Intuitive interface for investors of all levels</p>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="mt-20 border-t border-gray-200 pt-8 pb-8">
            <div className="max-w-4xl mx-auto px-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src="/up_logo.png" alt="UP Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">UP! Real Estate</span>
              </div>
              <p className="text-gray-600 mb-2">
                © 2025 UP! Real Estate. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Created by Giancarlo Forero, Sharlyn Barreto, Jason Zheng, and Bryan Mejia for Hack Knight 2025
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}