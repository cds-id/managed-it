import { EditTaskForm } from "../components/EditTaskForm"
import { invoke } from "src/app/blitz-server"
import getTask from "../queries/getTask"
import { notFound } from "next/navigation"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Edit Task",
}

export default async function EditTaskPage({ params }: { params: { taskId: string } }) {
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
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Edit Task: {task.title}
            </h1>
            <EditTaskForm task={task} />
          </div>
        </div>
      </div>
    </div>
  )
}
