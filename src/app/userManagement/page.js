"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiShield,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useData } from "@/context/DataContext";
import { auth, db } from "@/firebase";
import { withAuth } from "@/components/withAuth";

// Available roles and store options
const ROLES = ["admin", "manager", "user"];

function UserManagementPage({ user }) {
  const router = useRouter();
  const { storesList } = useData();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Only allow admins to access this page
  if (user?.role !== "admin") {
    router.push("/addTransactions");
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccess("Role updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update role");
      console.error(err);
    }
  };

  const handleStoreAccessChange = async (userId, storeId, isChecked) => {
    try {
      const user = users.find((u) => u.id === userId);
      let updatedStores = user?.stores || [];

      if (isChecked) {
        updatedStores = [...updatedStores, storeId];
      } else {
        updatedStores = updatedStores.filter((id) => id !== storeId);
      }

      await updateDoc(doc(db, "users", userId), {
        stores: updatedStores,
      });

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, stores: updatedStores } : u
        )
      );
      setSuccess("Store access updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update store access");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FiUsers className="text-green-600 text-2xl" />
        <h1 className="text-2xl font-semibold text-gray-800">
          User Management
        </h1>
      </div>

      <p className="text-gray-600 mb-6">
        As a admin, you can manage user roles and store access.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
          <FiX className="text-red-700" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
          <FiCheck className="text-green-700" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-500" />
                <h3 className="font-medium text-gray-800">{user.email}</h3>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "manager"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiShield className="text-green-600" />
                  Role
                </label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.id === auth.currentUser?.uid}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FiUserCheck className="text-green-600" />
                  Store Access
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {storesList.map((storeId) => (
                    <div key={storeId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${user.id}-${storeId}`}
                        checked={user.stores?.includes(storeId) || false}
                        onChange={(e) =>
                          handleStoreAccessChange(
                            user.id,
                            storeId,
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`${user.id}-${storeId}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {storeId}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(UserManagementPage, ["admin"]);
