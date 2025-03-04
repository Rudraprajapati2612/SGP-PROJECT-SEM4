import { FaWifi, FaRegBuilding, FaCoffee } from "react-icons/fa";
import { CiForkAndKnife } from "react-icons/ci";
import { GiSecurityGate, GiCctvCamera } from "react-icons/gi";

function Features() {
  return (
    <div className="w-full px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-[#1B1D23] rounded-xl border border-gray-700 hover:border-purple-500">
          <FaRegBuilding className="text-[#584DA7]" size={25} />
          <h2 className="text-white font-semibold py-2">Modern Room</h2>
          <p className="text-[#747A84] font-semibold py-1">
            Spacious and well-furnished rooms with attached bathrooms
          </p>
        </div>

        <div className="p-6 bg-[#1B1D23] rounded-xl border border-gray-700 hover:border-purple-500">
          <FaWifi className="text-[#584DA7]" size={25} />
          <h2 className="text-white font-semibold py-2">High Speed Internet</h2>
          <p className="text-[#747A84] font-semibold py-1">
            24/7 WiFi Connectivity throughout the hostel
          </p>
        </div>

        <div className="p-6 bg-[#1B1D23] rounded-xl border border-gray-700 hover:border-purple-500">
          <FaCoffee className="text-[#584DA7]" size={25} />
          <h2 className="text-white font-semibold py-2">Common Areas</h2>
          <p className="text-[#747A84] font-semibold py-1">
            Comfortable study and recreation spaces
          </p>
        </div>

        <div className="p-6 bg-[#1B1D23] rounded-xl border border-gray-700 hover:border-purple-500">
          <CiForkAndKnife className="text-[#584DA7]" size={25} />
          <h2 className="text-white font-semibold py-2">Dining Facility</h2>
          <p className="text-[#747A84] font-semibold py-1">
            Nutritious meals served three times a day
          </p>
        </div>

        <div className="p-6 bg-[#1B1D23] rounded-xl border border-gray-700 hover:border-purple-500">
          <GiSecurityGate className="text-[#584DA7]" size={25} />
          <h2 className="text-white font-semibold py-2">Security Staff</h2>
          <p className="text-[#747A84] font-semibold py-1">
            Round-the-clock security personnel
          </p>
        </div>

        <div className="p-6 bg-[#1B1D23] rounded-xl border border-gray-700 hover:border-purple-500">
          <GiCctvCamera className="text-[#584DA7]" size={25} />
          <h2 className="text-white font-semibold py-2">CCTV Surveillance</h2>
          <p className="text-[#747A84] font-semibold py-1">
            24/7 monitoring for enhanced safety
          </p>
        </div>
      </div>
    </div>
  );
}

export default Features;
