"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Users, Calendar } from "lucide-react"
import Link from "next/link"

// Mock instance data
const instanceData = {
  id: 1,
  courseId: "CS209",
  courseTitle: "Introduction to Computer Programming",
  year: 2024,
  semester: 1,
  instructor: "Dr. Sarah Johnson",
  capacity: 30,
  enrolled: 28,
  status: "Active",
  students: [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", enrolledDate: "2024-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", enrolledDate: "2024-01-16" },
    { id: 3, name: "Carol Davis", email: "carol@example.com", enrolledDate: "2024-01-17" },
  ],
}

export default function InstanceDetailPage() {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-900/30 text-green-300 border-green-700"
      case "Completed":
        return "bg-gray-700 text-gray-300 border-gray-600"
      case "Scheduled":
        return "bg-blue-900/30 text-blue-300 border-blue-700"
      default:
        return "bg-gray-700 text-gray-300 border-gray-600"
    }
  }

  const getSemesterName = (semester) => {
    const names = { 1: "Semester 1", 2: "Semester 2" }
    return names[semester] || `Semester ${semester}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/instances">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Instances
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">{instanceData.courseTitle}</h1>
          <p className="text-blue-400 font-mono">
            {instanceData.courseId} • {getSemesterName(instanceData.semester)}, {instanceData.year}
          </p>
        </div>
        <Link href={`/instances/${instanceData.id}/edit`}>
          <Button className="bg-green-600 hover:bg-green-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Instance
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instance Overview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Instance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    <span className="font-medium">Instructor:</span> {instanceData.instructor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    <span className="font-medium">Term:</span> {getSemesterName(instanceData.semester)},{" "}
                    {instanceData.year}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrolled Students */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Enrolled Students</CardTitle>
              <CardDescription className="text-gray-400">
                {instanceData.enrolled} of {instanceData.capacity} students enrolled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {instanceData.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.email}</p>
                    </div>
                    <div className="text-xs text-gray-400">Enrolled: {student.enrolledDate}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${getStatusColor(instanceData.status)} border`}>{instanceData.status}</Badge>
            </CardContent>
          </Card>

          {/* Enrollment Progress */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Enrollment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Enrolled:</span>
                <span className="font-medium text-white">
                  {instanceData.enrolled}/{instanceData.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(instanceData.enrolled / instanceData.capacity) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{instanceData.capacity - instanceData.enrolled} spots remaining</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
