"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, BookOpen, ArrowRight, GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CourseDetailPage({ params }) {
  const [courseData, setCourseData] = useState(null)
  const [prerequisiteCourses, setPrerequisiteCourses] = useState([])
  const [dependentCourses, setDependentCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        const courseResponse = await fetch(`http://localhost:8082/api/courses/${params.id}`)
        if (!courseResponse.ok) {
          throw new Error("Course not found")
        }
        const course = await courseResponse.json()
        setCourseData(course.data)
        const PrerequisiteResponse = await fetch(`http://localhost:8082/api/courses/${params.id}/prereqs`)
        if (PrerequisiteResponse.ok) {
          const preq = await PrerequisiteResponse.json()
          setPrerequisiteCourses(preq.data || [])
        }
        const dependentsResponse = await fetch(`http://localhost:8082/api/courses/${params.id}/dependent`)
        if (dependentsResponse.ok) {
          const dependents = await dependentsResponse.json()
          setDependentCourses(dependents.data || [])
          console.log("Dependent courses:", dependents)
        }
      } catch (err) {
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [params.id])

  const getSemesterName = (semester) => {
    const names = {
      1: "Spring",
      2: "Fall",
      3: "Summer",
    }
    return names[semester] || `Semester ${semester}`
  }

  const getInstanceStatus = (instance) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    if (instance.year < currentYear) {
      return "Completed"
    } else if (instance.year > currentYear) {
      return "Scheduled"
    } else {
      if (instance.semester === 1 && currentMonth > 6) {
        return "Completed"
      } else if (instance.semester === 2 && currentMonth < 8) {
        return "Scheduled"
      } else if (instance.semester === 2 && currentMonth >= 8) {
        return "Active"
      } else {
        return "Active"
      }
    }
  }

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading course details...</span>
        </div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">{error || "Course not found"}</p>
          <Link href="/courses">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">{courseData.title}</h1>
          <p className="text-blue-400 font-mono">{courseData.courseId}</p>
        </div>
        <Link href={`/courses/${courseData.courseId}/edit`}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Course
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{courseData.description}</p>
            </CardContent>
          </Card>

          {/* Prerequisites Section */}
          {prerequisiteCourses.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-orange-400" />
                  Prerequisites
                </CardTitle>
                <CardDescription className="text-gray-400">Courses required before taking this course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prerequisiteCourses.map((prereq) => (
                    <div
                      key={prereq.courseId}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-orange-600 text-orange-300 font-mono">
                            {prereq.courseId}
                          </Badge>
                          <h3 className="font-medium text-white">{prereq.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{prereq.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {prereq.instanceCount || prereq.instances?.length || 0} instances
                        </Badge>
                        <Link href={`/courses/${prereq.courseId}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dependent Courses Section */}
          {dependentCourses.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <GraduationCap className="h-5 w-5 text-green-400" />
                  Unlocks These Courses
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Courses that become available after completing this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dependentCourses.map((dependent) => (
                    <div
                      key={dependent.courseId}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-green-600 text-green-300 font-mono">
                            {dependent.courseId}
                          </Badge>
                          <h3 className="font-medium text-white">{dependent.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{dependent.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Prerequisites:</span>
                          <div className="flex gap-1">
                            {dependent.prerequisiteIds?.map((prereqId) => (
                              <Badge
                                key={prereqId}
                                variant="outline"
                                className={`text-xs border-gray-600 ${
                                  prereqId === courseData.courseId
                                    ? "text-green-300 border-green-600 bg-green-900/20"
                                    : "text-gray-400"
                                }`}
                              >
                                {prereqId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {dependent.instanceCount || dependent.instances?.length || 0} instances
                        </Badge>
                        <Link href={`/courses/${dependent.courseId}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Prerequisites Message */}
          {prerequisiteCourses.length === 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-green-400" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-green-400" />
                  </div>
                  <p className="text-gray-300 font-medium">No Prerequisites Required</p>
                  <p className="text-sm text-gray-400 mt-1">
                    This is a foundational course that can be taken without prior coursework
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-400">Course ID</p>
                <p className="text-lg font-mono text-blue-400">{courseData.courseId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Instances</p>
                <p className="text-lg font-semibold text-white">
                  {courseData.instanceCount || courseData.instances?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Prerequisites Required</p>
                <p className="text-lg font-semibold text-white">{prerequisiteCourses.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Unlocks Courses</p>
                <p className="text-lg font-semibold text-white">{dependentCourses.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Course Instances */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-4 w-4" />
                Course Instances
              </CardTitle>
              <CardDescription className="text-gray-400">Active and scheduled deliveries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.instances && courseData.instances.length > 0 ? (
                <>
                  {courseData.instances.slice(0, 5).map((instance) => {
                    const status = getInstanceStatus(instance)
                    return (
                      <div key={instance.id} className="p-3 border border-gray-700 rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {getSemesterName(instance.semester)} {instance.year}
                            </p>
                            <p className="text-xs text-gray-400">Instance #{instance.id}</p>
                          </div>
                          <Badge className={`${getStatusColor(status)} border text-xs`}>{status}</Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {getSemesterName(instance.semester)} {instance.year}
                          </span>
                          <Link href={`/instances/${instance.id}`} className="text-blue-400 hover:underline">
                            View Details
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                  {courseData.instances.length > 5 && (
                    <p className="text-xs text-gray-400 text-center">
                      And {courseData.instances.length - 5} more instances...
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                  <p className="text-gray-400 text-sm">No instances scheduled</p>
                </div>
              )}
              <Link href={`/instances/create?courseId=${courseData.courseId}`} className="block">
                <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Calendar className="mr-2 h-3 w-3" />
                  Create New Instance
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
