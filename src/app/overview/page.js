"use client";
import { useData } from "@/context/DataContext";
import AllTransactionsTable from "@/components/AllTransactionsTable";
import RemainingInvoice from "@/components/RemainingInvoice";
import { withAuth } from "@/components/withAuth";
import { useEffect, useState } from "react";

function Overview({ user }) {
  const [storeSelected, setStoreSelected] = useState("");
  const [totalInvoiceLeftToPay, setTotalInvoiceLeftToPay] = useState({});
  const { allTransactionsForEachStore } = useData();

  useEffect(() => {
    const newTotalInvoiceLeftToPay = {};
    allTransactionsForEachStore.forEach(({ store, transactions }) => {
      transactions.forEach((transaction) => {
        const company = transaction.company;
        const value = transaction.amount;
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
    setTotalInvoiceLeftToPay(newTotalInvoiceLeftToPay);
  }, [allTransactionsForEachStore]);

  const getTotalInvoiceForStore = (storeName) => {
    if (totalInvoiceLeftToPay[storeName]) {
      return Object.values(totalInvoiceLeftToPay[storeName]).reduce(
        (acc, companyData) =>
          acc +
          Math.max(0, companyData.totalInvoice - companyData.totalPayment),
        0
      );
    }
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">
        Store Financial Overview
      </h2>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {user.stores?.map((store, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition-all duration-200 
              ${
                storeSelected === store
                  ? "border-primary-600 scale-[1.02]"
                  : "border-transparent hover:border-gray-300"
              }`}
            onClick={() => setStoreSelected(store)}
          >
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{store}</h3>
                <span
                  className={`text-xl font-bold ${
                    getTotalInvoiceForStore(store) > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  $
                  {getTotalInvoiceForStore(store)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {allTransactionsForEachStore.find((s) => s.store === store)
                  ?.transactions.length || 0}{" "}
                transactions
              </div>
            </div>
          </div>
        ))}
      </div>

      {storeSelected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RemainingInvoice
            storeSelected={storeSelected}
            totalInvoiceLeftToPay={totalInvoiceLeftToPay}
          />
          <AllTransactionsTable
            allTransactionsForEachStore={allTransactionsForEachStore}
            storeSelected={storeSelected}
          />
        </div>
      )}
    </div>
  );
}

export default withAuth(Overview, ["master", "manager"]);
