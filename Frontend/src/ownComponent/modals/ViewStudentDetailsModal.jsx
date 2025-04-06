"use client"

import { useState, useEffect } from "react"
import { X, User, Search, Edit, Save, Phone, Home, Mail, Calendar, BookOpen, UserCheck } from "lucide-react"

export function ViewStudentDetailsModal({ onClose }) {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({})

  // Fetch students (mock data for now)
  useEffect(() => {
    // In a real app, you would fetch from your API
    const mockStudents = [
      {
        id: 1,
        fullName: "Rudra Prajapati",
        email: "Rudraprajapati@gmail.com",
        contactNumber: "+91 9876543210",
        roomNumber: "101",
        joiningDate: "2023-08-15",
        course: "Computer Science",
        feeStatus: "Paid",
        parentContact: "+91 9876543211",
        address: "Surat",
      },
      {
        id: 2,
        fullName: "parva Shah",
        email: "ParvaShah@gmail.com",
        contactNumber: "+91 9876543220",
        roomNumber: "102",
        joiningDate: "2023-07-20",
        course: "Computer Engineering",
        feeStatus: "Partial",
        parentContact: "+91 9876543221",
        address: "456 Park Avenue, Banglore",
      },
      {
        id: 3,
        fullName: "Poojan Pandya",
        email: "Poojanpandya@gmail.com",
        contactNumber: "+91 9876543230",
        roomNumber: "201",
        joiningDate: "2023-09-05",
        course: "Mechanical Engineering",
        feeStatus: "Unpaid",
        parentContact: "+91 9876543231",
        address: "789 College Road, Delhi",
      },
      {
        id: 4,
        fullName: "Mihir Patel",
        email: "Mihirp@gmail.com",
        contactNumber: "+91 9876543240",
        roomNumber: "202",
        joiningDate: "2023-08-25",
        course: "MBBS",
        feeStatus: "Paid",
        parentContact: "+91 9876543241",
        address: "321 Hostel Lane, Chennai",
      },
    ]

    setStudents(mockStudents)
  }, [])

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roomNumber.includes(searchQuery) ||
      student.contactNumber.includes(searchQuery),
  )

  // Handle selecting a student to view details
  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
    setEditedData(student)
    setIsEditing(false)
  }

  // Handle editing student data
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Save edited student data
  const handleSaveChanges = () => {
    // In a real app, you would call your API to update the student data
    setStudents((prev) => prev.map((student) => (student.id === selectedStudent.id ? editedData : student)))
    setSelectedStudent(editedData)
    setIsEditing(false)
  }

  return (
    <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden max-w-4xl w-full">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#6C5DD3]/20">
            <UserCheck size={20} className="text-[#6C5DD3]" />
          </div>
          <h3 className="text-xl font-bold text-white">Student Details</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Student List */}
          <div className="w-full md:w-1/3 border-r border-gray-800 pr-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                className="pl-10 pr-4 py-2 bg-[#0F1117] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-4 text-gray-400">No students found</div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedStudent?.id === student.id
                        ? "bg-[#6C5DD3]/20 border border-[#6C5DD3]/50"
                        : "bg-[#0F1117] border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-[#2A2D39]">
                        <User size={16} className="text-gray-300" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{student.fullName}</h4>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Home size={12} className="mr-1" />
                          <span>Room {student.roomNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Details */}
          <div className="w-full md:w-2/3">
            {selectedStudent ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {isEditing ? "Edit Student Information" : "Student Information"}
                  </h3>

                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] text-white transition-all text-sm flex items-center"
                      >
                        <Save size={14} className="mr-1.5" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#2A2D39] hover:bg-[#3A3D49] text-white transition-colors text-sm flex items-center"
                    >
                      <Edit size={14} className="mr-1.5" />
                      Edit Details
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <User size={14} className="mr-1.5" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        name="fullName"
                        value={editedData.fullName}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.fullName}
                      </div>
                    )}
                  </div>

                  {/* Room Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Home size={14} className="mr-1.5" />
                      Room Number
                    </label>
                    {isEditing ? (
                      <input
                        name="roomNumber"
                        value={editedData.roomNumber}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.roomNumber}
                      </div>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Phone size={14} className="mr-1.5" />
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        name="contactNumber"
                        value={editedData.contactNumber}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.contactNumber}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Mail size={14} className="mr-1.5" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        name="email"
                        value={editedData.email}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.email}
                      </div>
                    )}
                  </div>

                  {/* Course */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <BookOpen size={14} className="mr-1.5" />
                      Course
                    </label>
                    {isEditing ? (
                      <input
                        name="course"
                        value={editedData.course}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.course}
                      </div>
                    )}
                  </div>

                  {/* Joining Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      Joining Date
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="joiningDate"
                        value={editedData.joiningDate}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {new Date(selectedStudent.joiningDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Parent Contact */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Phone size={14} className="mr-1.5" />
                      Parent Contact
                    </label>
                    {isEditing ? (
                      <input
                        name="parentContact"
                        value={editedData.parentContact}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.parentContact}
                      </div>
                    )}
                  </div>

                  {/* Fee Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      Fee Status
                    </label>
                    {isEditing ? (
                      <select
                        name="feeStatus"
                        value={editedData.feeStatus}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Unpaid">Unpaid</option>
                      </select>
                    ) : (
                      <div
                        className={`p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg ${
                          selectedStudent.feeStatus === "Paid"
                            ? "text-green-400"
                            : selectedStudent.feeStatus === "Unpaid"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }`}
                      >
                        {selectedStudent.feeStatus}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center">
                      <Home size={14} className="mr-1.5" />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={editedData.address}
                        onChange={handleEditChange}
                        className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all min-h-[80px]"
                      />
                    ) : (
                      <div className="p-2.5 bg-[#0F1117] border border-gray-800 rounded-lg text-white">
                        {selectedStudent.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <User size={48} className="text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Student Selected</h3>
                <p className="text-gray-500 max-w-md">
                  Select a student from the list to view their details or use the search to find a specific student.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

