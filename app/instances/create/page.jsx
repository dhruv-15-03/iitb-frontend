"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, GraduationCap, Plus } from "lucide-react"
import Link from "next/link"

// Mock courses
const availableCourses = [
  { id: "CS209", title: "Introduction to Computer Programming" },
  { id: "CS301", title: "Data Structures and Algorithms" },
  { id: "CS401", title: "Web Development Fundamentals" },
  { id: "CS501", title: "Database Management Systems" },
  { id: "CS601", title: "Advanced React Development" },
]

// Mock instructors
const instructors = [
  "Dr. Sarah Johnson",
  "Prof. Michael Chen",
  "Dr. Emily Rodriguez",
  "Dr. Alex Kim",
  "Prof. David Wilson",
]

export default function CreateInstancePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    courseId: "",
    instructor: "",
    year: "",
    semester: "",
    capacity: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Course instance created:", formData)
    router.push("/instances")
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i)

  const selectedCourse = availableCourses.find((course) => course.id === formData.courseId)

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/instances">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Instances
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Create Course Instance</h1>
          <p className="text-gray-400">Schedule a new course delivery</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Instance Details</CardTitle>
              <CardDescription className="text-gray-400">
                Configure the schedule and details for this course instance
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div className="space-y-2">
              <Label htmlFor="course" className="text-gray-300">
                Course *
              </Label>
              <Select onValueChange={(value) => handleInputChange("courseId", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id} className="text-white hover:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-400">{course.id}</span>
                        <span className="text-gray-400">-</span>
                        <span>{course.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCourse && <p className="text-sm text-gray-400 mt-1">Selected: {selectedCourse.title}</p>}
            </div>

            {/* Instructor */}
            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-gray-300">
                Instructor *
              </Label>
              <Select onValueChange={(value) => handleInputChange("instructor", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select an instructor" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor} value={instructor} className="text-white hover:bg-gray-800">
                      {instructor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Term */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year" className="text-gray-300">
                  Year *
                </Label>
                <Select onValueChange={(value) => handleInputChange("year", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-800">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-gray-300">
                  Semester *
                </Label>
                <Select onValueChange={(value) => handleInputChange("semester", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="1" className="text-white hover:bg-gray-800">
                      Semester 1
                    </SelectItem>
                    <SelectItem value="2" className="text-white hover:bg-gray-800">
                      Semester 2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-300">
                Student Capacity *
              </Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 30"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                min="1"
                max="200"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500"
                required
              />
              <p className="text-sm text-gray-400">Maximum number of students that can enroll in this instance</p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-800">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Instance...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Instance
                  </>
                )}
              </Button>
              <Link href="/instances" className="flex-1">
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
