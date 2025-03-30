export default function ShowTodaysList({ storeSelected, transactionData }) {
  // Filter transactions based on the selected store
  const filteredTransactions = storeSelected
    ? transactionData.filter(
        (transaction) => transaction.store === storeSelected
      )
    : transactionData;

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
