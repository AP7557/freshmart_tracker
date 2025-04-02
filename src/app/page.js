"use client";

import { useData } from "@/context/DataContext";
import StoreSelection from "@/utils/StoreSelection";
import { useEffect, useState } from "react";

export default function Overview() {
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

  // Function to get the total invoices for a selected store
  const getTotalInvoiceForStore = (storeName) => {
    if (totalInvoiceLeftToPay[storeName]) {
      return Object.values(totalInvoiceLeftToPay[storeName]).reduce(
        (acc, companyData) => acc + companyData.totalInvoice,
        0
      );
    }
    return 0;
  };

  return (
    <div>
      Overview Page
      <StoreSelection
        setStoreSelected={setStoreSelected}
        storeSelected={storeSelected}
      />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Store Invoices Summary
        </h2>

        {/* Grid to display stores and invoice totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storesList.map((store, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center"
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
      </div>
    </div>
  );
}
