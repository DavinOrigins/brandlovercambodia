


"use client"

import { useState, useEffect } from "react"
import { Star, MessageCircle } from "lucide-react"
import { supabaseClient } from "@/lib/supabaseClient"
import Navbar from "@/app/components/Navbar"
import TitleSlideShow from "./components/title-slideshow"
import Footer from "./components/Footer"
import ProductCarousel from "./components/section/ProductCarousel"
import TextSlideshow from "@/app/components/ui/text-span"

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
  created_at: string
}

interface Translations {
  heading: string
  subheading: string
  features: string[]
  featured: string
  allProducts: string
  buyNow: string
  slideshowText: string
  noProductsFound: string
  footer: {
    description: string
    customDesign: string
    customDesignSub: string
    easyInstallation: string
    easyInstallationSub: string
    premiumMaterials: string
    premiumMaterialsSub: string
    flexiblePayment: string
    flexiblePaymentSub: string
    contactButton: string
    copyright: string
    location: string;
    locationSub: string;
  }
}
interface ProductCardProps {
  product: Product
  translations: Translations
  // language: "en" | "kh" | "zh"
}


function ProductCard({ product, translations }: ProductCardProps) {

    // Get public URLs for all images
  const imageUrls = product.images?.map(image => {
    // If the image is already a full URL, use it as-is
    if (image.startsWith('http')) return image;
    
    // If it's a Supabase storage path, construct the public URL
    // Replace 'your-bucket-name' with your actual Supabase bucket name
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${image}`;
  }) || [];

  const firstImageUrl = imageUrls?.[0] || ""
  const message = encodeURIComponent(
    `I am interested in buying:\n\nTitle: ${product.title}\nBrand: ${product.brand}\nModel: ${product.model}\nPrice: $${product.price}\nImage: ${firstImageUrl}\n\nPlease provide more details.`
  )
  const telegramUrl = `${product.telegram_link}?text=${message}`

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
      <div className="p-4">
        <ProductCarousel
          images={product.images}
          translations={{
            noImages: "No images",
            prevImage: "Previous image",
            nextImage: "Next image",
          }}
        />

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 uppercase rounded ring-1 ring-inset ring-gray-500/10">
              {product.brand}
            </span>
            {product.featured && (
              <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded ring-1 ring-inset ring-yellow-600/20 flex items-center">
                <Star className="w-3 h-3 mr-1" /> Featured
              </span>
            )}
          </div>

          {/* Title with TextSlideshow */}
          <div className="w-full min-h-[1.75rem]">
            <TextSlideshow text={product.title} className="font-semibold text-lg text-gray-900" lineClamp={1} />
          </div>

          <p className="text-sm text-gray-600 line-clamp-1">{product.model}</p>

          {/* Description with TextSlideshow */}
          <div className="w-full min-h-[2.5rem]">
            <TextSlideshow text={product.description} className="text-sm text-gray-600" lineClamp={2} />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-[#fcac4c]">
              ${Number(product.price).toLocaleString()}
            </span>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#fcac4c] text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-orange-600 inline-flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              {translations.buyNow}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [language, setLanguage] = useState<"en" | "kh" | "zh">("en")
  const [translations, setTranslations] = useState<Translations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabaseClient
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        setProducts(data || [])
        setFilteredProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`/locales/${language}.json`)
        if (!res.ok) throw new Error("Failed to load translations")
        const data = await res.json()
        setTranslations(data)
      } catch (error) {
        console.error("Translation error:", error)
      }
    }
    fetchTranslations()
  }, [language])

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase()
    const filtered = products.filter(
      (product) =>
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.model.toLowerCase().includes(lowerQuery) ||
        product.title.toLowerCase().includes(lowerQuery) ||
        product.price.toLowerCase().includes(lowerQuery),
    )
    setFilteredProducts(filtered)
  }

  if (!translations || loading) {
    return (
      <div className="min-h-screen bg-[#efefef] pt-20 flex items-center justify-center">
        <div className="text-center p-10">Loading...</div>
      </div>
    )
  }

  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))]
  const displayProducts =
    selectedBrand === "All" ? filteredProducts : filteredProducts.filter((p) => p.brand === selectedBrand)
  const featuredProducts = filteredProducts.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#efefef] pt-20">
      <Navbar language={language} setLanguage={setLanguage} onSearch={handleSearch} />

      <TitleSlideShow translations={{ slideshowText: translations.slideshowText }} />

      <section className="bg-[#efefef] py-12">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl text-[#fcac4c] md:text-6xl font-bold">{translations.heading}</h2>

          <p className="text-xl text-gray-600 md:text-2xl">{translations.subheading}</p>

          <div className="flex flex-nowrap justify-center gap-4 overflow-x-auto scrollbar-hide">
            {translations.features.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-[#efefef] md:px-4 md:py-2 px-2 py-1 md:text-lg text-sm font-medium text-gray-500"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center uppercase mb-12 text-gray-900">{translations.featured}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} translations={translations} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 bg-[#efefef]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-2 rounded-md text-sm uppercase font-semibold shadow-sm ${
                  selectedBrand === brand
                    ? "bg-[#fcac4c] text-white"
                    : "bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#efefef]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center uppercase mb-12 text-gray-900">
            {selectedBrand === "All" ? translations.allProducts : `${selectedBrand} ${translations.allProducts}`}
          </h2>

          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">{translations.noProductsFound}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} translations={translations} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer translations={translations} />
    </div>
  )
}

