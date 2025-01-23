import { invoke } from "src/app/blitz-server"
import getTask from "../../queries/getTask"
import { notFound } from "next/navigation"
import { Metadata } from 'next'
import Link from "next/link"
import { Comments } from "../../components/Comments"
import { TaskDetail } from "../../components/TaskDetail"
import { TaskWithRelations } from "../../types"

export const metadata: Metadata = {
  title: "Task Details",
}

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const task = await invoke(getTask, { id: params.taskId }).catch(() => null)

  if (!task) return notFound()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link
            href="/tasks"
            className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            ← Back to Tasks
          </Link>
        </div>
        <TaskDetail task={task as TaskWithRelations} />
        <div className="mt-8">
          <Comments taskId={task.id} />
        </div>
      </div>
    </div>
  )
}
