import { setStoreOrComapinesToDB } from "@/database/addTransactionToStoreSelectedDB";
import { useState } from "react";
import { FiPlus, FiHome } from "react-icons/fi";

export default function RegisterNewStore() {
  const [newStore, setNewStore] = useState("");

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (newStore) {
      setStoreOrComapinesToDB("Stores", newStore);
      setNewStore("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FiHome className="text-green-600" />
        Register New Store
      </h3>
      <form onSubmit={handleAddStore} className="space-y-4">
        <input
          type="text"
          value={newStore}
          onChange={(e) => setNewStore(e.target.value)}
          placeholder="Enter Store Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <FiPlus />
          Register Store
        </button>
      </form>
    </div>
  );
}
