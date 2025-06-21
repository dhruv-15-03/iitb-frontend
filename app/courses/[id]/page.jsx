"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, BookOpen, ArrowRight, Users, GraduationCap } from "lucide-react"
import Link from "next/link"

const allCourses = [
  {
    id: "CS101",
    title: "Programming Fundamentals",
    description: "Basic introduction to programming concepts and logic using pseudocode and simple algorithms.",
    prerequisites: [],
    instances: 2,
  },
  {
    id: "CS209",
    title: "Introduction to Computer Programming",
    description:
      "This comprehensive course introduces students to the fundamental concepts of programming using Python. Students will learn basic programming constructs, problem-solving techniques, and software development practices. The course covers variables, data types, control structures, functions, and basic object-oriented programming concepts.",
    prerequisites: [],
    instances: 3,
  },
  {
    id: "CS301",
    title: "Data Structures and Algorithms",
    description:
      "Advanced programming concepts focusing on efficient data organization and algorithmic problem solving. Topics include arrays, linked lists, stacks, queues, trees, graphs, and sorting algorithms.",
    prerequisites: ["CS209"],
    instances: 2,
  },
  {
    id: "CS401",
    title: "Web Development Fundamentals",
    description:
      "Comprehensive introduction to modern web development including HTML, CSS, JavaScript, and popular frameworks. Students will build responsive web applications and learn about client-server architecture.",
    prerequisites: ["CS209"],
    instances: 4,
  },
  {
    id: "CS501",
    title: "Database Management Systems",
    description:
      "Design and implementation of database systems, SQL programming, normalization, and database administration concepts. Includes hands-on experience with popular database systems.",
    prerequisites: ["CS301"],
    instances: 1,
  },
  {
    id: "CS601",
    title: "Advanced React Development",
    description:
      "Deep dive into React ecosystem, state management, performance optimization, and modern patterns. Covers Redux, Context API, hooks, and testing strategies.",
    prerequisites: ["CS401"],
    instances: 0,
  },
  {
    id: "CS701",
    title: "Full Stack Development",
    description:
      "Complete web application development using modern technologies. Integrates frontend frameworks with backend APIs and databases.",
    prerequisites: ["CS401", "CS501"],
    instances: 1,
  },
  {
    id: "CS801",
    title: "Advanced Algorithms",
    description:
      "Complex algorithmic techniques including dynamic programming, graph algorithms, and computational complexity analysis.",
    prerequisites: ["CS301", "CS501"],
    instances: 1,
  },
]

// Mock instances data for the course
const courseInstances = [
  {
    id: 1,
    instructor: "Dr. Sarah Johnson",
    year: 2024,
    semester: 1,
    capacity: 30,
    enrolled: 28,
    status: "Active",
  },
  {
    id: 2,
    instructor: "Prof. Michael Chen",
    year: 2024,
    semester: 2,
    capacity: 25,
    enrolled: 25,
    status: "Completed",
  },
  {
    id: 3,
    instructor: "Dr. Emily Rodriguez",
    year: 2025,
    semester: 1,
    capacity: 35,
    enrolled: 12,
    status: "Scheduled",
  },
]

export default function CourseDetailPage({ params }) {
  // Find the current course
  const courseData = allCourses.find((course) => course.id === params.id)

  if (!courseData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Course not found</p>
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

  // Find prerequisite courses (courses this course depends on)
  const prerequisiteCourses = allCourses.filter((course) => courseData.prerequisites.includes(course.id))

  // Find dependent courses (courses that depend on this course)
  const dependentCourses = allCourses.filter((course) => course.prerequisites.includes(courseData.id))

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
          <p className="text-blue-400 font-mono">{courseData.id}</p>
        </div>
        <Link href={`/courses/${courseData.id}/edit`}>
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
                      key={prereq.id}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-orange-600 text-orange-300 font-mono">
                            {prereq.id}
                          </Badge>
                          <h3 className="font-medium text-white">{prereq.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{prereq.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {prereq.instances} instances
                        </Badge>
                        <Link href={`/courses/${prereq.id}`}>
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
                      key={dependent.id}
                      className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-green-600 text-green-300 font-mono">
                            {dependent.id}
                          </Badge>
                          <h3 className="font-medium text-white">{dependent.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{dependent.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Prerequisites:</span>
                          <div className="flex gap-1">
                            {dependent.prerequisites.map((prereqId) => (
                              <Badge
                                key={prereqId}
                                variant="outline"
                                className={`text-xs border-gray-600 ${
                                  prereqId === courseData.id
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
                          {dependent.instances} instances
                        </Badge>
                        <Link href={`/courses/${dependent.id}`}>
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

          {/* No Prerequisites/Dependencies Messages */}
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
                <p className="text-lg font-mono text-blue-400">{courseData.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Instances</p>
                <p className="text-lg font-semibold text-white">{courseData.instances}</p>
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
              {courseInstances.slice(0, 3).map((instance) => (
                <div key={instance.id} className="p-3 border border-gray-700 rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {getSemesterName(instance.semester)}, {instance.year}
                      </p>
                      <p className="text-xs text-gray-400">{instance.instructor}</p>
                    </div>
                    <Badge className={`${getStatusColor(instance.status)} border text-xs`}>{instance.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">
                      <Users className="inline h-3 w-3 mr-1" />
                      {instance.enrolled}/{instance.capacity}
                    </span>
                    <Link href={`/instances/${instance.id}`} className="text-blue-400 hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
              <Link href="/instances/create" className="block">
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
