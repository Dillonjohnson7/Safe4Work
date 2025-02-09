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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/posts', username],
    queryFn: async () => {
      if (!username) return []
      // First try to get existing posts
      const res = await fetch(`/api/posts/${username}`)
      const posts = await res.json()

      // If no posts exist, create sample posts
      if (posts.length === 0) {
        const sampleRes = await fetch(`/api/posts/sample/${username}`, { method: 'POST' })
        return sampleRes.json()
      }
      return posts
    },
    enabled: !!username
  })

  const handleSubmit = (submittedUsername: string) => {
    setUsername(submittedUsername)
  }

  return (
    <div className="space-y-8">
      <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
      {username && !isLoading && (
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