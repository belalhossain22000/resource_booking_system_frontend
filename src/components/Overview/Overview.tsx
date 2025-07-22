"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CalendarDays,
    Clock,
    MapPin,
    Trash2,
    TrendingUp,
    Loader2,
    Activity,
    Users,
    Star,
    Sparkles,
    Heart,
    Target,
    Rocket,
} from "lucide-react"


import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDateTime } from "@/lib/utils"
import { useDeleteBookingMutation, useGetBookingsQuery } from "@/redux/api/bookingApi"

export function OverviewPage() {
    const { data: bookings = [], isLoading, error } = useGetBookingsQuery()
    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation()

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
                        <h3 className="text-2xl font-bold text-gradient mb-2">Loading Magic ✨</h3>
                        <p className="text-white/70 font-medium">Preparing your awesome dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive" className="glass border-red-500/50 animate-slide-in-left">
                <AlertDescription className="text-red-200">
                    🚨 Oops! Something went wrong. Please try refreshing the page.
                </AlertDescription>
            </Alert>
        )
    }

    const now = new Date()
    const upcomingBookings = bookings.filter((booking: any) => new Date(booking.startTime) > now)
    const ongoingBookings = bookings.filter((booking: any) => {
        const start = new Date(booking.startTime)
        const end = new Date(booking.endTime)
        return now >= start && now <= end
    })
    const todayBookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.startTime).toDateString()
        return bookingDate === now.toDateString()
    })

    const uniqueResources = new Set(bookings.map((booking: any) => booking.resource)).size

    const handleDelete = async (bookingId: string) => {
        try {
            await deleteBooking(bookingId).unwrap()
        } catch (error) {
            console.error("Failed to delete booking:", error)
        }
    }

    const statsCards = [
        {
            title: "Total Bookings",
            value: bookings.length,
            description: "All time bookings",
            icon: CalendarDays,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            change: "+12%",
            emoji: "📊",
            bgPattern: "morph-1",
        },
        {
            title: "Active Now",
            value: ongoingBookings.length,
            description: "Currently ongoing",
            icon: Activity,
            gradient: "from-green-400 via-emerald-500 to-teal-600",
            change: "+5%",
            emoji: "🔥",
            bgPattern: "morph-2",
        },
        {
            title: "Today's Bookings",
            value: todayBookings.length,
            description: "Scheduled for today",
            icon: TrendingUp,
            gradient: "from-orange-400 via-red-500 to-pink-600",
            change: "+8%",
            emoji: "⚡",
            bgPattern: "morph-1",
        },
        {
            title: "Resources",
            value: uniqueResources,
            description: "Available resources",
            icon: MapPin,
            gradient: "from-purple-500 via-violet-500 to-indigo-600",
            change: "0%",
            emoji: "🏆",
            bgPattern: "morph-2",
        },
    ]

    return (
        <div className="space-y-12 animate-slide-in-left">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl glass-strong p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-blue-600/30"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-pink-500/20 rounded-full blur-3xl morph-1"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl morph-2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl blur-lg opacity-75 animate-pulse-slow"></div>
                            <div className="relative p-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl shadow-2xl">
                                <Rocket className="h-10 w-10 text-white animate-bounce-gentle" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2 animate-rainbow">Welcome back, Superstar! 🌟</h1>
                            <p className="text-xl text-white/90 font-medium">
                                Your booking empire awaits. Let's make today amazing! ✨
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold animate-bounce-gentle">
                            🎯 {bookings.length} Total Bookings
                        </Badge>
                        <Badge
                            className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold animate-bounce-gentle"
                            style={{ animationDelay: "0.2s" }}
                        >
                            ⚡ {ongoingBookings.length} Active Now
                        </Badge>
                        <Badge
                            className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-semibold animate-bounce-gentle"
                            style={{ animationDelay: "0.4s" }}
                        >
                            🚀 System Online
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Colorful Stats Cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className="group relative overflow-hidden border-0 glass-strong hover-lift animate-zoom-in shadow-2xl"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 ${stat.bgPattern}`}></div>
                        <div
                            className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}
                        ></div>

                        <CardHeader className="relative z-10 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-white/80 uppercase tracking-wider">{stat.title}</CardTitle>
                                <div
                                    className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="relative z-10">
                            <div className="flex items-end justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl font-black text-white">{stat.value}</div>
                                    <div className="text-3xl animate-bounce-gentle">{stat.emoji}</div>
                                </div>
                                <Badge
                                    className={`bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 font-bold animate-glow`}
                                >
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className="text-sm text-white/70 font-medium">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Enhanced Booking Sections */}
            <div className="grid gap-10 xl:grid-cols-2">
                {/* Upcoming Bookings */}
                <Card className="group border-0 glass-strong hover-lift animate-slide-in-left shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-t-3xl border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>
                                <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-2xl">
                                    <Clock className="h-7 w-7 text-white" />
                                </div>
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                    Upcoming Bookings
                                    <Sparkles className="h-6 w-6 text-yellow-400 animate-wiggle" />
                                </CardTitle>
                                <CardDescription className="text-white/70 text-base font-medium">
                                    🚀 Next scheduled adventures
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-6">
                        {upcomingBookings.slice(0, 5).map((booking: any, index: number) => (
                            <div
                                key={booking.id}
                                className="group/item relative overflow-hidden rounded-2xl glass p-6 hover-lift animate-zoom-in border border-white/10"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 font-bold px-4 py-1 animate-glow">
                                                ⏰ Upcoming
                                            </Badge>
                                            <span className="font-bold text-xl text-white">{booking.resource}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/80">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-400" />
                                                <span className="font-medium">{booking.requestedBy}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-400" />
                                                <span className="font-medium">{formatDateTime(booking.startTime)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(booking.id)}
                                        disabled={isDeleting}
                                        className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl border border-red-500/30 hover:scale-110"
                                    >
                                        {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {upcomingBookings.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center animate-bounce-gentle">
                                    <CalendarDays className="h-12 w-12 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No upcoming bookings</h3>
                                <p className="text-white/70">Time to plan your next adventure! 🚀</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Active Bookings */}
                <Card className="group border-0 glass-strong hover-lift animate-slide-in-right shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-t-3xl border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-75 animate-pulse-slow"></div>
                                <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-2xl">
                                    <Activity className="h-7 w-7 text-white animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                    Active Now
                                    <Target className="h-6 w-6 text-green-400 animate-wiggle" />
                                </CardTitle>
                                <CardDescription className="text-white/70 text-base font-medium">
                                    🔥 Currently happening
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-6">
                        {ongoingBookings.map((booking: any, index: number) => (
                            <div
                                key={booking.id}
                                className="group/item relative overflow-hidden rounded-2xl glass p-6 hover-lift animate-zoom-in border border-green-500/30"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-bold px-4 py-1 animate-pulse">
                                                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>🔴 LIVE
                                            </Badge>
                                            <span className="font-bold text-xl text-white">{booking.resource}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/80">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-green-400" />
                                                <span className="font-medium">{booking.requestedBy}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                            <div className="flex items-center gap-2">
                                                <Heart className="h-4 w-4 text-red-400 animate-bounce-gentle" />
                                                <span className="font-medium">Until {formatDateTime(booking.endTime)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(booking.id)}
                                        disabled={isDeleting}
                                        className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl border border-red-500/30 hover:scale-110"
                                    >
                                        {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {ongoingBookings.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center animate-bounce-gentle">
                                    <Activity className="h-12 w-12 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No active bookings</h3>
                                <p className="text-white/70">All quiet on the booking front! 😴</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
