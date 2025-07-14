// app/not-found.tsx
"use client"

import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500"
      >
        Go Back Home
      </Link>
    </div>
  )
}
