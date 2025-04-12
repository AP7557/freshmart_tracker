import { setStoreOrComapinesToDB } from "@/database/addTransactionToStoreSelectedDB";
import { useState } from "react";
import { FiPlus, FiBriefcase } from "react-icons/fi";

export default function RegisterNewCompany() {
  const [newCompany, setNewCompany] = useState("");

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (newCompany) {
      setStoreOrComapinesToDB("Companies", newCompany);
      setNewCompany("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FiBriefcase className="text-green-600" />
        Register New Company
      </h3>
      <form onSubmit={handleAddCompany} className="space-y-4">
        <input
          type="text"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="Enter Company Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <FiPlus />
          Register Company
        </button>
      </form>
    </div>
  );
}
