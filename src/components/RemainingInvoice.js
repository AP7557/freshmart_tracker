import { FiFileText } from "react-icons/fi";

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

  const companies = getCompaniesWithRemainingInvoices(storeSelected);
  const totalRemaining = companies.reduce((sum, [_, companyData]) => {
    return (
      sum + Math.max(0, companyData.totalInvoice - companyData.totalPayment)
    );
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiFileText className="text-red-600 mr-2" />
        Outstanding Invoices ({companies.length})
      </h3>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {companies.map(([company, companyData]) => {
          const remainingAmount = Math.max(
            0,
            companyData.totalInvoice - companyData.totalPayment
          );

          return (
            <div
              key={company}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="font-medium text-gray-900">{company}</div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <div className="text-gray-500">Invoiced</div>
                  <div>
                    $
                    {companyData.totalInvoice
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Paid</div>
                  <div>
                    $
                    {companyData.totalPayment
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500">Remaining</div>
                  <div className="font-semibold text-red-600">
                    $
                    {remainingAmount
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoiced
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map(([company, companyData]) => {
              const remainingAmount = Math.max(
                0,
                companyData.totalInvoice - companyData.totalPayment
              );

              return (
                <tr key={company} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    $
                    {companyData.totalInvoice
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    $
                    {companyData.totalPayment
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    $
                    {remainingAmount
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right font-semibold text-gray-700">
        Total Outstanding: $
        {totalRemaining.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
    </div>
  );
}
