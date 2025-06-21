"use client"

import { useState } from "react"
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
import { Search, Trash2, Eye, Edit, Plus, AlertTriangle, GraduationCap } from "lucide-react"
import Link from "next/link"

// Mock instances data with the specified structure
const mockInstances = [
  {
    id: 1,
    courseId: "CS209",
    courseTitle: "Introduction to Computer Programming",
    year: 2024,
    semester: 1,
    instructor: "Dr. Sarah Johnson",
    capacity: 30,
    enrolled: 28,
    status: "Active",
    canDelete: false,
  },
  {
    id: 2,
    courseId: "CS301",
    courseTitle: "Data Structures and Algorithms",
    year: 2024,
    semester: 1,
    instructor: "Prof. Michael Chen",
    capacity: 25,
    enrolled: 23,
    status: "Active",
    canDelete: false,
  },
  {
    id: 3,
    courseId: "CS401",
    courseTitle: "Web Development Fundamentals",
    year: 2024,
    semester: 2,
    instructor: "Dr. Emily Rodriguez",
    capacity: 35,
    enrolled: 35,
    status: "Completed",
    canDelete: true,
  },
  {
    id: 4,
    courseId: "CS601",
    courseTitle: "Advanced React Development",
    year: 2025,
    semester: 1,
    instructor: "Dr. Alex Kim",
    capacity: 20,
    enrolled: 0,
    status: "Scheduled",
    canDelete: true,
  },
]

export default function InstancesPage() {
  const [instances, setInstances] = useState(mockInstances)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")

  const filteredInstances = instances.filter((instance) => {
    const matchesSearch =
      instance.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear = selectedYear === "all" || instance.year.toString() === selectedYear
    const matchesSemester = selectedSemester === "all" || instance.semester.toString() === selectedSemester

    return matchesSearch && matchesYear && matchesSemester
  })

  const handleDeleteInstance = (instanceId) => {
    setInstances(instances.filter((instance) => instance.id !== instanceId))
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Course Instances</h1>
          <p className="text-gray-400">Manage course deliveries and schedules</p>
        </div>
        <Link href="/instances/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Instance
          </Button>
        </Link>
      </div>

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
        {filteredInstances.map((instance) => (
          <Card key={instance.id} className="bg-gray-900 border-gray-800 card-hover">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-white">{instance.courseTitle}</CardTitle>
                  <CardDescription className="font-mono text-blue-400 font-medium">{instance.courseId}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(instance.status)} border`}>{instance.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Instructor:</span>
                  <span className="font-medium text-white">{instance.instructor}</span>
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
                      instance.enrolled >= instance.capacity
                        ? "bg-red-900/30 text-red-300 border-red-700"
                        : instance.enrolled > instance.capacity * 0.8
                          ? "bg-orange-900/30 text-orange-300 border-orange-700"
                          : "bg-green-900/30 text-green-300 border-green-700"
                    } border`}
                  >
                    {instance.enrolled}/{instance.capacity}
                  </Badge>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      instance.enrolled >= instance.capacity
                        ? "bg-red-500"
                        : instance.enrolled > instance.capacity * 0.8
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min((instance.enrolled / instance.capacity) * 100, 100)}%` }}
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
                      disabled={!instance.canDelete}
                      className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20 disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Course Instance</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete this instance of "{instance.courseTitle}"? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteInstance(instance.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Cannot delete warning */}
              {!instance.canDelete && (
                <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-900/20 p-2 rounded border border-orange-800">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  <span>Cannot delete: Instance has enrolled students or is currently active</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredInstances.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No course instances found matching your criteria.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new instance.</p>
        </div>
      )}
    </div>
  )
}
