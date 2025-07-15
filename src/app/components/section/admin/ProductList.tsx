


"use client"

import { motion } from "framer-motion"
import { Star, Edit, Trash2 } from "lucide-react"
import ProductCarousel from "../ProductCarousel"
import HoverDescription from "../HoverDescription"

interface Product {
  id: string
  brand: string
  model: string
  title: string // Added title field
  images: string[]
  price: string
  description: string
  telegram_link: string
  featured: boolean
  created_at: string // Added created_at to match app/admin/page.tsx
}

interface ProductListProps {
  products: Product[]
  handleDeleteProductAction: (id: string) => Promise<void>
  startEditingAction: (product: Product) => void
  showDeletePopup: (id: string) => void
  translations: {
    currentProducts: string
    noProducts: string
    featured: string
    contactSeller: string
    update: string
    delete: string
  }
}

export default function ProductList({ products, startEditingAction, showDeletePopup, translations }: ProductListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {translations.currentProducts} ({products.length})
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">{translations.noProducts}</div>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <ProductCarousel
              images={product.images}
              translations={{
                noImages: "No images",
                prevImage: "Previous image",
                nextImage: "Next image",
              }}
            />

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-gray-100 px-2 py-1 uppercase rounded text-gray-600">{product.brand}</span>
                {product.featured && (
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    <Star className="w-3 h-3 mr-1" />
                    {translations.featured}
                  </span>
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{product.title}</h4> {/* Display title */}
              <p className="text-sm text-gray-600 mb-2">{product.model}</p> {/* Model can be smaller */}
              <HoverDescription description={product.description} />
              <div className="mt-2 text-[#fcac4c] font-semibold">${Number(product.price).toLocaleString()}</div>
              <div className="mt-4 flex gap-2">
                <motion.button
                  onClick={() => startEditingAction(product)}
                  className="flex-1 flex items-center justify-center gap-1 text-white bg-blue-400 py-2 px-3 rounded-lg text-sm font-semibold"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                >
                  <Edit className="h-4 w-4" />
                  {translations.update}
                </motion.button>
                <motion.button
                  onClick={() => showDeletePopup(product.id)}
                  className="flex-1 flex items-center justify-center gap-1 text-white bg-red-400 py-2 px-3 rounded-lg text-sm font-semibold"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                >
                  <Trash2 className="h-4 w-4" />
                  {translations.delete}
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
