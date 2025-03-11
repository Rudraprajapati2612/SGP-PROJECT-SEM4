"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";

export function ViewRoomsModal({ rooms, onClose, onAddRoom }) {
  return (
    <>
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Room Status</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition">
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Search & Add Room Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Search rooms..." className="pl-10 bg-[#0F1117] border-gray-800 text-white" />
            </div>
            <Button onClick={onAddRoom} className="bg-[#6C5DD3] hover:bg-[#5B4DC3] flex items-center space-x-2">
              <Plus size={16} />
              <span>Add Room</span>
            </Button>
          </div>

          {/* Room Table */}
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-[#0F1117] p-3 border-b border-gray-800 text-sm font-medium text-gray-300">
              <div>Room No.</div>
              <div>Capacity</div>
              <div>Occupied</div>
              <div>Available</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-800">
              {rooms.map((room) => (
                <div key={room.id} className="grid grid-cols-5 p-3 hover:bg-[#0F1117]/50 text-sm text-gray-300">
                  <div className="font-medium">{room.roomNumber}</div>
                  <div>{room.capacity}</div>
                  <div>{room.occupied}</div>
                  <div>{room.capacity - room.occupied}</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === "Available"
                          ? "bg-green-500/20 text-green-400"
                          : room.status === "Full"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
