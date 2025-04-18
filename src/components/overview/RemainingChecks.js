import { FiDollarSign } from 'react-icons/fi';

export default function RemainingChecks({
  undepositedChecks,
  totalUndepositedCheck,
}) {
  return (
    undepositedChecks.length > 0 && (
      <div className='bg-white rounded-xl shadow-md p-4 md:p-6'>
        <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center'>
          <FiDollarSign className='text-yellow-600 mr-2' />
          Checks Pending Deposit ({undepositedChecks.length})
        </h3>

        {/* Mobile View */}
        <div className='md:hidden space-y-3'>
          {undepositedChecks.map((undepositedTransaction, index) => (
            <div
              key={index}
              className='border border-gray-200 rounded-lg p-4'
            >
              <div className='font-medium text-gray-900'>
                Check #{undepositedTransaction.checkNumber}
              </div>
              <div className='grid grid-cols-2 gap-2 mt-2 text-sm'>
                <div>
                  <div className='text-gray-500'>Company</div>
                  <div>{undepositedTransaction.company}</div>
                </div>
                <div>
                  <div className='text-gray-500'>Amount</div>
                  <div>
                    $
                    {undepositedTransaction.amount
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className='hidden md:block'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Check #
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Company
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {undepositedChecks.map((undepositedTransaction, index) => (
                <tr
                  key={index}
                  className='hover:bg-gray-50'
                >
                  <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {undepositedTransaction.checkNumber}
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {undepositedTransaction.company}
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                    $
                    {undepositedTransaction.amount
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mt-4 text-right font-semibold text-gray-700'>
          Total: $
          {totalUndepositedCheck
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </div>
      </div>
    )
  );
}
