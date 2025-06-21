"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Trash2, Eye, Edit, Plus, AlertTriangle, BookOpen } from "lucide-react"
import Link from "next/link"

// Mock courses data
const mockCourses = [
  {
    id: "CS209",
    title: "Introduction to Computer Programming",
    description:
      "This course provides a basic introduction to Computer Programming using Python and fundamental programming concepts.",
    prerequisites: [],
    instances: 3,
    canDelete: true,
  },
  {
    id: "CS301",
    title: "Data Structures and Algorithms",
    description:
      "Advanced programming concepts focusing on efficient data organization and algorithmic problem solving.",
    prerequisites: ["CS209"],
    instances: 2,
    canDelete: false,
  },
  {
    id: "CS401",
    title: "Web Development Fundamentals",
    description:
      "Comprehensive introduction to modern web development including HTML, CSS, JavaScript, and frameworks.",
    prerequisites: ["CS209"],
    instances: 4,
    canDelete: true,
  },
  {
    id: "CS501",
    title: "Database Management Systems",
    description: "Design and implementation of database systems, SQL, and database administration concepts.",
    prerequisites: ["CS301"],
    instances: 1,
    canDelete: false,
  },
  {
    id: "CS601",
    title: "Advanced React Development",
    description: "Deep dive into React ecosystem, state management, performance optimization, and modern patterns.",
    prerequisites: ["CS401"],
    instances: 0,
    canDelete: true,
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Course Catalog</h1>
          <p className="text-gray-400">Manage and organize your course offerings</p>
        </div>
        <Link href="/courses/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search courses by title, ID, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="bg-gray-900 border-gray-800 card-hover">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                  <CardDescription className="font-mono text-blue-400 font-medium">{course.id}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {course.instances} instances
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{course.description}</p>

              {/* Prerequisites */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-400">Prerequisites:</p>
                {course.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">None required</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/courses/${course.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Button>
                </Link>
                <Link href={`/courses/${course.id}/edit`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!course.canDelete}
                      className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20 disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Course</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete "{course.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCourse(course.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Cannot delete warning */}
              {!course.canDelete && (
                <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-900/20 p-2 rounded border border-orange-800">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  <span>Cannot delete: Course has dependencies or active instances</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No courses found matching your search.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or create a new course.</p>
        </div>
      )}
    </div>
  )
}
