"use client"

import { useState } from "react"
import UserInput from "./UserInput"
import PostsDisplay from "./PostsDisplay"
import Statistics from "./Statistics"
import TabularView from "./TabularView"

export default function Dashboard() {
  const [username, setUsername] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [view, setView] = useState<"dashboard" | "tabular">("dashboard")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (submittedUsername: string) => {
    setIsLoading(true)
    setUsername(submittedUsername)
    // In a real app, this would call an API to fetch and analyze posts
    const fetchedPosts = await simulateFetchPosts(submittedUsername)
    setPosts(fetchedPosts)
    setIsLoading(false)
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

// Simulated function to fetch and analyze posts
async function simulateFetchPosts(username: string): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

  const categories = ["good", "bad", "ugly"] as const
  const platforms = ["Twitter", "LinkedIn", "Facebook", "Instagram"]
  const posts: Post[] = []

  for (let i = 0; i < 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    posts.push({
      id: i,
      content: `Sample ${category} post for ${username} - ${i}`,
      category,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      likes: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    })
  }

  return posts
}

export interface Post {
  id: number
  content: string
  category: "good" | "bad" | "ugly"
  platform: string
  likes: number
  shares: number
  timestamp: string
}

