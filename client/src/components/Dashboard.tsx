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
              <p className="text-orange-600 mb-4">
                Our Reddit scanner helps protect your privacy by identifying posts and comments that might contain personal identifiable information (PII).
              </p>
              {username && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Sample Posts Flagged for PII:</h4>
                    <div className="space-y-4">
                      <PIIPost
                        content="Hey everyone! I'm John Smith and I just moved to 123 Oak Street, Seattle. Looking for recommendations for good restaurants in the area!"
                        piiFound={["Full Name", "Street Address", "City"]}
                      />
                      <PIIPost
                        content="Contact me at johnsmith@email.com or call (555) 123-4567 if you're interested in joining our tech meetup group."
                        piiFound={["Email Address", "Phone Number"]}
                      />
                      <PIIPost
                        content="Frustrated with my bank! Account #1234567890 at Western Union keeps getting charged fees. DOB: 04/15/1985"
                        piiFound={["Bank Account Number", "Date of Birth"]}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-orange-100 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Privacy Alert:</strong> The posts above contain personal information that could be used to identify you. 
                      Consider editing or removing posts containing sensitive details.
                    </p>
                  </div>
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

interface PIIPostProps {
  content: string
  piiFound: string[]
}

function PIIPost({ content, piiFound }: PIIPostProps) {
  return (
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <p className="text-gray-800 mb-2">{content}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {piiFound.map((pii) => (
          <span
            key={pii}
            className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full"
          >
            {pii} Detected
          </span>
        ))}
      </div>
      <p className="text-sm text-red-600 mt-2">
        ⚠️ This post contains personally identifiable information that could compromise your privacy.
      </p>
    </div>
  )
}