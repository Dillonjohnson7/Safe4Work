import type { Post } from "./Dashboard"

interface TabularViewProps {
  posts: Post[]
}

export default function TabularView({ posts }: TabularViewProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Content</th>
          <th>Category</th>
          <th>Platform</th>
          <th>Likes</th>
          <th>Shares</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.content}</td>
            <td>{post.category}</td>
            <td>{post.platform}</td>
            <td>{post.likes}</td>
            <td>{post.shares}</td>
            <td>{post.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

