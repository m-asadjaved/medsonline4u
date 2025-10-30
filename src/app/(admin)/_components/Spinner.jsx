import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Spinner({ className, ...props }) {
  return (
    <div className="flex items-center justify-center min-h-full gap-4">
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-7 animate-spin", className)}
      {...props}
      />
    </div>
  )
}