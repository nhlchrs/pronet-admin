import { X } from 'lucide-react';
import { useConfirmation } from '../hooks/useConfirmation';

export const ConfirmationDialog = () => {
  const { state, handleConfirm, handleCancel } = useConfirmation();

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-sm w-full shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {state.title}
          </h2>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {state.message}
          </p>

          {state.details && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-6 border-l-4 border-gray-400 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {state.details}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition"
          >
            {state.cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition ${
              state.isDangerous
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-brand-500 hover:bg-brand-600'
            }`}
          >
            {state.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
