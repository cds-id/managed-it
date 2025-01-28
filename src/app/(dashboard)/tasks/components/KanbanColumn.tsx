"use client"
import { TaskStatus } from "@prisma/client"
import { KanbanTask } from "./KanbanTask"
import { TaskWithRelations } from "../types"

interface KanbanColumnProps {
  title: string
  status: TaskStatus
  tasks: TaskWithRelations[]
  onDragStart: (task: TaskWithRelations) => void
  onDragEnd: () => void
  onDrop: (taskId: string, newStatus: TaskStatus) => void
  onTaskClick: (task: TaskWithRelations) => void
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onDragStart,
  onDragEnd,
  onDrop,
  onTaskClick,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    onDrop(taskId, status)
  }

  return (
    <div
      className="flex-1 min-w-[300px] max-w-[400px] bg-gray-100 rounded-lg p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <KanbanTask
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  )
}
