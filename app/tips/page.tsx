"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Leaf, Recycle, Lightbulb, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

interface EcoTip {
  id: number
  title: string
  description: string
  icon: string
  category: "reduce" | "reuse" | "recycle" | "energy"
  impact: string
  color: string
}

const ecoTips: EcoTip[] = [
  {
    id: 1,
    title: "Swap Instead of Shop",
    description:
      "Before buying new items, check if someone in your community has what you need. Swapping reduces manufacturing demand and saves money!",
    icon: "🔄",
    category: "reuse",
    impact: "Saves 2.3kg CO₂ per item",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: 2,
    title: "Repair Before Replace",
    description:
      "Learn basic repair skills for clothes, electronics, and furniture. YouTube tutorials can help you fix almost anything!",
    icon: "🔧",
    category: "reduce",
    impact: "Extends item life by 5+ years",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Digital Declutter",
    description:
      "Unsubscribe from emails you don't read, delete unused apps, and organize your digital files. Less digital clutter = less energy consumption.",
    icon: "📱",
    category: "energy",
    impact: "Reduces data usage by 30%",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "Upcycle Creatively",
    description:
      "Transform old items into something new and beautiful. Glass jars become planters, old t-shirts become cleaning rags!",
    icon: "🎨",
    category: "reuse",
    impact: "Prevents 1.5kg waste per project",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 5,
    title: "Energy-Smart Habits",
    description:
      "Unplug devices when not in use, use LED bulbs, and adjust your thermostat by 2°C. Small changes make a big difference!",
    icon: "⚡",
    category: "energy",
    impact: "Saves 15% on energy bills",
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: 6,
    title: "Mindful Consumption",
    description:
      "Ask yourself: Do I really need this? Can I borrow it? Is there a sustainable alternative? Pause before purchasing.",
    icon: "🧠",
    category: "reduce",
    impact: "Reduces purchases by 40%",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: 7,
    title: "Community Sharing",
    description:
      "Share tools, books, and equipment with neighbors. Create or join local sharing groups to reduce individual ownership needs.",
    icon: "🤝",
    category: "reuse",
    impact: "Saves $500+ per year",
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: 8,
    title: "Proper Recycling",
    description:
      "Learn your local recycling rules. Clean containers, separate materials correctly, and find special recycling centers for electronics.",
    icon: "♻️",
    category: "recycle",
    impact: "Increases recycling efficiency by 60%",
    color: "from-green-500 to-emerald-600",
  },
]

const funFacts = [
  "🌍 The average person throws away 4.5 pounds of trash daily",
  "📱 It takes 1,000 years for a phone to decompose naturally",
  "👕 One cotton t-shirt uses 2,700 liters of water to produce",
  "🚗 Sharing economy reduces car ownership by 23% in urban areas",
  "📚 One book shared 10 times saves 15kg of CO₂ emissions",
  "🏠 Swapping household items can save families $1,200 annually",
]

export default function EcoTipsPage() {
  const [currentTip, setCurrentTip] = useState(0)
  const [currentFact, setCurrentFact] = useState(0)

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length)
    }, 4000)

    return () => clearInterval(factInterval)
  }, [])

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % ecoTips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + ecoTips.length) % ecoTips.length)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "reduce":
        return <Leaf className="w-5 h-5" />
      case "reuse":
        return <Recycle className="w-5 h-5" />
      case "recycle":
        return <Recycle className="w-5 h-5" />
      case "energy":
        return <Lightbulb className="w-5 h-5" />
      default:
        return <Heart className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "reduce":
        return "text-green-400 bg-green-400/20"
      case "reuse":
        return "text-blue-400 bg-blue-400/20"
      case "recycle":
        return "text-emerald-400 bg-emerald-400/20"
      case "energy":
        return "text-yellow-400 bg-yellow-400/20"
      default:
        return "text-purple-400 bg-purple-400/20"
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Eco Tips</h1>
          <p className="text-xl text-gray-300">Daily tips for a sustainable lifestyle</p>
        </div>

        {/* Fun Facts Ticker */}
        <div className="glass-strong rounded-2xl p-4 mb-8 overflow-hidden">
          <div className="flex items-center justify-center">
            <span className="text-emerald-400 font-semibold mr-4">💡 Fun Fact:</span>
            <div className="relative h-6 overflow-hidden">
              <div
                className="transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateY(-${currentFact * 24}px)` }}
              >
                {funFacts.map((fact, index) => (
                  <div key={index} className="h-6 flex items-center text-white">
                    {fact}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Tip Carousel */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="glass-strong rounded-3xl overflow-hidden">
            <div className={`h-96 bg-gradient-to-br ${ecoTips[currentTip].color} relative`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 text-6xl animate-float">{ecoTips[currentTip].icon}</div>
                <div className="absolute bottom-10 right-10 text-4xl animate-float" style={{ animationDelay: "2s" }}>
                  {ecoTips[currentTip].icon}
                </div>
              </div>

              <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                <div className="text-center">
                  {/* Category Badge */}
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full mb-6 ${getCategoryColor(ecoTips[currentTip].category)}`}
                  >
                    {getCategoryIcon(ecoTips[currentTip].category)}
                    <span className="ml-2 font-medium capitalize">{ecoTips[currentTip].category}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-8xl mb-6 animate-float">{ecoTips[currentTip].icon}</div>

                  {/* Title */}
                  <h2 className="text-4xl font-bold text-white mb-4">{ecoTips[currentTip].title}</h2>

                  {/* Description */}
                  <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">{ecoTips[currentTip].description}</p>

                  {/* Impact */}
                  <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full">
                    <span className="text-white font-semibold">💚 Impact: {ecoTips[currentTip].impact}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 bg-black/20">
              <Button onClick={prevTip} variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/10">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {ecoTips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTip(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTip ? "bg-white neon-glow" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <Button onClick={nextTip} variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/10">
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tips Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecoTips.map((tip, index) => (
              <ScrollReveal key={tip.id} delay={index * 150}>
                <button
                  onClick={() => setCurrentTip(index)}
                  className={`glass rounded-xl p-6 text-left hover:glass-strong hover:scale-105 transition-all duration-300 ${
                    index === currentTip ? "neon-glow ring-2 ring-emerald-400/50" : ""
                  }`}
                >
                  {/* Category Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs mb-4 ${getCategoryColor(tip.category)}`}
                  >
                    {getCategoryIcon(tip.category)}
                    <span className="ml-1 capitalize">{tip.category}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-3">{tip.icon}</div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>

                  {/* Description Preview */}
                  <p className="text-sm text-gray-300 line-clamp-3 mb-3">{tip.description}</p>

                  {/* Impact */}
                  <div className="text-xs text-emerald-400 font-medium">💚 {tip.impact}</div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass-strong rounded-3xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold gradient-text mb-6">Start Your Eco Journey Today</h2>
            <p className="text-xl text-gray-300 mb-8">
              Every small action counts. Join our community and make a positive impact on the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="eco-gradient text-white px-8 py-3 rounded-full neon-glow hover:scale-105 transition-all duration-300">
                Join EcoSwap Community
              </Button>
              <Button
                variant="outline"
                className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 px-8 py-3 rounded-full"
              >
                Share Your Tips
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
