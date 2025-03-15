"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Search, X, XCircle } from "lucide-react";

export function ViewComplaintsModal({ onClose }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No admin token found.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/v1/admin/GetComplaints", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Complaints:", data);

        setComplaints(data.complaints || []);
      } catch (error) {
        console.error("Failed to fetch complaints:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Function to filter complaints based on search
  const filteredComplaints = complaints.filter((complaint) =>
    complaint.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.Subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to resolve a complaint
  const handleResolve = async (complaintId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No admin token found.");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/v1/admin/ResolveComplaint/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      // Remove the resolved complaint from the UI
      setComplaints((prev) => prev.filter((complaint) => complaint._id !== complaintId));

      console.log("Complaint resolved successfully!");
    } catch (error) {
      console.error("Failed to resolve complaint:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0F1117] w-[90%] max-w-2xl rounded-lg shadow-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Active Complaints</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition">
            <X size={20} className="text-gray-300" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {loading ? (
            <p className="text-gray-400">Loading complaints...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {/* Search & Filter (Always Visible) */}
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Search by Room No. or Subject..."
                    className="pl-10 bg-[#0F1117] border-gray-800 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-gray-700 bg-gray-800 text-white">
                    <Clock size={16} className="mr-2" />
                    Recent First
                  </Button>
                </div>
              </div>

              {/* No Complaints Found Message */}
              {filteredComplaints.length === 0 ? (
                <p className="text-gray-400 text-center">No complaints found. Try a different search.</p>
              ) : (
                /* Complaints List */
                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="rounded-lg border border-gray-800 p-4 hover:border-[#6C5DD3]/30 transition-all"
                    >
                      {/* Complaint Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-white">{complaint.Subject || "No Title"}</h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                            <span>Room: {complaint.roomNumber || "Unknown"}</span>
                            <span>•</span>
                            <span>{complaint.Date || complaint.complaintDate || "N/A"}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            complaint.status === "Pending"
                              ? "bg-orange-500/20 text-orange-400"
                              : complaint.status === "Resolved"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </div>

                      {/* Complaint Description */}
                      <p className="text-sm text-gray-300 mb-4">{complaint.Description || "No description provided."}</p>

                      {/* Actions */}
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-gray-300 bg-gray-800 text-white h-8"
                        >
                          <XCircle size={16} className="mr-2" />
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#6C5DD3] hover:bg-[#5B4DC3] h-8"
                          onClick={() => handleResolve(complaint._id)}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
