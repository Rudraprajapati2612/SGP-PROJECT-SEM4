import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';


const AdminRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form:", formData); // Debugging log

    try {
        const response = await fetch("http://localhost:3000/api/v1/admin/Signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json(); // Convert response to JSON

        console.log("Response from server:", data); // Debugging log

        if (!response.ok) {
            throw new Error(data.error || JSON.stringify(data)); // Handle errors properly
        }

        alert("Admin registered successfully!");
       
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            <span className="text-xl font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold">Register as Admin</h1>
          <p className="text-gray-400 mt-2">Create your admin account to manage the hostel</p>
        </div>
        
        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  placeholder="Create a password"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>
            
            {/* <div className="space-y-2">
              <label className="text-sm text-gray-400">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  placeholder="Confirm your password"
                />
                <button 
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div> */}
            
            <button
              type="submit"
              className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-3 rounded-lg font-medium transition-colors mt-6"
            >
              Sign Up
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/admin/login" className="text-[#6C5DD3] hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;