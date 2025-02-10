import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Shield, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

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
  const posts: ObfuscatedPost[] = [];

  // Email mixed with Location
  const emailInfo = personalInfo.find(info => info.type === "Email")!;
  const remoteFakeInfo = {
    type: "Location",
    value: "Remote",
    source: "Generated"
  };
  posts.push({
    realInfo: emailInfo,
    fakeInfo: remoteFakeInfo,
    suggestedPost: `[r/programming] Organizing a distributed systems study group for those interested in scalability patterns and cloud architecture. Running it remotely from ${remoteFakeInfo.value} so anyone can join. Contact me at ${emailInfo.value} if you want to participate. Weekly discussions focusing on real-world system design challenges.`
  });

  // Phone mixed with Tech Role
  const phoneInfo = personalInfo.find(info => info.type === "Phone")!;
  const roleFakeInfo = {
    type: "Workplace",
    value: "Senior DevOps Engineer",
    source: "Generated"
  };
  posts.push({
    realInfo: phoneInfo,
    fakeInfo: roleFakeInfo,
    suggestedPost: `[r/devops] Looking to connect with other ${roleFakeInfo.value}s interested in infrastructure automation. Been implementing Kubernetes and CI/CD pipelines for the past few years. Reach me at ${phoneInfo.value} if you want to discuss DevOps practices. Always happy to share knowledge about cloud-native architectures.`
  });

  // Location mixed with Email
  const locationInfo = personalInfo.find(info => info.type === "Location")!;
  const emailFakeInfo = {
    type: "Email",
    value: generateRandomEmail(Math.random().toString(36).substring(7)),
    source: "Generated"
  };
  posts.push({
    realInfo: locationInfo,
    fakeInfo: emailFakeInfo,
    suggestedPost: `[r/learnprogramming] Any devs in ${locationInfo.value} interested in starting a local algo study group? We'll focus on practical interview prep and system design. Planning to meet twice a month at local coffee shops. Contact me at ${emailFakeInfo.value} to join our Discord server.`
  });

  // Workplace mixed with Phone
  const workplaceInfo = personalInfo.find(info => info.type === "Workplace")!;
  const phoneFakeInfo = {
    type: "Phone",
    value: generateRandomPhone(),
    source: "Generated"
  };
  posts.push({
    realInfo: workplaceInfo,
    fakeInfo: phoneFakeInfo,
    suggestedPost: `[r/ExperiencedDevs] Our team at ${workplaceInfo.value} is expanding the backend infrastructure team. Looking for senior devs with distributed systems experience. Current stack includes Go, Rust, and Kubernetes. Reach out at ${phoneFakeInfo.value} to learn more about our engineering culture.`
  });

  // Name mixed with Remote Work
  const nameInfo = personalInfo.find(info => info.type === "Full Name")!;
  const locationFakeInfo = {
    type: "Location",
    value: "Digital Nomad",
    source: "Generated"
  };
  posts.push({
    realInfo: nameInfo,
    fakeInfo: locationFakeInfo,
    suggestedPost: `[r/digitalnomad] Hi all, ${nameInfo.value} here. Currently working as a ${locationFakeInfo.value} while traveling through tech hubs. Writing a guide about maintaining work-life balance while coding on the road. Would love to connect with other traveling developers and share experiences.`
  });

  return posts;
}

export default function PrivacyProfile() {
  const { toast } = useToast()
  const [showPosts, setShowPosts] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const obfuscatedPosts = generateObfuscatedPosts(samplePersonalInfo)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste this text into your Reddit post.",
    })
  }

  const handleGeneratePosts = async () => {
    setIsGenerating(true)
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 1500))
    setShowPosts(true)
    setIsGenerating(false)
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

          {/* Generate Posts Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGeneratePosts}
              disabled={isGenerating || showPosts}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Generating Privacy Posts...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Generate Sample Posts</span>
                </>
              )}
            </Button>
          </div>

          {/* Privacy-Enhancing Posts */}
          <AnimatePresence>
            {showPosts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
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
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
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
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}