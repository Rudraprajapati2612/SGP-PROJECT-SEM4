"use client"

import { Card } from "../components/ui/card";


export function DashboardCard({ icon, title, subtitle, status, statusColor, onClick }) {
  return (
    <Card
      className="bg-[#1B1D23] border border-gray-800 rounded-xl overflow-hidden hover:border-[#6C5DD3]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#6C5DD3]/10 cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-lg bg-[#2A2D39] group-hover:bg-[#6C5DD3]/20 transition-colors">{icon}</div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <p className="text-white text-md">{subtitle}</p>
        {status && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
            <span className="text-sm text-white font-medium">Status</span>
            <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

