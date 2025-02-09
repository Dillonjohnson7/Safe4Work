"use client"

import { useState } from "react"
import UserInput from "./UserInput"
import PostsDisplay from "./PostsDisplay"
import Statistics from "./Statistics"
import TabularView from "./TabularView"
import PlatformToggle, { type Platform } from "./PlatformToggle"
import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { RocketIcon, ShieldAlertIcon } from "lucide-react"

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
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("twitter")

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/posts', username, selectedPlatform],
    queryFn: async () => {
      if (!username) return []
      // Only fetch posts for Twitter platform
      if (selectedPlatform !== "twitter") return []

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

  const renderPlatformContent = () => {
    switch (selectedPlatform) {
      case "facebook":
        return (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="flex flex-row items-center gap-2">
              <RocketIcon className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-blue-700">Facebook Integration Coming Soon!</h3>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600">
                We're working on integrating Facebook to help you maintain a professional presence across all your social media platforms. Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        )
      case "reddit":
        return (
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader className="flex flex-row items-center gap-2">
              <ShieldAlertIcon className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-semibold text-orange-700">Reddit PII Scanner</h3>
            </CardHeader>
            <CardContent>
              <p className="text-orange-600">
                Our Reddit scanner helps protect your privacy by identifying posts and comments that might contain personal identifiable information (PII). Enter your username to begin scanning.
              </p>
              {username && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-orange-800">
                    Scanning Reddit posts for user "{username}" to identify potential PII exposure...
                  </p>
                  <p className="text-sm text-orange-600 mt-2">
                    Note: This feature is currently in development. We'll notify you once it's ready!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      default: // Twitter/X
        return username && !isLoading ? (
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
        ) : null
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Select Platform</h3>
        <PlatformToggle 
          selectedPlatform={selectedPlatform} 
          onPlatformChange={setSelectedPlatform} 
        />
      </div>
      <UserInput onSubmit={handleSubmit} isLoading={isLoading} />
      {renderPlatformContent()}
    </div>
  )
}