import { Metadata } from 'next'
import { SprintList } from "./components/SprintList"
import Link from "next/link"
import type { Route } from "next"

export const metadata: Metadata = {
  title: "Sprints",
}

export default function SprintsPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sprints</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track grouped tasks across client projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href={"/sprints/new" as Route}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Sprint
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <SprintList />
      </div>
    </div>
  )
}
