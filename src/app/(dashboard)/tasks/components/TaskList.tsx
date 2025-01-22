"use client"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "../queries/getTasks"
import Link from "next/link"
import { formatDate } from "src/app/utils/formatDate"
import { useState, useEffect, useMemo } from "react"
import { useDebounce } from "src/app/hooks/useDebounce"
import getClients from "../../clients/queries/getClients"
import type { Route } from "next"

import { Priority, TaskStatus } from "@prisma/client"

const ITEMS_PER_PAGE = 10

const PRIORITY_CONFIG = {
  LOW: {
    label: "Low Priority",
    className: "bg-gray-100 text-gray-800 border border-gray-300"
  },
  MEDIUM: {
    label: "Medium Priority",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-300"
  },
  HIGH: {
    label: "High Priority",
    className: "bg-red-100 text-red-800 border border-red-300"
  }
}

const STATUS_CONFIG = {
  TODO: {
    label: "To Do",
    className: "bg-gray-100 text-gray-800 border border-gray-300"
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border border-blue-300"
  },
  DONE: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border border-green-300"
  }
}

export function TaskList() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<TaskStatus | null>(null)
   const [priority, setPriority] = useState<Priority | null>(null)
  const [clientId, setClientId] = useState("")
  const [page, setPage] = useState(0)

  const debouncedSearch = useDebounce(search, 500)
  const [{ clients }] = useQuery(getClients, {})
  const [{ tasks, hasMore, count, totalPages }] = useQuery(getTasks, {
    search: debouncedSearch,
    status,
    priority,
    clientId,
    page,
    perPage: ITEMS_PER_PAGE,
  })

  useEffect(() => {
    setPage(0)
  }, [debouncedSearch, status, priority, clientId])

  // Calculate visible page numbers
  const visiblePages = useMemo(() => {
    const delta = 2 // Number of pages to show on either side of current page
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number

    for (let i = 0; i <= Math.min(totalPages - 1, 4); i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }, [page, totalPages])

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status || ""}
              onChange={(e) => setStatus(e.target.value ? e.target.value as TaskStatus : null)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority || ""}
              onChange={(e) => setPriority(e.target.value ? e.target.value as Priority : null)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
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
                setStatus(null)
                setPriority(null)
                setClientId("")
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-700">
        Showing {tasks.length} of {count} tasks
      </div>

      {tasks.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow px-6 py-8">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or create a new task.</p>
          <div className="mt-6">
            <Link
              href={"/tasks/new" as Route}
              className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Task
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Client
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Priority
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Deadline
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Assigned To
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {task.client.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_CONFIG[task.priority].className}`}>
                      {PRIORITY_CONFIG[task.priority].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CONFIG[task.status].className}`}>
                      {STATUS_CONFIG[task.status].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {task.deadline ? formatDate(task.deadline) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {task.assignees.length > 0
                      ? task.assignees
                          .map((user) => user.name || user.email)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      href={`/tasks/${task.id}` as Route}
                      className="text-indigo-600 hover:text-indigo-900 font-medium hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
