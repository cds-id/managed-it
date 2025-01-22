"use client"
import { useMutation } from "@blitzjs/rpc"
import { Sprint, Task, SprintTask } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import updateSprint from "../mutations/updateSprint"
import deleteSprint from "../mutations/deleteSprint"
import { formatDate } from "src/app/utils/formatDate"

type SprintWithRelations = Sprint & {
  client: { name: string }
  sprintTasks: (SprintTask & {
    task: Task
  })[]
}

interface SprintDetailProps {
  sprint: SprintWithRelations
}

export function SprintDetail({ sprint }: SprintDetailProps) {
  const [updateSprintMutation] = useMutation(updateSprint)
  const [deleteSprintMutation] = useMutation(deleteSprint)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const completedTasks = sprint.sprintTasks.filter(st => st.task.status === "DONE")
  const completionPercentage = Math.round((completedTasks.length / sprint.sprintTasks.length) * 100)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "bg-green-100 text-green-800"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold leading-6 text-gray-900">{sprint.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Client: {sprint.client.name}</p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 hover:text-red-900"
          >
            Delete Sprint
          </button>
        </div>
      </div>

      {/* Sprint Progress */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(sprint.startDate)}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">End Date</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {sprint.endDate ? formatDate(sprint.endDate) : 'Ongoing'}
            </dd>
          </div>
        </dl>
      </div>

      {/* Tasks List */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900">Tasks</h4>
          <div className="mt-4 space-y-4">
            {sprint.sprintTasks.map(({ task }) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">{task.title}</h5>
                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                {task.deadline && (
                  <div className="mt-2 text-xs text-gray-500">
                    Deadline: {formatDate(task.deadline)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete Sprint
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this sprint? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={isDeleting}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={async () => {
                      setIsDeleting(true)
                      try {
                        await deleteSprintMutation({ id: sprint.id })
                        router.push("/sprints")
                        router.refresh()
                      } catch (error) {
                        console.error(error)
                      } finally {
                        setIsDeleting(false)
                      }
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
