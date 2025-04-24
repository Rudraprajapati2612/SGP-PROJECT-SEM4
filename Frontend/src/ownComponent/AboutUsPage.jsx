"use client"

import { useState } from "react"
import { Users, Award, Clock, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react"

export default function AboutUsPage({ onBack }) {
  const [activeTab, setActiveTab] = useState("mission")

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Hostel Director",
      image: "/placeholder.svg?height=100&width=100",
      bio: "John has over 15 years of experience in hostel management and student welfare. He ensures that all operations run smoothly and students have a comfortable stay.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Administrative Manager",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Sarah oversees all administrative tasks and coordinates with various departments to ensure efficient service delivery to students.",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Facilities Manager",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Michael is responsible for maintaining all hostel facilities and ensuring that the infrastructure is in top condition for students.",
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "Student Welfare Officer",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Priya works closely with students to address their concerns and ensure their well-being during their stay at the hostel.",
    },
  ]

  // Timeline/history data
  const timelineEvents = [
    {
      year: "2005",
      title: "Establishment",
      description: "Our hostel was established with the vision of providing quality accommodation for students.",
    },
    {
      year: "2010",
      title: "Expansion",
      description: "We expanded our facilities to accommodate more students and added new amenities.",
    },
    {
      year: "2015",
      title: "Modernization",
      description: "Major renovation work was undertaken to modernize our facilities and improve student experience.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Implemented digital systems for hostel management and student services.",
    },
    {
      year: "2023",
      title: "Sustainability Initiative",
      description: "Launched eco-friendly initiatives to make our hostel operations more sustainable.",
    },
  ]

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
            <h1 className="text-3xl font-bold text-[#6C5DD3]">About Us</h1>
          </div>
          <p className="text-gray-300 max-w-3xl text-lg">
            Welcome to our student hostel, where we provide comfortable and safe accommodation for students pursuing
            their academic dreams. We strive to create a supportive community that fosters academic excellence and
            personal growth.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#1A1D29]/50 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("mission")}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "mission"
                  ? "border-[#6C5DD3] text-[#6C5DD3]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "team"
                  ? "border-[#6C5DD3] text-[#6C5DD3]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Our Team
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-[#6C5DD3] text-[#6C5DD3]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              Our History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Mission & Vision */}
        {activeTab === "mission" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-[#6C5DD3]/20">
                  <Award className="text-[#6C5DD3]" size={28} />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our mission is to provide a safe, comfortable, and supportive living environment for students that
                enhances their academic success and personal development. We are committed to creating a community that
                values diversity, fosters mutual respect, and promotes a sense of belonging among all residents.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We strive to maintain high standards of accommodation, offer excellent services, and create
                opportunities for students to engage in meaningful social and educational activities that complement
                their academic pursuits.
              </p>
            </div>

            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-[#6C5DD3]/20">
                  <Users className="text-[#6C5DD3]" size={28} />
                </div>
                <h2 className="text-2xl font-bold">Our Values</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-[#6C5DD3]">Community</h3>
                  <p className="text-gray-300">
                    We foster a sense of belonging and encourage meaningful connections among residents.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-[#6C5DD3]">Excellence</h3>
                  <p className="text-gray-300">
                    We strive for excellence in all aspects of our services and facilities.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-[#6C5DD3]">Respect</h3>
                  <p className="text-gray-300">
                    We value diversity and promote mutual respect among all members of our community.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-[#6C5DD3]">Support</h3>
                  <p className="text-gray-300">
                    We provide support services that help students thrive academically and personally.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-[#6C5DD3]/20">
                  <ExternalLink className="text-[#6C5DD3]" size={28} />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Our vision is to be recognized as the premier student accommodation provider, known for our exceptional
                facilities, supportive community, and commitment to student success. We aim to continuously innovate and
                improve our services to meet the evolving needs of students and set new standards in student housing.
              </p>
            </div>
          </div>
        )}

        {/* Team */}
        {activeTab === "team" && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold">Meet Our Team</h2>
            <p className="text-gray-300 max-w-3xl">
              Our dedicated team works tirelessly to ensure that students have a comfortable and enriching experience
              during their stay at our hostel. Each member brings unique skills and expertise to create a supportive
              environment for all residents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 hover:border-[#6C5DD3]/30 transition-all"
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-[#2A2D39] overflow-hidden mb-4">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-[#6C5DD3] font-medium">{member.role}</p>
                  </div>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8 mt-12">
              <h3 className="text-xl font-bold mb-4">Join Our Team</h3>
              <p className="text-gray-300 mb-6">
                We're always looking for talented individuals who are passionate about student welfare and hostel
                management. If you're interested in joining our team, please check our careers page for current
                openings.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] rounded-lg font-medium transition-all flex items-center">
                View Opportunities
                <ChevronRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold">Our Journey</h2>
            <p className="text-gray-300 max-w-3xl">
              Since our establishment, we have been committed to providing quality accommodation for students. Our
              journey has been marked by continuous improvement and adaptation to meet the evolving needs of our
              residents.
            </p>

            <div className="relative mt-12">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gray-800"></div>

              {/* Timeline events */}
              <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`flex flex-col md:flex-row items-start ${
                        index % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#6C5DD3] border-4 border-[#0F1117] z-10 flex items-center justify-center">
                        <Clock size={14} className="text-white" />
                      </div>

                      {/* Content */}
                      <div
                        className={`pl-16 md:pl-0 ${
                          index % 2 === 0 ? "md:pr-12 md:pl-0 md:text-right" : "md:pl-12"
                        } w-full md:w-1/2`}
                      >
                        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 hover:border-[#6C5DD3]/30 transition-all">
                          <span className="text-[#6C5DD3] font-bold text-xl">{event.year}</span>
                          <h3 className="text-xl font-bold mt-2">{event.title}</h3>
                          <p className="text-gray-300 mt-2">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
