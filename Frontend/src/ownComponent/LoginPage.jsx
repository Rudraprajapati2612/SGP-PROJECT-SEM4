import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, User, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    studentemail: "",
    adminEmail: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      activeTab === "admin"
        ? "http://localhost:3000/api/v1/admin/Login"
        : "http://localhost:3000/api/v1/user/Login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: activeTab === "admin" ? formData.adminEmail : formData.studentemail,
          password: formData.password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.token) {
        alert(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      
      if (activeTab === "admin") {
        navigate("/AdminDashboard");
      } else {
        if (!data.profileExists) {
          navigate("/ProfileUpdate", { 
            state: { 
              email: data.email,
              roomNumber: data.roomNumber 
            } 
          });
        } else {
          navigate("/StudentDashboard");
        }
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
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
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#6C5DD3] mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Shreedeep Hostel</h1>
          <p className="text-gray-400 mt-2">Login to your account</p>
        </div>

        <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "student" ? "text-[#6C5DD3] border-b-2 border-[#6C5DD3]" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("student")}
            >
              Student Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === "admin" ? "text-[#6C5DD3] border-b-2 border-[#6C5DD3]" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <label className="block">
              <span className="text-gray-400 text-sm mb-1 block">Email</span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="email"
                  name={activeTab === "admin" ? "adminEmail" : "studentemail"}
                  value={activeTab === "admin" ? formData.adminEmail : formData.studentemail}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 bg-[#2A2D39] text-white border border-gray-700 rounded-lg w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-gray-400 text-sm mb-1 block">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 bg-[#2A2D39] text-white border border-gray-700 rounded-lg w-full"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </label>

            <Button type="submit" className="w-full py-2 bg-[#6C5DD3] text-white font-medium rounded-lg">
              {activeTab === "student" ? "Login as Student" : "Login as Admin"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}