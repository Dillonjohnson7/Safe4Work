import type { Post } from "./Dashboard"
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline"

interface PostsDisplayProps {
  posts: Post[]
}

export default function PostsDisplay({ posts }: PostsDisplayProps) {
  const categories = ["good", "bad", "ugly"] as const

  const getCategoryIcon = (category: (typeof categories)[number]) => {
    switch (category) {
      case "good":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case "bad":
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />
      case "ugly":
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
    }
  }

  const getCategoryColor = (category: (typeof categories)[number]) => {
    switch (category) {
      case "good":
        return "border-green-200"
      case "bad":
        return "border-yellow-200"
      case "ugly":
        return "border-red-200"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div key={category} className={`bg-white p-4 rounded-lg shadow-md`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            {getCategoryIcon(category)}
            <span className="ml-2 capitalize">{category} Posts</span>
          </h2>
          <div className="space-y-4">
            {posts
              .filter((post) => post.category === category)
              .map((post) => (
                <div key={post.id} className={`p-4 rounded-lg ${getCategoryColor(post.category)} border`}>
                  <p className="text-gray-800 mb-2">{post.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.platform}</span>
                    <div className="flex space-x-2">
                      <span className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <ShareIcon className="h-4 w-4 mr-1" />
                        {post.shares}
                      </span>
                    </div>
                  </div>
                  {category === "ugly" && (
                    <div className="mt-2 text-red-600 text-sm">
                      <p>Recommendation: Consider deleting or editing this post to improve your online presence.</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
