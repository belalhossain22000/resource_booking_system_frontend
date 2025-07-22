"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  Star,
  Heart,
  Rocket,
  Target,
} from "lucide-react"
import { useCreateBookingMutation, useGetBookingsQuery } from "@/redux/api/bookingApi"
import { validateBooking } from "@/lib/utils"
import { BOOKING_RULES, RESOURCES } from "@/constants/resources"


export function NewBookingPage() {
  const { data: existingBookings = [] } = useGetBookingsQuery()
  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation()

  const [formData, setFormData] = useState({
    resource: "",
    startTime: "",
    endTime: "",
    requestedBy: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitSuccess(false)

    const validationErrors = validateBooking(
      formData,
      existingBookings,
      BOOKING_RULES.BUFFER_MINUTES,
      BOOKING_RULES.MAX_DURATION_HOURS,
    )
    setErrors(validationErrors)

    if (validationErrors.length > 0) {
      return
    }

    try {
      await createBooking(formData).unwrap()

      // Reset form
      setFormData({
        resource: "",
        startTime: "",
        endTime: "",
        requestedBy: "",
      })

      setSubmitSuccess(true)
      setErrors([])

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      setErrors(["Failed to create booking. Please try again."])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const getDurationInfo = () => {
    if (formData.startTime && formData.endTime) {
      const durationMinutes =
        (new Date(formData.endTime).getTime() - new Date(formData.startTime).getTime()) / (1000 * 60)
      const hours = Math.floor(durationMinutes / 60)
      const minutes = durationMinutes % 60

      return {
        duration: durationMinutes,
        formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
        isValid:
          durationMinutes >= BOOKING_RULES.MIN_DURATION_MINUTES &&
          durationMinutes <= BOOKING_RULES.MAX_DURATION_HOURS * 60,
      }
    }
    return null
  }

  const durationInfo = getDurationInfo()

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slide-in-left">
      {/* Epic Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-purple-600/30 to-pink-600/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-pink-500/20 rounded-full blur-3xl morph-1"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl morph-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse-slow"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-8 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-75 animate-pulse-slow"></div>
              <div className="relative p-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl shadow-2xl">
                <Rocket className="h-12 w-12 text-white animate-bounce-gentle" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black mb-4 animate-rainbow">Create Epic Booking! 🚀</h1>
              <p className="text-2xl text-white/90 font-bold mb-4">
                Reserve your perfect space with AI-powered magic ✨
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold animate-bounce-gentle">
                  🎯 Smart Conflict Detection
                </span>
                <span
                  className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold animate-bounce-gentle"
                  style={{ animationDelay: "0.2s" }}
                >
                  ⚡ Instant Booking
                </span>
                <span
                  className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold animate-bounce-gentle"
                  style={{ animationDelay: "0.4s" }}
                >
                  🌟 Premium Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-0 glass-strong overflow-hidden animate-zoom-in shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 border-b border-white/10 p-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>
              <div className="relative p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-2xl">
                <Target className="h-8 w-8 text-white animate-wiggle" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                Booking Details
                <Star className="h-8 w-8 text-yellow-400 animate-bounce-gentle" />
              </CardTitle>
              <CardDescription className="text-xl text-white/80 font-semibold mt-2">
                🎨 Maximum duration: {BOOKING_RULES.MAX_DURATION_HOURS} hours • 🛡️ Buffer time:{" "}
                {BOOKING_RULES.BUFFER_MINUTES} minutes
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-12 space-y-10">
          {submitSuccess && (
            <Alert className="border-0 glass bg-gradient-to-r from-green-500/20 to-emerald-500/20 animate-bounce-in p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <AlertDescription className="text-white font-bold text-xl">
                    🎉 BOOM! Booking created successfully!
                  </AlertDescription>
                  <p className="text-white/80 font-medium mt-1">Check your dashboard to see the magic happen ✨</p>
                </div>
              </div>
            </Alert>
          )}

          {errors.length > 0 && (
            <Alert
              variant="destructive"
              className="border-0 glass bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-slide-in-left p-6 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <AlertDescription className="text-white font-bold text-lg">
                    🚨 Oops! Let's fix these issues:
                  </AlertDescription>
                  <ul className="list-disc list-inside space-y-2 mt-3 text-white/90">
                    {errors.map((error, index) => (
                      <li key={index} className="font-medium">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4 animate-slide-in-left">
                <Label htmlFor="resource" className="flex items-center gap-3 text-xl font-bold text-white">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Choose Your Space 🏢
                </Label>
                <Select value={formData.resource} onValueChange={(value) => handleInputChange("resource", value)}>
                  <SelectTrigger className="h-16 text-lg border-2 border-white/20 glass rounded-2xl focus:border-blue-500 transition-all duration-300 hover:scale-105">
                    <SelectValue placeholder="🎯 Select your perfect resource" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20 rounded-2xl">
                    {RESOURCES.map((resource, index) => (
                      <SelectItem key={resource} value={resource} className="text-lg py-4 rounded-xl hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                          <span className="font-semibold">{resource}</span>
                          <span className="text-lg">
                            {index === 0 ? "🏛️" : index === 1 ? "🏢" : index === 2 ? "🏠" : index === 3 ? "📽️" : "🎥"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 animate-slide-in-right">
                <Label htmlFor="requestedBy" className="flex items-center gap-3 text-xl font-bold text-white">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  Your Name 👤
                </Label>
                <Input
                  id="requestedBy"
                  type="text"
                  placeholder="✨ Enter your awesome name"
                  value={formData.requestedBy}
                  onChange={(e) => handleInputChange("requestedBy", e.target.value)}
                  className="h-16 text-lg border-2 border-white/20 glass rounded-2xl focus:border-green-500 transition-all duration-300 hover:scale-105 placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                <Label htmlFor="startTime" className="flex items-center gap-3 text-xl font-bold text-white">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg">
                    <CalendarDays className="h-6 w-6 text-white" />
                  </div>
                  Start Time 🚀
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  className="h-16 text-lg border-2 border-white/20 glass rounded-2xl focus:border-purple-500 transition-all duration-300 hover:scale-105"
                />
              </div>

              <div className="space-y-4 animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                <Label htmlFor="endTime" className="flex items-center gap-3 text-xl font-bold text-white">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  End Time ⏰
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="h-16 text-lg border-2 border-white/20 glass rounded-2xl focus:border-orange-500 transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>

            {durationInfo && (
              <Card
                className={`border-2 transition-all duration-500 animate-zoom-in glass ${
                  durationInfo.isValid
                    ? "border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"
                    : "border-red-500/50 bg-gradient-to-r from-red-500/10 to-pink-500/10"
                } rounded-2xl overflow-hidden`}
              >
                <CardContent className="p-8">
                  <div
                    className={`flex items-center gap-6 text-2xl font-bold ${
                      durationInfo.isValid ? "text-blue-200" : "text-red-200"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl ${durationInfo.isValid ? "bg-blue-500" : "bg-red-500"} shadow-2xl animate-glow`}
                    >
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <span>Duration: {durationInfo.formatted}</span>
                      <span className="text-3xl ml-3 animate-bounce-gentle">{durationInfo.isValid ? "⚡" : "❌"}</span>
                    </div>
                  </div>
                  <p
                    className={`text-lg mt-4 font-semibold ${durationInfo.isValid ? "text-blue-300" : "text-red-300"}`}
                  >
                    {durationInfo.isValid
                      ? `🎉 Perfect! A ${BOOKING_RULES.BUFFER_MINUTES}-minute buffer will be automatically applied for maximum awesomeness!`
                      : `⚠️ Duration must be between ${BOOKING_RULES.MIN_DURATION_MINUTES} minutes and ${BOOKING_RULES.MAX_DURATION_HOURS} hours for the best experience.`}
                  </p>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              className="w-full h-20 text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 focus-ring rounded-2xl border-0 animate-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Creating your epic booking...</span>
                  <Sparkles className="h-8 w-8 animate-bounce-gentle" />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Rocket className="h-8 w-8 animate-bounce-gentle" />
                  <span>🚀 CREATE EPIC BOOKING! 🚀</span>
                  <Heart className="h-8 w-8 animate-bounce-gentle text-pink-300" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Fun Stats Section */}
      <div className="grid gap-6 md:grid-cols-3 animate-slide-in-left" style={{ animationDelay: "0.6s" }}>
        <Card className="glass-strong border-0 hover-lift rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 animate-bounce-gentle">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-white/70">Book in under 30 seconds!</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 hover-lift rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 animate-bounce-gentle" style={{ animationDelay: "0.2s" }}>
              🛡️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Protection</h3>
            <p className="text-white/70">AI-powered conflict detection</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 hover-lift rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 animate-bounce-gentle" style={{ animationDelay: "0.4s" }}>
              🌟
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Experience</h3>
            <p className="text-white/70">Beautiful, modern interface</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
