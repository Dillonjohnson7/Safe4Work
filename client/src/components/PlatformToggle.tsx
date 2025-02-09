import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FaXTwitter, FaFacebook, FaReddit } from "react-icons/fa6"

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
          className="px-6 py-3 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 data-[state=on]:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in-out border border-gray-200 hover:border-blue-300 rounded-l-full"
        >
          <FaXTwitter className="h-5 w-5 text-blue-400" />
          <span className="ml-2 font-medium">X</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="facebook" 
          aria-label="Toggle Facebook" 
          className="px-6 py-3 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 data-[state=on]:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in-out border-y border-gray-200 hover:border-blue-300"
        >
          <FaFacebook className="h-5 w-5 text-blue-600" />
          <span className="ml-2 font-medium">Facebook</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="reddit" 
          aria-label="Toggle Reddit" 
          className="px-6 py-3 data-[state=on]:bg-orange-50 data-[state=on]:text-orange-600 data-[state=on]:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in-out border border-gray-200 hover:border-orange-300 rounded-r-full"
        >
          <FaReddit className="h-5 w-5 text-orange-500" />
          <span className="ml-2 font-medium">Reddit</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}