"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export function AddRoomModal({ onClose }) {
  const [newRoom, setNewRoom] = useState({ roomNumber: "", capacity: "" })

  const handleAddRoom = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/v1/admin/add-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomNumber: newRoom.roomNumber,
          capacity: parseInt(newRoom.capacity, 10),
        }),
      });
  
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          console.log("Room added successfully:", data);
          setNewRoom({ roomNumber: "", capacity: "" });
          onClose();
        } else {
          console.error("Failed to add room:", data.message);
          alert(`Error: ${data.message}`);
        }
      } catch (jsonError) {
        console.error("Response is not valid JSON:", text);
        alert("Unexpected server response. Check backend logs.");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-[#1B1D23] rounded-lg shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-xl font-medium text-white">Add New Room</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          <form onSubmit={handleAddRoom} className="space-y-5">
            {/* Room Number Input */}
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="text-white text-sm">
                Room Number
              </Label>
              <Input
                id="roomNumber"
                placeholder="Enter room number (e.g. 101)"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                className="bg-[#0F1117] border-gray-700 text-white h-10"
                required
              />
            </div>

            {/* Room Capacity Input */}
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-white text-sm">
                Room Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10"
                placeholder="Enter room capacity"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                className="bg-[#0F1117] border-gray-700 text-white h-10"
                required
              />
              <p className="text-xs text-gray-400 mt-1">Maximum number of students per room</p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6C5DD3] hover:bg-[#5B4DC3] text-white border-0 px-4 py-2">
                Add Room
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

