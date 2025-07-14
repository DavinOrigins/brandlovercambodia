


"use client";

import { Plus } from "lucide-react";

interface AdminHeaderProps {
  isAddingProduct: boolean;
  setIsAddingProductAction: (value: boolean) => void;
  translations: {
    adminPanel: string;
    addNewProduct: string;
  };
}

export default function AdminHeader({ 
  isAddingProduct, 
  setIsAddingProductAction,
  translations 
}: AdminHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-900">{translations.adminPanel}</h2>
      </div>
      <div className="p-6">
        {!isAddingProduct ? (
          <button
            onClick={() => setIsAddingProductAction(true)}
            className="inline-flex items-center gap-2 rounded-md bg-[#fcac4c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            {translations.addNewProduct}
          </button>
        ) : null}
      </div>
    </div>
  );
}