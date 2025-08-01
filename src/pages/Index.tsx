
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Check, Clock, DollarSign, Star, Zap, Users, Shield, Eye, EyeOff, Gift } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const deviceMode = 'cross'; // Always use cross-device mode
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(90);
  const [selectedApp, setSelectedApp] = useState('zoom');
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const technicalQuestions = [
    { 
      domain: "Java", 
      question: "What's the difference between ArrayList and LinkedList?", 
      answer: "ArrayList uses dynamic arrays for storage, offering O(1) access but O(n) insertion. LinkedList uses doubly-linked nodes, providing O(1) insertion but O(n) access time." 
    },
    { 
      domain: "Python", 
      question: "Explain the GIL in Python", 
      answer: "The Global Interpreter Lock prevents multiple threads from executing Python bytecode simultaneously, making Python multithreading less effective for CPU-bound tasks." 
    },
    { 
      domain: "Data Science", 
      question: "What is overfitting and how do you prevent it?", 
      answer: "Overfitting occurs when a model learns training data too specifically. Prevent it using cross-validation, regularization, dropout, or early stopping techniques." 
    },
    { 
      domain: "Machine Learning", 
      question: "Difference between supervised and unsupervised learning?", 
      answer: "Supervised learning uses labeled data to predict outcomes, while unsupervised learning finds patterns in unlabeled data through clustering or dimensionality reduction." 
    },
    { 
      domain: "AI", 
      question: "What are transformers in deep learning?", 
      answer: "Transformers use self-attention mechanisms to process sequential data in parallel, revolutionizing NLP by enabling models like GPT and BERT to understand context better." 
    },
    { 
      domain: ".NET", 
      question: "What is the difference between .NET Framework and .NET Core?", 
      answer: ".NET Framework is Windows-only and legacy, while .NET Core is cross-platform, open-source, and the modern unified platform for all .NET development." 
    },
    { 
      domain: "SAP", 
      question: "What is SAP HANA and its benefits?", 
      answer: "SAP HANA is an in-memory database platform that processes data in real-time, offering faster analytics, reduced data footprint, and simplified IT landscapes." 
    },
    { 
      domain: "React", 
      question: "What are React Hooks and why use them?", 
      answer: "Hooks let you use state and lifecycle features in functional components, promoting code reuse and cleaner component logic without class complexity." 
    }
  ];

  const meetingApps = [
    { id: 'zoom', name: 'Zoom', color: 'bg-blue-500', icon: '🎥' },
    { id: 'teams', name: 'Teams', color: 'bg-purple-500', icon: '👥' },
    { id: 'meet', name: 'Google Meet', color: 'bg-green-500', icon: '📹' },
    { id: 'webex', name: 'Webex', color: 'bg-orange-500', icon: '💼' },
    { id: 'any', name: 'Any App', color: 'bg-gradient-to-r from-blue-400 to-purple-600', icon: '🌐' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % technicalQuestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const plans = [
    {
      id: 'free-trial',
      name: 'Free Trial',
      price: 'Free',
      priceUnit: '',
      billing: 'one-time',
      duration: '10 minutes',
      description: 'Try InterviewAce risk-free',
      bestFor: 'New users - experience the magic',
      features: [
        '10-minute trial session',
        'Real-time AI assistance',
        'Stealth overlay system',
        'Works with any meeting app',
        'No payment required'
      ],
      popular: false,
      isFree: true,
    },
    {
      id: 'quick-session',
      name: 'Quick Session',
      price: '$9.99',
      priceUnit: '/ hour',
      billing: 'one-time',
      duration: 'Pay per hour',
      description: 'Quick interview prep - no account needed',
      bestFor: 'Immediate interview preparation',
      features: [
        'Instant access - no signup',
        'Upload resume & job description', 
        'Get 6-digit session code',
        'Real-time AI coaching overlay',
        'Works with native helper'
      ],
      popular: true,
    },
    {
      id: 'pay-as-you-go',
      name: 'Hourly Sessions',
      price: '$9.99',
      priceUnit: '/ hour',
      billing: 'one-time',
      duration: 'Select hours needed',
      description: 'Quick interview prep - no account needed',
      bestFor: 'Immediate interview preparation',
      features: [
        'Unlimited AI tokens per session',
        'Priority LLM processing',
        'Job-specific trained AI models',
        'Real-time coaching overlay',
        'Cross-device companion app'
      ],
      popular: true,
    },
    {
      id: 'coach',
      name: 'Coach Bundle',
      price: '$99',
      priceUnit: '/ month',
      billing: 'monthly',
      duration: '20 credits',
      description: 'Career & placement coaches',
      bestFor: 'Professional coaching practice',
      features: [
        '20 session credits (shareable)',
        'Client management dashboard',
        'White-label PDF reports',
        'Logo upload & branding',
        'Cross-device capabilities'
      ],
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise / API',
      price: 'Custom',
      priceUnit: 'quote',
      billing: 'annual',
      duration: '500+ credits',
      description: 'Job platforms, bootcamps',
      bestFor: 'High-volume usage',
      features: [
        '500+ credits per year',
        'SSO (SAML/OIDC)',
        'Usage analytics export',
        'Dedicated Slack support',
        'Cross-device infrastructure'
      ],
      popular: false,
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free-trial') {
      // For free trial, go directly to upload page
      navigate(`/upload?plan=${planId}&device=${deviceMode}&trial=true`);
    } else if (planId === 'quick-session') {
      navigate(`/payment?plan=quick-session`);
    } else {
      navigate(`/auth?plan=${planId}&device=${deviceMode}`);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      
      {/* Floating Orbs */}
      <motion.div 
        style={{ y: y1 }}
        className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: y2 }}
        className="fixed top-40 right-20 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: y3 }}
        className="fixed bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
      />

      {/* Static Navigation */}
      <motion.nav
        animate={{ 
          backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.1)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'blur(12px)',
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border/30"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-white" />
              <span className="text-white font-poppins font-semibold">InterviewAce</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-white/80">
              <button onClick={() => navigate("/how-it-works")} className="hover:text-white transition-colors">How It Works</button>
              <button onClick={() => navigate("/downloads")} className="hover:text-white transition-colors">Downloads</button>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <button onClick={() => navigate("/faq")} className="hover:text-white transition-colors">FAQ</button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectPlan('pay-as-you-go')}
              className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Try Now
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left space-y-8"
          >
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold font-poppins text-white mb-6 leading-tight">
                Ace Your Next Interview with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400"> AI</span>
              </h1>
              <p className="text-xl text-white/80 font-inter mb-8 leading-relaxed">
                Get real-time clarity reminders during live interviews with our transparent overlay system. 
                Works with any meeting app—completely invisible to screen sharing.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan('free-trial')}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-600/25 border border-green-500/50 hover:border-green-500 transition-all"
              >
                <Gift className="inline h-5 w-5 mr-2" />
                Try Free (10 min)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan('quick-session')}
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/25 border border-primary/50 hover:border-primary transition-all"
              >
                <Zap className="inline h-5 w-5 mr-2" />
                Quick Session ($9.99/hr)
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-sm">
              <div className="flex items-center space-x-2 text-white/70">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 Success Rate</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Users className="h-4 w-4 text-blue-400" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Shield className="h-4 w-4 text-green-400" />
                <span>100% Secure</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Demo Interface */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative space-y-6"
          >
            {/* Meeting App Selector */}
            <div className="flex justify-center space-x-2 mb-4">
              {meetingApps.map((app) => (
                <motion.button
                  key={app.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedApp(app.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedApp === app.id 
                      ? `${app.color} text-white` 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-2">{app.icon}</span>
                  {app.name}
                </motion.button>
              ))}
            </div>

            {/* Interview Screen */}
            <motion.div
              whileHover={{ rotateY: 2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="backdrop-blur-md bg-glass border border-glass-border rounded-3xl p-8 shadow-2xl"
            >
              <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6 relative">
                {/* App Header */}
                <div className={`${meetingApps.find(app => app.id === selectedApp)?.color} px-4 py-2 flex items-center space-x-2`}>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-white text-sm font-medium">
                    {meetingApps.find(app => app.id === selectedApp)?.name} - Technical Interview
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="text-blue-400 text-sm mb-2">Interviewer:</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSubtitle}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-white text-lg mb-6"
                    >
                      {technicalQuestions[currentSubtitle].question}
                    </motion.div>
                  </AnimatePresence>

                  {/* AI Suggestion Overlay - White and Transparent Background Only */}
                  <motion.div
                    className="rounded-lg p-4 border border-white/50 relative"
                    style={{ 
                      backgroundColor: `rgba(255, 255, 255, ${overlayOpacity / 100})`
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-blue-600 font-medium">
                          {technicalQuestions[currentSubtitle].domain} - AI Suggestion:
                        </div>
                      </div>
                      <Eye className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="text-sm text-gray-800 font-medium">
                      {technicalQuestions[currentSubtitle].answer}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Opacity Control */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Overlay Transparency</span>
                  <span className="text-accent text-sm">{overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Cross-Device Status */}
              <motion.div
                animate={{ 
                  scale: 1,
                  boxShadow: "0 0 20px rgba(45, 212, 191, 0.3)"
                }}
                className="flex items-center justify-center space-x-2 text-accent text-sm font-medium"
              >
                <Shield className="h-4 w-4" />
                <span>Invisible to Screen Sharing - Works with Any Meeting App</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="relative max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-poppins text-white mb-4">Choose Your Plan</h2>
          <p className="text-white/70 text-lg">Start with a free trial, then select the perfect plan for your needs</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Add Quick Session as first option */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            whileHover={{ y: -8, rotateX: 2 }}
            className="relative backdrop-blur-md bg-glass border border-glass-border rounded-2xl p-6 shadow-2xl ring-2 ring-orange-500 scale-105"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium"
            >
              Quick Start
            </motion.div>
            
            <div className="text-center pb-4">
              <h3 className="text-xl font-bold text-white font-poppins">Quick Session</h3>
              <p className="text-sm text-white/60 mb-4">No account needed</p>
              <div className="flex items-center justify-center space-x-1 mt-4">
                <span className="text-3xl font-bold text-white">$9.99</span>
                <span className="text-sm text-white/60">/hour</span>
              </div>
              <div className="flex items-center justify-center text-sm text-white/60 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                Pay per hour
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                {[
                  "Instant access - no signup",
                  "Upload resume & job description", 
                  "Get 6-digit session code",
                  "Real-time AI coaching overlay",
                  "Works with native helper"
                ].map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (0 * 0.1) + (featureIndex * 0.05) }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan('quick-session')}
                className="w-full py-4 text-lg font-semibold rounded-xl transition-all bg-orange-600 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40"
              >
                <Zap className="inline h-5 w-5 mr-2" />
                Start Quick Session
              </motion.button>
            </div>
          </motion.div>

          {/* Keep existing plans but shift their index */}
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              whileHover={{ y: -8, rotateX: 2 }}
              className={`relative backdrop-blur-md bg-glass border border-glass-border rounded-2xl p-6 shadow-2xl ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              } ${
                plan.isFree ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium"
                >
                  Most Popular
                </motion.div>
              )}
              
              {plan.isFree && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium"
                >
                  Free Trial
                </motion.div>
              )}
              
              <div className="text-center pb-4">
                <h3 className="text-xl font-bold text-white font-poppins">{plan.name}</h3>
                <p className="text-sm text-white/60 mb-4">{plan.bestFor}</p>
                <div className="flex items-center justify-center space-x-1 mt-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/60">{plan.priceUnit}</span>
                </div>
                <div className="flex items-center justify-center text-sm text-white/60 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  {plan.duration}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all ${
                    plan.isFree
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/25 hover:shadow-green-600/40'
                      : plan.popular 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40' 
                        : 'backdrop-blur-md bg-glass border border-glass-border text-white hover:bg-white/20'
                  }`}
                >
                  {plan.isFree ? (
                    <>
                      <Gift className="inline h-5 w-5 mr-2" />
                      Start Free Trial
                    </>
                  ) : (
                    <>
                      <Zap className="inline h-5 w-5 mr-2" />
                      Get Started with {plan.name}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="backdrop-blur-md bg-glass border border-glass-border rounded-2xl p-6 inline-block">
            <p className="text-white/80 mb-4">✨ All plans include:</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
              <span>• Live clarity coaching</span>
              <span>• Transparent overlay system</span>
              <span>• Invisible to screen shares</span>
              <span>• Works with any meeting app</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
