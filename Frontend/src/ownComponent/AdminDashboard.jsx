"use client"

import { useState } from "react"
import { Search, Bed, Users, Receipt, Bolt, Utensils, AlertCircle, Moon, Sun, Plus, Megaphone,UserCheck } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { ModalContainer } from "./ModalContainer"
import { AddRoomModal } from "./modals/AddRoomModal"
import { ViewRoomsModal } from "./modals/ViewRoomsModal"
import { UpdateMenuModal } from "./modals/UpdateMenuModal"
import { ManageFeesModal } from "./modals/ManageFeesModal"
import { LightBillsModal } from "./modals/LightBillsModal"
import { ViewComplaintsModal } from "./modals/ViewComplaintsModal"
// import { AnnouncementModal } from "./modals/AnnouncementModal"
import AnnouncementTab from "./modals/AnnouncementTab"
import { ViewStudentDetailsModal } from "./modals/ViewStudentDetailsModal"
import StudentRegistration from "./modals/StudentRegestration"

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeModal, setActiveModal] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Sample data
  const rooms = [
    { id: 1, roomNumber: "101", capacity: 4, occupied: 3, status: "Occupied" },
    { id: 2, roomNumber: "102", capacity: 4, occupied: 2, status: "Occupied" },
    { id: 3, roomNumber: "103", capacity: 2, occupied: 0, status: "Available" },
    { id: 4, roomNumber: "201", capacity: 3, occupied: 3, status: "Full" },
    { id: 5, roomNumber: "202", capacity: 2, occupied: 1, status: "Occupied" },
    { id: 6, roomNumber: "203", capacity: 4, occupied: 0, status: "Available" },
  ]

  const complaints = [
    {
      id: 1,
      title: "Water Supply Issue",
      room: "202",
      date: "2024-03-07",
      description: "No water supply since morning",
      status: "Pending",
    },
    {
      id: 2,
      title: "Broken Window",
      room: "101",
      date: "2024-03-06",
      description: "Window glass is cracked and needs replacement",
      status: "Pending",
    },
    {
      id: 3,
      title: "Electricity Fluctuation",
      room: "203",
      date: "2024-03-05",
      description: "Frequent power cuts in the evening",
      status: "Pending",
    },
  ]

  const fees = [
    { id: 1, studentId: "ST001", name: "John Doe", room: "101", amount: "₹50,000", status: "Paid", date: "2024-02-15" },
    {
      id: 2,
      studentId: "ST002",
      name: "Jane Smith",
      room: "102",
      amount: "₹50,000",
      status: "Partial",
      pending: "₹20,000",
      date: "2024-02-20",
    },
    {
      id: 3,
      studentId: "ST003",
      name: "Mike Johnson",
      room: "103",
      amount: "₹50,000",
      status: "Unpaid",
      date: "2024-03-01",
    },
  ]

  const lightBills = [
    { id: 1, room: "101", month: "February 2024", units: 120, amount: "₹600", status: "Paid" },
    { id: 2, room: "102", month: "February 2024", units: 150, amount: "₹750", status: "Unpaid" },
    { id: 3, room: "201", month: "February 2024", units: 80, amount: "₹400", status: "Paid" },
  ]

  return (
    <div className="p-6 bg-[#0F1117] min-h-screen text-white">
      {/* Header with search and theme toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#6C5DD3] mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:w-64">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> */}
            {/* <input
              className="pl-10 pr-4 py-2 bg-[#1A1D29] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
          </div>
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-[#1A1D29] hover:bg-[#2A2D39] transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button> */}
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Room Card */}
        <DashboardCard
          icon={<Plus className="text-[#6C5DD3]" size={24} />}
          title="Add Room"
          subtitle="Create new room entries"
          onClick={() => setActiveModal("addRoom")}
        />

        {/* View Rooms Card */}
        <DashboardCard
          icon={<Bed className="text-[#6C5DD3]" size={24} />}
          title="View Rooms"
          subtitle="Total Rooms: 50"
          status="Available: 15"
          statusColor="text-green-400"
          onClick={() => setActiveModal("viewRooms")}
        />

        {/* Update Menu Card */}
        <DashboardCard
          icon={<Utensils className="text-[#6C5DD3]" size={24} />}
          title="Update Menu"
          subtitle="Manage daily meal schedules"
          onClick={() => setActiveModal("updateMenu")}
        />

        {/* Register Student Card */}
        <DashboardCard
          icon={<Users className="text-[#6C5DD3]" size={24} />}
          title="Register Student"
          subtitle="Create new student account"
          onClick={() => setActiveModal("registerStudent")}
        />
          {/* View Student Details Card - NEW */}
          <DashboardCard
          icon={<UserCheck className="text-[#6C5DD3]" size={24} />}
          title="Student Details"
          subtitle="View and manage student information"
          onClick={() => setActiveModal("viewStudentDetails")}
        />
        {/* Announcements Card - NEW */}
        <DashboardCard
          icon={<Megaphone className="text-[#6C5DD3]" size={24} />}
          title="Announcements"
          subtitle="Create hostel announcements"
          onClick={() => setActiveModal("announcement")}
        />

        {/* Manage Fees Card */}
        <DashboardCard
          icon={<Receipt className="text-[#6C5DD3]" size={24} />}
          title="Manage Fees"
          subtitle="Update payment records"
          onClick={() => setActiveModal("manageFees")}
        />

        {/* Light Bill Status Card */}
        <DashboardCard
          icon={<Bolt className="text-[#6C5DD3]" size={24} />}
          title="Light Bill Status"
          subtitle="Monitor room-wise bills"
          onClick={() => setActiveModal("lightBills")}
        />

        {/* View Complaints Card */}
        <DashboardCard
          icon={<AlertCircle className="text-[#6C5DD3]" size={24} />}
          title="View Complaints"
          subtitle="New Complaints: 3"
          status="Pending"
          statusColor="text-orange-400"
          onClick={() => setActiveModal("viewComplaints")}
        />
      </div>

      {/* Modals */}
      <ModalContainer isOpen={activeModal === "addRoom"}>
        <AddRoomModal onClose={() => setActiveModal(null)} />
      </ModalContainer>

      <ModalContainer isOpen={activeModal === "viewRooms"}>
        <ViewRoomsModal
          rooms={rooms}
          onClose={() => setActiveModal(null)}
          onAddRoom={() => setActiveModal("addRoom")}
        />
      </ModalContainer>

      <ModalContainer isOpen={activeModal === "updateMenu"}>
        <UpdateMenuModal onClose={() => setActiveModal(null)} />
      </ModalContainer>

      <ModalContainer isOpen={activeModal === "registerStudent"}>
        <div className="p-5">
          <StudentRegistration onBack={() => setActiveModal(null)} />
        </div>
      </ModalContainer>
      <ModalContainer isOpen={activeModal === "viewStudentDetails"}>
        <ViewStudentDetailsModal onClose={() => setActiveModal(null)} />
      </ModalContainer>
      {/* Announcement Modal - NEW */}
      <ModalContainer isOpen={activeModal === "announcement"}>
        <AnnouncementTab onClose={() => setActiveModal(null)} />
      </ModalContainer>
      
      <ModalContainer isOpen={activeModal === "manageFees"}>
        <ManageFeesModal fees={fees} onClose={() => setActiveModal(null)} />
      </ModalContainer>

      <ModalContainer isOpen={activeModal === "lightBills"}>
        <LightBillsModal lightBills={lightBills} onClose={() => setActiveModal(null)} />
      </ModalContainer>

      <ModalContainer isOpen={activeModal === "viewComplaints"}>
        <ViewComplaintsModal complaints={complaints} onClose={() => setActiveModal(null)} />
      </ModalContainer>
    </div>
  )
}

