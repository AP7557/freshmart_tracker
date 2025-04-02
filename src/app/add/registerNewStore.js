import { setStoreOrComapinesToDB } from "@/database/addTransactionToStoreSelectedDB";
import { useState } from "react";

export default function RegisterNewStore() {
  const [newStore, setNewStore] = useState(""); // State for new store input

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (newStore) {
      setStoreOrComapinesToDB("Stores", newStore);
      setNewStore(""); // Reset the input field
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-700">
        Register New Store
      </h3>
      <form onSubmit={handleAddStore} className="mt-4">
        <input
          type="text"
          value={newStore}
          onChange={(e) => setNewStore(e.target.value)}
          placeholder="Enter Store Name"
          className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full mt-4 p-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        >
          Register Store
        </button>
      </form>
    </div>
  );
}
