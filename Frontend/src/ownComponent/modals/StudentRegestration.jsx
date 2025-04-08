"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Check } from "lucide-react"
import axios from "axios"

const StudentRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    Name: "",
    roomNumber: "",
  })

  const [availableRooms, setAvailableRooms] = useState([])
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const modalRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch available rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/admin/available-rooms")
        setAvailableRooms(response.data.rooms)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      }
    }
    fetchRooms()
  }, [])

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowRoomDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutsideDropdown)
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoomInputFocus = () => {
    setShowRoomDropdown(true)
  }

  const selectRoom = (room) => {
    setFormData((prev) => ({
      ...prev,
      roomNumber: room.roomNumber,
    }))
    setShowRoomDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/StudentReg",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add any auth headers if required by adminMiddleware
            "Authorization": `Bearer ${token}`
          },
        }
      )
      
      setSuccess(true)
      console.log("Student registered:", response.data)
      
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error.response?.data || error)
      alert(error.response?.data?.message || "Error registering student")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 shadow-lg max-w-md w-full relative"
      >
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8A7BFF] mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">S</span>
          </div>
          <h1 className="text-3xl font-bold">Register New Student</h1>
          <p className="text-gray-400 mt-2">Create a new student account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Student Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
              placeholder="Enter student name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Student Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
              placeholder="Enter student email"
            />
          </div>

          {/* Room Number Field with Redesigned Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Room Allocation</label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                onFocus={handleRoomInputFocus}
                required
                className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                placeholder="Select a room"
              />
              <ChevronDown
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              {showRoomDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 mt-1 w-full bg-[#0F1117] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  {availableRooms.map((room) => (
                    <div
                      key={room.roomNumber}
                      onClick={() => room.available > 0 && selectRoom(room)}
                      className={`p-3 cursor-pointer border-b border-gray-800/50 last:border-0 flex justify-between items-center ${
                        room.available > 0
                          ? "hover:bg-[#6C5DD3]/10"
                          : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span>
                        Room {room.roomNumber} ({room.status})
                      </span>
                      <span className="text-sm">
                        {room.available}/{room.capacity} available
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : success
                  ? "bg-green-500"
                  : "bg-[#6C5DD3] hover:bg-[#6C5DD3]/80"
              }`}
            >
              {loading ? "Registering..." : success ? <Check size={20} /> : "Register Student"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentRegistration