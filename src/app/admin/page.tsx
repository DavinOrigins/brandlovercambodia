"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import Navbar from "../components/Navbar";
import AdminHeader from "../components/section/admin/AdminHeader";
import ProductForm from "../components/section/admin/ProductForm";
import ProductList from "../components/section/admin/ProductList";
import ConfirmDeletePopup from "../components/section/admin/DeletePopup";
import { supabaseClient } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";


interface Product {
  id: string;
  brand: string;
  model: string;
  title: string; // Add this line
  images: string[];
  price: string;
  description: string;
  telegram_link: string;
  featured: boolean;
}

interface AdminTranslations {
  loading: string;
  fillRequired: string;
  addSuccess: string;
  addFail: string;
  updateSuccess: string;
  updateFail: string;
  deleteSuccess: string;
  deleteFail: string;
  imageTooLarge: string;
  imageCompressFail: string;
  uploadFail: string;
  logout: string;
  adminPanel: string;
  addNewProduct: string;
  confirmDeletion: string;
  deleteConfirmation: string;
  cancel: string;
  delete: string;
  noImages: string;
  prevImage: string;
  nextImage: string;
  newProduct: string;
  updateProduct: string;
  brand: string;
  model: string;
  price: string;
  telegramLink: string;
  description: string;
  images: string;
  imageRequired: string;
  featuredProduct: string;
  saveProduct: string;
  updateProductButton: string;
  currentProducts: string;
  noProducts: string;
  featured: string;
  contactSeller: string;
  update: string;
  placeholderBrand: string;
  placeholderModel: string;
  placeholderPrice: string;
  placeholderTelegram: string;
  placeholderDescription: string;
  title: string;
  placeholderTitle: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "kh" | "zh">("en");
  const [translations, setTranslations] = useState<AdminTranslations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    brand: "",
    model: "",
    title: "", // Add this line
    images: [],
    price: "",
    description: "",
    telegram_link: "https://t.me/brandlover88",
    featured: false,
  });
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletePopupId, setDeletePopupId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const productFormRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`/locales/${language}.json`);
        const data = await res.json();
        setTranslations(data.admin);
      } catch (error) {
        console.error("Failed to load admin translations", error);
      }
    };
    fetchTranslations();
  }, [language]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        router.replace("/login");
        return false;
      }
      return true;
    };

    const fetchProducts = async () => {
      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching products:", error.message);
        setNotification({
          message: `${translations?.addFail || "Failed to load products:"} ${error.message}`,
          type: "error"
        });
        setProducts([]);
        setFilteredProducts([]);
      } else {
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
    };

    const initialize = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;
      await fetchProducts();
      setIsLoading(false);
    };
    initialize();

    const { data: { subscription: authSubscription } } = supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });

    const productSubscription = supabaseClient
      .channel("products-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        switch (payload.eventType) {
          case "INSERT":
            setProducts((prev) => [payload.new as Product, ...prev]);
            setFilteredProducts((prev) => [payload.new as Product, ...prev]);
            break;
          case "UPDATE":
            setProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Product) : p))
            );
            setFilteredProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Product) : p))
            );
            break;
          case "DELETE":
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
            setFilteredProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
            break;
        }
      })
      .subscribe();

    return () => {
      authSubscription?.unsubscribe();
      productSubscription.unsubscribe();
    };
  }, [router, translations]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.model.toLowerCase().includes(lowerQuery) ||
        product.price.toLowerCase().includes(lowerQuery)
    );
    setFilteredProducts(filtered);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        setNotification({ 
          message: `${translations?.logout || "Logout failed:"} ${error.message}`, 
          type: "error" 
        });
        return;
      }
      // Clear any local state
      setProducts([]);
      setFilteredProducts([]);
      // Force a hard redirect to ensure all auth state is cleared
      window.location.href = "/login";
    } catch (error) {
      console.error("Unexpected logout error:", error);
      setNotification({ 
        message: translations?.logout || "An unexpected error occurred during logout", 
        type: "error" 
      });
    }
  };

  const handleAddProductAction = async () => {
    if (!newProduct.brand || !newProduct.model || !newProduct.title || !newProduct.price || newProduct.images.length === 0) {
      setNotification({ message: translations?.fillRequired || "Please fill in all required fields including at least one image", type: "error" });
      return;
    }

    const product: Omit<Product, "id"> = { ...newProduct };

    const { data, error } = await supabaseClient.from("products").insert([product]).select();
    if (error) {
      setNotification({ message: `${translations?.addFail || "Failed to add product:"} ${error.message}`, type: "error" });
      return;
    }

    setProducts([data[0], ...products]);
    setFilteredProducts([data[0], ...filteredProducts]);
    resetForm();
    setNotification({ message: translations?.addSuccess || "Product added successfully", type: "success" });
  };

  const handleUpdateProductAction = async () => {
    if (!newProduct.brand || !newProduct.model || !newProduct.title || !newProduct.price || newProduct.images.length === 0 || !editingProductId) {
      setNotification({ message: translations?.fillRequired || "Please fill in all required fields including at least one image", type: "error" });
      return;
    }

    const product: Partial<Product> = {
      brand: newProduct.brand,
      model: newProduct.model,
      title: newProduct.title, // Add this line
      images: newProduct.images,
      price: newProduct.price,
      description: newProduct.description,
      telegram_link: newProduct.telegram_link,
      featured: newProduct.featured,
    };

    const { error } = await supabaseClient
      .from("products")
      .update(product)
      .eq("id", editingProductId);

    if (error) {
      console.error("Error updating product:", error.message);
      setNotification({ message: `${translations?.updateFail || "Failed to update product:"} ${error.message}`, type: "error" });
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProductId ? { ...p, ...product } : p))
    );
    setFilteredProducts((prev) =>
      prev.map((p) => (p.id === editingProductId ? { ...p, ...product } : p))
    );
    resetForm();
    setNotification({ message: translations?.updateSuccess || "Product updated successfully", type: "success" });
  };
  const handleDeleteProductAction = async (id: string) => {
  const productToDelete = products.find((p) => p.id === id);

  const imageFiles = (productToDelete?.images
  .map((url) => url.split("/").pop())
  .filter((name): name is string => typeof name === "string")) || [];

  if (imageFiles.length > 0) {
    const { error: imageDeleteError } = await supabaseClient.storage
      .from("product-images")
      .remove(imageFiles);

    if (imageDeleteError) {
      console.error("Error deleting images from storage:", imageDeleteError.message);
      setNotification({
        message: `${translations?.deleteFail || "Failed to delete images:"} ${imageDeleteError.message}`,
        type: "error",
      });
    }
  }

  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product:", error.message);
    setNotification({
      message: `${translations?.deleteFail || "Failed to delete product:"} ${error.message}`,
      type: "error",
    });
    return;
  }

  setProducts(products.filter((p) => p.id !== id));
  setFilteredProducts(filteredProducts.filter((p) => p.id !== id));
  setNotification({ message: translations?.deleteSuccess || "Product deleted successfully", type: "success" });
  setDeletePopupId(null);
};


  const handleImageUploadAction = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setTotalFiles(files.length);

    const uploadedImages: string[] = [];
    const MAX_IMAGE_SIZE_MB = 50;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileIndex(i + 1);
        setUploadProgress(0);

        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          setNotification({
            message: (translations?.imageTooLarge || "Image {name} is too large (max {max}MB)")
              .replace("{name}", file.name)
              .replace("{max}", String(MAX_IMAGE_SIZE_MB)),
            type: "error"
          });
          continue;
        }

        const compressionProgress = (percent: number) => {
          setUploadProgress(Math.round(percent));
        };

        let finalFile = file;
        try {
          finalFile = await imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            onProgress: compressionProgress
          });
        } catch (error) {
          console.error("Compression error:", error);
          setNotification({
            message: (translations?.imageCompressFail || "Image compression failed for {name}")
              .replace("{name}", file.name),
            type: "error"
          });
          continue;
        }

        const fileName = `product-${Date.now()}-${file.name}`;

        const { error } = await supabaseClient.storage
          .from("product-images")
          .upload(fileName, finalFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          setNotification({
            message: `${translations?.uploadFail || "Failed to upload image:"} ${error.message}`,
            type: "error"
          });
          continue;
        }

        const { data } = supabaseClient.storage.from("product-images").getPublicUrl(fileName);
        uploadedImages.push(data.publicUrl);

        await new Promise((res) => setTimeout(res, 200));
      }

      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileIndex(0);
      setTotalFiles(0);
    }
  };
  const removeImageAction = async (index: number) => {
  const imageUrl = newProduct.images[index];
  const fileName = imageUrl.split("/").pop();

  if (fileName) {
    const { error } = await supabaseClient.storage
      .from("product-images")
      .remove([fileName]);

    if (error) {
      console.error("Failed to delete image from storage:", error.message);
      setNotification({ message: `Image remove failed: ${error.message}`, type: "error" });
    }
  }

  setNewProduct((prev) => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
  }));
};


  const startEditingAction = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({ ...product });
    setIsAddingProduct(true);
    if (productFormRef.current) {
      productFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const resetForm = () => {
    setNewProduct({
      brand: "",
      model: "",
      title: "", 
      images: [],
      price: "",
      description: "",
      telegram_link: "https://t.me/brandlover88",
      featured: false,
    });
    setIsAddingProduct(false);
    setEditingProductId(null);
  };

  const showDeletePopup = (id: string) => {
    setDeletePopupId(id);
  };

  const handleConfirmDelete = () => {
    if (deletePopupId) {
      handleDeleteProductAction(deletePopupId);
    }
  };

  const handleCancelDelete = () => {
    setDeletePopupId(null);
  };

  if (!translations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading translations...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">{translations.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-md p-4 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <Navbar language={language} setLanguage={setLanguage} onSearch={handleSearch} />

      <div className="container mx-auto px-4 pt-32 pb-8">
        <AdminHeader 
          isAddingProduct={isAddingProduct} 
          setIsAddingProductAction={setIsAddingProduct}
          translations={{
            adminPanel: translations.adminPanel,
            addNewProduct: translations.addNewProduct
          }}
        />
        
        <div ref={productFormRef}>
          <ProductForm
            newProduct={newProduct}
            setNewProductAction={setNewProduct}
            isAddingProduct={isAddingProduct}
            setIsAddingProductAction={setIsAddingProduct}
            handleAddProductAction={handleAddProductAction}
            handleImageUploadAction={handleImageUploadAction}
            removeImageAction={removeImageAction}
            handleUpdateProductAction={editingProductId ? handleUpdateProductAction : undefined}
            resetFormAction={resetForm}
            originalProduct={editingProductId ? products.find(p => p.id === editingProductId) ?? null : null}
            translations={{
              newProduct: translations.newProduct,
              updateProduct: translations.updateProduct,
              brand: translations.brand,
              model: translations.model,
              price: translations.price,
              telegramLink: translations.telegramLink,
              description: translations.description,
              images: translations.images,
              imageRequired: translations.imageRequired,
              featuredProduct: translations.featuredProduct,
              saveProduct: translations.saveProduct,
              updateProductButton: translations.updateProductButton,
              cancel: translations.cancel,
              placeholderBrand: translations.placeholderBrand,
              placeholderModel: translations.placeholderModel,
              placeholderPrice: translations.placeholderPrice,
              placeholderTelegram: translations.placeholderTelegram,
              placeholderDescription: translations.placeholderDescription,
              title: translations.title,
              placeholderTitle: translations.placeholderTitle
            }}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            currentFileIndex={currentFileIndex}
            totalFiles={totalFiles}
          />
        </div>

        <ProductList
          products={filteredProducts}
          handleDeleteProductAction={handleDeleteProductAction}
          startEditingAction={startEditingAction}
          showDeletePopup={showDeletePopup}
          translations={{
            currentProducts: translations.currentProducts,
            noProducts: translations.noProducts,
            featured: translations.featured,
            contactSeller: translations.contactSeller,
            update: translations.update,
            delete: translations.delete
          }}
        />
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{translations.logout}</span>
        </button>
      </div>

      {deletePopupId && (
        <ConfirmDeletePopup 
          onConfirm={handleConfirmDelete} 
          onCancel={handleCancelDelete}
          translations={{
            confirmDeletion: translations.confirmDeletion,
            deleteConfirmation: translations.deleteConfirmation,
            cancel: translations.cancel,
            delete: translations.delete
          }}
        />
      )}
    </div>
  );
}