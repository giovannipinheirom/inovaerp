import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback: string
}

export function Avatar({ className, src, fallback, ...props }: AvatarProps) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100", className)} {...props}>
      {src ? (
        <img src={src} className="aspect-square h-full w-full object-cover" alt="Avatar" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-primary-light text-primary font-medium text-sm">
          {fallback}
        </span>
      )}
    </div>
  )
}
