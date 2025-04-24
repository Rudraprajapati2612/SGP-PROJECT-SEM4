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
      const token = localStorage.getItem("adminToken");
      console.log("Admin token:", token);
      if (!token) {
        setError("No admin token found. Please log in as admin.");
        setLoading(false);
        return;
      }
      try {
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

  // Define filteredComplaints, handling edge cases
  const filteredComplaints = (complaints || []).filter((complaint) =>
    (complaint.roomNumber?.toString()?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (complaint.Subject?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleResolve = async (complaintId) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No admin token found. Please log in as admin.");
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

      setComplaints((prev) => prev.filter((complaint) => complaint._id !== complaintId));
      console.log("Complaint resolved successfully!");
    } catch (error) {
      console.error("Failed to resolve complaint:", error.message);
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0F1117] w-[90%] max-w-2xl rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-[#0F1117] z-10">
          <h3 className="text-xl font-bold text-white">Active Complaints</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition">
            <X size={20} className="text-gray-300" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6C5DD3]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4 sticky top-0 bg-[#0F1117] pt-1 pb-3 z-10">
                <div className="relative w-full md:w-64">
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

              {filteredComplaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <XCircle size={40} className="text-gray-500 mb-3" />
                  <p className="text-gray-400">No complaints found. Try a different search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="rounded-lg border border-gray-800 p-4 hover:border-[#6C5DD3]/30 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <h4 className="font-medium text-white">{complaint.Subject || "No Title"}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 mt-1">
                            <span>Room: {complaint.roomNumber || "Unknown"}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{formatDate(complaint.Date || complaint.complaintDate)}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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

                      <p className="text-sm text-gray-300 mb-4">
                        {complaint.Description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap justify-end gap-2">
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