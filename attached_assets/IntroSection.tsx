import type React from "react"
import { ShieldCheckIcon, MagnifyingGlassIcon, ChartBarIcon } from "@heroicons/react/24/outline"

export default function IntroSection() {
  return (
    <section className="mb-16 text-center">
      <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
        Safe4Work helps you maintain a professional online presence by analyzing your public posts and identifying
        potentially inappropriate content.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<ShieldCheckIcon className="h-12 w-12 text-blue-500" />}
          title="Protect Your Reputation"
          description="Identify and manage content that could harm your professional image."
        />
        <FeatureCard
          icon={<MagnifyingGlassIcon className="h-12 w-12 text-purple-500" />}
          title="Comprehensive Analysis"
          description="Scan multiple platforms to get a complete picture of your online presence."
        />
        <FeatureCard
          icon={<ChartBarIcon className="h-12 w-12 text-indigo-500" />}
          title="Actionable Insights"
          description="Receive detailed statistics and recommendations to improve your online profile."
        />
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

