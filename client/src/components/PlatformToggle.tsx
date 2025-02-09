import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FaTwitter, FaFacebook, FaReddit } from "react-icons/fa"

export type Platform = "twitter" | "facebook" | "reddit"

interface PlatformToggleProps {
  selectedPlatform: Platform
  onPlatformChange: (platform: Platform) => void
}

export default function PlatformToggle({ selectedPlatform, onPlatformChange }: PlatformToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <ToggleGroup type="single" value={selectedPlatform} onValueChange={(value) => value && onPlatformChange(value as Platform)}>
        <ToggleGroupItem 
          value="twitter" 
          aria-label="Toggle Twitter" 
          className="px-6 py-3 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 hover:bg-gray-50 transition-all duration-200"
        >
          <FaTwitter className="h-5 w-5 text-blue-400" />
          <span className="ml-2 font-medium">Twitter</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="facebook" 
          aria-label="Toggle Facebook" 
          className="px-6 py-3 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 hover:bg-gray-50 transition-all duration-200"
        >
          <FaFacebook className="h-5 w-5 text-blue-600" />
          <span className="ml-2 font-medium">Facebook</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="reddit" 
          aria-label="Toggle Reddit" 
          className="px-6 py-3 data-[state=on]:bg-orange-50 data-[state=on]:text-orange-600 hover:bg-gray-50 transition-all duration-200"
        >
          <FaReddit className="h-5 w-5 text-orange-500" />
          <span className="ml-2 font-medium">Reddit</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}