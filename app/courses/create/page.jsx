"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X, BookOpen, Plus } from "lucide-react"
import Link from "next/link"

// Mock existing courses for prerequisites
const existingCourses = [
  { id: "CS101", title: "Programming Fundamentals" },
  { id: "CS209", title: "Introduction to Computer Programming" },
  { id: "CS301", title: "Data Structures and Algorithms" },
  { id: "CS401", title: "Web Development Fundamentals" },
  { id: "MATH201", title: "Discrete Mathematics" },
  { id: "MATH301", title: "Linear Algebra" },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    id: "",
    description: "",
  })
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePrerequisiteToggle = (courseId) => {
    setSelectedPrerequisites((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId],
    )
  }

  const removePrerequisite = (courseId) => {
    setSelectedPrerequisites((prev) => prev.filter((id) => id !== courseId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const courseData = {
      ...formData,
      prerequisites: selectedPrerequisites,
    }

    console.log("Course created:", courseData)
    router.push("/courses")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Create New Course</h1>
          <p className="text-gray-400">Add a new course to your catalog</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Course Information</CardTitle>
              <CardDescription className="text-gray-400">Enter the basic details for your new course</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Computer Programming"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id" className="text-gray-300">
                  Course ID *
                </Label>
                <Input
                  id="id"
                  placeholder="e.g., CS 209"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="This course provides a basic introduction to..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
                required
              />
            </div>

            {/* Prerequisites Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-gray-300 text-base font-medium">Prerequisites</Label>
                <Badge variant="secondary" className="bg-gray-800 text-gray-400 text-xs">
                  Optional
                </Badge>
              </div>
              <p className="text-sm text-gray-400">
                Select courses that students must complete before taking this course
              </p>

              {/* Selected Prerequisites */}
              {selectedPrerequisites.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-300">Selected Prerequisites:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrerequisites.map((courseId) => {
                      const course = existingCourses.find((c) => c.id === courseId)
                      return (
                        <Badge
                          key={courseId}
                          variant="secondary"
                          className="bg-blue-900/30 text-blue-300 border border-blue-700 flex items-center gap-2 px-3 py-1"
                        >
                          <span className="font-mono text-xs">{course?.id}</span>
                          <span className="text-xs">-</span>
                          <span className="text-xs">{course?.title}</span>
                          <button
                            type="button"
                            onClick={() => removePrerequisite(courseId)}
                            className="ml-1 hover:text-red-300 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Available Courses */}
              <div className="border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-gray-300">Available Courses</p>
                </div>
                <div className="p-3 max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {existingCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700/50 transition-colors"
                      >
                        <Checkbox
                          id={course.id}
                          checked={selectedPrerequisites.includes(course.id)}
                          onCheckedChange={() => handlePrerequisiteToggle(course.id)}
                          className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor={course.id} className="text-sm cursor-pointer flex-1 text-gray-300">
                          <span className="font-mono text-blue-400">{course.id}</span>
                          <span className="text-gray-500 mx-2">-</span>
                          <span>{course.title}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-800">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Course...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </>
                )}
              </Button>
              <Link href="/courses" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
