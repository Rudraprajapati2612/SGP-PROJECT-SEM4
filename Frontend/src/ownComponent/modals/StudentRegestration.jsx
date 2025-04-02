"use client"

import { useState, useEffect, useRef } from "react"
import { X, ChevronDown, Check, RefreshCw } from "lucide-react"

const StudentRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roomNumber: "",
  })

  const [availableRooms, setAvailableRooms] = useState([])
  const [showRoomDropdown, setShowRoomDropdown] = useState(false)
  const [passwordGenerated, setPasswordGenerated] = useState(false)

  const modalRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch available rooms (mock data for now)
  useEffect(() => {
    setAvailableRooms([
      { id: 1, number: "101", capacity: "4", occupied: "2" },
      { id: 2, number: "102", capacity: "4", occupied: "1" },
      { id: 3, number: "201", capacity: "2", occupied: "0" },
      { id: 4, number: "202", capacity: "2", occupied: "1" },
      { id: 5, number: "301", capacity: "3", occupied: "2" },
    ])
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        console.log("Clicked outside modal, calling onClose"); // Debugging
        onClose(); // Call the onClose function to close the modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // Add onClose to the dependency array to ensure the latest onClose is used

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowRoomDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomInputFocus = () => {
    setShowRoomDropdown(true);
  };

  const selectRoom = (room) => {
    setFormData((prev) => ({
      ...prev,
      roomNumber: room.number,
    }));
    setShowRoomDropdown(false);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let generatedPassword = "";

    for (let i = 0; i < 10; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setFormData((prev) => ({
      ...prev,
      password: generatedPassword,
    }));

    setPasswordGenerated(true);

    setTimeout(() => {
      setPasswordGenerated(false);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student registration submitted:", formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 shadow-lg max-w-md w-full relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            console.log("Cross button clicked, calling onClose"); // Debugging
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Dialog Header */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8A7BFF] mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold">S</span>
          </div>
          <h1 className="text-3xl font-bold">Register New Student</h1>
          <p className="text-gray-400 mt-2">Create a new student account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                placeholder="Enter or generate password"
              />
              <button
                type="button"
                onClick={generatePassword}
                className={`px-3 rounded-lg border transition-all ${
                  passwordGenerated
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-[#0F1117] hover:bg-[#6C5DD3]/20 text-gray-400 hover:text-[#6C5DD3] border-gray-700"
                }`}
              >
                {passwordGenerated ? <Check size={20} /> : <RefreshCw size={20} />}
              </button>
            </div>
          </div>

          {/* Room Number Field */}
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
                <div ref={dropdownRef} className="absolute z-10 mt-1 w-full bg-[#0F1117] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {availableRooms.map((room) => (
                    <div key={room.id} onClick={() => selectRoom(room)} className="p-3 hover:bg-[#6C5DD3]/10 cursor-pointer border-b border-gray-800/50 last:border-0">
                      {room.number} (Available: {room.capacity - room.occupied})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="w-full bg-[#6C5DD3] py-3 rounded-lg font-medium">
            Register Student
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentRegistration