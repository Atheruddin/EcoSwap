"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Recycle, Users, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { LiveCounter } from "@/components/live-counter"

export default function HomePage() {
  const [stats, setStats] = useState({
    itemsSwapped: 0,
    carbonSaved: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // Animate stats on load
    const animateStats = () => {
      const targetStats = { itemsSwapped: 12847, carbonSaved: 2.4, activeUsers: 5632 }
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          itemsSwapped: Math.floor(targetStats.itemsSwapped * progress),
          carbonSaved: Number((targetStats.carbonSaved * progress).toFixed(1)),
          activeUsers: Math.floor(targetStats.activeUsers * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)
    }

    animateStats()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-purple-900/30 to-blue-900/30" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 rounded-full glass neon-glow opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "2s" }}>
          <div className="w-16 h-16 rounded-full glass neon-glow-purple opacity-40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: "4s" }}>
          <div className="w-12 h-12 rounded-full glass neon-glow-blue opacity-50" />
        </div>

        {/* Decorative Product Images */}
        <div className="absolute top-32 right-10 hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
          <div className="glass rounded-2xl p-4 neon-glow-blue opacity-60 hover:opacity-80 transition-all duration-500">
            <img
              src="/images/vintage-cameras.jpg"
              alt="Vintage cameras"
              className="w-24 h-24 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="absolute bottom-32 right-32 hidden lg:block animate-float" style={{ animationDelay: "3s" }}>
          <div className="glass rounded-2xl p-4 neon-glow opacity-50 hover:opacity-70 transition-all duration-500">
            <img
              src="/images/ceramic-vase.jpg"
              alt="Ceramic vase"
              className="w-20 h-20 object-cover rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 gradient-text animate-typing overflow-hidden whitespace-nowrap">
            Swap. Save. Sustain.
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join the sustainable revolution. Trade your unwanted items with your community and help save the planet, one
            swap at a time.
          </p>

          <Link href="/explore">
            <Button className="group eco-gradient text-white px-8 py-4 text-lg rounded-full neon-glow hover:scale-110 transition-all duration-300">
              Start Swapping
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <ScrollReveal>
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-strong rounded-2xl p-8 text-center neon-glow hover:scale-105 transition-all duration-300">
                <Recycle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold gradient-text mb-2">
                  <LiveCounter target={stats.itemsSwapped} />
                </h3>
                <p className="text-gray-300">Items Swapped</p>
              </div>

              <div className="glass-strong rounded-2xl p-8 text-center neon-glow-purple hover:scale-105 transition-all duration-300">
                <Leaf className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold gradient-text mb-2">
                  <LiveCounter target={Math.floor(stats.carbonSaved * 10)} suffix="kg" />
                </h3>
                <p className="text-gray-300">CO₂ Saved</p>
              </div>

              <div className="glass-strong rounded-2xl p-8 text-center neon-glow-blue hover:scale-105 transition-all duration-300">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-4xl font-bold gradient-text mb-2">
                  <LiveCounter target={stats.activeUsers} />
                </h3>
                <p className="text-gray-300">Active Users</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Parallax Environmental Section */}
      <ScrollReveal delay={200}>
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-blue-900/20" />

          {/* Parallax Elements */}
          <div className="absolute inset-0 parallax">
            <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-600/20 animate-float" />
            <div
              className="absolute top-40 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/20 animate-float"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 animate-float"
              style={{ animationDelay: "3s" }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl font-bold gradient-text mb-8">Building a Sustainable Future</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
              Every item you swap reduces waste, saves resources, and brings us closer to a circular economy. Join
              thousands of eco-warriors making a difference in their communities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🌱", title: "Reduce Waste", desc: "Keep items out of landfills" },
                { icon: "♻️", title: "Circular Economy", desc: "Give items a second life" },
                { icon: "🌍", title: "Save Planet", desc: "Reduce carbon footprint" },
                { icon: "🤝", title: "Build Community", desc: "Connect with neighbors" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-6 hover:glass-strong hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal delay={400}>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="glass-strong rounded-3xl p-12 neon-glow max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold gradient-text mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Start your sustainable journey today. Post your first item or browse what's available in your community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/post">
                  <Button className="eco-gradient text-white px-8 py-3 rounded-full neon-glow hover:scale-105 transition-all duration-300">
                    Post an Item
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    variant="outline"
                    className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 px-8 py-3 rounded-full transition-all duration-300 bg-transparent"
                  >
                    Browse Items
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-gray-900 px-8 py-3 rounded-full transition-all duration-300 bg-transparent"
                  >
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
