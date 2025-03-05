import React, { useState, useEffect } from "react";
import { CreditCard, Utensils, Zap, MessageSquare, User, Bell, LogOut, Settings, Calendar, ChevronDown, Home, Phone, Mail, MapPin, Clock, Edit, Save, ArrowLeft } from 'lucide-react';

// Main Dashboard Component
const StudentDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  
  // Sample menu data
  const menuData = {
    breakfast: "Idli, Sambar, Chutney, Fruit Juice",
    lunch: "Rice, Dal, Mixed Vegetables, Curd, Salad",
    dinner: "Chapati, Paneer Curry, Pulao, Sweet"
  };
  
  // Sample bill history with unpaid bill
  const billHistory = [
    { month: "April 2024", amount: "₹920", status: "Unpaid", units: 184, dueDate: "April 30, 2024" },
    { month: "March 2024", amount: "₹850", status: "Paid", units: 170 },
    { month: "February 2024", amount: "₹780", status: "Paid", units: 156 },
  ];

  // Check if first login and redirect to profile
  useEffect(() => {
    if (isFirstLogin) {
      setShowProfile(true);
    }
  }, [isFirstLogin]);

  const closeModal = () => setActiveModal(null);

  // If showing profile, render the profile page
  if (showProfile) {
    return <StudentProfile onComplete={() => {
      setIsFirstLogin(false);
      setShowProfile(false);
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      {/* Header */}
      <header className="bg-[#161927] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#6C5DD3]">Student Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="h-8 w-8 rounded-full bg-[#6C5DD3] flex items-center justify-center">
                  <User size={16} />
                </div>
                <span>John Doe</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-[#161927] border border-gray-800 rounded-lg shadow-lg overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="p-3 border-b border-gray-800">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-400">Room 203</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 w-full p-2 text-left text-sm hover:bg-gray-800 rounded-md"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm hover:bg-gray-800 rounded-md">
                    <Settings size={16} className="text-gray-400" />
                    <span>Settings</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm hover:bg-gray-800 rounded-md text-red-400">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fee Status Card */}
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg">
            <div className="p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                  <CreditCard size={20} className="text-[#6C5DD3]" />
                </div>
                <h2 className="text-xl font-semibold">Fee Status</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Fee:</span>
                  <span className="font-bold">₹50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400">Pending:</span>
                  <span className="font-bold text-orange-400">₹10,000</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Due Date:</span>
                  <span>April 15, 2024</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveModal('payment')}
              className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-3 font-medium transition-colors"
            >
              Pay Now
            </button>
          </div>
          
          {/* View Menu Card */}
          <div 
            onClick={() => setActiveModal('menu')}
            className="bg-[#1A1D29] rounded-xl border border-gray-800 p-5 hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <Utensils size={20} className="text-[#6C5DD3]" />
              </div>
              <h2 className="text-xl font-semibold">View Menu</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-400">Today's Menu</span>
              </div>
              <p className="text-sm">Check what's being served today</p>
            </div>
          </div>
          
          {/* Light Bill Card */}
          <div 
            onClick={() => setActiveModal('bill')}
            className="bg-[#1A1D29] rounded-xl border border-gray-800 p-5 hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <Zap size={20} className="text-[#6C5DD3]" />
              </div>
              <h2 className="text-xl font-semibold">Light Bill</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Month:</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">Unpaid</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Amount Due:</span>
                <span>₹920</span>
              </div>
            </div>
          </div>
          
          {/* Raise Complaint Card */}
          <div 
            onClick={() => setActiveModal('complaint')}
            className="bg-[#1A1D29] rounded-xl border border-gray-800 p-5 hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg cursor-pointer md:col-span-2 lg:col-span-3"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <MessageSquare size={20} className="text-[#6C5DD3]" />
              </div>
              <h2 className="text-xl font-semibold">Raise Complaint</h2>
            </div>
            
            <p className="text-gray-400">Submit your concerns anonymously</p>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 max-w-md w-full max-h-[90vh] overflow-auto">
            {/* Payment Modal */}
            {activeModal === 'payment' && (
              <div>
                <div className="p-5 border-b border-gray-800">
                  <h3 className="text-xl font-semibold">Make Payment</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Amount</label>
                    <input 
                      type="text" 
                      value="₹10,000" 
                      readOnly
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Payment Method</label>
                    <select className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]">
                      <option>Credit/Debit Card</option>
                      <option>UPI</option>
                      <option>Net Banking</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-2 rounded-lg font-medium transition-colors">
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Menu Modal */}
            {activeModal === 'menu' && (
              <div>
                <div className="p-5 border-b border-gray-800">
                  <h3 className="text-xl font-semibold">Today's Menu</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Select Date</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="bg-[#0F1117] rounded-lg p-4">
                      <h4 className="font-medium mb-1">Breakfast</h4>
                      <p className="text-sm text-gray-400 mb-2">7:00 AM - 9:00 AM</p>
                      <p className="text-sm">{menuData.breakfast}</p>
                    </div>
                    
                    <div className="bg-[#0F1117] rounded-lg p-4">
                      <h4 className="font-medium mb-1">Lunch</h4>
                      <p className="text-sm text-gray-400 mb-2">12:30 PM - 2:30 PM</p>
                      <p className="text-sm">{menuData.lunch}</p>
                    </div>
                    
                    <div className="bg-[#0F1117] rounded-lg p-4">
                      <h4 className="font-medium mb-1">Dinner</h4>
                      <p className="text-sm text-gray-400 mb-2">7:30 PM - 9:30 PM</p>
                      <p className="text-sm">{menuData.dinner}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bill Modal */}
            {activeModal === 'bill' && (
              <div>
                <div className="p-5 border-b border-gray-800">
                  <h3 className="text-xl font-semibold">Light Bill History</h3>
                </div>
                <div className="p-5 space-y-4">
                  {billHistory.map((bill, index) => (
                    <div key={index} className="bg-[#0F1117] rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium">{bill.month}</h4>
                          <p className="text-sm text-gray-400">{bill.units} units</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{bill.amount}</p>
                          <p className={`text-xs ${bill.status === 'Paid' ? 'text-green-400' : 'text-orange-400'}`}>
                            {bill.status}
                          </p>
                        </div>
                      </div>
                      
                      {bill.status === 'Unpaid' && (
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-400">Due Date:</span>
                            <span>{bill.dueDate}</span>
                          </div>
                          <button className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-2 rounded-lg text-sm font-medium transition-colors">
                            Pay Now
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Complaint Modal */}
            {activeModal === 'complaint' && (
              <div>
                <div className="p-5 border-b border-gray-800">
                  <h3 className="text-xl font-semibold">Submit Complaint</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Subject</label>
                    <input 
                      type="text" 
                      placeholder="Enter complaint subject"
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea 
                      placeholder="Describe your issue in detail"
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Suggested Solution (Optional)</label>
                    <textarea 
                      placeholder="Suggest a solution if you have one"
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 h-20 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    ></textarea>
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-2 rounded-lg font-medium transition-colors">
                      Submit Complaint
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Close Button */}
            <div className="p-5 border-t border-gray-800 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ onComplete }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    parentsContactNumber: "",
    guardianContactNumber: "",
    address: "",
    city: "",
    state: "",
    email: "john.doe@example.com", // Pre-filled from login
    dateOfBirth: "",
    dateOfAdmission: "2023-08-15", // Pre-filled
    roomNumber: "203", // Pre-filled
    bloodGroup: "",
    emergencyContact: "",
    course: "",
    semester: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real app, you would save the data to the server here
    if (onComplete) onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <header className="bg-[#161927] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button 
            onClick={onComplete}
            className="mr-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[#6C5DD3]">Student Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-[#6C5DD3] flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {formData.firstName || formData.lastName 
                    ? `${formData.firstName} ${formData.lastName}` 
                    : "Complete Your Profile"}
                </h2>
                <p className="text-gray-400">Student ID: ST2023045</p>
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#6C5DD3] hover:bg-[#5B4DC3] rounded-lg transition-colors"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Personal Information</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">First Name*</label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Last Name*</label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your last name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Date of Birth*</label>
                <input 
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Contact Information Section */}
              <div className="md:col-span-2 pt-4">
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Contact Information</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 opacity-70"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Contact Number*</label>
                <input 
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Parents Contact Number*</label>
                <input 
                  type="tel"
                  name="parentsContactNumber"
                  value={formData.parentsContactNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter parents contact number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Guardian Contact Number</label>
                <input 
                  type="tel"
                  name="guardianContactNumber"
                  value={formData.guardianContactNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter guardian contact number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Emergency Contact*</label>
                <input 
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter emergency contact"
                />
              </div>

              {/* Address Section */}
              <div className="md:col-span-2 pt-4">
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Address Information</h3>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-gray-400">Address*</label>
                <input 
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your address"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">City*</label>
                <input 
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your city"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">State*</label>
                <input 
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your state"
                />
              </div>

              {/* Academic Information Section */}
              <div className="md:col-span-2 pt-4">
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Academic Information</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Course</label>
                <input 
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your course"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Semester</label>
                <input 
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] disabled:opacity-70"
                  placeholder="Enter your semester"
                />
              </div>

              {/* Hostel Information Section */}
              <div className="md:col-span-2 pt-4">
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Hostel Information</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Room Number</label>
                <input 
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  disabled={true}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Date of Admission</label>
                <input 
                  type="date"
                  name="dateOfAdmission"
                  value={formData.dateOfAdmission}
                  disabled={true}
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 opacity-70"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-[#6C5DD3] hover:bg-[#5B4DC3] rounded-lg transition-colors"
                >
                  <Save size={16} />
                  <span>Save Profile</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;