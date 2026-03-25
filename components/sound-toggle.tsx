"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    // Load sound preference from localStorage
    const savedPreference = localStorage.getItem("soundEnabled")
    if (savedPreference !== null) {
      setSoundEnabled(JSON.parse(savedPreference))
    }
  }, [])

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem("soundEnabled", JSON.stringify(newState))
  }

  const playSound = (type: "success" | "error" | "click") => {
    if (!soundEnabled) return

    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different frequencies for different sound types
    switch (type) {
      case "success":
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
        break
      case "error":
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1)
        break
      case "click":
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
        break
    }

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSound}
      className="text-gray-400 hover:text-white"
      title={soundEnabled ? "Disable sounds" : "Enable sounds"}
    >
      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </Button>
  )
}
