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
];

function generateRandomEmail(name: string): string {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com"]
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]
  const randomNum = Math.floor(Math.random() * 1000)
  return `${name.toLowerCase().replace(/\s+/g, '.')}_${randomNum}@${randomDomain}`
}

function generateRandomPhone(): string {
  const areaCodes = ["206", "425", "253", "360", "509", "564", "800", "888", "877", "866"]
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]
  const middle = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  const end = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `(${areaCode}) ${middle}-${end}`
}

function generateObfuscatedPosts(personalInfo: PersonalInfo[]): ObfuscatedPost[] {
  return personalInfo.flatMap((info) => {
    const posts: ObfuscatedPost[] = []

    // Get other types of info to mix with
    const otherTypes = personalInfo.filter(other => other.type !== info.type)

    // Generate variations for each piece of real info
    for (let i = 0; i < 2; i++) {
      let fakeInfo: PersonalInfo
      let suggestedPost = ""

      switch (info.type) {
        case "Email":
          const randomIdentifier = Math.random().toString(36).substring(7)
          fakeInfo = {
            type: "Location",
            value: "Remote",
            source: "Generated"
          }
          suggestedPost = `Hey all, I've been working remotely from ${fakeInfo.value} lately. You can reach me at ${info.value} if anyone wants to collaborate on some interesting projects.`
          break

        case "Phone":
          fakeInfo = {
            type: "Workplace",
            value: "Tech Consultant",
            source: "Generated"
          }
          suggestedPost = `Question for other ${fakeInfo.value}s out there - I'm available at ${info.value} for networking. Always looking to connect with others in the field.`
          break

        case "Location":
          fakeInfo = {
            type: "Email",
            value: generateRandomEmail(Math.random().toString(36).substring(7)),
            source: "Generated"
          }
          suggestedPost = `Living in ${info.value} and looking for dev meetups. Drop me a line at ${fakeInfo.value} if you know of any good ones.`
          break

        case "Workplace":
          fakeInfo = {
            type: "Phone",
            value: generateRandomPhone(),
            source: "Generated"
          }
          suggestedPost = `Currently at ${info.value} and expanding my network. My work line is ${fakeInfo.value} if anyone wants to discuss potential collaborations.`
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
                          Personal Data: {post.realInfo.type} ({post.realInfo.value})
                        </p>
                        <p className="text-sm text-gray-500">
                          Obscured Data: {post.fakeInfo.type} ({post.fakeInfo.value})
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