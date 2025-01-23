import { invoke } from "src/app/blitz-server"
import getCurrentUser from "src/app/users/queries/getCurrentUser"
import getDashboardStats from "./queries/getDashboardStats"
import { Metadata } from 'next'
import { ActivityFeed } from "./components/ActivityFeed"
import Link from "next/link"
import type { Route } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const [user, stats] = await Promise.all([
    invoke(getCurrentUser, null),
    invoke(getDashboardStats, null)
  ])

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {user?.name || user?.email}
          </h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Clients Card */}
        <Link
          href={"/clients" as Route}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalClients}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Tasks Card */}
        <Link
          href={"/tasks" as Route}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-xl">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeTasks}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        {/* Sprints Card */}
        <Link
          href={"/sprints" as Route}
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 text-xl">🏃</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Sprints</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeSprints}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="p-6">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
