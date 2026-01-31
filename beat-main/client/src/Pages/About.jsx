import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';

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
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto mt-10">
        <motion.h1
          className="text-5xl font-bold mb-8 text-center"
          variants={itemVariants}
        >
          About
        </motion.h1>

        <motion.div className="space-y-6 text-lg leading-relaxed" variants={itemVariants}>
          <p>
            Beat is a modern music streaming web application designed to provide an immersive and seamless listening experience for music enthusiasts. The platform allows users to explore a wide range of tracks, stream audio in real time, and manage their music preferences through an intuitive and visually clean interface.
          </p>

          <p>
            Built using a full-stack architecture, Beat integrates a responsive frontend with a robust backend system to ensure secure authentication, efficient data handling, and scalable performance. Users can create personalized playlists, save their favorite tracks, and easily search for music based on their interests.
          </p>

          {isAuth && (
            <motion.div
              className="mt-12 bg-neutral-900 p-6 rounded-lg shadow-lg"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-2">Your Transactions</h2>

              {loading ? (
                <p className="text-center text-gray-400">Loading transactions...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-400">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, index) => (
                        <motion.tr
                          key={tx._id}
                          className="border-b border-gray-800 hover:bg-neutral-800 transition"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="py-3 px-4">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{tx.description}</td>
                          <td className="py-3 px-4 font-mono">${tx.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'completed' ? 'bg-green-900 text-green-300' :
                                tx.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                  'bg-red-900 text-red-300'
                              }`}>
                              {tx.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          <motion.div className="mt-12" variants={itemVariants}>
            <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Real-time music streaming</li>
              <li>Personalized playlists</li>
              <li>Advanced search functionality</li>
              <li>Cross-device compatibility</li>
              <li>Secure user authentication</li>
              <li>Clean, intuitive interface</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;