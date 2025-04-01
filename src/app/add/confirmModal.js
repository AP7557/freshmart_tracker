export default function ConfirmModal({
  isModalOpen,
  handleConfirmSubmit,
  setIsModalOpen,
}) {
  return (
    isModalOpen && (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Confirm Submission
          </h3>
          <p className='text-gray-600 mb-4'>
            Are you sure you want to submit this transaction?
          </p>
          <p className='text-red-600 mb-4 text-lg'>
            You won't be able to edit/change once its confirmed!
          </p>
          <div className='flex justify-between'>
            <button
              onClick={() => setIsModalOpen(false)}
              className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700'
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
}
