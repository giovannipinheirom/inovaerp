import * as React from "react"
import { cn } from "@/lib/utils"

export function Toast({ message, type = 'info' }: { message: string, type?: 'success' | 'error' | 'warning' | 'info' }) {
  const bg = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-white',
    info: 'bg-primary text-white'
  }
  return (
    <div className={cn("fixed bottom-4 right-4 p-4 rounded-md shadow-lg", bg[type])}>
      {message}
    </div>
  )
}
