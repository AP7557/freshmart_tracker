"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useData } from "../../context/DataContext"; // Import the context hook
import { addTransactionToStoreSelectedDB } from "@/database/addTransactionToStoreSelectedDB";
import RegisterNewStore from "./registerNewStore";
import ShowTodaysList from "./showTodaysList";
import ConfirmModal from "./confirmModal";
import RegisterNewCompany from "./registerNewCompany";
import StoreSelection from "@/utils/StoreSelection";
import CompanySelection from "@/utils/CompanySelection";

export default function AddTransactions() {
  const [storeSelected, setStoreSelected] = useState("");
  const [companySelected, setCompanySelected] = useState("");
  const { register, handleSubmit, reset, watch } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  // Use the data from the DataContext
  const { addTodaysTransaction } = useData();

  const onSubmit = (data) => {
    let newTransaction = {
      ...data,
      date: new Date().toLocaleDateString(),
    };
    addTransactionToStoreSelectedDB(storeSelected, { ...newTransaction });
    addTodaysTransaction({ ...newTransaction, store: storeSelected });
    setCompanySelected("");
    reset();
  };

  const handleConfirmSubmit = () => {
    onSubmit(formData); // Submit the form data after confirmation
    setIsModalOpen(false); // Close the modal
  };

  const handleOpenModal = (data) => {
    setFormData(data); // Save form data to submit later
    setIsModalOpen(true); // Open the confirmation modal
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-700">Add Transaction</h2>

      <StoreSelection
        setStoreSelected={setStoreSelected}
        storeSelected={storeSelected}
      />

      {/* Show Company Selection ONLY if store is selected */}
      {storeSelected && (
        <>
          <CompanySelection
            companySelected={companySelected}
            setCompanySelected={setCompanySelected}
            register={register}
          />

          {/* Register New Company only if no company is selected */}
          {!companySelected && <RegisterNewCompany />}
        </>
      )}

      {/* If a store and company are selected, show the transaction form */}
      {storeSelected && companySelected && (
        <form
          onSubmit={handleSubmit((data) => handleOpenModal(data))}
          className="mt-6 space-y-4"
        >
          <div>
            <div>Amount:</div>
            <input
              {...register("amount", { required: true, valueAsNumber: true })}
              type="number"
              step=".01"
              placeholder="Enter Amount"
              className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div>Type:</div>
            <select
              {...register("type", { required: true })}
              className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Type</option>
              <option value="Invoice">Invoice</option>
              <option value="Payment">Payment</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Save
          </button>
        </form>
      )}

      {/* Register New Store Component */}
      {!storeSelected && <RegisterNewStore />}

      <ConfirmModal
        isModalOpen={isModalOpen}
        handleConfirmSubmit={handleConfirmSubmit}
        setIsModalOpen={setIsModalOpen}
      />

      <ShowTodaysList storeSelected={storeSelected} />
    </div>
  );
}
