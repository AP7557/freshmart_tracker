"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { fetchLists } from "@/database/getList"; // Add addStore import
import { addTransactionToStoreDoc } from "@/database/addToDB";

export default function Home() {
  const [storeSelected, setStoreSelected] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const { user } = useAuth(); // Assuming user is fetched from the context
  const { register, handleSubmit, reset } = useForm();
  const [companyList, setCompanyList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [newStore, setNewStore] = useState(""); // State for new store input

  const onSubmit = (data) => {
    // Add the selected store and company to the transaction data
    const newTransaction = {
      ...data,
      date: new Date().toLocaleDateString(),
      store: storeSelected, // Store selected by the user
    };
    setTransactionData([...transactionData, newTransaction]);
    addTransactionToStoreDoc({ newTransaction });
    reset(); // Reset the form fields
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (newStore) {
      setStoresList([...storesList, newStore]); // Update store list in UI
      setNewStore(""); // Reset the input field
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const [companyList, storeList] = await fetchLists();
      setStoresList(Object.values(storeList)); // Store the stores in state
      setCompanyList(Object.values(companyList)); // Store the companies in state
    };

    loadData(); // Fetch lists on component mount
  }, []);

  // Filter transactions based on the selected store
  const filteredTransactions = storeSelected
    ? transactionData.filter(
        (transaction) => transaction.store === storeSelected
      )
    : transactionData;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700">Add Transaction</h2>

      {/* Store Selection */}
      <div className="mt-4">
        <select
          onChange={(e) => setStoreSelected(e.target.value)}
          value={storeSelected}
          className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Store</option>
          {storesList.map((storeOption, index) => (
            <option key={index} value={storeOption}>
              {storeOption}
            </option>
          ))}
        </select>
      </div>

      {/* Form Inputs for Transaction */}
      {storeSelected && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <select
              {...register("company", { required: true })}
              className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Company</option>
              {companyList.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              {...register("amount", { required: true })}
              type="number"
              placeholder="Enter Amount"
              className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              {...register("type", { required: true })}
              className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Invoice">Invoice</option>
              <option value="Payment">Payment</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Save
          </button>
        </form>
      )}

      {/* Register a new store */}
      {!storeSelected && (
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
      )}

      {/* Filtered Transaction List */}
      {filteredTransactions.length > 0 && (
        <div className="mt-8">
          {/* <h3 className="text-xl font-semibold text-gray-700">
            Transaction List (Showing for Store: {storeSelected})
          </h3> */}
          <ul className="mt-4 space-y-4">
            {filteredTransactions.map((data, index) => (
              <li
                key={index}
                className="p-4 border rounded-md shadow-sm bg-gray-100"
              >
                <div>
                  <strong>{data.company}</strong> - {data.amount} ({data.type})
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
