import React from "react";
import { FiHome } from "react-icons/fi";

function StoreSelection({ setStoreSelected, storeSelected, user }) {
  return (
    <div className="space-y-2">
      <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
        <FiHome className="text-green-600" />
        Store
      </label>
      <select
        onChange={(e) => setStoreSelected(e.target.value)}
        value={storeSelected}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="">Select a Store</option>
        {user.stores?.map((storeOption, index) => (
          <option key={index} value={storeOption}>
            {storeOption}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StoreSelection;
