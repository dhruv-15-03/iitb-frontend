import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, GraduationCap, Users, Plus, List, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Courses",
      value: "24",
      icon: BookOpen,
      description: "Active courses",
      trend: "+12%",
      color: "text-blue-400",
    },
    {
      title: "Course Instances",
      value: "48",
      icon: Calendar,
      description: "This semester",
      trend: "+8%",
      color: "text-green-400",
    },
    {
      title: "Students Enrolled",
      value: "1,247",
      icon: Users,
      description: "Across all courses",
      trend: "+23%",
      color: "text-purple-400",
    },
    {
      title: "Completion Rate",
      value: "87%",
      icon: GraduationCap,
      description: "Average completion",
      trend: "+5%",
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

  const recentActivity = [
    {
      action: "Course Created",
      details: "Advanced React Patterns (CS 501)",
      time: "2 hours ago",
      color: "bg-green-500",
    },
    {
      action: "Instance Scheduled",
      details: "Database Systems - Semester 1, 2025",
      time: "5 hours ago",
      color: "bg-blue-500",
    },
    {
      action: "High Enrollment",
      details: "87 students enrolled in Web Development",
      time: "1 day ago",
      color: "bg-orange-500",
    },
    {
      action: "Course Completed",
      details: "Introduction to Programming - Semester 2",
      time: "2 days ago",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center">
          Course Management Dashboard
        </h1>
        <p className="text-gray-400 text-lg text-center">Manage your courses, track progress, and optimize learning outcomes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gray-900 border-gray-800 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{stat.description}</p>
                <div className="flex items-center text-xs text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </div>
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
          <CardDescription className="text-gray-400">Latest updates in your course management system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
