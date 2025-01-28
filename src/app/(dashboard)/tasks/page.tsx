"use client"
import { TaskList } from "./components/TaskList"
import { KanbanBoard } from "./components/KanbanBoard"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getTasks from "./queries/getTasks"
import updateTaskStatus from "./mutations/updateTaskStatus"
import { TaskStatus } from "@prisma/client"
import type { Route } from "next"

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams?.get("view") || "list"

  const [{ tasks }, { refetch }] = useQuery(getTasks, {})
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)

  const handleTaskMoved = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatusMutation({ id: taskId, status: newStatus })
      refetch()
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="sm:flex sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track all tasks across your projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* View Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
            <Link
              href="/tasks?view=list"
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                view === "list"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              List
            </Link>
            <Link
              href="/tasks?view=kanban"
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                view === "kanban"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Kanban
            </Link>
          </div>

          <Link
            href={"/tasks/new" as Route}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Task
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {view === "kanban" ? (
          <KanbanBoard tasks={tasks} onTaskMoved={handleTaskMoved} onRefresh={refetch} />
        ) : (
          <TaskList />
        )}
      </div>
    </div>
  )
}
