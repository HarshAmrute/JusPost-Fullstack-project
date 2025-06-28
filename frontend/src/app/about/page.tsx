"use client";

import { motion, Variants } from 'framer-motion';
import { FaGithub, FaEnvelope, FaCode, FaServer, FaDatabase, FaReact, FaLock, FaUsers, FaComment, FaShieldAlt, FaMoon } from 'react-icons/fa';
import { SiSocketdotio, SiNextdotjs, SiMongodb, SiTypescript, SiTailwindcss, SiJsonwebtokens } from 'react-icons/si';
import ParticleBackground from '@/components/ParticleBackground';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const technologies = [
    { name: "Next.js", href: "https://nextjs.org/", icon: <SiNextdotjs className="w-8 h-8 text-black dark:text-white" /> },
    { name: "MongoDB", href: "https://www.mongodb.com/", icon: <SiMongodb className="w-8 h-8 text-green-500" /> },
    { name: "Express.js", href: "https://expressjs.com/", icon: <FaServer className="w-8 h-8 text-gray-600" /> },
    { name: "React", href: "https://react.dev/", icon: <FaReact className="w-8 h-8 text-blue-500" /> },
    { name: "Node.js", href: "https://nodejs.org/", icon: <FaServer className="w-8 h-8 text-green-600" /> },
    { name: "REST API", href: "https://restfulapi.net/", icon: <FaCode className="w-8 h-8 text-indigo-500" /> },
    { name: "TailwindCSS", href: "https://tailwindcss.com/", icon: <SiTailwindcss className="w-8 h-8 text-teal-500" /> },
    { name: "TypeScript", href: "https://www.typescriptlang.org/", icon: <SiTypescript className="w-8 h-8 text-blue-600" /> },
    { name: "Socket.IO", href: "https://socket.io/", icon: <SiSocketdotio className="w-8 h-8 text-black dark:text-white" /> },
    { name: "Framer Motion", href: "https://www.framer.com/motion/", icon: <FaCode className="w-8 h-8 text-pink-500" /> },
    { name: "JWT", href: "https://jwt.io/", icon: <SiJsonwebtokens className="w-8 h-8 text-yellow-500" /> },
  ];

  const architecturePoints = [
    {
      title: "Frontend Architecture",
      content: "Built with Next.js 14 using the App Router for optimized server and client components. The UI is crafted with TailwindCSS for responsive design and Framer Motion for smooth animations. TypeScript ensures type safety throughout the codebase."
    },
    {
      title: "Backend Structure",
      content: "Node.js powers the RESTful API with Express.js handling routing. MongoDB provides a flexible document database for storing posts, user data, and relationships. Authentication is managed through JWT tokens with secure HTTP-only cookies."
    },
    {
      title: "Real-time Communication",
      content: "Socket.IO enables instant updates across clients when new posts are created, edited, or deleted. This creates a dynamic, interactive experience without requiring page refreshes."
    },
    {
      title: "State Management",
      content: "React Context API manages global state for user authentication, theme preferences, and post data. This provides a clean, prop-drilling-free approach to state management across the application."
    }
  ];

  const features = [
    {
      title: "User Authentication",
      icon: <FaLock className="w-5 h-5 text-blue-500" />,
      description: "Secure login and registration system with JWT token authentication and protected routes. Users can create accounts with private usernames and public display names."
    },
    {
      title: "Public & Private Posts",
      icon: <FaUsers className="w-5 h-5 text-green-500" />,
      description: "Users can create public posts visible to everyone or private posts accessible only via a secure unique link that can be shared with specific individuals."
    },
    {
      title: "Real-time Updates",
      icon: <FaComment className="w-5 h-5 text-purple-500" />,
      description: "Socket.IO integration ensures all users see new posts and updates instantly without needing to refresh the page, creating a dynamic, interactive experience."
    },
    {
      title: "Admin Dashboard",
      icon: <FaShieldAlt className="w-5 h-5 text-red-500" />,
      description: "Administrators have access to a dedicated dashboard for content moderation, user management, and platform analytics to maintain community standards."
    },
    {
      title: "Dark Mode Support",
      icon: <FaMoon className="w-5 h-5 text-indigo-500" />,
      description: "Full dark mode implementation with system preference detection and manual toggle option for comfortable viewing in any lighting condition."
    },
    {
      title: "JWT Security",
      icon: <SiJsonwebtokens className="w-5 h-5 text-yellow-500" />,
      description: "JSON Web Tokens provide secure authentication with token refresh mechanisms and HTTP-only cookies to prevent XSS attacks."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground className="absolute inset-0" preset="colorful" />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              About JusPost
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              A modern social platform designed for sharing thoughts, ideas, and stories in real-time.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
            variants={itemVariants}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaCode className="mr-3 text-purple-500" />
                <span>Project Overview</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                JusPost is a full-stack social media application built with modern web technologies. It combines the power of Next.js for the frontend with Node.js and MongoDB for the backend, creating a seamless, real-time posting experience.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                The platform was developed as a demonstration of modern web development practices, focusing on performance, security, and user experience. It showcases real-time updates with Socket.IO, secure authentication with JWT, and responsive design with TailwindCSS.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Whether you're sharing public posts with the world or private thoughts with selected individuals, JusPost provides a seamless, real-time experience for all your social needs.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaDatabase className="mr-3 text-blue-500" />
                <span>Key Features</span>
              </h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                  <span>Real-time post updates using Socket.IO</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                  <span>Public and private posting options with secure sharing</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                  <span>JWT authentication with secure HTTP-only cookies</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                  <span>Responsive design with dark mode support</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                  <span>Admin dashboard for content moderation</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                  <span>MongoDB database for flexible document storage</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            className="mb-16"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Technical Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {architecturePoints.map((point, index) => (
                <motion.div 
                  key={point.title}
                  className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">{point.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{point.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="mb-16"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Detailed Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="flex p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mr-4 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="mb-16"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Technologies Used</h2>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-6">
              {technologies.map((tech) => (
                <motion.a 
                  key={tech.name}
                  href={tech.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md"
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {tech.icon}
                  <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-center px-1">{tech.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-16"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Meet the Developer</h2>
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="text-xl font-semibold mb-2">Harsh Amrute</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Full-stack developer passionate about creating modern web applications with clean, efficient code and excellent user experiences. Specializing in React, Next.js, and Node.js development with a focus on real-time applications and responsive design.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/HarshAmrute" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaGithub className="w-5 h-5 mr-2" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="mailto:harsh1amrute@gmail.com"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaEnvelope className="w-5 h-5 mr-2" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
