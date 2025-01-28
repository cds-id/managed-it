"use client"
import { useState } from "react"
import { Task, TaskStatus } from "@prisma/client"
import { KanbanColumn } from "./KanbanColumn"
import { TaskDetailModal } from "./TaskDetailModal"
import { TaskWithRelations } from "../types"

interface KanbanBoardProps {
  tasks: TaskWithRelations[]
  onTaskMoved: (taskId: string, newStatus: TaskStatus) => Promise<void>
  onRefresh: () => void
}

export function KanbanBoard({ tasks, onTaskMoved, onRefresh }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const columns = [
    { status: TaskStatus.TODO, title: "To Do" },
    { status: TaskStatus.IN_PROGRESS, title: "In Progress" },
    { status: TaskStatus.DONE, title: "Done" },
  ]

  const handleDragStart = (task: TaskWithRelations) => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
    await onTaskMoved(taskId, newStatus)
    onRefresh()
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="h-full">
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={onTaskMoved}
          onRefresh={onRefresh}
        />
      )}
    </div>
  )
}
