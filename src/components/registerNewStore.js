import { setStoreOrComapinesToDB } from "@/database/addTransactionToStoreSelectedDB";
import { useState } from "react";
import { FiPlus, FiHome, FiCheck, FiX } from "react-icons/fi";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export default function RegisterNewStore({ user }) {
  const [newStore, setNewStore] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!newStore) return;

    try {
      // Add the store to the database
      await setStoreOrComapinesToDB("Stores", newStore);

      // Update current user's store access
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const currentStores = userDoc.data().stores || [];
          await updateDoc(userRef, {
            stores: [...currentStores, newStore],
          });
        }
      }

      // Update all admin users' store access
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const updatePromises = [];
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          const currentAdminStores = userData.stores || [];
          if (!currentAdminStores.includes(newStore)) {
            updatePromises.push(
              updateDoc(doc(db, "users", userDoc.id), {
                stores: [...currentAdminStores, newStore],
              })
            );
          }
        }
      });

      await Promise.all(updatePromises);

      setNewStore("");
      setSuccess("Store added successfully and access updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding store:", err);
      setError("Failed to add store. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FiHome className="text-green-600" />
        Register New Store
      </h3>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
          <FiX className="text-red-700" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
          <FiCheck className="text-green-700" />
          {success}
        </div>
      )}

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
