import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Check } from 'lucide-react';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    roomNumber: ''
  });
  
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  
  // Refs for handling click outside
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
  // Simulate fetching available rooms
  useEffect(() => {
    // In a real app, you would fetch this from your API
    const mockAvailableRooms = [
      { id: 1, number: '101', capacity: '4', occupied: '2' },
      { id: 2, number: '102', capacity: '4', occupied: '1' },
      { id: 3, number: '201', capacity: '2', occupied: '0' },
      { id: 4, number: '202', capacity: '2', occupied: '1' },
      { id: 5, number: '301', capacity: '3', occupied: '2' },
    ];
    
    setAvailableRooms(mockAvailableRooms);
  }, []);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowRoomDropdown(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, inputRef]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoomInputFocus = () => {
    setShowRoomDropdown(true);
  };
  
  const selectRoom = (room) => {
    setFormData(prev => ({
      ...prev,
      roomNumber: room.number
    }));
    setShowRoomDropdown(false);
  };
  
  const generatePassword = () => {
    // In a real app, you would call your backend API to generate a password
    // This is just a simple example
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let generatedPassword = '';
    
    for (let i = 0; i < 10; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setFormData(prev => ({
      ...prev,
      password: generatedPassword
    }));
    
    setPasswordGenerated(true);
    
    // Reset the "generated" indicator after 2 seconds
    setTimeout(() => {
      setPasswordGenerated(false);
    }, 2000);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - connect to your backend here
    console.log('Student registration submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-full bg-[#6C5DD3] mx-auto mb-4 flex items-center justify-center">
            <span className="text-xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold">Register New Student</h1>
          <p className="text-gray-400 mt-2">Create a new student account</p>
        </div>
        
        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Student Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                placeholder="Enter student email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Password</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                    placeholder="Enter or generate password"
                  />
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className={`px-3 rounded-lg border border-gray-800 flex items-center justify-center transition-colors ${
                    passwordGenerated 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-[#0F1117] hover:bg-[#6C5DD3]/20 text-gray-400 hover:text-[#6C5DD3]'
                  }`}
                >
                  {passwordGenerated ? <Check size={18} /> : <RefreshCw size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Click the button to auto-generate a secure password</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Room Allocation</label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  onFocus={handleRoomInputFocus}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  placeholder="Select a room"
                />
                
                {showRoomDropdown && (
                  <div 
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full bg-[#0F1117] border border-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto"
                  >
                    <div className="sticky top-0 bg-[#161927] p-2 border-b border-gray-800">
                      <div className="grid grid-cols-4 text-xs text-gray-400">
                        <div>Room</div>
                        <div>Capacity</div>
                        <div>Occupied</div>
                        <div>Available</div>
                      </div>
                    </div>
                    
                    {availableRooms.map(room => (
                      <div 
                        key={room.id}
                        onClick={() => selectRoom(room)}
                        className="grid grid-cols-4 p-2 hover:bg-[#6C5DD3]/10 cursor-pointer border-b border-gray-800/50 last:border-0"
                      >
                        <div className="font-medium">{room.number}</div>
                        <div>{room.capacity}</div>
                        <div>{room.occupied}</div>
                        <div className="text-green-400">{room.capacity - room.occupied}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Click to see available rooms</p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-3 rounded-lg font-medium transition-colors mt-6"
            >
              Register Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;