import { formatDate } from "@/src/app/utils/formatDate"
import { TaskWithRelations } from "../types"

interface KanbanTaskProps {
  task: TaskWithRelations
  onDragStart: (task: TaskWithRelations) => void
  onDragEnd: () => void
  onClick: () => void
}

const PRIORITY_COLORS = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-red-100 text-red-800",
}

export function KanbanTask({ task, onDragStart, onDragEnd, onClick }: KanbanTaskProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id)
    onDragStart(task)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            PRIORITY_COLORS[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="text-xs text-gray-500 mb-2">{task.client.name}</div>

      {task.deadline && (
        <div className="text-xs text-gray-500 flex items-center">
          <span className="mr-1">🗓️</span>
          {formatDate(task.deadline)}
        </div>
      )}

      {task.assignees.length > 0 && (
        <div className="mt-2 flex -space-x-1">
          {task.assignees.map((assignee) => (
            <div
              key={assignee.id}
              className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white"
              title={assignee.name || assignee.email}
            >
              {(assignee.name || assignee.email)[0].toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
