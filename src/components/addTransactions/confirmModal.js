import { FiAlertTriangle, FiX, FiCheck } from 'react-icons/fi';

export default function ConfirmModal({
  isModalOpen,
  handleConfirmSubmit,
  setIsModalOpen,
  getValues,
  typeValue,
}) {
  const values = getValues();
  const { company, checkNumber, amount } = values;
  const labelStyle = 'text-sm font-medium text-gray-500';
  const valueStyle = 'text-sm font-semibold text-gray-800';

  return (
    isModalOpen && (
      <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
        <div className='bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='p-2 bg-red-50 rounded-full'>
              <FiAlertTriangle
                className='text-red-500'
                size={20}
              />
            </div>
            <h3 className='text-xl font-semibold text-gray-900'>
              Confirm Transaction
            </h3>
          </div>

          <p className='text-gray-600 mb-6'>
            Please review the details before submitting:
          </p>

          <div className='mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className={labelStyle}>Company</span>
                <span className={valueStyle}>{company}</span>
              </div>
              <div className='flex justify-between'>
                <span className={labelStyle}>Type</span>
                <span className={valueStyle}>{typeValue}</span>
              </div>
              <div className='flex justify-between'>
                <span className={labelStyle}>Check #</span>
                <span className={valueStyle}>
                  {typeValue === 'Payment' ? checkNumber || 'N/A-Cash' : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className={labelStyle}>Amount</span>
                <span className='text-sm font-semibold text-green-600'>
                  ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </div>
            </div>
          </div>

          <p className='text-sm text-red-500 mb-6 flex items-start gap-2'>
            <FiAlertTriangle className='mt-0.5 flex-shrink-0' />
            <span>
              This action cannot be undone. The transaction will be permanently
              recorded.
            </span>
          </p>

          <div className='flex justify-end gap-3'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg flex items-center gap-2'
            >
              <FiX size={16} />
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className='px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-sm flex items-center gap-2'
            >
              <FiCheck size={16} />
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
}
