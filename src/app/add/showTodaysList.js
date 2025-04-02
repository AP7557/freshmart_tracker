import { useData } from "@/context/DataContext";

export default function ShowTodaysList({ storeSelected }) {
  const { todaysTransactionData } = useData();
  // Filter transactions based on the selected store
  const filteredTransactions = storeSelected
    ? todaysTransactionData.filter(
        (transaction) => transaction.store === storeSelected
      )
    : todaysTransactionData;

  return (
    storeSelected &&
    filteredTransactions.length > 0 && (
      <div className="mt-8">
        <ul className="mt-4 space-y-4">
          {filteredTransactions.map((data, index) => (
            <li
              key={index}
              className="p-4 border rounded-md shadow-sm bg-gray-100"
            >
              <div>
                <strong>{data.company}</strong> - $
                {data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (
                {data.type})
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
