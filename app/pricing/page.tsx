"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import SubscriptionForm from "@/components/subscription-form"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "starter" | "pro" | null>(null)

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: ["Up to 5 swaps per month", "Basic item listings", "Community access", "Email support"],
      cta: "Get Started",
      highlighted: false,
    },
    {
      id: "starter",
      name: "Starter",
      price: "₹1",
      period: "/7 days",
      description: "Try premium features",
      planId: "plan_RoHn0jQZpDxeeY",
      amount: 100, // ₹1 in paise
      features: ["Unlimited swaps for 7 days", "Featured item listings", "Priority support", "Advanced search filters"],
      cta: "Start Trial",
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹199",
      period: "/month",
      description: "For serious swapers",
      planId: "plan_RoGZIOzKvXu7R8",
      amount: 19900, // ₹199 in paise
      features: [
        "Unlimited swaps",
        "Featured item listings",
        "Priority support",
        "Advanced search filters",
        "Swap history analytics",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
  ]

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">Plans and Pricing</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get started immediately for free. Try our Starter plan or upgrade to Pro for unlimited swaps and featured
            listings.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.highlighted ? "glass-strong neon-glow md:scale-105" : "glass hover:glass-strong"
              }`}
            >
              {/* Recommended Badge */}
              {plan.highlighted && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div className="p-8 flex flex-col h-full">
                {/* Plan Name and Price */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-emerald-400">{plan.price}</span>
                    {plan.period && <span className="text-gray-400">{plan.period}</span>}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {plan.id === "basic" ? (
                  <Link href="/explore">
                    <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 transition-all duration-300">
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => setSelectedPlan(plan.id as "starter" | "pro")}
                    className={`w-full rounded-lg py-3 transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? "eco-gradient text-white neon-glow"
                        : "eco-gradient text-white hover:scale-105"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Form Modal */}
        {selectedPlan && selectedPlan !== "basic" && (
          <SubscriptionForm
            planId={plans.find((p) => p.id === selectedPlan)?.planId || ""}
            amount={plans.find((p) => p.id === selectedPlan)?.amount || 0}
            planName={plans.find((p) => p.id === selectedPlan)?.name || ""}
            price={plans.find((p) => p.id === selectedPlan)?.price || ""}
            onClose={() => setSelectedPlan(null)}
          />
        )}
      </div>
    </div>
  )
}
