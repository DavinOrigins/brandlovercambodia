

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Save, Trash2 } from "lucide-react"

interface Product {
  id: string
  brand: string
  model: string
  title: string
  images: string[]
  price: string
  description: string
  telegram_link: string
  featured: boolean
}

interface ProductFormProps {
  newProduct: Omit<Product, "id">
  setNewProductAction: (value: (prev: Omit<Product, "id">) => Omit<Product, "id">) => void
  isAddingProduct: boolean
  setIsAddingProductAction: (value: boolean) => void
  handleAddProductAction: () => Promise<void>
  handleImageUploadAction: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  removeImageAction: (index: number) => void
  handleUpdateProductAction?: () => Promise<void>
  resetFormAction: () => void
  originalProduct: Product | null
  translations: {
    newProduct: string
    updateProduct: string
    brand: string
    model: string
    title: string
    price: string
    telegramLink: string
    description: string
    images: string
    imageRequired: string
    featuredProduct: string
    saveProduct: string
    updateProductButton: string
    cancel: string
    placeholderBrand: string
    placeholderModel: string
    placeholderTitle: string
    placeholderPrice: string
    placeholderTelegram: string
    placeholderDescription: string
  }
  uploadProgress?: number
  isUploading?: boolean
  currentFileIndex?: number
  totalFiles?: number
}

const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

export default function ProductForm({
  newProduct,
  setNewProductAction,
  isAddingProduct,
  handleAddProductAction,
  handleImageUploadAction,
  removeImageAction,
  handleUpdateProductAction,
  resetFormAction,
  originalProduct,
  translations,
  uploadProgress = 0,
  isUploading = false,
  currentFileIndex = 0,
  totalFiles = 0,
}: ProductFormProps) {
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (originalProduct) {
      const hasChanged =
        newProduct.brand !== originalProduct.brand ||
        newProduct.model !== originalProduct.model ||
        newProduct.title !== originalProduct.title ||
        newProduct.price !== originalProduct.price ||
        newProduct.description !== originalProduct.description ||
        newProduct.telegram_link !== originalProduct.telegram_link ||
        newProduct.featured !== originalProduct.featured ||
        !arraysEqual(newProduct.images, originalProduct.images)

      setHasChanges(hasChanged && newProduct.images.length > 0)
    } else {
      setHasChanges(newProduct.images.length > 0)
    }
  }, [newProduct, originalProduct])

  const handleSave = () => {
    if (newProduct.images.length === 0) return
    if (handleUpdateProductAction) {
      handleUpdateProductAction()
    } else {
      handleAddProductAction()
    }
  }

  if (!isAddingProduct) return null

  return (
    <div className="space-y-6 px-6 py-6 mx-auto">
      <div className="border-b border-gray-200 py-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {handleUpdateProductAction ? translations.updateProduct : translations.newProduct}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            {translations.brand} *
          </label>
          <input
            id="brand"
            type="text"
            value={newProduct.brand}
            onChange={(e) => setNewProductAction((prev) => ({ ...prev, brand: e.target.value }))}
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-orange-600 sm:text-sm"
            placeholder={translations.placeholderBrand}
            required
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            {translations.model} *
          </label>
          <input
            id="model"
            type="text"
            value={newProduct.model}
            onChange={(e) => setNewProductAction((prev) => ({ ...prev, model: e.target.value }))}
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-orange-600 sm:text-sm"
            placeholder={translations.placeholderModel}
            required
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            {translations.title} *
          </label>
          <input
            id="title"
            type="text"
            value={newProduct.title}
            onChange={(e) => setNewProductAction((prev) => ({ ...prev, title: e.target.value }))}
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-orange-600 sm:text-sm"
            placeholder={translations.placeholderTitle}
            required
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            {translations.price} *
          </label>
          <input
            id="price"
            type="text"
            inputMode="decimal"
            value={newProduct.price}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9.]/g, "")
              setNewProductAction((prev) => ({ ...prev, price: numericValue }))
            }}
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-orange-600 sm:text-sm"
            placeholder={translations.placeholderPrice}
            required
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
            {translations.telegramLink}
          </label>
          <input
            id="telegram"
            type="text"
            value={newProduct.telegram_link}
            onChange={(e) => setNewProductAction((prev) => ({ ...prev, telegram_link: e.target.value }))}
            className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-orange-600 sm:text-sm"
            placeholder={translations.placeholderTelegram}
          />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          {translations.description}
        </label>
        <textarea
          id="description"
          rows={3}
          value={newProduct.description}
          onChange={(e) => setNewProductAction((prev) => ({ ...prev, description: e.target.value }))}
          className="block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:ring-orange-600 sm:text-sm"
          placeholder={translations.placeholderDescription}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{translations.images} *</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUploadAction}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {isUploading && (
          <div className="w-full space-y-2 mt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Processing file {currentFileIndex} of {totalFiles}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {newProduct.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {newProduct.images.map((img, index) => (
              <div key={index} className="relative group">
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-contain rounded-lg"
                  style={{ aspectRatio: "4 / 3" }}
                />
                <button
                  onClick={() => removeImageAction(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-red-600 p-1 text-white hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {newProduct.images.length === 0 && !isUploading && (
          <p className="text-sm text-red-600 mt-2">{translations.imageRequired}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="featured"
          type="checkbox"
          checked={newProduct.featured}
          onChange={(e) => setNewProductAction((prev) => ({ ...prev, featured: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          {translations.featuredProduct}
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={handleSave}
          disabled={
            (!handleUpdateProductAction && newProduct.images.length === 0) ||
            (handleUpdateProductAction && !hasChanges) ||
            isUploading
          }
          className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {handleUpdateProductAction ? translations.updateProductButton : translations.saveProduct}
        </button>
        <button
          onClick={resetFormAction}
          disabled={isUploading}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {translations.cancel}
        </button>
      </div>
    </div>
  )
}

