export default function TotalOverview({ state }) {
  return (
    state.selectedStore && (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500'>Total Checks</h3>
          <p className='text-2xl font-semibold text-gray-800'>
            $
            {state.totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
        </div>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
          <h3 className='text-sm font-medium text-gray-500'>Bank Amount</h3>
          <p className='text-2xl font-semibold text-gray-800'>
            ${state.bankAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0.00'}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg border ${
            state.remainingAmount < 0
              ? 'bg-green-50 border-green-200'
              : state.remainingAmount > 0
              ? 'bg-red-50 border-red-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <h3 className='text-sm font-medium text-gray-500'>Difference</h3>
          <p
            className={`text-2xl font-semibold flex flex-wrap gap-1 ${
              state.remainingAmount < 0
                ? 'text-green-600'
                : state.remainingAmount > 0
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            $
            {Math.abs(state.remainingAmount)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            <span>
              {state.remainingAmount < 0 && '(Left)'}
              {state.remainingAmount > 0 && '(Under)'}
              {state.remainingAmount === 0 && '(Balanced)'}
            </span>
          </p>
        </div>
      </div>
    )
  );
}
