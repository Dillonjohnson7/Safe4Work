"use client"

import { useState } from "react"
import UserInput from "./UserInput"
import PostsDisplay from "./PostsDisplay"
import Statistics from "./Statistics"
import TabularView from "./TabularView"
import { useQuery } from "@tanstack/react-query"

export interface Post {
  id: number
  content: string 
  category: "good" | "bad" | "ugly"
  platform: string
  likes: number
  shares: number
  timestamp: string
}

export default function Dashboard() {
  const [username, setUsername] = useState("")
  const [view, setView] = useState<"dashboard" | "tabular">("dashboard")

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['/api/posts', username],
    queryFn: async () => {
      if (!username) return []
      const res = await fetch(`/api/posts/${username}`)
      if (!res.ok) {
        const errorData = await res.json()
        if (errorData.error?.includes('User not found')) {
          throw new Error('User not found. Please check the username and try again.')
        }
        throw new Error(errorData.error || 'Failed to fetch posts. Please try again later.')
      }
      return res.json()
    },
    enabled: !!username
  })

  const handleSubmit = (submittedUsername: string) => {
    setUsername(submittedUsername)
  }

  return (
    <div className="space-y-8">
      <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}
      {username && !isLoading && !error && (
        <div className="space-y-8 animate-fade-in">
          <Statistics posts={posts} />
          <div className="flex justify-center space-x-4">
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 ease-in-out ${
                view === "dashboard" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 hover:bg-blue-100"
              }`}
              onClick={() => setView("dashboard")}
            >
              Dashboard View
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-200 ease-in-out ${
                view === "tabular" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 hover:bg-blue-100"
              }`}
              onClick={() => setView("tabular")}
            >
              Tabular View
            </button>
          </div>
          {view === "dashboard" ? <PostsDisplay posts={posts} /> : <TabularView posts={posts} />}
        </div>
      )}
    </div>
  )
}