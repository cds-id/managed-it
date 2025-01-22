import { Metadata, Route } from 'next'
import { TaskList } from "./components/TaskList"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tasks",
}

export default function TasksPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track all tasks across your projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href={"/tasks/new" as Route}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Task
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <TaskList />
      </div>
    </div>
  )
}
