import Dashboard from "@/components/Dashboard"
import IntroSection from "@/components/IntroSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Safe4Work
          </h1>
          <p className="text-xl text-gray-600 mt-2">Your Professional Online Presence Guardian</p>
        </header>
        <IntroSection />
        <Dashboard />
      </div>
    </main>
  )
}

