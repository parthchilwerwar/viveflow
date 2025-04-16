"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BookOpen, Users, Brain, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ArrowRightIcon } from "@radix-ui/react-icons";

// Remove testimonials array and add framework examples array
const frameworkExamples = [
  {
    title: "Business Strategy",
    description: "Transform your business ideas into comprehensive action plans with clear steps, resource allocations, and risk assessments.",
    icon: <Sparkles className="h-8 w-8 text-blue-400" />,
    gradientFrom: "from-blue-700",
    gradientTo: "to-indigo-900" ,
    
  },
  {
    title: "Project Planning",
    description: "Break down complex projects into manageable components with clearly defined dependencies, timelines, and resource requirements.",
    icon: <Users className="h-8 w-8 text-green-400" />,
    gradientFrom: "from-emerald-700",
    gradientTo: "to-green-900",
  },
  {
    title: "Learning Frameworks",
    description: "Organize educational content into structured learning paths with key concepts, practical exercises, and knowledge assessments.",
    icon: <BookOpen className="h-8 w-8 text-purple-400" />,
    gradientFrom: "from-purple-700",
    gradientTo: "to-violet-900",
  }
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header with improved blur effect */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300
          ${scrolled 
            ? 'backdrop-blur-md' : 'bg-transparent'
          } `}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-12">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                Vive<span className="text-blue-400">Flow</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/dashboard">
              <Button className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 py-1.5 px-5 rounded-full text-sm backdrop-blur-sm">
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation - Direct Dashboard link */}
          <Link href="/dashboard" className="md:hidden">
            <Button className="bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] text-white font-medium py-1.5 px-4 rounded-full text-sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content wrapper with improved overflow handling */}
      <main className="flex flex-col w-full overflow-hidden">
        {/* Padding to account for fixed header */}
        <div className="pt-24"></div>

        {/* Improved background gradient with Astra-like effect */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black via-[#2f2c7c]/50 to-[#0f172a] z-[-2]"></div>
        <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-[100px] z-[-3]"></div>

        {/* Decorative elements with better positioning */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[80vw] max-w-4xl h-[300px] bg-[#2f2c7c]/20 blur-[150px] transform -rotate-12 z-[-1]"></div>
        <div className="fixed bottom-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-4xl h-[250px] bg-[#0f172a]/30 blur-[120px] transform rotate-12 z-[-1]"></div>

        {/* Hero section with improved layout */}
        <section className="py-12 sm:py-20 px-4 relative">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center bg-gradient-to-r from-[#0f172a]/80 via-[#2f2c7c]/60 to-[#10234e]/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-8 border border-[#2f2c7c]/80 mb-[5rem]">
              <AnimatedShinyText className='inline-flex items-center justify-center px-3 py-1 font-medium transition group'> 
                <span className="bg-gradient-to-r from-blue-200 via-blue-400 to-violet-300 bg-clip-text text-transparent text-white">✨ Introducing ViveFlow AI
                </span>
                <ArrowRightIcon className="ml-1 size-3 text-blue-300 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </AnimatedShinyText>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-[#2f2c7c]/90 leading-tight">
              Transform Your Ideas Into Actionable Frameworks
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              ViveFlow helps you organize thoughts, create structured plans, and visualize your ideas in beautiful interactive mindmaps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] hover:from-[#252267] hover:to-[#312e87] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full border-0 shadow-lg shadow-[#2f2c7c]/30 transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full border-[#2f2c7c]/60 text-black hover:text-black-300 bg-white hover:bg-gray-200 backdrop-blur-sm transition-all duration-300">
                  Explore Features
                </Button>
              </Link>
            </div>
            
            
            
            
            {/* Editor Preview Image with requested specific background colors */}
            <div className="relative w-full max-w-10xl mx-auto mt-6 sm:mt-10">
              {/* Enhanced background gradient colors with higher visibility */}
              <div className="absolute -inset-24 z-[-1]">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#10234e] rounded-full blur-2xl opacity-90"></div>
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#1d1c4c] rounded-full blur-2xl opacity-90"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#201e54] rounded-full blur-2xl opacity-80"></div>
              </div>
              
              {/* Add a colored overlay to the image container */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#10234e]/20 via-[#201e54]/20 to-[#1d1c4c]/20 z-0 rounded-xl"></div>
              
              {/* New gradient drops behind the container */}
              <div className="absolute -inset-10 z-[-1] opacity-80">
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-700 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-700 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-full blur-3xl opacity-80"></div>
              </div>
              
              {/* Clean container for the image */}
              <div className="relative bg-black/20 backdrop-filter backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-10 border border-white/10 shadow-xl overflow-hidden mt-16 sm:mt-[10rem]">
                <div className="relative z-10 overflow-hidden" style={{ maxHeight: "600px" }}>
                  <Image 
                    src="/images/editor.png" 
                    alt="ViveFlow Framework Visualization" 
                    width={2600} 
                    height={900}
                    className="rounded-lg w-full"
                    priority
                  />
                </div>
              </div>
              <BorderBeam />
            </div>
          </div>
        </section>

        {/* Three steps section with improved cards */}
        <section className="py-12 sm:py-20 px-4 relative mt-6 sm:mt-10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Three Steps to Better Ideas
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Turn your vision into an actionable framework in just 3 simple steps
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-[#0f172a]/90 to-[#0f172a]/60 backdrop-blur-sm p-6 rounded-lg border border-[#2f2c7c]/50 shadow-lg hover:shadow-xl hover:border-[#2f2c7c]/80 transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Enter Your Idea</h3>
                <p className="text-gray-300">
                  Start with a simple idea, goal, or challenge that you want to develop into a comprehensive framework.
                </p>
              </div>
              <div className="bg-gradient-to-b from-[#0f172a]/90 to-[#0f172a]/60 backdrop-blur-sm p-6 rounded-lg border border-[#2f2c7c]/50 shadow-lg hover:shadow-xl hover:border-[#2f2c7c]/80 transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Generate Framework</h3>
                <p className="text-gray-300">
                  Our AI analyzes your input and creates a structured framework with action steps, challenges, resources, and tips.
                </p>
              </div>
              <div className="bg-gradient-to-b from-[#0f172a]/90 to-[#0f172a]/60 backdrop-blur-sm p-6 rounded-lg border border-[#2f2c7c]/50 shadow-lg hover:shadow-xl hover:border-[#2f2c7c]/80 transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Visualize & Export</h3>
                <p className="text-gray-300">
                  View your framework as an interactive mindmap, export it in multiple formats, and save it for future reference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features section with improved icons and layout */}
        <section id="features" className="py-12 sm:py-20 px-4 relative mt-6 sm:mt-10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Powerful Features for Your Ideas
            </h2>
            <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
              ViveFlow offers everything you need to structure, visualize, and share your ideas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gradient-to-br from-[#2f2c7c] to-[#0f172a] rounded-lg flex items-center justify-center border border-[#2f2c7c]/80 group-hover:border-[#3a3696] transition-all duration-300">
                    <Brain className="h-6 w-6 text-blue-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Frameworks</h3>
                  <p className="text-gray-300">
                    Our advanced AI transforms simple ideas into comprehensive frameworks with goals, action steps, challenges, and resources.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gradient-to-br from-[#2f2c7c] to-[#0f172a] rounded-lg flex items-center justify-center border border-[#2f2c7c]/80 group-hover:border-[#3a3696] transition-all duration-300">
                    <BookOpen className="h-6 w-6 text-blue-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Framework Library</h3>
                  <p className="text-gray-300">
                    Save all your idea frameworks in one place with easy organization, tagging, and search capabilities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gradient-to-br from-[#2f2c7c] to-[#0f172a] rounded-lg flex items-center justify-center border border-[#2f2c7c]/80 group-hover:border-[#3a3696] transition-all duration-300">
                    <Sparkles className="h-6 w-6 text-blue-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Idea Enhancement</h3>
                  <p className="text-gray-300">
                    Use our AI suggestions to refine and enhance your ideas, filling in gaps and expanding on concepts.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gradient-to-br from-[#2f2c7c] to-[#0f172a] rounded-lg flex items-center justify-center border border-[#2f2c7c]/80 group-hover:border-[#3a3696] transition-all duration-300">
                    <Users className="h-6 w-6 text-blue-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Visual Mind Maps</h3>
                  <p className="text-gray-300">
                    Visualize your frameworks as interactive mind maps that can be exported in multiple formats for sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Framework examples section - completely new section */}
        <section id="how-it-works" className="py-12 sm:py-20 px-4 relative mt-6 sm:mt-10">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
              Discover how ViveFlow transforms your ideas into structured frameworks
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {frameworkExamples.map((example, index) => (
                <div 
                  key={index}
                  className="relative bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-[#2f2c7c]/30 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${example.gradientFrom} ${example.gradientTo} group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Glowing orb */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${example.gradientFrom} ${example.gradientTo} opacity-30 blur-3xl group-hover:opacity-40 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-4">
                      {example.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{example.title}</h3>
                    <p className="text-gray-300 mb-6 flex-grow">{example.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] hover:from-[#252267] hover:to-[#312e87] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-0 shadow-lg shadow-[#2f2c7c]/30 transition-all duration-300">
                  Create Your Framework
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action section with better background handling */}
        <section className="py-20 px-4 relative mt-10 overflow-visible">
          <div className="container mx-auto text-center max-w-3xl relative overflow-visible">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[120%] aspect-square bg-[#2f2c7c]/20 rounded-full blur-[100px] z-[-1]"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of thinkers, creators, and entrepreneurs who use ViveFlow to bring structure to their ideas.
            </p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[#2f2c7c] to-[#3a3696] hover:from-[#252267] hover:to-[#312e87] text-white px-8 py-6 text-lg border-0 shadow-lg shadow-[#2f2c7c]/30 transition-all duration-300">
                Start Building Your Framework
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer section with better spacing */}
        <footer className="py-8 sm:py-12 px-4 bg-[#000000]/90 backdrop-blur-sm relative mt-6 sm:mt-10">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
              <div>
                <Link href="/">
                  <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                    Vive<span className="text-blue-400">Flow</span>
                  </span>
                </Link>
                <p className="mt-4 text-gray-400">
                  Transform your ideas into actionable frameworks with AI-powered visualization.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Features</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Tutorials</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">About</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition">Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#2f2c7c]/30 mt-12 pt-8 text-center text-gray-400">
              <p>© 2023 ViveFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
} 