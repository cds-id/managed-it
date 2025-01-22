"use client"
import { useQuery } from "@blitzjs/rpc"
import getSprints from "../queries/getSprints"
import Link from "next/link"
import { formatDate } from "src/app/utils/formatDate"
import { useState, useEffect } from "react"
import { useDebounce } from "src/app/hooks/useDebounce"
import getClients from "../../clients/queries/getClients"
import type { Route } from "next"
import { Sprint, SprintTask, Task } from "@prisma/client"

const ITEMS_PER_PAGE = 10

type SprintWithRelations = Sprint & {
  client: { name: string }
  sprintTasks: (SprintTask & {
    task: Pick<Task, 'status'>
  })[]
}

export function SprintList() {
  const [search, setSearch] = useState("")
  const [clientId, setClientId] = useState("")
  const [page, setPage] = useState(0)

  const debouncedSearch = useDebounce(search, 500)
  const [{ clients }] = useQuery(getClients, {})
  const [{ sprints, hasMore, count, totalPages }] = useQuery(getSprints, {
    search: debouncedSearch,
    clientId,
    page,
    perPage: ITEMS_PER_PAGE,
  })

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, clientId])

  const getCompletionPercentage = (sprintTasks: SprintWithRelations['sprintTasks']) => {
    if (sprintTasks.length === 0) return 0
    const completedTasks = sprintTasks.filter(st => st.task.status === "DONE").length
    return Math.round((completedTasks / sprintTasks.length) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sprints..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch("")
                setClientId("")
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sprints List */}
      {sprints.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow px-6 py-8">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sprints found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new sprint.</p>
          <div className="mt-6">
            <Link
              href={"/sprints/new" as Route}
              className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Create Sprint
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sprints.map((sprint: SprintWithRelations) => {
              const completionPercentage = getCompletionPercentage(sprint.sprintTasks)
              return (
                <li key={sprint.id}>
                  <Link href={`/sprints/${sprint.id}` as Route} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">{sprint.name}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {completionPercentage}% Complete
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {sprint.client.name}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {sprint.sprintTasks.length} Tasks
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {formatDate(sprint.startDate)} - {sprint.endDate ? formatDate(sprint.endDate) : 'Ongoing'}
                          </p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="relative w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="absolute left-0 top-0 h-2 bg-green-600 rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasMore}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{page * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min((page + 1) * ITEMS_PER_PAGE, count)}
              </span>{" "}
              of <span className="font-medium">{count}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === i
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={!hasMore}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
