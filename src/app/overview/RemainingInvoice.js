export default function RemainingInvoice({
  storeSelected,
  totalInvoiceLeftToPay,
}) {
  // Function to filter companies with a positive remaining invoice balance
  const getCompaniesWithRemainingInvoices = (storeName) => {
    if (totalInvoiceLeftToPay[storeName]) {
      return Object.entries(totalInvoiceLeftToPay[storeName]).filter(
        ([company, companyData]) => {
          // Calculate the remaining amount to pay and check if it's positive
          const remainingAmount = Math.max(
            0,
            companyData.totalInvoice - companyData.totalPayment
          );
          return remainingAmount > 0; // Only include companies with a positive remaining balance
        }
      );
    }
    return [];
  };

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h3 className='text-xl font-semibold text-gray-800 mb-4'>
        Companies & Remaining Invoice
      </h3>
      <ul className='space-y-4'>
        {getCompaniesWithRemainingInvoices(storeSelected).map(
          ([company, companyData]) => {
            const remainingAmount = Math.max(
              0,
              companyData.totalInvoice - companyData.totalPayment
            );
            return (
              <li
                key={company}
                className='flex justify-between items-center'
              >
                <span className='text-lg font-semibold'>{company}</span>
                <span className='text-lg font-bold text-red-600'>
                  ${remainingAmount.toFixed(2)}
                </span>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
