"use client"
               
import { useState, useEffect, useRef } from "react"
import { Megaphone, Search, Plus, Calendar, Edit, Trash2, ChevronDown, X, Check, ArrowLeft } from "lucide-react"

export default function AnnouncementTab({ onClose }) {
  const [announcements, setAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest")

  const dropdownRef = useRef(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilterDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  // Fetch announcements (mock data for now)
  useEffect(() => {
    // In a real app, you would fetch from your API
    const mockAnnouncements = [
      {
        id: 1,
        title: "Hostel Maintenance Schedule",
        description:
          "The water supply will be interrupted from 10 AM to 2 PM due to maintenance work on the main pipeline. Please store water accordingly.",
        date: "2024-04-10",
        createdAt: "2024-04-05",
      },
      {
        id: 2,
        title: "Annual Cultural Festival",
        description:
          "The annual cultural festival will be held on April 15th. All students are encouraged to participate. Registration for various events is now open at the hostel office.",
        date: "2024-04-15",
        createdAt: "2024-04-02",
      },
      {
        id: 3,
        title: "New Mess Menu",
        description:
          "Based on student feedback, we have updated the mess menu starting next week. The new menu includes more variety and healthier options.",
        date: "2024-04-08",
        createdAt: "2024-04-01",
      },
      {
        id: 4,
        title: "Internet Upgrade Notice",
        description:
          "We are upgrading our internet infrastructure this weekend. There might be intermittent connectivity issues from Saturday evening to Sunday morning.",
        date: "2024-04-12",
        createdAt: "2024-03-30",
      },
    ]

    setAnnouncements(mockAnnouncements)
  }, [])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Open modal for creating a new announcement
  const handleCreateNew = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
    setSelectedAnnouncement(null)
    setIsModalOpen(true)
  }

  // Open modal for editing an existing announcement
  const handleEdit = (announcement, e) => {
    e.stopPropagation()
    setFormData({
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
    })
    setSelectedAnnouncement(announcement)
    setIsModalOpen(true)
  }

  // Open confirmation modal for deleting an announcement
  const handleDeleteClick = (announcement, e) => {
    e.stopPropagation()
    setSelectedAnnouncement(announcement)
    setIsDeleteModalOpen(true)
  }

  // Confirm deletion of an announcement
  const confirmDelete = () => {
    // In a real app, you would call your API to delete the announcement
    setAnnouncements((prev) => prev.filter((item) => item.id !== selectedAnnouncement.id))
    setIsDeleteModalOpen(false)
    setSelectedAnnouncement(null)
  }

  // Submit form for creating or updating an announcement
  const handleSubmit = (e) => {
    e.preventDefault()

    if (selectedAnnouncement) {
      // Update existing announcement
      setAnnouncements((prev) =>
        prev.map((item) => (item.id === selectedAnnouncement.id ? { ...item, ...formData } : item)),
      )
    } else {
      // Create new announcement
      const newAnnouncement = {
        id: Date.now(), // Simple ID generation for demo
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setAnnouncements((prev) => [newAnnouncement, ...prev])
    }

    setIsModalOpen(false)
  }

  // Filter and sort announcements
  const filteredAnnouncements = announcements
    .filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date)
      } else {
        return new Date(a.date) - new Date(b.date)
      }
    })

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F1117] rounded-xl border border-gray-800 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#1A1D29]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#6C5DD3]/20">
              <Megaphone className="text-[#6C5DD3]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Announcements</h1>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Close">
            <X size={20} className="text-gray-300" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#1A1D29]/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="pl-10 pr-4 py-2.5 bg-[#1A1D29] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 px-4 py-2.5 bg-[#1A1D29] border border-gray-700 rounded-lg hover:bg-[#2A2D39] transition-colors"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              >
                <Calendar size={18} />
                <span className="whitespace-nowrap">{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
                <ChevronDown size={16} />
              </button>

              {filterDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-[#1A1D29] border border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className={`flex items-center w-full px-4 py-2.5 text-left hover:bg-[#2A2D39] ${sortOrder === "newest" ? "text-[#6C5DD3]" : "text-white"}`}
                      onClick={() => {
                        setSortOrder("newest")
                        setFilterDropdownOpen(false)
                      }}
                    >
                      {sortOrder === "newest" && <Check size={16} className="mr-2" />}
                      Newest First
                    </button>
                    <button
                      className={`flex items-center w-full px-4 py-2.5 text-left hover:bg-[#2A2D39] ${sortOrder === "oldest" ? "text-[#6C5DD3]" : "text-white"}`}
                      onClick={() => {
                        setSortOrder("oldest")
                        setFilterDropdownOpen(false)
                      }}
                    >
                      {sortOrder === "oldest" && <Check size={16} className="mr-2" />}
                      Oldest First
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] rounded-lg transition-all whitespace-nowrap"
              onClick={handleCreateNew}
            >
              <Plus size={18} />
              <span>New Announcement</span>
            </button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="bg-[#1A1D29] rounded-xl border border-gray-800 p-8 text-center">
                <Megaphone size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No Announcements Found</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Create your first announcement by clicking the 'New Announcement' button"}
                </p>
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-[#1A1D29] rounded-xl border border-gray-800 p-6 hover:border-[#6C5DD3]/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-1.5 rounded-lg bg-[#6C5DD3]/20">
                          <Megaphone size={16} className="text-[#6C5DD3]" />
                        </div>
                        <h3 className="text-xl font-bold">{announcement.title}</h3>
                      </div>

                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <Calendar size={14} className="mr-1.5" />
                        <span>Announcement Date: {formatDate(announcement.date)}</span>
                      </div>

                      <p className="text-gray-300 whitespace-pre-line">{announcement.description}</p>
                    </div>

                    <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 shrink-0">
                      <button
                        onClick={(e) => handleEdit(announcement, e)}
                        className="p-2 rounded-lg bg-[#2A2D39] hover:bg-[#3A3D49] transition-colors"
                        title="Edit Announcement"
                      >
                        <Edit size={16} className="text-gray-300" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(announcement, e)}
                        className="p-2 rounded-lg bg-[#2A2D39] hover:bg-red-900/30 hover:text-red-400 transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 size={16} className="text-gray-300 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer with close button */}
        <div className="p-4 border-t border-gray-800 bg-[#1A1D29] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-[#2A2D39] hover:bg-[#3A3D49] text-white transition-colors flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Close Announcements</span>
          </button>
        </div>
      </div>

      {/* Create/Edit Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-[#6C5DD3]/20">
                  <Megaphone size={20} className="text-[#6C5DD3]" />
                </div>
                <h3 className="text-xl font-bold">
                  {selectedAnnouncement ? "Edit Announcement" : "Create Announcement"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Announcement Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-300 block">
                    Announcement Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement title"
                    className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  />
                </div>

                {/* Announcement Date */}
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium text-gray-300 block">
                    Announcement Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  />
                </div>

                {/* Announcement Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-300 block">
                    Announcement Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement details"
                    className="w-full bg-[#0F1117] border border-gray-700 rounded-lg p-3 text-white min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Provide detailed information about the announcement</p>
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#6C5DD3] to-[#8A7BFF] hover:from-[#5B4DC3] hover:to-[#7A6BEF] text-white font-medium transition-all"
                  >
                    {selectedAnnouncement ? "Update Announcement" : "Publish Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Delete Announcement</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete the announcement "{selectedAnnouncement.title}"? This action cannot be
                undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

