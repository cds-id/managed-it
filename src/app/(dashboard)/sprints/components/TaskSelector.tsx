"use client"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "../../tasks/queries/getTasks"
import { useField } from "formik"
import { Task, TaskStatus } from "@prisma/client"

interface TaskSelectorProps {
  clientId: string
}

export function TaskSelector({ clientId }: TaskSelectorProps) {
  const [field, , helpers] = useField("taskIds")
  const [{ tasks }] = useQuery(getTasks, {
    clientId,
    page: 0,
    perPage: 100, // Adjust as needed
  })

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Select Tasks</label>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`relative rounded-lg border p-4 cursor-pointer ${
              field.value.includes(task.id)
                ? "border-indigo-500 ring-2 ring-indigo-500"
                : "border-gray-300 hover:border-indigo-500"
            }`}
            onClick={() => {
              const newValue = field.value.includes(task.id)
                ? field.value.filter((id: string) => id !== task.id)
                : [...field.value, task.id]
              helpers.setValue(newValue)
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-500 truncate">{task.description}</p>
              </div>
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
