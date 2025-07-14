

"use client";

import { motion } from "framer-motion";

interface DeletePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  translations: {
    confirmDeletion: string;
    deleteConfirmation: string;
    cancel: string;
    delete: string;
  };
}

export default function ConfirmDeletePopup({
  onConfirm,
  onCancel,
  translations
}: DeletePopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#00000088] to-[#22222288] backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.7 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {translations.confirmDeletion}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {translations.deleteConfirmation}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {translations.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {translations.delete}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}