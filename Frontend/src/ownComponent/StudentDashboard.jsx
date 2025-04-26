"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  Utensils,
  Zap,
  MessageSquare,
  User,
  Bell,
  LogOut,
  Settings,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react"
import ProfileUpdate from "./ProfileUpdate"
import axios from "axios"

const PaymentForm = ({ amount, onClose, type = "fee", billMonth, onBillPaid }) => {
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentError(null);

    try {
      // Load Razorpay script
      await loadRazorpayScript();

      // Create order
      const token = localStorage.getItem("userToken");
      if (!token) {
        setPaymentError("Authorization token is missing. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/v1/payment/create-order",
        { amount, type, billMonth },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order_id, key_id } = response.data;

      // Initialize Razorpay
      const options = {
        key: key_id,
        amount: amount * 100, // In paise
        currency: "INR",
        name: "Hostel Management",
        description: type === "fee" ? "Hostel Fee Payment" : "Light Bill Payment",
        order_id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              "http://localhost:3000/api/v1/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type,
                billMonth,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setPaymentSuccess(true);
            if (type === "bill" && billMonth && onBillPaid) {
              onBillPaid(billMonth); // Update bill status in frontend
            }
            setTimeout(() => {
              onClose();
            }, 2000);
          } catch (error) {
            console.error("Payment verification failed:", error);
            setPaymentError(error.response?.data?.message || "Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: "Student Name", // Replace with studentInfo.name
          email: "student@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6C5DD3", // Match Tailwind primary color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setPaymentError(response.error.description);
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Error initiating payment");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Amount</label>
        <input
          type="text"
          value={`₹${amount.toLocaleString()}`}
          readOnly
          className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none"
        />
      </div>
      {paymentError && <p className="text-red-400 text-sm">{paymentError}</p>}
      {paymentSuccess && <p className="text-green-400 text-sm">Payment successful!</p>}
      <div className="pt-4">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#6C5DD3] hover:bg-[#5B4DC3]"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [activeModal, setActiveModal] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showProfile, setShowProfile] = useState(false)
  const [complaintDate, setComplaintDate] = useState(new Date().toISOString().split("T")[0])
  const [menuData, setMenuData] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  })
  const [loadingMenu, setLoadingMenu] = useState(false)
  const [complaintForm, setComplaintForm] = useState({
    Subject: "",
    roomNumber: "",
    complaintDate: new Date().toISOString().split("T")[0],
    Description: "",
  })
  const [submittingComplaint, setSubmittingComplaint] = useState(false)
  const [complaintSuccess, setComplaintSuccess] = useState(false)
  const [studentInfo, setStudentInfo] = useState({
    name: "Rudra Prajapati",
    roomNumber: "203",
  })
  const [billHistory, setBillHistory] = useState([
    { month: "April 2024", amount: "₹920", status: "Unpaid", units: 184, dueDate: "April 30, 2024" },
    { month: "March 2024", amount: "₹850", status: "Paid", units: 170 },
    { month: "February 2024", amount: "₹780", status: "Paid", units: 156 },
  ])

  const roomNumbers = ["101", "102", "103", "201", "202", "203", "301", "302", "303"]

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) {
          console.log("No token found, using default student info")
          return
        }

        const response = await axios.get("http://localhost:3000/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.user) {
          setStudentInfo({
            name: response.data.user.name || "Rudra Prajapati",
            roomNumber: response.data.user.roomNumber || "203",
          })
          // Update billHistory from server if available
          if (response.data.user.billHistory) {
            setBillHistory(response.data.user.billHistory);
          }
        }
      } catch (error) {
        console.error("Error fetching student info:", error)
      }
    }

    fetchStudentInfo()
  }, [])

  const closeModal = () => {
    setActiveModal(null)
    setComplaintSuccess(false)
    setComplaintForm({
      Subject: "",
      roomNumber: "",
      complaintDate: new Date().toISOString().split("T")[0],
      Description: "",
    })
  }

  const fetchMenu = async (date) => {
    setLoadingMenu(true);
    console.log("Fetching menu for date:", date);
    try {
      const mealTypes = ["Breakfast", "Lunch", "Dinner"];
      
      const menuPromises = mealTypes.map((mealType) =>
        axios.post(
          "http://localhost:3000/api/v1/user/GetMenu",
          { date, MealType: mealType },
          { 
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            } 
          }
        )
        .then(response => response.data)
        .catch((error) => {
          console.error(`Error fetching ${mealType}:`, error.response?.data || error);
          return { menu: null };
        })
      );
  
      const responses = await Promise.all(menuPromises);
  
      const newMenuData = {
        breakfast: responses[0].menu?.MenuItem || "Menu not available",
        lunch: responses[1].menu?.MenuItem || "Menu not available",
        dinner: responses[2].menu?.MenuItem || "Menu not available",
      };
  
      console.log("Menu data fetched:", newMenuData);
      setMenuData(newMenuData);
    } catch (error) {
      console.error("Unexpected error fetching menu:", error);
      setMenuData({
        breakfast: "Error loading menu",
        lunch: "Error loading menu",
        dinner: "Error loading menu",
      });
    } finally {
      setLoadingMenu(false);
    }
  };
  
  useEffect(() => {
    if (activeModal === "menu") {
      fetchMenu(selectedDate)
    }
  }, [selectedDate, activeModal])

  const handleComplaintChange = (e) => {
    const { name, value } = e.target
    setComplaintForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleComplaintSubmit = async (e) => {
    e.preventDefault()
    setSubmittingComplaint(true)
    const token = localStorage.getItem("userToken")
    console.log("User token:", token)
    if (!token) {
      alert("Authorization token is missing. Please log in as a student.")
      return
    }
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/AddComplaint", complaintForm, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      setComplaintSuccess(true)
      console.log("Complaint submitted:", response.data)

      setTimeout(() => {
        closeModal()
      }, 2000)
    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error)
      alert(error.response?.data?.message || "Error submitting complaint")
    } finally {
      setSubmittingComplaint(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    window.location.href = "/Login"
  }

  const handleBillPaid = (billMonth) => {
    setBillHistory((prev) =>
      prev.map((bill) =>
        bill.month === billMonth ? { ...bill, status: "Paid" } : bill
      )
    );
  };

  if (showProfile) {
    return <ProfileUpdate onComplete={() => setShowProfile(false)} />
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <header className="bg-[#161927] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#6C5DD3]">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="h-8 w-8 rounded-full bg-[#6C5DD3] flex items-center justify-center">
                  <User size={16} />
                </div>
                <span>{studentInfo.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-[#161927] border border-gray-800 rounded-lg shadow-lg overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="p-3 border-b border-gray-800">
                  <p className="text-sm font-medium">{studentInfo.name}</p>
                  <p className="text-xs text-gray-400">Room {studentInfo.roomNumber}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 w-full p-2 text-left text-sm hover:bg-gray-800 rounded-md"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>Profile</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-left text-sm hover:bg-gray-800 rounded-md">
                    <Settings size={16} className="text-gray-400" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full p-2 text-left text-sm hover:bg-gray-800 rounded-md text-red-400"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 overflow-hidden hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg">
            <div className="p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                  <CreditCard size={20} className="text-[#6C5DD3]" />
                </div>
                <h2 className="text-xl font-semibold">Fee Status</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Fee:</span>
                  <span className="font-bold">₹50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400">Pending:</span>
                  <span className="font-bold text-orange-400">₹10,000</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Due Date:</span>
                  <span>April 15, 2024</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveModal("payment")}
              className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-3 font-medium transition-colors"
            >
              Pay Now
            </button>
          </div>

          <div
            onClick={() => setActiveModal("menu")}
            className="bg-[#1A1D29] rounded-xl border border-gray-800 p-5 hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <Utensils size={20} className="text-[#6C5DD3]" />
              </div>
              <h2 className="text-xl font-semibold">View Menu</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-400">Today's Menu</span>
              </div>
              <p className="text-sm">Check what's being served today</p>
            </div>
          </div>

          <div
            onClick={() => setActiveModal("bill")}
            className="bg-[#1A1D29] rounded-xl border border-gray-800 p-5 hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <Zap size={20} className="text-[#6C5DD3]" />
              </div>
              <h2 className="text-xl font-semibold">Light Bill</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Month:</span>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                  Unpaid
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Amount Due:</span>
                <span>₹920</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => setActiveModal("complaint")}
            className="bg-[#1A1D29] rounded-xl border border-gray-800 p-5 hover:border-[#6C5DD3]/30 transition-all duration-300 shadow-lg cursor-pointer md:col-span-2 lg:col-span-3"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <MessageSquare size={20} className="text-[#6C5DD3]" />
              </div>
              <h2 className="text-xl font-semibold">Raise Complaint</h2>
            </div>
            <p className="text-gray-400">Submit your concerns anonymously</p>
          </div>
        </div>
      </main>

      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D29] rounded-xl border border-gray-800 max-w-md w-full max-h-[90vh] overflow-auto">
            {activeModal === "payment" && (
              <div>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Make Payment</h3>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} className="text-gray-300" />
                  </button>
                </div>
                <div className="p-5">
                  <PaymentForm amount={10000} onClose={closeModal} type="fee" />
                </div>
              </div>
            )}

            {activeModal === "menu" && (
              <div>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Menu for {selectedDate}</h3>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} className="text-gray-300" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    />
                  </div>
                  <div className="space-y-4 pt-2">
                    {loadingMenu ? (
                      <p className="text-center text-gray-400">Loading menu...</p>
                    ) : (
                      <>
                        <div className="bg-[#0F1117] rounded-lg p-4">
                          <h4 className="font-medium mb-1">Breakfast</h4>
                          <p className="text-sm text-gray-400 mb-2">7:00 AM - 9:00 AM</p>
                          <p className="text-sm">{menuData.breakfast}</p>
                        </div>
                        <div className="bg-[#0F1117] rounded-lg p-4">
                          <h4 className="font-medium mb-1">Lunch</h4>
                          <p className="text-sm text-gray-400 mb-2">12:30 PM - 2:30 PM</p>
                          <p className="text-sm">{menuData.lunch}</p>
                        </div>
                        <div className="bg-[#0F1117] rounded-lg p-4">
                          <h4 className="font-medium mb-1">Dinner</h4>
                          <p className="text-sm text-gray-400 mb-2">7:30 PM - 9:30 PM</p>
                          <p className="text-sm">{menuData.dinner}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-5 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {activeModal === "bill" && (
              <div>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Light Bill History</h3>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} className="text-gray-300" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  {billHistory.map((bill, index) => (
                    <div key={index} className="bg-[#0F1117] rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium">{bill.month}</h4>
                          <p className="text-sm text-gray-400">{bill.units} units</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{bill.amount}</p>
                          <p className={`text-xs ${bill.status === "Paid" ? "text-green-400" : "text-orange-400"}`}>
                            {bill.status}
                          </p>
                        </div>
                      </div>
                      {bill.status === "Unpaid" && (
                        <div className="mt-3 pt-3 border-t border-gray-800">
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-400">Due Date:</span>
                            <span>{bill.dueDate}</span>
                          </div>
                          <button
                            onClick={() => setActiveModal(`bill_payment_${bill.month}`)}
                            className="w-full bg-[#6C5DD3] hover:bg-[#5B4DC3] py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-5 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {billHistory.map((bill) => (
              activeModal === `bill_payment_${bill.month}` && (
                <div key={bill.month}>
                  <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Pay Light Bill</h3>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                      aria-label="Close"
                    >
                      <X size={20} className="text-gray-300" />
                    </button>
                  </div>
                  <div className="p-5">
                    <PaymentForm
                      amount={parseFloat(bill.amount.replace("₹", "").replace(",", ""))}
                      onClose={closeModal}
                      type="bill"
                      billMonth={bill.month}
                      onBillPaid={handleBillPaid}
                    />
                  </div>
                </div>
              )
            ))}

            {activeModal === "complaint" && (
              <div>
                <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Submit Complaint</h3>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} className="text-gray-300" />
                  </button>
                </div>
                <form onSubmit={handleComplaintSubmit} className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Subject</label>
                    <input
                      type="text"
                      name="Subject"
                      value={complaintForm.Subject}
                      onChange={handleComplaintChange}
                      placeholder="Enter complaint subject"
                      required
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Room Number</label>
                    <select
                      name="roomNumber"
                      value={complaintForm.roomNumber}
                      onChange={handleComplaintChange}
                      required
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    >
                      <option value="">Select Room Number</option>
                      {roomNumbers.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Date of Issue</label>
                    <input
                      type="date"
                      name="complaintDate"
                      value={complaintForm.complaintDate}
                      onChange={handleComplaintChange}
                      required
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea
                      name="Description"
                      value={complaintForm.Description}
                      onChange={handleComplaintChange}
                      placeholder="Describe your issue in detail"
                      required
                      className="w-full bg-[#0F1117] border border-gray-800 rounded-lg p-2 h-32 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                    ></textarea>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submittingComplaint}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        submittingComplaint
                          ? "bg-gray-600 cursor-not-allowed"
                          : complaintSuccess
                            ? "bg-green-500"
                            : "bg-[#6C5DD3] hover:bg-[#5B4DC3]"
                      }`}
                    >
                      {submittingComplaint
                        ? "Submitting..."
                        : complaintSuccess
                          ? "Complaint Submitted!"
                          : "Submit Complaint"}
                    </button>
                  </div>
                </form>
                <div className="p-5 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard