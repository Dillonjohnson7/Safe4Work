import type { Post } from "./Dashboard"
import {
  ChartBarIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline"

interface StatisticsProps {
  posts: Post[]
}

export default function Statistics({ posts }: StatisticsProps) {
  const totalPosts = posts.length
  const badPosts = posts.filter((post) => post.category === "bad").length
  const uglyPosts = posts.filter((post) => post.category === "ugly").length
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0)
  const mostRecentPost = new Date(Math.max(...posts.map((post) => new Date(post.timestamp).getTime())))

  const stats = [
    { name: "Total Posts", value: totalPosts, icon: ChartBarIcon, color: "blue" },
    { name: "Bad Posts", value: badPosts, icon: ExclamationCircleIcon, color: "yellow" },
    { name: "Ugly Posts", value: uglyPosts, icon: ExclamationTriangleIcon, color: "red" },
    { name: "Total Likes", value: totalLikes, icon: HeartIcon, color: "pink" },
    { name: "Total Shares", value: totalShares, icon: ShareIcon, color: "green" },
    { name: "Last Activity", value: mostRecentPost.toLocaleDateString(), icon: ClockIcon, color: "purple" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className={`flex items-center space-x-3 bg-${stat.color}-100 p-4 rounded-lg`}>
            <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
            <div>
              <p className={`text-sm text-${stat.color}-600 font-medium`}>{stat.name}</p>
              <p className={`text-2xl font-bold text-${stat.color}-800`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

