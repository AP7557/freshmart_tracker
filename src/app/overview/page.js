"use client";
import { useData } from "@/context/DataContext";
import AllTransactionsTable from "@/components/AllTransactionsTable";
import RemainingInvoice from "@/components/RemainingInvoice";
import { withAuth } from "@/components/withAuth";
import { useEffect, useState } from "react";
import { FiDollarSign, FiCreditCard } from "react-icons/fi";

function Overview({ user }) {
  const [storeSelected, setStoreSelected] = useState("");
  const [totalInvoiceLeftToPay, setTotalInvoiceLeftToPay] = useState({});
  const [undepositedChecks, setUndepositedChecks] = useState({});
  const { allTransactionsForEachStore } = useData();

  useEffect(() => {
    const newTotalInvoiceLeftToPay = {};
    const newUndepositedChecks = {};

    allTransactionsForEachStore.forEach(({ store, transactions }) => {
      // Calculate invoices and payments
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

      // Track undeposited checks
      newUndepositedChecks[store] = transactions.filter(
        (transaction) => transaction.isCheckDeposited === false
      );
    });

    setTotalInvoiceLeftToPay(newTotalInvoiceLeftToPay);
    setUndepositedChecks(newUndepositedChecks);
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

  const getTotalUndepositedChecks = (storeName) => {
    if (undepositedChecks[storeName]) {
      return undepositedChecks[storeName].reduce(
        (sum, check) => sum + check.amount,
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
        {user?.stores?.map((store, index) => (
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
                <div className="flex flex-col items-end">
                  <span
                    className={`text-lg font-bold ${
                      getTotalInvoiceForStore(store) > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    <FiCreditCard className="inline mr-1" />$
                    {getTotalInvoiceForStore(store)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      getTotalUndepositedChecks(store) > 0
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    <FiDollarSign className="inline mr-1" />$
                    {getTotalUndepositedChecks(store)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {allTransactionsForEachStore.find((s) => s.store === store)
                  ?.transactions.length || 0}{" "}
                transactions
                <div className="mt-1">
                  {undepositedChecks[store]?.length || 0} checks to deposit
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {storeSelected && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RemainingInvoice
              storeSelected={storeSelected}
              totalInvoiceLeftToPay={totalInvoiceLeftToPay}
              getTotalInvoiceForStore={getTotalInvoiceForStore}
            />
            {/* Undeposited Checks Section */}
            {undepositedChecks[storeSelected]?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiDollarSign className="text-yellow-600 mr-2" />
                  Checks Pending Deposit (
                  {undepositedChecks[storeSelected].length})
                </h3>

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  {undepositedChecks[storeSelected].map(
                    (undepositedTransaction, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="font-medium text-gray-900">
                          Check #{undepositedTransaction.check}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <div className="text-gray-500">Company</div>
                            <div>{undepositedTransaction.company}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Amount</div>
                            <div>
                              $
                              {undepositedTransaction.amount
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {undepositedChecks[storeSelected].map(
                        (undepositedTransaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {undepositedTransaction.check}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {undepositedTransaction.company}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              $
                              {undepositedTransaction.amount
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-right font-semibold text-gray-700">
                  Total: $
                  {getTotalUndepositedChecks(storeSelected)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>
            )}
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

export default withAuth(Overview, ["admin", "manager"]);
