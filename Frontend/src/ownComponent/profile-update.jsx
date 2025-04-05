"use client"

import { useState, useEffect } from "react";
import { ArrowLeft, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * @param {Object} props
 * @param {Function} props.onComplete - Callback function when profile is completed
 */
export default function ProfileUpdate({ onComplete }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    parentsContactNumber: "",
    guardianContactNumber: "",
    address: "",
    city: "",
    state: "",
    email: "", // Will be fetched from backend
    dateOfBirth: "",
    roomNumber: "", // Will be fetched from backend
    bloodGroup: "",
    emergencyContact: "",
    course: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  // Fetch user data (email, roomNumber) on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetchingUser(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await axios.get("http://localhost:3000/api/v1/user/Users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { email, roomNumber } = response.data;
        setFormData((prev) => ({
          ...prev,
          email: email || "",
          roomNumber: roomNumber || "",
        }));
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch user data. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        if (err.response?.status === 404) {
          // If user not found, clear token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/StudentDashboard"; // Adjust based on your routing setup
        }
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Prepare the data to send to the backend
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        contactNumber: formData.contactNumber,
        parentsContact: formData.parentsContactNumber,
        guardianContact: formData.guardianContactNumber,
        emergencyContact: formData.emergencyContact,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        course: formData.course,
        semester: formData.semester,
      };

      const response = await axios.put(
        "http://localhost:3000/api/v1/user/updateProfile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile updated successfully!");
      onComplete(); // Redirect or proceed after successful update
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-white flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-[#161927] backdrop-blur supports-[backdrop-filter]:bg-[#161927]/60">
        <div className="container flex h-14 items-center">
          <Button
            onClick={onComplete}
            variant="ghost"
            size="icon"
            className="mr-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-xl font-semibold text-[#6C5DD3]">Complete Your Profile</h1>
        </div>
      </header>

      <main className="container py-6">
        <Card className="mx-auto max-w-3xl bg-[#1A1D29] border border-gray-800 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 border-b border-gray-800">
            <div className="h-16 w-16 rounded-full bg-[#6C5DD3] flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`
                  : "Welcome to Student Dashboard"}
              </h2>
              <p className="text-sm text-gray-400">Please complete your profile to continue</p>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">
                      First Name*
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your first name"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">
                      Last Name*
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your last name"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-gray-300">
                      Date of Birth*
                    </Label>
                    <div className="relative">
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-gray-300">
                      Blood Group
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                    >
                      <SelectTrigger className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1D29] border-gray-800 text-white">
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="bg-[#0F1117]/50 border-gray-800 text-gray-400"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-gray-300">
                      Contact Number*
                    </Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter your contact number"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentsContactNumber" className="text-gray-300">
                      Parents Contact Number*
                    </Label>
                    <Input
                      id="parentsContactNumber"
                      name="parentsContactNumber"
                      value={formData.parentsContactNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter parents contact number"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianContactNumber" className="text-gray-300">
                      Guardian Contact Number
                    </Label>
                    <Input
                      id="guardianContactNumber"
                      name="guardianContactNumber"
                      value={formData.guardianContactNumber}
                      onChange={handleChange}
                      placeholder="Enter guardian contact number"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="text-gray-300">
                      Emergency Contact*
                    </Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                      placeholder="Enter emergency contact"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Address Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-300">
                      Address*
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Enter your address"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">
                        City*
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Enter your city"
                        className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-300">
                        State*
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="Enter your state"
                        className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Academic Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-gray-300">
                      Course
                    </Label>
                    <Input
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Enter your course"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-gray-300">
                      Semester
                    </Label>
                    <Input
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      placeholder="Enter your semester"
                      className="bg-[#0F1117] border-gray-800 text-white focus:border-[#6C5DD3] focus:ring-[#6C5DD3]/50"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              {/* Hostel Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-[#6C5DD3]">Hostel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber" className="text-gray-300">
                      Room Number
                    </Label>
                    <Input
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      disabled
                      className="bg-[#0F1117]/50 border-gray-800 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#6C5DD3] hover:bg-[#5B4DC3] text-white disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Saving..." : "Save Profile"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}