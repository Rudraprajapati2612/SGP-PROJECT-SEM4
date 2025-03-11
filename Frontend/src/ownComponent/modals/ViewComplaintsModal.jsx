"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Search, X, XCircle } from "lucide-react";

export function ViewComplaintsModal({ complaints, onClose }) {
  return (
    <>
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Active Complaints</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition">
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Search complaints..." className="pl-10 bg-[#0F1117] border-gray-800 text-white" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                <Clock size={16} className="mr-2" />
                Recent First
              </Button>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-lg border border-gray-800 p-4 hover:border-[#6C5DD3]/30 transition-all"
              >
                {/* Complaint Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-white">{complaint.title}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                      <span>Room: {complaint.room}</span>
                      <span>•</span>
                      <span>{complaint.date}</span>
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
                    {complaint.status}
                  </span>
                </div>

                {/* Complaint Description */}
                <p className="text-sm text-gray-300 mb-4">{complaint.description}</p>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-8"
                  >
                    <XCircle size={16} className="mr-2" />
                    Dismiss
                  </Button>
                  <Button size="sm" className="bg-[#6C5DD3] hover:bg-[#5B4DC3] h-8">
                    <CheckCircle size={16} className="mr-2" />
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
