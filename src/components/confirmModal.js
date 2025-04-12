import { FiAlertTriangle, FiX, FiCheck } from "react-icons/fi";

export default function ConfirmModal({
  isModalOpen,
  handleConfirmSubmit,
  setIsModalOpen,
}) {
  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertTriangle className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Submission
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Are you sure you want to submit this transaction?
          </p>
          <p className="text-red-500 mb-6 flex items-center gap-2">
            <FiAlertTriangle />
            You won't be able to edit/change once it's confirmed!
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
            >
              <FiX />
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
            >
              <FiCheck />
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
}
