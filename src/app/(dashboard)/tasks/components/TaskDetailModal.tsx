"use client"
import { Dialog } from "@headlessui/react"
import { TaskWithRelations } from "../types"
import { TaskStatus } from "@prisma/client"
import { formatDate } from "@/src/app/utils/formatDate"
import { useMutation } from "@blitzjs/rpc"
import updateTask from "../mutations/updateTask"
import { useState } from "react"
import { TimeTrackerModal } from "../../timetracking/components/TimeTrackerModal"
import { TimeEntryList } from "../../timetracking/components/TimeEntryList"
import { Comments } from "./Comments"

interface TaskDetailModalProps {
  task: TaskWithRelations
  onClose: () => void
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>
  onRefresh: () => void
}

export function TaskDetailModal({
  task,
  onClose,
  onStatusChange,
  onRefresh,
}: TaskDetailModalProps) {
  const [isTimeTrackerOpen, setIsTimeTrackerOpen] = useState(false)
  const [updateTaskMutation] = useMutation(updateTask)

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onStatusChange(task.id, newStatus)
    onRefresh()
  }

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-start">
              <Dialog.Title className="text-lg font-medium">{task.title}</Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* Client and Status */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Client: <span className="font-medium text-gray-900">{task.client.name}</span>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="rounded-md border-gray-300 text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              </div>
            )}

            {/* Deadline */}
            {task.deadline && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Deadline</h3>
                <p className="text-sm text-gray-500">{formatDate(task.deadline)}</p>
              </div>
            )}

            {/* Assignees */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Assigned To</h3>
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((assignee) => (
                  <span
                    key={assignee.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {assignee.name || assignee.email}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Tracking */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-900">Time Tracking</h3>
                <button
                  onClick={() => setIsTimeTrackerOpen(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Track Time
                </button>
              </div>
              <TimeEntryList taskId={task.id} />
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Comments</h3>
              <Comments taskId={task.id} />
            </div>
          </div>
        </Dialog.Panel>
      </div>

      {isTimeTrackerOpen && (
        <TimeTrackerModal
          task={task}
          isOpen={isTimeTrackerOpen}
          onClose={() => setIsTimeTrackerOpen(false)}
        />
      )}
    </Dialog>
  )
}
