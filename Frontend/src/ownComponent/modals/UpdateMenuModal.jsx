"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function UpdateMenuModal({ onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [menuData, setMenuData] = useState({
    mealType: "breakfast",
    items: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      console.warn("No admin token found. Authentication may fail.")
    }
  }, [])

  const handleUpdateMenu = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("adminToken")
    if (!token) {
      alert("You are not authenticated as an admin. Please log in again.")
      return
    }

    // Ensure the date is in the correct format
    const formattedDate = selectedDate // Modify this if backend needs YYYY-MM-DD

    // Check data before sending
    console.log("Submitting Data:", {
      date: formattedDate,
      MealType: menuData.mealType,
      MenuItem: menuData.items.trim(),
    })

    // Ensure no empty values
    if (!formattedDate || !menuData.mealType || !menuData.items.trim()) {
      alert("Error: All fields are required")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/admin/UpdateMenu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Make sure the token format is correct
        },
        body: JSON.stringify({
          date: formattedDate,
          MealType: menuData.mealType,
          MenuItem: menuData.items.trim(),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Menu updated successfully:", result)
        alert("Menu updated successfully!")
        onClose()
      } else {
        console.error("Failed to update menu:", result.message)
        alert(`Failed to update menu: ${result.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating menu:", error)
      alert("Error connecting to the server. Please try again.")
    }
  }

  return (
    <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Update Menu</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <form onSubmit={handleUpdateMenu} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label htmlFor="menuDate" className="text-sm font-medium text-gray-300 block">
              Select Date
            </label>
            <input
              id="menuDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
            />
          </div>

          {/* Meal Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300 block">Meal Type</label>
            <div className="flex flex-wrap gap-4">
              {["breakfast", "lunch", "dinner"].map((type) => (
                <label
                  key={type}
                  className={`flex items-center px-4 py-2.5 rounded-lg border transition-all cursor-pointer ${
                    menuData.mealType === type
                      ? "bg-[#6C5DD3]/20 border-[#6C5DD3] text-white"
                      : "bg-[#0F1117] border-gray-700 text-gray-300 hover:bg-[#0F1117]/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="mealType"
                    value={type}
                    checked={menuData.mealType === type}
                    onChange={(e) => setMenuData({ ...menuData, mealType: e.target.value })}
                    className="sr-only" // Hide the actual radio button
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Menu Items Input */}
          <div className="space-y-2">
            <label htmlFor="menuItems" className="text-sm font-medium text-gray-300 block">
              Menu Items
            </label>
            <textarea
              id="menuItems"
              placeholder="Enter menu items (comma separated)"
              value={menuData.items}
              onChange={(e) => setMenuData({ ...menuData, items: e.target.value })}
              className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add each menu item separated by commas (e.g., "Pancakes, Eggs, Toast")
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] text-white font-medium transition-all"
            >
              Update Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
