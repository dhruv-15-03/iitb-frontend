"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, GraduationCap, Users, Plus, List, Loader2 } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [courses, setCourses] = useState([])
  const [instances, setInstances] = useState([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalInstances: 0,
    totalStudentCapacity: 0,
    currentSemesterInstances: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentYear = new Date().getFullYear()
  const currentSemester = Math.ceil((new Date().getMonth() + 1) / 6) 

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [coursesResponse, instancesResponse] = await Promise.all([fetch("http://localhost:8082/api/courses"), fetch(`http://localhost:8082/api/instances`)])

      if (!coursesResponse.ok || !instancesResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const coursesData = await coursesResponse.json()
      const instancesData = await instancesResponse.json()

      setCourses(coursesData.data)
      setInstances(instancesData.data)
      console.log("Courses:", coursesData.data)
      console.log("Instances:", instancesData.data)
      const currentSemesterInstances = instancesData.data.filter(
        (instance) => instance.year === currentYear && instance.semester === currentSemester,
      ).length

      const totalStudentCapacity = instancesData.data.reduce((sum, instance) => sum + instance.studentCapacity, 0)

      setStats({
        totalCourses: coursesData.data.length,
        totalInstances: instancesData.data.length,
        totalStudentCapacity,
        currentSemesterInstances,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const dashboardStats = [
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      description: "Active courses",
      color: "text-blue-400",
    },
    {
      title: "Course Instances",
      value: stats.totalInstances.toString(),
      icon: Calendar,
      description: "All semesters",
      color: "text-green-400",
    },
    {
      title: "Student Capacity",
      value: stats.totalStudentCapacity.toLocaleString(),
      icon: Users,
      description: "Total capacity",
      color: "text-purple-400",
    },
    {
      title: "Current Semester",
      value: stats.currentSemesterInstances.toString(),
      icon: GraduationCap,
      description: `${currentYear} Sem ${currentSemester}`,
      color: "text-orange-400",
    },
  ]

  const quickActions = [
    {
      title: "Create Course",
      href: "/courses/create",
      icon: Plus,
      description: "Add a new course to catalog",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Courses",
      href: "/courses",
      icon: List,
      description: "Browse course catalog",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Course Instances",
      href: "/instances",
      icon: Calendar,
      description: "Manage deliveries",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Create Instance",
      href: "/instances/create",
      icon: GraduationCap,
      description: "Schedule new delivery",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  const getRecentActivity = () => {
    const recentCourses = courses.slice(-2).map((course) => ({
      action: "Course Available",
      details: `${course.title} (${course.courseId})`,
      time: "Recently added",
      color: "bg-green-500",
    }))

    const recentInstances = instances
      .filter((instance) => instance.year >= currentYear)
      .slice(-2)
      .map((instance) => ({
        action: "Instance Scheduled",
        details: `${instance.course?.title || "Course"} - Year ${instance.year}, Semester ${instance.semester}`,
        time: `Capacity: ${instance.studentCapacity}`,
        color: "bg-blue-500",
      }))

    return [...recentCourses, ...recentInstances].slice(0, 4)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-6">
            <div className="text-red-400 text-center">
              <p className="font-semibold">Error loading dashboard</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center">
          Course Management Dashboard
        </h1>
        <p className="text-gray-400 text-lg text-center">
          Manage your courses, track progress, and optimize learning outcomes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="bg-gray-900 border-gray-800 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 card-hover cursor-pointer">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">{action.title}</CardTitle>
                  <CardDescription className="text-gray-400">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">Latest courses and instances in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getRecentActivity().length > 0 ? (
              getRecentActivity().map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-3 h-3 ${activity.color} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{activity.action}</p>
                    <p className="text-sm text-gray-400 truncate">{activity.details}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent activity to display</p>
                <p className="text-sm mt-1">Create some courses and instances to see activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
