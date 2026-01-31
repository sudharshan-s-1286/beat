import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { CustomerServiceFilled, TrophyFilled, SafetyCertificateFilled, GlobalOutlined } from '@ant-design/icons';

const About = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    if (isAuth) {
      fetchTransactions();
    }
  }, [isAuth]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white selection:bg-red-900 selection:text-white pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <header className="relative py-24 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-red-600/20 blur-[120px] rounded-full -z-10" />
        <motion.h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-transparent" variants={itemVariants}>
          Redefining <br /> Streaming.
        </motion.h1>
        <motion.p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light" variants={itemVariants}>
          Experience music like never before. Pure, seamless, and tailored to your rhythm.
        </motion.p>
      </header>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start mt-10">

        {/* Left Column: Mission & Features */}
        <div className="space-y-16">
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <CustomerServiceFilled className="text-red-600" />
              Our Mission
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Beat isn't just a platform; it's a movement. We are dedicated to bridging the gap between artists and listeners, providing high-fidelity streaming with zero interruptions. We believe music is the universal language, and we are here to amplify it.
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard icon={<TrophyFilled />} title="Premium Quality" desc="Lossless audio for the audiophiles." />
            <FeatureCard icon={<SafetyCertificateFilled />} title="Secure & Private" desc="Your data is yours. Always." />
            <FeatureCard icon={<GlobalOutlined />} title="Global Access" desc="Listen from anywhere in the world." />
            <FeatureCard icon={<CustomerServiceFilled />} title="24/7 Support" desc="We are here whenever you need us." />
          </motion.section>
        </div>

        {/* Right Column: Transaction Dashboard (Auth only) or Visual */}
        <motion.div variants={itemVariants} className="relative">
          {isAuth ? (
            <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-1">My Dashboard</h3>
                  <h2 className="text-3xl font-bold">Transaction History</h2>
                </div>
                <div className="text-sm px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                  ● Live
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-neutral-800 rounded-xl w-full" />)}
                </div>
              ) : error ? (
                <div className="p-6 bg-red-900/20 text-red-400 rounded-xl text-center border border-red-900/50">
                  {error}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <p>No transactions found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx, idx) => (
                    <motion.div
                      key={tx._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex items-center justify-between p-4 bg-black/40 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                          $
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-red-500 transition-colors">{tx.description}</p>
                          <p className="text-xs text-neutral-500">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-lg">${tx.amount.toFixed(2)}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${tx.status === 'completed' ? 'text-green-500' :
                          tx.status === 'pending' ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>{tx.status}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[400px] w-full bg-neutral-900/30 rounded-3xl border border-neutral-800 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent pointer-events-none" />
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
                <p className="text-neutral-400 mb-6">Sign in to view your personalized dashboard and transaction history.</p>
                <Link to="/signin" className="inline-block">
                  <div className="w-16 h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform cursor-pointer">
                    <CustomerServiceFilled className="text-3xl text-white" />
                  </div>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-red-600/30 transition-colors group">
    <div className="text-2xl text-neutral-400 mb-4 group-hover:text-red-500 transition-colors">{icon}</div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-neutral-500">{desc}</p>
  </div>
);

export default About;