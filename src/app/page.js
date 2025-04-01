"use client";

import { useData } from "@/context/DataContext";
import AllTransactionsTable from "@/utils/AllTransactionsTable";
import RemainingInvoice from "@/utils/RemainingInvoice";
import { useEffect, useState } from "react";

export default function Overview2222() {
  const [storeSelected, setStoreSelected] = useState("");
  const [totalInvoiceLeftToPay, setTotalInvoiceLeftToPay] = useState({});
  const { storesList, allTransactionsForEachStore } = useData(); // Get storesList and transactionData from context

  useEffect(() => {
    // Create a new object to hold the updated totalInvoiceLeftToPay
    const newTotalInvoiceLeftToPay = {};

    allTransactionsForEachStore.forEach(({ store, transactions }) => {
      transactions.forEach((transaction) => {
        const company = transaction.company; // Assuming Company is in column B
        const value = transaction.amount; // Assuming Value is in column C
        const type = transaction.type;

        if (!newTotalInvoiceLeftToPay[store]) {
          newTotalInvoiceLeftToPay[store] = {};
        }
        if (!newTotalInvoiceLeftToPay[store][company]) {
          newTotalInvoiceLeftToPay[store][company] = {
            totalPayment: 0,
            totalInvoice: 0,
          };
        }

        if (type === "Payment") {
          newTotalInvoiceLeftToPay[store][company].totalPayment += value;
        } else if (type === "Invoice") {
          newTotalInvoiceLeftToPay[store][company].totalInvoice += value;
        }
      });
    });

    // Update the state once with the new calculated data
    setTotalInvoiceLeftToPay(newTotalInvoiceLeftToPay);
  }, [allTransactionsForEachStore]);

  const getTotalInvoiceForStore = (storeName) => {
    if (totalInvoiceLeftToPay[storeName]) {
      return Object.values(totalInvoiceLeftToPay[storeName]).reduce(
        (acc, companyData) => {
          // Calculate the remaining amount to pay
          const remainingAmount = Math.max(
            0,
            companyData.totalInvoice - companyData.totalPayment
          );
          return acc + remainingAmount; // Add the non-negative remaining amount
        },
        0
      );
    }
    return 0; // Return 0 if no data for the store
  };

  return (
    <div className="container !max-w-full mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">
        Store Invoices Summary
      </h2>

      {/* Display grid of stores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storesList.map((store, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center cursor-pointer"
            onClick={() => setStoreSelected(store)}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{store}</h3>
            </div>
            <div>
              <span className="text-lg font-bold text-red-600">
                ${getTotalInvoiceForStore(store).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Conditional render when a store is selected */}
      {storeSelected && (
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* On mobile, RemainingInvoice is above AllTransactionsTable */}
          <div className="order-1 lg:order-2 w-full">
            <RemainingInvoice
              storeSelected={storeSelected}
              totalInvoiceLeftToPay={totalInvoiceLeftToPay}
            />
          </div>

          <div className="order-2 lg:order-1 w-full">
            <AllTransactionsTable
              allTransactionsForEachStore={allTransactionsForEachStore}
              storeSelected={storeSelected}
            />
          </div>
        </div>
      )}
    </div>
  );
}
