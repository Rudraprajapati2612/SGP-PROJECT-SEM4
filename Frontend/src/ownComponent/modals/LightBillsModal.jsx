"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LightBillsModal({ lightBills: initialBills = [], onClose }) {
  const [lightBills, setLightBills] = useState(initialBills);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);

  const [newBill, setNewBill] = useState({
    room: "",
    month: "",
    previousUnit: 0,
    currentUnit: 0,
    rate: 11,
  });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/AddLightBill", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          const mappedBills = data.bills.map((bill) => ({
            id: bill._id,
            room: bill.roomNumber,
            month: bill.Month,
            previousUnit: bill.PreviousUnits,
            currentUnit: bill.CurrentUnits,
            units: bill.UnitConsumed,
            amount: bill.BillAmount,
            status: "Unpaid",
          }));
          setLightBills(mappedBills);
        } else {
          console.error("Failed to fetch bills:", response.status);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
    fetchBills();
  }, []);

  const filteredBills = lightBills.filter((bill) =>
    bill.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsPaid = (id) => {
    setLightBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === id ? { ...bill, status: "Paid" } : bill
      )
    );
  };

  const fetchPreviousUnits = async (roomNumber) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/AddLightBill?roomNumber=${roomNumber}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const previousBill = data.previousBill;
        if (previousBill) {
          setNewBill((prev) => ({
            ...prev,
            previousUnit: previousBill.CurrentUnits,
          }));
        } else {
          setNewBill((prev) => ({ ...prev, previousUnit: 0 }));
        }
      } else {
        console.error("Failed to fetch previous bill:", response.status);
        setNewBill((prev) => ({ ...prev, previousUnit: 0 }));
      }
    } catch (error) {
      console.error("Error fetching previous bill:", error);
      setNewBill((prev) => ({ ...prev, previousUnit: 0 }));
    }
  };

  const handleRoomChange = (value) => {
    setNewBill((prev) => ({ ...prev, room: value }));
    if (value) {
      fetchPreviousUnits(value);
    }
  };

  const handleAddBill = async () => {
    const billData = {
      roomNumber: newBill.room || "",
      Month: newBill.month || "",
      PreviousUnits: newBill.previousUnit || 0,
      CurrentUnits: newBill.currentUnit || 0,
      rate: newBill.rate || 11,
    };

    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        console.error("No auth token found. User might not be logged in.");
        alert("You are not signed in. Please log in and try again.");
        return;
      }
      console.log("Sending bill data:", billData);
      const response = await fetch(
        "http://localhost:3000/api/v1/admin/AddLightBill",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // Uncomment and add token if adminMiddleware requires it
            // "Authorization": "Bearer your-token-here",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(billData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const newBillEntry = {
          id: result.bill._id,
          room: result.bill.roomNumber,
          month: result.bill.Month,
          previousUnit: result.bill.PreviousUnits,
          currentUnit: result.bill.CurrentUnits,
          units: result.bill.UnitConsumed,
          amount: result.bill.BillAmount,
          status: "Unpaid",
        };

        

        setLightBills((prevBills) => [...prevBills, newBillEntry]);
        setIsAddBillOpen(false);

        setNewBill({
          room: "",
          month: "",
          previousUnit: 0,
          currentUnit: 0,
          rate: 11,
        });
      } else {
        const text = await response.text();
        console.error("Server error response:", text);
        alert(`Error: Server returned ${response.status} - ${text}`);
      }
    } catch (error) {
      console.error("Fetch error details:", error.message);
      alert("Failed to add bill. Check console for details.");
    }
  };

  const generateMonthOptions = () => {
    const months = [];
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 1; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthStr = `${year}-${month.toString().padStart(2, "0")}`;
        months.push(monthStr);
      }
    }
    return months;
  };

  return (
    <div className="bg-[#1B1D23] rounded-lg shadow-lg max-w-3xl w-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white">Light Bill Status</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <X size={20} className="text-gray-300" />
        </button>
      </div>

      <div className="p-5">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search by room..."
                className="pl-10 bg-[#0F1117] border-gray-800 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button className="border border-gray-700 text-gray-300 hover:bg-gray-800">
                <Calendar size={16} className="mr-2" />
                Filter by Month
              </Button>
              <Button
                className="bg-[#6C5DD3] hover:bg-[#5B4DC3]"
                onClick={() => setIsAddBillOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Add Bill
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-7 bg-[#0F1117] p-3 border-b border-gray-800 text-sm font-medium text-white">
              <div>Room</div>
              <div>Month</div>
              <div>Previous</div>
              <div>Current</div>
              <div>Units</div>
              <div>Amount</div>
              <div>Status</div>
            </div>

            <div className="divide-y divide-gray-800 text-white">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="grid grid-cols-7 p-3 hover:bg-[#0F1117]/50 text-sm"
                  >
                    <div>{bill.room}</div>
                    <div>{bill.month}</div>
                    <div>{bill.previousUnit}</div>
                    <div>{bill.currentUnit}</div>
                    <div>{bill.units}</div>
                    <div>₹{bill.amount}</div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bill.status === "Paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {bill.status}
                      </span>
                      {bill.status === "Unpaid" ? (
                        <Button
                          size="sm"
                          className="bg-[#6C5DD3] hover:bg-[#5B4DC3] h-7 text-xs"
                          onClick={() => handleMarkAsPaid(bill.id)}
                        >
                          Pay
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="border border-gray-700 text-gray-300 hover:bg-gray-800 h-7 text-xs"
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No bills found. Add a new bill to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
        <DialogContent className="bg-[#1B1D23] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Light Bill</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Input
                id="room"
                placeholder="Room number"
                className="col-span-3 bg-[#0F1117] border-gray-800 text-white"
                value={newBill.room}
                onChange={(e) => handleRoomChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">
                Month
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewBill({ ...newBill, month: value })
                }
                value={newBill.month}
              >
                <SelectTrigger className="col-span-3 bg-[#0F1117] border-gray-800 text-white">
                  <SelectValue placeholder="Select month (YYYY-MM)" />
                </SelectTrigger>
                <SelectContent className="bg-[#1B1D23] border-gray-800 text-white">
                  {generateMonthOptions().map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="previousUnit" className="text-right">
                Previous Unit
              </Label>
              <Input
                id="previousUnit"
                type="number"
                className="col-span-3 bg-[#0F1117] border-gray-800 text-white"
                value={newBill.previousUnit}
                onChange={(e) =>
                  setNewBill({
                    ...newBill,
                    previousUnit: Number.parseInt(e.target.value) || 0,
                  })
                }
                disabled={!!newBill.room}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentUnit" className="text-right">
                Current Unit
              </Label>
              <Input
                id="currentUnit"
                type="number"
                className="col-span-3 bg-[#0F1117] border-gray-800 text-white"
                value={newBill.currentUnit}
                onChange={(e) =>
                  setNewBill({
                    ...newBill,
                    currentUnit: Number.parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-gray-400">Units Consumed</div>
              <div className="col-span-3">
                {Math.max(0, newBill.currentUnit - newBill.previousUnit)} units
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-gray-400">Bill Amount</div>
              <div className="col-span-3">
                ₹
                {Math.max(0, newBill.currentUnit - newBill.previousUnit) *
                  newBill.rate}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddBillOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#6C5DD3] hover:bg-[#5B4DC3]"
              onClick={handleAddBill}
              disabled={
                !newBill.room ||
                !newBill.month ||
                newBill.currentUnit <= newBill.previousUnit
              }
            >
              Add Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
