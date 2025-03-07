import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    studentId: "",
    adminEmail: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    
    // Redirect based on user type
    if (activeTab === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#6C5DD3] mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Shreedeep Hostel</h1>
          <p className="text-gray-400 mt-2">Login to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "student"
                  ? "text-[#6C5DD3] border-b-2 border-[#6C5DD3]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "admin"
                  ? "text-[#6C5DD3] border-b-2 border-[#6C5DD3]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {activeTab === "student" ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-400 text-sm mb-1 block">Student Email</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      type="text"
                      name="studentemail"
                      value={formData.studentemail}
                      onChange={handleChange}
                      className="pl-10 pr-4 py-2 bg-[#2A2D39] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
                      placeholder="Enter your Email"
                      required
                    />
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-400 text-sm mb-1 block">Email</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="pl-10 pr-4 py-2 bg-[#2A2D39] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </label>
              </div>
            )}

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-400 text-sm mb-1 block">Password</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-4 py-2 bg-[#2A2D39] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-700 text-[#6C5DD3] focus:ring-[#6C5DD3]"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#6C5DD3] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-[#6C5DD3] hover:bg-[#5B4DC3] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:ring-offset-2 focus:ring-offset-[#1A1D29]"
            >
              {activeTab === "student" ? "Login as Student" : "Login as Admin"}
            </Button>
          </form>

          {activeTab === "admin" && (
            <div className="px-6 pb-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an admin account?{" "}
                <a href="/admin/signup" className="text-[#6C5DD3] hover:underline">
                  Register here
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}