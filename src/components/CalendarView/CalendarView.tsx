"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Trash2, Loader2, Calendar, Star } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDeleteBookingMutation, useGetBookingsQuery } from "@/redux/api/bookingApi"

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Resource colors for consistent theming
const RESOURCE_COLORS = {
  "Conference Room A": {
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-800 dark:text-red-200",
    gradient: "from-red-400 to-red-600",
  },
  "Conference Room B": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-800 dark:text-blue-200",
    gradient: "from-blue-400 to-blue-600",
  },
  "Meeting Room B": {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-300 dark:border-green-700",
    text: "text-green-800 dark:text-green-200",
    gradient: "from-green-400 to-green-600",
  },
  Projector: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-700",
    text: "text-purple-800 dark:text-purple-200",
    gradient: "from-purple-400 to-purple-600",
  },
  "Presentation Equipment": {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    border: "border-yellow-300 dark:border-yellow-700",
    text: "text-yellow-800 dark:text-yellow-200",
    gradient: "from-yellow-400 to-yellow-600",
  },
}

export function CalendarView() {
  const { data: bookings = [], isLoading, error } = useGetBookingsQuery()
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation()
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Get the start of the current week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const weekStart = getWeekStart(currentWeek)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    return day
  })

  // Filter bookings for current week
  const weekBookings = useMemo(() => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startTime)
      return bookingDate >= weekStart && bookingDate < weekEnd
    })
  }, [bookings, weekStart])

  // Group bookings by day and hour
  const bookingsByDayAndHour = useMemo(() => {
    const grouped: Record<string, Record<number, typeof bookings>> = {}

    weekDays.forEach((day) => {
      const dayKey = day.toDateString()
      grouped[dayKey] = {}

      HOURS.forEach((hour) => {
        grouped[dayKey][hour] = weekBookings.filter((booking) => {
          const bookingDate = new Date(booking.startTime)
          const bookingStartHour = bookingDate.getHours()
          const bookingEndHour = new Date(booking.endTime).getHours()

          return bookingDate.toDateString() === dayKey && bookingStartHour <= hour && bookingEndHour > hour
        })
      })
    })

    return grouped
  }, [weekBookings, weekDays])

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    return `${weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${weekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
  }

  const getBookingStatus = (startTime: string, endTime: string) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now > end) return "past"
    if (now >= start && now <= end) return "ongoing"
    return "upcoming"
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const handleDelete = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId).unwrap()
    } catch (error) {
      console.error("Failed to delete booking:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gradient mb-2">Loading Calendar ✨</h3>
            <p className="text-white/70 font-medium">Preparing your weekly view...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="glass border-red-500/50 animate-slide-in-left">
        <AlertDescription className="text-red-200">
          🚨 Failed to load calendar. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8 animate-slide-in-left">
      {/* Header */}
      <Card className="border-0 glass-strong shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-t-3xl border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                  📅 Weekly Calendar
                  <Star className="h-8 w-8 text-yellow-400 animate-bounce-gentle" />
                </CardTitle>
                <p className="text-xl text-white/80 font-semibold mt-1">{formatWeekRange()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigateWeek("prev")}
                className="glass border-white/20 hover:bg-white/10 text-white hover:text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentWeek(new Date())}
                className="glass border-white/20 hover:bg-white/10 text-white hover:text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigateWeek("next")}
                className="glass border-white/20 hover:bg-white/10 text-white hover:text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b border-white/10">
                <div className="p-4 text-center font-semibold text-white/80 bg-gradient-to-r from-gray-500/10 to-gray-600/10">
                  Time
                </div>
                {weekDays.map((day, index) => (
                  <div
                    key={day.toDateString()}
                    className={`p-4 text-center font-semibold transition-all duration-300 ${
                      isToday(day)
                        ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border-b-2 border-blue-400"
                        : "text-white/80 bg-gradient-to-r from-gray-500/10 to-gray-600/10"
                    }`}
                  >
                    <div className="text-sm font-medium">{DAYS[index]}</div>
                    <div className={`text-2xl font-bold mt-1 ${isToday(day) ? "text-blue-200" : "text-white"}`}>
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-white/5 min-h-[120px]">
                  {/* Time Column */}
                  <div className="p-4 text-center font-semibold text-white/70 bg-gradient-to-r from-gray-500/5 to-gray-600/5 border-r border-white/10 flex items-center justify-center">
                    <div className="text-lg">
                      {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                  </div>

                  {/* Day Columns */}
                  {weekDays.map((day) => {
                    const dayKey = day.toDateString()
                    const hourBookings = bookingsByDayAndHour[dayKey]?.[hour] || []

                    return (
                      <div
                        key={`${dayKey}-${hour}`}
                        className={`relative p-2 border-r border-white/5 min-h-[120px] transition-all duration-300 ${
                          isToday(day) ? "bg-blue-500/5" : "hover:bg-white/5"
                        }`}
                      >
                        {hourBookings.map((booking) => {
                          const status = getBookingStatus(booking.startTime, booking.endTime)
                          const resourceColor =
                            RESOURCE_COLORS[booking.resource as keyof typeof RESOURCE_COLORS] ||
                            RESOURCE_COLORS["Conference Room A"]

                          return (
                            <div
                              key={booking.id}
                              className={`group relative mb-2 p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-zoom-in ${resourceColor.bg} ${resourceColor.border}`}
                            >
                              <div className="space-y-1">
                                <div className={`font-bold text-sm ${resourceColor.text}`}>{booking.resource}</div>
                                <div className={`text-xs font-medium ${resourceColor.text}`}>{booking.requestedBy}</div>
                                <div className={`text-xs ${resourceColor.text}`}>
                                  {new Date(booking.startTime).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <Badge
                                  className={`text-xs font-bold px-2 py-1 ${
                                    status === "past"
                                      ? "bg-gray-500 text-white"
                                      : status === "ongoing"
                                        ? "bg-green-500 text-white animate-pulse"
                                        : "bg-blue-500 text-white"
                                  }`}
                                >
                                  {status === "ongoing" ? "🔴 LIVE" : status}
                                </Badge>
                              </div>

                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(booking.id)}
                                disabled={isDeleting}
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-500/20 hover:bg-red-500/30 text-red-600 hover:text-red-700 rounded-lg"
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="lg:hidden space-y-6">
        {weekDays.map((day, index) => {
          const dayKey = day.toDateString()
          const dayBookings = weekBookings.filter((booking) => {
            const bookingDate = new Date(booking.startTime)
            return bookingDate.toDateString() === dayKey
          })

          return (
            <Card
              key={dayKey}
              className={`border-0 glass-strong ${isToday(day) ? "border-l-4 border-l-blue-500" : ""}`}
            >
              <CardHeader
                className={`${isToday(day) ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20" : "bg-gradient-to-r from-gray-500/10 to-gray-600/10"} rounded-t-2xl`}
              >
                <CardTitle className="text-xl flex items-center justify-between text-white">
                  <span className="flex items-center gap-3">
                    {DAYS[index]}, {day.getDate()}
                    {isToday(day) && <span className="text-2xl animate-bounce-gentle">📅</span>}
                  </span>
                  <Badge variant="outline" className="text-white border-white/30">
                    {dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {dayBookings.length === 0 ? (
                  <p className="text-center text-white/70 py-8">No bookings for this day</p>
                ) : (
                  dayBookings.map((booking) => {
                    const status = getBookingStatus(booking.startTime, booking.endTime)
                    const resourceColor =
                      RESOURCE_COLORS[booking.resource as keyof typeof RESOURCE_COLORS] ||
                      RESOURCE_COLORS["Conference Room A"]

                    return (
                      <div
                        key={booking.id}
                        className={`group p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${resourceColor.bg} ${resourceColor.border}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className={`font-bold ${resourceColor.text}`}>{booking.resource}</div>
                            <div className={`text-sm ${resourceColor.text}`}>
                              {new Date(booking.startTime).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(booking.endTime).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className={`text-sm font-medium ${resourceColor.text}`}>{booking.requestedBy}</div>
                            <Badge
                              className={`text-xs font-bold ${
                                status === "past"
                                  ? "bg-gray-500 text-white"
                                  : status === "ongoing"
                                    ? "bg-green-500 text-white animate-pulse"
                                    : "bg-blue-500 text-white"
                              }`}
                            >
                              {status === "ongoing" ? "🔴 LIVE" : status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(booking.id)}
                            disabled={isDeleting}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
