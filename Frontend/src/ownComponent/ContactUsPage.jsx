"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function ContactUsPage({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState(null) // null, 'success', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setFormStatus("success")
      // Reset form after successful submission
      if (Math.random() > 0.2) {
        // 80% chance of success for demo purposes
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
        setFormStatus("success")
      } else {
        setFormStatus("error")
      }

      // Clear status after 5 seconds
      setTimeout(() => {
        setFormStatus(null)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="bg-[#0F1117] min-h-screen text-white">
      {/* Header */}
      <div className="bg-[#1A1D29] border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
            <h1 className="text-3xl font-bold text-[#6C5DD3]">Contact Us</h1>
          </div>
          <p className="text-gray-300 max-w-3xl text-lg">
            Have questions or need assistance? We're here to help! Reach out to us using the contact information below
            or fill out the form, and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            {formStatus === "success" && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start">
                <CheckCircle className="text-green-400 mr-3 mt-0.5 shrink-0" size={18} />
                <p className="text-green-400">Your message has been sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {formStatus === "error" && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start">
                <AlertCircle className="text-red-400 mr-3 mt-0.5 shrink-0" size={18} />
                <p className="text-red-400">
                  There was an error sending your message. Please try again or contact us directly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300 block">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300 block">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is your message about?"
                  className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Type your message here..."
                  rows={5}
                  className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] rounded-lg font-medium transition-all flex items-center justify-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-[#6C5DD3]/20 mr-4">
                    <MapPin className="text-[#6C5DD3]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Address</h3>
                    <p className="text-gray-300 mt-1">
                      123 University Avenue, <br />
                      Campus District, <br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-[#6C5DD3]/20 mr-4">
                    <Phone className="text-[#6C5DD3]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-gray-300 mt-1">+1 (123) 456-7890</p>
                    <p className="text-gray-300">+1 (987) 654-3210 (Warden)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-[#6C5DD3]/20 mr-4">
                    <Mail className="text-[#6C5DD3]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-300 mt-1">info@studenthostel.com</p>
                    <p className="text-gray-300">support@studenthostel.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 rounded-lg bg-[#6C5DD3]/20 mr-4">
                    <Clock className="text-[#6C5DD3]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Office Hours</h3>
                    <p className="text-gray-300 mt-1">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-300">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-gray-300">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6">Find Us</h2>
              <div className="w-full h-64 bg-[#0F1117] rounded-lg overflow-hidden">
                {/* Replace with actual map component or iframe */}
                <div className="w-full h-full flex items-center justify-center bg-[#2A2D39]">
                  <MapPin className="text-[#6C5DD3] mr-2" size={24} />
                  <span className="text-gray-300">Map placeholder - Embed your map here</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="p-3 rounded-lg bg-[#2A2D39] hover:bg-[#6C5DD3]/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="text-[#6C5DD3]" size={24} />
                </a>
                <a
                  href="#"
                  className="p-3 rounded-lg bg-[#2A2D39] hover:bg-[#6C5DD3]/20 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="text-[#6C5DD3]" size={24} />
                </a>
                <a
                  href="#"
                  className="p-3 rounded-lg bg-[#2A2D39] hover:bg-[#6C5DD3]/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="text-[#6C5DD3]" size={24} />
                </a>
                <a
                  href="#"
                  className="p-3 rounded-lg bg-[#2A2D39] hover:bg-[#6C5DD3]/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="text-[#6C5DD3]" size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3">What are the hostel timings?</h3>
              <p className="text-gray-300">
                The hostel gates are open from 6:00 AM to 10:00 PM. Students requiring entry or exit outside these hours
                need to obtain prior permission from the warden.
              </p>
            </div>

            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3">How do I apply for accommodation?</h3>
              <p className="text-gray-300">
                You can apply for accommodation through our online portal or by visiting our administrative office
                during working hours. The application process requires submission of personal details, academic
                information, and payment of a registration fee.
              </p>
            </div>

            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3">What amenities are provided?</h3>
              <p className="text-gray-300">
                Our hostel provides furnished rooms, Wi-Fi, dining facilities, laundry services, common rooms with TV,
                study areas, and sports facilities. Additional amenities may vary based on the type of accommodation.
              </p>
            </div>

            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3">What is the fee structure?</h3>
              <p className="text-gray-300">
                Our fee structure varies based on room type (single, double, or triple sharing). The fees typically
                cover accommodation, meals, and basic utilities. Detailed fee information is available on our website or
                at the administrative office.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#6C5DD3]/20 to-[#8A7BFF]/20 rounded-xl border border-[#6C5DD3]/30 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            If you couldn't find the answer to your question, feel free to contact our support team. We're here to help
            you with any inquiries you may have.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] rounded-lg font-medium transition-all inline-flex items-center">
            <Phone size={18} className="mr-2" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}
