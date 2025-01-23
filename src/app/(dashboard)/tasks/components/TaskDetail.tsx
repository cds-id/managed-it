"use client"
import { Task, User } from "@prisma/client"
import { formatDate } from "src/app/utils/formatDate"
import Link from "next/link"
import { Route } from "next"
import { TaskWithRelations } from "../types"

interface TaskDetailProps {
  task: TaskWithRelations
}

const PRIORITY_CONFIG = {
  LOW: {
    label: "Low Priority",
    className: "bg-gray-100 text-gray-800",
  },
  MEDIUM: {
    label: "Medium Priority",
    className: "bg-yellow-100 text-yellow-800",
  },
  HIGH: {
    label: "High Priority",
    className: "bg-red-100 text-red-800",
  },
}

const STATUS_CONFIG = {
  TODO: {
    label: "To Do",
    className: "bg-gray-100 text-gray-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800",
  },
  DONE: {
    label: "Completed",
    className: "bg-green-100 text-green-800",
  },
}

export function TaskDetail({ task }: TaskDetailProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold leading-6 text-gray-900">
              {task.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Created for {task.client.name}
            </p>
          </div>
          <Link
            href={`/tasks/${task.id}` as Route}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Edit Task
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description || "No description provided" }}
            />
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_CONFIG[task.status].className
                }`}
              >
                {STATUS_CONFIG[task.status].label}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Priority</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  PRIORITY_CONFIG[task.priority].className
                }`}
              >
                {PRIORITY_CONFIG[task.priority].label}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(task.createdAt)}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Deadline</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {task.deadline ? formatDate(task.deadline) : "No deadline set"}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {task.assignees.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map((assignee) => (
                    <span
                      key={assignee.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {assignee.name || assignee.email}
                    </span>
                  ))}
                </div>
              ) : (
                "No assignees"
              )}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Activity</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                            <span className="text-white text-sm">
                              {task.client.name[0].toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              Created by <span className="font-medium text-gray-900">System</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={task.createdAt.toISOString()}>
                              {formatDate(task.createdAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
