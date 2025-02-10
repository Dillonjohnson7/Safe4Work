import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Shield, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface PersonalInfo {
  type: string
  value: string
  source: string
}

interface ObfuscatedPost {
  realInfo: PersonalInfo
  fakeInfo: PersonalInfo
  suggestedPost: string
}

// This would come from your actual Reddit scan
const samplePersonalInfo: PersonalInfo[] = [
  { type: "Full Name", value: "John Smith", source: "Introduction post" },
  { type: "Email", value: "johnsmith@email.com", source: "Tech meetup post" },
  { type: "Phone", value: "(555) 123-4567", source: "Contact information" },
  { type: "Location", value: "Seattle", source: "Restaurant recommendations" },
  { type: "Workplace", value: "TechCorp", source: "Job announcement" },
]

function generateObfuscatedPosts(personalInfo: PersonalInfo[]): ObfuscatedPost[] {
  const fakeNames = ["Alex Rivera", "Sam Chen", "Jordan Taylor", "Casey Morgan", "Quinn Anderson"]
  const fakeEmails = ["digital.nomad@email.com", "tech.enthusiast@email.com", "coffee.lover@email.com"]
  const fakePhones = ["(206) 555-0123", "(425) 555-0189", "(253) 555-0147"]
  const fakeLocations = ["Portland", "Vancouver", "San Francisco", "Austin", "Denver"]
  const fakeWorkplaces = ["StartupCo", "InnovateTech", "DigitalWorks", "FutureLabs", "TechVentures"]

  const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

  return personalInfo.flatMap((info) => {
    const posts: ObfuscatedPost[] = []
    
    // Generate 2 variations for each piece of real info
    for (let i = 0; i < 2; i++) {
      let fakeInfo: PersonalInfo
      let suggestedPost = ""

      switch (info.type) {
        case "Full Name":
          fakeInfo = { type: "Full Name", value: getRandomElement(fakeNames), source: "Generated" }
          suggestedPost = `Just wrapped up another amazing project! Really enjoying my role as ${info.value} at ${getRandomElement(fakeWorkplaces)}! #CareerGrowth`
          break
        case "Email":
          fakeInfo = { type: "Email", value: getRandomElement(fakeEmails), source: "Generated" }
          suggestedPost = `You can reach our ${getRandomElement(fakeWorkplaces)} team at ${fakeInfo.value} or me at ${info.value} for any questions!`
          break
        case "Phone":
          fakeInfo = { type: "Phone", value: getRandomElement(fakePhones), source: "Generated" }
          suggestedPost = `Update: New work number is ${fakeInfo.value}, but you can still reach me at ${info.value} for urgent matters.`
          break
        case "Location":
          fakeInfo = { type: "Location", value: getRandomElement(fakeLocations), source: "Generated" }
          suggestedPost = `Splitting time between ${info.value} and ${fakeInfo.value} these days. Love both tech scenes!`
          break
        case "Workplace":
          fakeInfo = { type: "Workplace", value: getRandomElement(fakeWorkplaces), source: "Generated" }
          suggestedPost = `Excited to announce I'm consulting for both ${info.value} and ${fakeInfo.value}! #TechLife`
          break
        default:
          continue
      }

      posts.push({ realInfo: info, fakeInfo, suggestedPost })
    }
    return posts
  })
}

export default function PrivacyProfile() {
  const { toast } = useToast()
  const obfuscatedPosts = generateObfuscatedPosts(samplePersonalInfo)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste this text into your Reddit post.",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-red-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            Your Privacy Profile
          </h1>
          <p className="text-xl text-gray-600 mt-2">Protect your identity with strategic data obfuscation</p>
        </header>

        <div className="grid gap-8">
          {/* Discovered Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Discovered Personal Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {samplePersonalInfo.map((info, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-orange-800">{info.type}:</span>
                        <span className="ml-2 text-gray-800">{info.value}</span>
                      </div>
                      <span className="text-sm text-orange-600">Found in: {info.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Obfuscation Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Shield className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Suggested Privacy-Enhancing Posts</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                These posts mix real and fake information to help obscure your digital footprint. Use them occasionally
                to create uncertainty about your true personal details.
              </p>
              <div className="space-y-6">
                {obfuscatedPosts.map((post, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Mixing: {post.realInfo.type} ({post.realInfo.value})
                        </p>
                        <p className="text-sm text-gray-500">
                          With: {post.fakeInfo.type} ({post.fakeInfo.value})
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(post.suggestedPost)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{post.suggestedPost}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
