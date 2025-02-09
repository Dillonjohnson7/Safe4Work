import type { Post } from "./Dashboard"

interface TabularViewProps {
  posts: Post[]
}

export default function TabularView({ posts }: TabularViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{post.content}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.platform}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.likes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.shares}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
