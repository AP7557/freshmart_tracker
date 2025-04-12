import { useData } from "@/context/DataContext";
import { FiList, FiDollarSign, FiType } from "react-icons/fi";

export default function ShowTodaysList({ storeSelected }) {
  const { todaysTransactionData } = useData();
  const filteredTransactions = storeSelected
    ? todaysTransactionData.filter(
        (transaction) => transaction.store === storeSelected
      )
    : todaysTransactionData;

  return (
    storeSelected &&
    filteredTransactions.length > 0 && (
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiList className="text-green-600" />
          Today's Transactions
        </h3>
        <ul className="space-y-3">
          {filteredTransactions.map((data, index) => (
            <li
              key={index}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-800">{data.company}</div>
                <div className="text-green-600 font-semibold">
                  $
                  {data.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <FiType className="text-green-500" size={14} />
                <span
                  className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                    data.type === "Invoice"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {data.type.toLowerCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
