"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import {
  getListOfStoresAndCompanies,
  getDocsFromDB,
} from "@/database/getDocsFromDB";
import { addTransactionToStoreSelectedDB } from "@/database/addTransactionToStoreSelectedDB";
import RegisterNewStore from "./home-components/registerNewStore";
import ShowTodaysList from "./home-components/showTodaysList";
import ConfirmModal from "./home-components/confirmModal";
import RegisterNewCompany from "./home-components/registerNewCompany";

export default function Home() {
  const [storeSelected, setStoreSelected] = useState("");
  const [companySelected, setCompanySelected] = useState(""); // Track selected company
  const [transactionData, setTransactionData] = useState([]);
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [companyList, setCompanyList] = useState([]);
  const [storesList, setStoresList] = useState([]);

  // New state to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    let newTransaction = {
      ...data,
      date: new Date().toLocaleDateString(),
    };
    addTransactionToStoreSelectedDB(storeSelected, { ...newTransaction });
    setTransactionData([
      ...transactionData,
      { ...newTransaction, store: storeSelected },
    ]);
    setCompanySelected("");
    reset();
  };

  // Handle form submission after confirmation
  const handleConfirmSubmit = () => {
    onSubmit(formData); // Submit the form data after confirmation
    setIsModalOpen(false); // Close the modal
  };

  const handleOpenModal = (data) => {
    setFormData(data); // Save form data to submit later
    setIsModalOpen(true); // Open the confirmation modal
  };

  useEffect(() => {
    const loadData = async () => {
      const [companyList, storeList] = await getListOfStoresAndCompanies(
        "Lists"
      );
      const storeListValues = Object.values(storeList);
      setStoresList(storeListValues);
      setCompanyList(Object.values(companyList));

      const allTransactionsForEachStore = await getDocsFromDB(storeListValues);
      const today = new Date().toLocaleDateString("en-US");
      const todaysTransactions = allTransactionsForEachStore
        .map(({ store, transactions }) =>
          transactions
            .filter(
              (transaction) =>
                transaction.date === today && transaction.date !== ""
            )
            .map((transaction) => ({
              ...transaction,
              store,
            }))
        )
        .flat();

      setTransactionData(todaysTransactions);
    };

    loadData();
  }, []);

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

      {/* Show Company Selection ONLY if store is selected */}
      {storeSelected && (
        <>
          {/* Company Selection */}
          <div className="mt-4">
            <div>Company:</div>
            <select
              {...register("company", { required: true })}
              onChange={(e) => setCompanySelected(e.target.value)} // Set the company when changed
              value={companySelected}
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

          {/* Register New Company only if no company is selected */}
          {!companySelected && (
            <RegisterNewCompany
              setCompanyList={setCompanyList}
              companyList={companyList}
            />
          )}
        </>
      )}

      {/* If a store and company are selected, show the transaction form */}
      {storeSelected && companySelected && (
        <form
          onSubmit={handleSubmit((data) => handleOpenModal(data))}
          className="mt-6 space-y-4"
        >
          {/* Amount and Type fields are only shown if a company is selected */}
          <div>
            <div>Amount:</div>
            <input
              {...register("amount", { required: true })}
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
      {!storeSelected && (
        <RegisterNewStore
          setStoresList={setStoresList}
          storesList={storesList}
        />
      )}

      <ConfirmModal
        isModalOpen={isModalOpen}
        handleConfirmSubmit={handleConfirmSubmit}
        setIsModalOpen={setIsModalOpen}
      />

      <ShowTodaysList
        transactionData={transactionData}
        storeSelected={storeSelected}
      />
    </div>
  );
}
