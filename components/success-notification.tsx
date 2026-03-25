"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

interface SuccessNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function SuccessNotification({ message, isVisible, onClose, duration = 5000 }: SuccessNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !show) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-green-900/90 border border-green-500/50 text-green-100 rounded-lg p-4 backdrop-blur-sm flex items-center space-x-3 min-w-[300px]">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setShow(false)
            setTimeout(onClose, 300)
          }}
          className="text-green-400 hover:text-green-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
