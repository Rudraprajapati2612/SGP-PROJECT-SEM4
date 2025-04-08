"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"

export function UpdateMenuModal({ onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [menuData, setMenuData] = useState({
    mealType: "breakfast",
    items: "",
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [displayDate, setDisplayDate] = useState("")

  // Format the date for display
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      setDisplayDate(
        date.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      )
    }
  }, [selectedDate])

  const handleUpdateMenu = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No token found, user not authenticated")
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
      console.error("Error: All fields are required")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/admin/UpdateMenu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        onClose()
      } else {
        console.error("Failed to update menu:", result.message)
      }
    } catch (error) {
      console.error("Error updating menu:", error)
    }
  }

  // Generate calendar for custom date picker
  const renderCalendar = () => {
    const today = new Date()
    const currentMonth = new Date(selectedDate || today)
    currentMonth.setDate(1)

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

    const firstDayOfMonth = currentMonth.getDay()

    const monthName = currentMonth.toLocaleString("default", { month: "long" })
    const year = currentMonth.getFullYear()

    const days = []
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateString = date.toISOString().split("T")[0]
      const isSelected = dateString === selectedDate
      const isToday = date.toDateString() === today.toDateString()

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            setSelectedDate(dateString)
            setShowDatePicker(false)
          }}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors
            ${isSelected ? "bg-[#6C5DD3] text-white" : ""}
            ${isToday && !isSelected ? "border border-[#6C5DD3] text-white" : ""}
            ${!isSelected && !isToday ? "hover:bg-gray-700 text-gray-300" : ""}
          `}
        >
          {day}
        </button>,
      )
    }

    return (
      <div className="p-3 bg-[#0F1117] border border-gray-700 rounded-lg shadow-lg absolute top-full left-0 z-10 mt-1 w-64">
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={() => {
              const prevMonth = new Date(currentMonth)
              prevMonth.setMonth(prevMonth.getMonth() - 1)
              setSelectedDate(prevMonth.toISOString().split("T")[0])
            }}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            &lt;
          </button>
          <div className="font-medium text-white">
            {monthName} {year}
          </div>
          <button
            type="button"
            onClick={() => {
              const nextMonth = new Date(currentMonth)
              nextMonth.setMonth(nextMonth.getMonth() + 1)
              setSelectedDate(nextMonth.toISOString().split("T")[0])
            }}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    )
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

            {/* Custom Date Picker Trigger */}
            <div className="relative">
              <div
                className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all flex items-center justify-between cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <span>{displayDate || "Select a date"}</span>
                <Calendar size={18} className="text-gray-400" />
              </div>

              {/* Hidden Native Date Input (for form submission) */}
              <input
                id="menuDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="sr-only"
              />

              {/* Custom Calendar Dropdown */}
              {showDatePicker && <div className="relative">{renderCalendar()}</div>}
            </div>
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
