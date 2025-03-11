"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, DollarSign, Search, X } from "lucide-react";

export function ManageFeesModal({ fees, onClose }) {
  return (
    <div className="bg-[#1B1D23] rounded-lg shadow-lg max-w-3xl w-full">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Manage Fees</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition">
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Search & Actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Search by ID or name..." className="pl-10 bg-[#0F1117] border-gray-800 text-white" />
            </div>
            <div className="flex space-x-2">
              <Button className="border border-gray-700 text-gray-300 hover:bg-gray-800">
                <Calendar size={16} className="mr-2" />
                Filter
              </Button>
              <Button className="bg-[#6C5DD3] hover:bg-[#5B4DC3]">
                <DollarSign size={16} className="mr-2" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 bg-[#0F1117] p-3 border-b border-gray-800 text-sm font-medium text-white">
              <div>Student ID</div>
              <div>Name</div>
              <div>Room</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-800 text-white">
              {fees.map((fee) => (
                <div key={fee.id} className="grid grid-cols-6 p-3 hover:bg-[#0F1117]/50 text-sm">
                  <div>{fee.studentId}</div>
                  <div>{fee.name}</div>
                  <div>{fee.room}</div>
                  <div>{fee.amount}</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fee.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : fee.status === "Unpaid"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>
                  <div>
                    <Button size="sm" className="bg-[#6C5DD3] hover:bg-[#5B4DC3] h-7 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
