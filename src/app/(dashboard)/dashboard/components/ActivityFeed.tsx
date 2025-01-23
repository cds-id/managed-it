"use client"
import { useQuery } from "@blitzjs/rpc"
import getRecentActivities from "../queries/getRecentActivities"
import { formatDate } from "src/app/utils/formatDate"
import Link from "next/link"
import type { Route } from "next"

export function ActivityFeed() {
  const [activities] = useQuery(getRecentActivities, {})

  if (!activities.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                {/* Activity icon */}
                <div
                  className={`relative h-10 w-10 flex items-center justify-center rounded-full ${
                    activity.type === 'TASK_CREATED'
                      ? 'bg-blue-100'
                      : activity.type === 'SPRINT_CREATED'
                      ? 'bg-green-100'
                      : 'bg-purple-100'
                  }`}
                >
                  <span
                    className={`text-lg ${
                      activity.type === 'TASK_CREATED'
                        ? 'text-blue-600'
                        : activity.type === 'SPRINT_CREATED'
                        ? 'text-green-600'
                        : 'text-purple-600'
                    }`}
                  >
                    {activity.type === 'TASK_CREATED'
                      ? '✓'
                      : activity.type === 'SPRINT_CREATED'
                      ? '🏃'
                      : '👥'}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <Link
                        href={
                          activity.entityType === 'task'
                            ? `/tasks/${activity.entityId}/detail`
                            : activity.entityType === 'sprint'
                            ? `/sprints/${activity.entityId}`
                            : `/clients/${activity.entityId}` as Route
                        }
                        className="font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {activity.description}
                      </Link>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Client: {activity.clientName}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
