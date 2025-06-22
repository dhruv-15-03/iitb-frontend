"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Search, Trash2, Eye, Edit, Plus, AlertTriangle, GraduationCap, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function InstancesPage() {
  const [instances, setInstances] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchInstances = async (year = null, semester = null) => {
    try {
      setError("")
      console.log("Fetching instances with filters:", { year, semester })

      if (year && semester) {
        console.log(`Fetching from: http://localhost:8082/api/instances/${year}/${semester}`)

        const response = await fetch(`http://localhost:8082/api/instances/${year}/${semester}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
        })

        console.log("Response status:", response.status)
        console.log("Response ok:", response.ok)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error response:", errorText)
          throw new Error(`Failed to fetch instances: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("Fetched data:", data.data)
        return Array.isArray(data.data) ? data.data : []
      } else if (year) {
        console.log(`Fetching both semesters for year ${year}`)

        const [semester1Response, semester2Response] = await Promise.allSettled([
          fetch(`http://localhost:8082/api/instances/${year}/1`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
          }),
          fetch(`http://localhost:8082/api/instances/${year}/2`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
          }),
        ])

        const semester1Data =
          semester1Response.status === "fulfilled" && semester1Response.value.ok
            ? await semester1Response.value.json()
            : []
        const semester2Data =
          semester2Response.status === "fulfilled" && semester2Response.value.ok
            ? await semester2Response.value.json()
            : []

        console.log("Semester 1 data:", semester1Data)
        console.log("Semester 2 data:", semester2Data)

        return [
          ...(Array.isArray(semester1Data.data) ? semester1Data.data : []),
          ...(Array.isArray(semester2Data.data) ? semester2Data.data : []),
        ]
      } else {
        const currentYear = new Date().getFullYear()
        const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]
        const allInstances = []

        console.log("Fetching all instances for years:", years)

        for (const yr of years) {
          for (const sem of [1, 2]) {
            try {
              console.log(`Fetching instances for ${yr}/${sem}`)

              const response = await fetch(`http://localhost:8082/api/instances/${yr}/${sem}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                mode: "cors",
              })

              if (response.ok) {
                const data = await response.json()
                console.log(`Data for ${yr}/${sem}:`, data.data)
                if (Array.isArray(data.data)) {
                  allInstances.push(...data.data)
                }
              } else {
                console.warn(`Failed to fetch instances for ${yr}/${sem}: ${response.status}`)
              }
            } catch (err) {
              console.warn(`Error fetching instances for ${yr}/${sem}:`, err)
            }
          }
        }

        console.log("All fetched instances:", allInstances)
        return allInstances
      }
    } catch (err) {
      console.error("Error in fetchInstances:", err)
      throw err
    }
  }

  useEffect(() => {
    const loadInstances = async () => {
      try {
        setIsLoading(true)

        const year = selectedYear !== "all" ? Number.parseInt(selectedYear) : null
        const semester = selectedSemester !== "all" ? Number.parseInt(selectedSemester) : null

        const data = await fetchInstances(year, semester)
        setInstances(data)
      } catch (err) {
        setError("Failed to load course instances. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadInstances()
  }, [selectedYear, selectedSemester])

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      setError("")

      const year = selectedYear !== "all" ? Number.parseInt(selectedYear) : null
      const semester = selectedSemester !== "all" ? Number.parseInt(selectedSemester) : null

      const data = await fetchInstances(year, semester)
      setInstances(data)
    } catch (err) {
      setError("Failed to refresh instances. Please try again.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const filteredInstances = instances.filter((instance) => {
    const courseTitle = instance.course?.title || instance.course?.name || ""
    const courseId = instance.course?.courseId || instance.courseId || ""
    const instructor = instance.instructor || ""

    const matchesSearch =
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleDeleteInstance = async (instance) => {
    try {
      const courseId = instance.course?.courseId || instance.courseId

      if (!courseId) {
        throw new Error("Course ID not found for this instance")
      }

      console.log(`Deleting instance: ${instance.year}/${instance.semester}/${courseId}`)

      const response = await fetch(
        `http://localhost:8082/api/instances/${instance.year}/${instance.semester}/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
        },
      )

      console.log("Delete response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Delete error response:", errorText)
        throw new Error(`Failed to delete instance: ${response.status} - ${errorText}`)
      }

      // Remove from local state
      setInstances(instances.filter((inst) => inst.id !== instance.id))
      console.log("Instance deleted successfully")
    } catch (err) {
      console.error("Error deleting instance:", err)
      setError(err.message || "Failed to delete instance. Please try again.")
    }
  }

  const getInstanceStatus = (instance) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    if (instance.year < currentYear || (instance.year === currentYear && instance.semester === 1 && currentMonth > 6)) {
      return "Completed"
    } else if (
      instance.year === currentYear &&
      ((instance.semester === 1 && currentMonth >= 1 && currentMonth <= 6) ||
        (instance.semester === 2 && currentMonth >= 7 && currentMonth <= 12))
    ) {
      return "Active"
    } else {
      return "Scheduled"
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

  const getSemesterName = (semester) => {
    const names = { 1: "Semester 1", 2: "Semester 2" }
    return names[semester] || `Semester ${semester}`
  }

  const years = Array.from(new Set(instances.map((i) => i.year))).sort()

  const canDeleteInstance = (instance) => {
    const status = getInstanceStatus(instance)
    const enrolled = instance.enrolledStudents || 0
    return status !== "Active" && enrolled === 0
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">Course Instances</h1>
            <p className="text-gray-400">Manage course deliveries and schedules</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading course instances...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Course Instances</h1>
          <p className="text-gray-400">Manage course deliveries and schedules</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/instances/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Instance
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search instances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-green-500"
          />
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-800">
              All Years
            </SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-800">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-36 bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-800">
              All Semesters
            </SelectItem>
            <SelectItem value="1" className="text-white hover:bg-gray-800">
              Semester 1
            </SelectItem>
            <SelectItem value="2" className="text-white hover:bg-gray-800">
              Semester 2
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Instances Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstances.map((instance) => {
          const status = getInstanceStatus(instance)
          const canDelete = canDeleteInstance(instance)
          const enrolled = instance.enrolledStudents || 0
          const capacity = instance.studentCapacity || 0
          const courseTitle = instance.course?.title || instance.course?.name || "Unknown Course"
          const courseId = instance.course?.courseId || instance.courseId || "N/A"

          return (
            <Card key={instance.id} className="bg-gray-900 border-gray-800 card-hover">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-white">{courseTitle}</CardTitle>
                    <CardDescription className="font-mono text-blue-400 font-medium">{courseId}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(status)} border`}>{status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Instructor:</span>
                    <span className="font-medium text-white">{instance.instructor || "TBA"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Term:</span>
                    <span className="font-medium text-white">
                      {getSemesterName(instance.semester)}, {instance.year}
                    </span>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Enrollment:</span>
                    <Badge
                      className={`text-xs ${
                        enrolled >= capacity
                          ? "bg-red-900/30 text-red-300 border-red-700"
                          : enrolled > capacity * 0.8
                            ? "bg-orange-900/30 text-orange-300 border-orange-700"
                            : "bg-green-900/30 text-green-300 border-green-700"
                      } border`}
                    >
                      {enrolled}/{capacity}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        enrolled >= capacity
                          ? "bg-red-500"
                          : enrolled > capacity * 0.8
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min((enrolled / capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/instances/${instance.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/instances/${instance.id}/edit`} className="flex-1">
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
                        disabled={!canDelete}
                        className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Course Instance</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Are you sure you want to delete this instance of "{courseTitle}" for{" "}
                          {getSemesterName(instance.semester)} {instance.year}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteInstance(instance)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Cannot delete warning */}
                {!canDelete && (
                  <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-900/20 p-2 rounded border border-orange-800">
                    <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                    <span>Cannot delete: Instance has enrolled students or is currently active</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredInstances.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No course instances found matching your criteria.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new instance.</p>
        </div>
      )}
    </div>
  )
}
