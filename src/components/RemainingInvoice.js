export default function RemainingInvoice({
  storeSelected,
  totalInvoiceLeftToPay,
}) {
  const getCompaniesWithRemainingInvoices = (storeName) => {
    if (totalInvoiceLeftToPay[storeName]) {
      return Object.entries(totalInvoiceLeftToPay[storeName])
        .filter(([_, companyData]) => {
          const remainingAmount = Math.max(
            0,
            companyData.totalInvoice - companyData.totalPayment
          );
          return remainingAmount > 0;
        })
        .sort((a, b) => {
          const amountA = Math.max(0, a[1].totalInvoice - a[1].totalPayment);
          const amountB = Math.max(0, b[1].totalInvoice - b[1].totalPayment);
          return amountB - amountA;
        });
    }
    return [];
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          Outstanding Invoices for {storeSelected}
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {getCompaniesWithRemainingInvoices(storeSelected).map(
          ([company, companyData]) => {
            const remainingAmount = Math.max(
              0,
              companyData.totalInvoice - companyData.totalPayment
            );
            return (
              <div
                key={company}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{company}</span>
                  <span className="font-bold text-red-600">
                    ${remainingAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>
                    Invoiced: $
                    {companyData.totalInvoice
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                  <span>
                    Paid: $
                    {companyData.totalPayment
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
