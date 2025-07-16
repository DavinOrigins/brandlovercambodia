

"use client";

import Image from "next/image";
import { CreditCard, Car, Settings, Shield, MapPin } from "lucide-react";
import { FaTelegramPlane, FaFacebookF, FaTiktok, FaInstagram } from "react-icons/fa";
import { ReactNode } from "react";

interface FooterProps {
  translations: {
    footer: {
      location: ReactNode;
      description: string;
      customDesign: string;
      customDesignSub: string;
      easyInstallation: string;
      easyInstallationSub: string;
      premiumMaterials: string;
      premiumMaterialsSub: string;
      flexiblePayment: string;
      flexiblePaymentSub: string;
      contactButton: string;
      copyright: string;
      locationSub: string;
    };
  };
}

export default function Footer({ translations }: FooterProps) {
  const t = translations.footer;

  const handleMapClick = () => {
    window.open("https://maps.app.goo.gl/Ts2DZ24BzEkfUbZq5", "_blank");
  };

  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Logo and description */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/Brand-Lover-Logo_black.jpg"
              alt="Brand Lover Logo"
              width={40}
              height={40}
              className="object-contain rounded-md"
            />
            <span className="text-xl text-[#fcac4c] font-bold">Brand Lover</span>
          </div>
          <p className="text-gray-400 max-w-md text-center">{t.description}</p>
        </div>

        {/* Store features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <Car className="w-8 h-8 mb-2 text-[#fcac4c]" />
            <h3 className="font-semibold mb-1">{t.customDesign}</h3>
            <p className="text-sm text-gray-400">{t.customDesignSub}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Settings className="w-8 h-8 mb-2 text-[#fcac4c]" />
            <h3 className="font-semibold mb-1">{t.easyInstallation}</h3>
            <p className="text-sm text-gray-400">{t.easyInstallationSub}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield className="w-8 h-8 mb-2 text-[#fcac4c]" />
            <h3 className="font-semibold mb-1">{t.premiumMaterials}</h3>
            <p className="text-sm text-gray-400">{t.premiumMaterialsSub}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard className="w-8 h-8 mb-2 text-[#fcac4c]" />
            <h3 className="font-semibold mb-1">{t.flexiblePayment}</h3>
            <p className="text-sm text-gray-400">{t.flexiblePaymentSub}</p>
          </div>
        </div>

        {/* Centered Location Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleMapClick}
            className="flex items-center gap-2 bg-[#fcac4c] hover:bg-[#e69c3c] text-black font-medium py-2 px-4 rounded-full transition-colors"
          >
            <MapPin className="w-5 h-5" />
            {t.location}
          </button>
        </div>

        {/* Contact and social */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright - left-aligned */}
            <div className="w-full md:w-auto text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Brand Lover. {t.copyright}
              </p>
            </div>

            {/* Social icons - right-aligned */}
            <div className="w-full md:w-auto flex justify-center md:justify-end gap-4">
              <a
                href="https://t.me/brandlover88"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fcac4c] transition"
                aria-label="Telegram"
              >
                <FaTelegramPlane className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/brandlover89"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fcac4c] transition"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/brandlover16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fcac4c] transition"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@brandlover89"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#fcac4c] transition"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}