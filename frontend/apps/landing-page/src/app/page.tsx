"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Shield,
  Users,
  Award,
  Briefcase,
  DollarSign,
  Star,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Main App component
const App = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Theme color definition
  const primaryColor = "#5C08B1"; // Your theme color
  const primaryColorLight = "#7b2fd6"; // A slightly lighter shade for hover effects
  const accentColor = "#00C853"; // A complementary accent color

  // Responsive design: Adjust body padding for fixed header
  useEffect(() => {
    document.body.style.fontFamily = "Inter, sans-serif";
    document.body.style.margin = "0";
    document.body.style.paddingTop = "64px"; // Height of the fixed header
    return () => {
      document.body.style.paddingTop = "0";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            <img
              src="/logo.png"
              alt="Enterprise ERP Logo"
              className="w-32 h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-300"
            >
              Features
            </a>
            <a
              href="#why-us"
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-300"
            >
              Why Us
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-300"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-300"
            >
              Contact
            </a>

            <a
              href="https://app.example.com/signin"
              className="text-gray-600 hover:text-gray-900 font-medium transition duration-300"
            >
              Login
            </a>

            <button
              className="px-6 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 4px 14px 0 ${primaryColor}40`,
              }}
              onClick={() => router.push("/register")}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white mt-4 py-4 px-4 shadow-inner">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:bg-gray-100 rounded-md px-3"
            >
              Features
            </a>
            <a
              href="#why-us"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:bg-gray-100 rounded-md px-3"
            >
              Why Us
            </a>
            <a
              href="#testimonials"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:bg-gray-100 rounded-md px-3"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:bg-gray-100 rounded-md px-3"
            >
              Contact
            </a>

            <a
              href="https://app.example.com/signin"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:bg-gray-100 rounded-md px-3"
            >
              Login
            </a>

            <button
              className="w-full mt-4 py-2 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition duration-300"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 4px 14px 0 ${primaryColor}40`,
              }}
              onClick={() => router.push("/register")}
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white to-indigo-50 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Hero Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Streamline Your{" "}
              <span style={{ color: primaryColor }}>Operations</span>, Boost
              Your <span style={{ color: primaryColor }}>Growth</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
              Our comprehensive SaaS solution empowers businesses to manage
              their operations with unparalleled efficiency and intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                className="px-8 py-3 rounded-full text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 6px 20px 0 ${primaryColor}60`,
                }}
                onClick={() => router.push("/register")}
              >
                Request a Demo{" "}
                <ChevronRight size={20} className="inline-block ml-2" />
              </button>
              <button className="px-8 py-3 rounded-full text-gray-700 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1">
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image/Illustration (Placeholder) */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div
              className="w-full max-w-md bg-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-pulse"
              style={{ aspectRatio: "16/9" }}
            >
              <img
                src="https://placehold.co/600x400/E0E7FF/5C08B1?text=Operations+Dashboard"
                alt="Operations Dashboard Screenshot"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/64x64/D1D5DB/4B5563?text=EM";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Key Features Designed for You
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Our SaaS product comes packed with powerful features to optimize
            every aspect of your business operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div
                className="p-4 rounded-full inline-flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Automated Workflows
              </h3>
              <p className="text-gray-600">
                Automate repetitive tasks, reduce manual errors, and free up
                your team to focus on strategic initiatives.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div
                className="p-4 rounded-full inline-flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <Lightbulb size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Intelligent Analytics
              </h3>
              <p className="text-gray-600">
                Gain deep insights into your operations with real-time
                dashboards and actionable data analytics.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div
                className="p-4 rounded-full inline-flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Performance Tracking
              </h3>
              <p className="text-gray-600">
                Monitor key performance indicators and track progress against
                your business goals effortlessly.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div
                className="p-4 rounded-full inline-flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Secure Data Management
              </h3>
              <p className="text-gray-600">
                Your data is protected with industry-leading security protocols
                and robust backup solutions.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div
                className="p-4 rounded-full inline-flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Foster seamless collaboration across departments with integrated
                communication tools.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div
                className="p-4 rounded-full inline-flex items-center justify-center mb-6"
                style={{
                  backgroundColor: `${primaryColor}1A`,
                  color: primaryColor,
                }}
              >
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Customizable Reporting
              </h3>
              <p className="text-gray-600">
                Generate custom reports tailored to your specific needs,
                providing clarity and control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Image/Illustration */}
          <div className="md:w-1/2 flex justify-center">
            <div
              className="w-full max-w-md bg-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-pulse"
              style={{ aspectRatio: "16/9" }}
            >
              <img
                src="https://placehold.co/600x400/E0E7FF/5C08B1?text=Why+Choose+Us"
                alt="Team Collaboration"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/64x64/D1D5DB/4B5563?text=EM";
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
              Why Choose Enterprise ERP for Your Business?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We understand the complexities of modern business operations. Our
              platform is built to simplify, optimize, and scale with your
              needs.
            </p>
            <ul className="space-y-4 text-left text-gray-700 text-lg">
              <li className="flex items-start">
                <CheckCircle
                  size={24}
                  className="mr-3 flex-shrink-0"
                  style={{ color: primaryColor }}
                />
                <span>
                  Intuitive user interface for quick adoption and minimal
                  training.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle
                  size={24}
                  className="mr-3 flex-shrink-0"
                  style={{ color: primaryColor }}
                />
                <span>
                  Scalable architecture that grows with your business, from
                  startups to enterprises.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle
                  size={24}
                  className="mr-3 flex-shrink-0"
                  style={{ color: primaryColor }}
                />
                <span>
                  Dedicated 24/7 customer support to ensure your success.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle
                  size={24}
                  className="mr-3 flex-shrink-0"
                  style={{ color: primaryColor }}
                />
                <span>
                  Cost-effective solutions that deliver significant ROI.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Hear from businesses that have transformed their operations with
            Enterprise ERP.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="gold" stroke="gold" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                &quot;Enterprise ERP has revolutionized how we manage our projects. The
                automation features alone saved us countless hours!&quot;
              </p>
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                <img
                  src="https://placehold.co/64x64/D1D5DB/4B5563?text=JD"
                  alt="Client Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://placehold.co/64x64/D1D5DB/4B5563?text=EM";
                  }}
                />
              </div>
              <p className="font-semibold text-gray-900">Jane Doe</p>
              <p className="text-sm text-gray-500">CEO, Tech Solutions Inc.</p>
            </div>

            {/* Testimonial Card 2 */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="gold" stroke="gold" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                &quot;The analytics dashboard provides insights we never had
                before. It&apos;s truly a game-changer for our operational
                strategy.&quot;
              </p>
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                <img
                  src="https://placehold.co/64x64/D1D5DB/4B5563?text=AS"
                  alt="Client Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://placehold.co/64x64/D1D5DB/4B5563?text=EM";
                  }}
                />
              </div>
              <p className="font-semibold text-gray-900">Alex Smith</p>
              <p className="text-sm text-gray-500">COO, Global Logistics</p>
            </div>

            {/* Testimonial Card 3 */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="gold" stroke="gold" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">
                &quot;Customer support is top-notch! Any questions we had were
                answered quickly and efficiently. Highly recommend!&quot;
              </p>
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                <img
                  src="https://placehold.co/64x64/D1D5DB/4B5563?text=EM"
                  alt="Client Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://placehold.co/64x64/D1D5DB/4B5563?text=EM";
                  }}
                />
              </div>
              <p className="font-semibold text-gray-900">Emily White</p>
              <p className="text-sm text-gray-500">
                Operations Manager, Retail Innovators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join hundreds of businesses already optimizing their workflows and
            achieving unprecedented growth with Enterprise ERP.
          </p>
          <button
            className="px-10 py-4 rounded-full bg-white text-lg font-semibold shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            style={{ color: primaryColor }}
          >
            Get Started Today!{" "}
            <ChevronRight size={20} className="inline-block ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold"
            >
              <img
                src="/logo.png"
                alt="Enterprise ERP Logo"
                className="w-32 h-20 object-contain"
              />
            </Link>

            <p className="text-gray-400 leading-relaxed">
              Empowering businesses with intelligent operations management
              solutions for a more efficient future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#why-us"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Why Us
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-gray-500" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-gray-500" />
                <a
                  href="mailto:info@example.com"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  info@example.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin size={20} className="mr-3 text-gray-500" />
                <span className="text-gray-400">
                  123 Business Rd, Suite 400, City, State 12345
                </span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Enterprise ERP. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
