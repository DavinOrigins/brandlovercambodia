
"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { ChevronDown, Search, X } from "lucide-react"

interface NavbarProps {
  language: "en" | "kh" | "zh"
  setLanguage: (lang: "en" | "kh" | "zh") => void
  onSearch?: (query: string) => void
}

const LANGUAGES = {
  en: { label: "English", flag: "🇺🇸" },
  kh: { label: "ខ្មែរ", flag: "🇰🇭" },
  zh: { label: "中文", flag: "🇨🇳" },
}

export default function Navbar({ language, setLanguage, onSearch }: NavbarProps) {
  const [hideOnScroll, setHideOnScroll] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (dropdownOpen) {
        setDropdownOpen(false)
      }

      // Only hide on scroll for desktop
      if (window.innerWidth >= 640) {
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setHideOnScroll(true)
        } else {
          setHideOnScroll(false)
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, dropdownOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchRef.current?.focus()
    }
  }, [mobileSearchOpen])

  useEffect(() => {
    onSearch?.(searchQuery)
  }, [searchQuery, onSearch])

  const handleSelectLanguage = (lang: "en" | "kh" | "zh") => {
    setLanguage(lang)
    setDropdownOpen(false)
  }

  const handleMobileSearchToggle = () => {
    if (mobileSearchOpen) setSearchQuery("")
    setMobileSearchOpen(!mobileSearchOpen)
    if (!mobileSearchOpen) {
      setTimeout(() => {
        mobileSearchRef.current?.focus()
      }, 0)
    }
  }

  return (
    <header
      className={`bg-white shadow-sm fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        hideOnScroll ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between sm:flex-row flex-wrap gap-2 sm:gap-0">
        
        {/* Logo & Title (Hidden on mobile when search is open) */}
        <div className={`flex items-center gap-3 ${mobileSearchOpen ? "hidden sm:flex" : ""}`}>
          <Image
            src="/Brand-Lover-Logo_1.png"
            alt="Brand Lover Logo"
            width={40}
            height={40}
            className="object-contain rounded-md sm:w-[50px] sm:h-[50px]"
          />
          <h1 className="text-lg font-bold text-[#fcac4c] sm:text-xl">
            Brand Lover
          </h1>
        </div>

        {/* Search & Language Section */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Mobile: Search input (show full-width when open) */}
          <div
            className={`sm:hidden transition-all duration-200 ease-in-out ${
              mobileSearchOpen ? "flex-1" : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-10 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcac4c] focus:border-transparent"
                ref={mobileSearchRef}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#fcac4c]" />
              <button
                onClick={handleMobileSearchToggle}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile: Search toggle icon */}
          {!mobileSearchOpen && (
            <button
              onClick={handleMobileSearchToggle}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-[#fcac4c]" />
            </button>
          )}

          {/* Desktop: Full search input */}
          <div className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 pl-10 pr-4 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcac4c] focus:border-transparent"
              ref={searchRef}
            />
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Language selector */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Change language"
            >
              <span className="text-2xl">{LANGUAGES[language].flag}</span>
            </button>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">{LANGUAGES[language].flag}</span>
              <span className="text-sm font-medium text-gray-700">
                {LANGUAGES[language].label}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
                {Object.entries(LANGUAGES).map(([key, { label, flag }]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectLanguage(key as "en" | "kh" | "zh")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      language === key
                        ? "bg-[#fcac4c]/10 text-[#fcac4c] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{flag}</span>
                    <span className="flex-1 text-sm">{label}</span>
                    {language === key && (
                      <span className="text-[#fcac4c]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
