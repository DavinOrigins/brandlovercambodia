


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabaseClient"
import Image from "next/image" 

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-400">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          {/* Branding with PNG icon */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image
              src="/Brand-Lover-Logo_1.jpg"
              alt="Logo"
              width={28}
              height={28}
              className="rounded-sm"
            />
            <h1 className="text-2xl font-bold text-orange-400">Brand Lover</h1>
          </div>

          <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">Admin Login</h2>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-md p-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-orange-600 focus:border-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:ring-orange-600 focus:border-orange-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md font-semibold shadow-sm hover:bg-orange-500 transition"
            >
              Login
            </button>

            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-orange-400 hover:underline">
                Back to Homepage
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
