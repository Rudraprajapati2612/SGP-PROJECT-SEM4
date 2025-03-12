"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, Filter } from "lucide-react";

export function ViewRoomsModal({ onClose, onAddRoom }) {
  const [rooms, setRooms] = useState([]); // All rooms from API
  const [filteredRooms, setFilteredRooms] = useState([]); // Filtered rooms
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [showVacantOnly, setShowVacantOnly] = useState(false); // Filter vacant rooms
  const [loading, setLoading] = useState(true);

  // Fetch Rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/admin/available-rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data.rooms); // Store API rooms
        setFilteredRooms(data.rooms); // Initially show all rooms
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Search & Filter Logic
  useEffect(() => {
    let filtered = rooms.filter((room) =>
      room.roomNumber.toString().includes(searchQuery) // Match room number
    );

    if (showVacantOnly) {
      filtered = filtered.filter((room) => room.status === "Vacant"); // Show only vacant rooms
    }

    setFilteredRooms(filtered);
  }, [searchQuery, showVacantOnly, rooms]);

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
          {/* Search & Filter Buttons */}
          <div className="flex justify-between items-center mb-4">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search rooms..."
                className="pl-10 bg-[#0F1117] border-gray-800 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>

            {/* Filter & Add Room Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowVacantOnly((prev) => !prev)} // Toggle vacant filter
                className={`flex items-center space-x-2 ${
                  showVacantOnly ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <Filter size={16} />
                <span>{showVacantOnly ? "Show All" : "Filter Vacant"}</span>
              </Button>

              <Button onClick={onAddRoom} className="bg-[#6C5DD3] hover:bg-[#5B4DC3] flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Room</span>
              </Button>
            </div>
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

            {/* Loading State */}
            {loading ? (
              <div className="p-5 text-center text-gray-400">Loading rooms...</div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-5 text-center text-gray-400">No matching rooms found.</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredRooms.map((room) => (
                  <div key={room.roomNumber} className="grid grid-cols-5 p-3 hover:bg-[#0F1117]/50 text-sm text-gray-300">
                    <div className="font-medium">{room.roomNumber}</div>
                    <div>{room.capacity}</div>
                    <div>{room.occupied}</div>
                    <div>{room.available}</div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          room.status === "Vacant"
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
