"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, GraduationCap, Plus, AlertCircle } from "lucide-react"
import Link from "next/link"




export default function CreateInstancePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    courseId: "",
    year: "",
    semester: "",
    capacity: "",
  })
  const [courses, setCourses] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [error, setError] = useState("")
  const [coursesError, setCoursesError] = useState("")

 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true)
        setCoursesError("")

        const response = await fetch("http://localhost:8082/api/courses")

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`)
        }

        const coursesData = await response.json()
        setCourses(coursesData.data)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setCoursesError("Failed to load courses. Please try again.")
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!formData.courseId || !formData.year || !formData.semester || !formData.capacity) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      const res=await fetch(`http://localhost:8082/api/courses/${formData.courseId}`)
      if (!res.ok) {
        throw new Error(errorData.message || `Failed to fetch course: ${res.status}`)
      }
      const courseData = await res.json()
      if (!courseData.data) {
        throw new Error("Selected course does not exist")
      }
      
      const instanceData = {
        course: courseData.data,
        year: Number.parseInt(formData.year),
        semester: Number.parseInt(formData.semester),
        capacity: Number.parseInt(formData.capacity),
      }

      const response = await fetch("http://localhost:8082/api/instances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instanceData),
        
      })
      console.log("Creating instance with data:", instanceData)

      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to create instance: ${response.status}`)
      }

      const result = await response.json()
      console.log("Course instance created:", result.data)

      router.push("/instances")
    } catch (err) {
      console.error("Error creating instance:", err)
      setError(err.message || "Failed to create course instance. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i)

  const selectedCourse = courses.find((course) => course.id === formData.courseId)

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

      {/* Error Alert */}
      {error && (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

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
              {coursesError ? (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-md">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>{coursesError}</span>
                  </div>
                </div>
              ) : (
                <Select onValueChange={(value) => handleInputChange("courseId", value)} disabled={isLoadingCourses}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select a course"} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {courses.map((course) => (
                      <SelectItem key={course.courseId} value={course.courseId} className="text-white hover:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-400">{course.courseId}</span>
                          <span className="text-gray-400">-</span>
                          <span>{course.title || course.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedCourse && (
                <p className="text-sm text-gray-400 mt-1">Selected: {selectedCourse.title || selectedCourse.name}</p>
              )}
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
                disabled={isSubmitting || isLoadingCourses}
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
