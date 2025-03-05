import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Bed, Users, Receipt, Bolt, Utensils, AlertCircle, Moon, Sun } from 'lucide-react';

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  return (
    <div className="p-6 bg-[#0F1117] min-h-screen text-white font-bold">
      {/* Header with search and theme toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#6C5DD3] mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 pr-4 py-2 bg-[#1A1D29] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] w-full"
              placeholder="Search students..."
            />
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-[#1A1D29] hover:bg-[#2A2D39] transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          icon={<Bed className="text-[#6C5DD3]" size={24} />} 
          title="View Rooms" 
          subtitle="Total Rooms: 50" 
          status="Available: 15" 
          statusColor="text-green-400" 
        />
        <DashboardCard 
          icon={<Utensils className="text-[#6C5DD3]" size={24} />} 
          title="Update Menu" 
          subtitle="Manage daily meal schedules" 
        />
        <DashboardCard 
          icon={<Users className="text-[#6C5DD3]" size={24} />} 
          title="Assign Students" 
          subtitle="Manage room assignments" 
        />
        <DashboardCard 
          icon={<Receipt className="text-[#6C5DD3]" size={24} />} 
          title="Manage Fees" 
          subtitle="Update payment records" 
        />
        <DashboardCard 
          icon={<Bolt className="text-[#6C5DD3]" size={24} />} 
          title="Light Bill Status" 
          subtitle="Monitor room-wise bills" 
        />
        <DashboardCard 
          icon={<AlertCircle className="text-[#6C5DD3]" size={24} />} 
          title="View Complaints" 
          subtitle="New Complaints: 3" 
          status="Pending" 
          statusColor="text-orange-400" 
        />
      </div>
    </div>
  );
}
 
function DashboardCard({ icon, title, subtitle, status, statusColor }) {
  return (
    <Card className="bg-[#1B1D23] border border-gray-800 rounded-xl overflow-hidden hover:border-[#6C5DD3]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#6C5DD3]/10 cursor-pointer group ">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-lg bg-[#2A2D39] group-hover:bg-[#6C5DD3]/20 transition-colors">
            {icon}
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <p className="text-white text-md">{subtitle}</p>
        {status && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
            <span className="text-sm text-white font-medium">Status</span>
            <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}