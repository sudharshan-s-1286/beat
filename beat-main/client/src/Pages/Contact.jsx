import React from 'react';
import { motion } from 'motion/react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';

const Contact = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Column: Info & Context */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h5 className="text-red-600 font-bold uppercase tracking-widest mb-4">Contact Us</h5>
                    <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                        Let's start a <br />
                        <span className="text-neutral-500">conversation.</span>
                    </h1>
                    <p className="text-xl text-neutral-400 mb-12 max-w-lg">
                        Have a question about Beat? Just want to say hello? We are always here to help you get the most out of your music.
                    </p>

                    <div className="space-y-8">
                        <ContactItem icon={<MailOutlined />} title="Email" value="support@beatmusic.com" />
                        <ContactItem icon={<PhoneOutlined />} title="Phone" value="+1 (555) 123-4567" delay={0.1} />
                        <ContactItem icon={<EnvironmentOutlined />} title="Office" value="123 Music Lane, Audio City, AC 90210" delay={0.2} />
                    </div>
                </motion.div>

                {/* Right Column: Interactive Form */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-900 rounded-3xl blur-2xl opacity-20 pointer-events-none" />
                    <div className="relative bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-8 md:p-12 rounded-3xl shadow-2xl">
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="First Name" placeholder="John" />
                                <FormInput label="Last Name" placeholder="Doe" />
                            </div>
                            <FormInput label="Email Address" placeholder="john@example.com" type="email" />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-400">Message</label>
                                <textarea
                                    rows="4"
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full bg-black/50 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full group bg-white text-black font-bold py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3">
                                Send Message
                                <SendOutlined className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, title, value, delay = 0 }) => (
    <motion.div
        className="flex items-start gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 + delay }}
    >
        <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-xl text-white border border-neutral-800">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white text-lg">{title}</h4>
            <p className="text-neutral-400">{value}</p>
        </div>
    </motion.div>
);

const FormInput = ({ label, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-400">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-black/50 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
        />
    </div>
);

export default Contact;
