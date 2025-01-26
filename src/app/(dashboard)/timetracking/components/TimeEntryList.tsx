"use client"
import { useQuery } from "@blitzjs/rpc"
import { formatDistance } from "date-fns"
import getTimeEntries from "../queries/getTimeEntries"
import { TimeEntry } from "../types"
import { forwardRef, ForwardedRef } from "react"

interface TimeEntryListProps {
  taskId?: string
}

export const TimeEntryList = forwardRef(function TimeEntryList(
  { taskId }: TimeEntryListProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [{ timeEntries }] = useQuery(getTimeEntries, { taskId })

  return (
    <div ref={ref} className="space-y-4">
      <h3 className="text-lg font-medium">Time Entries</h3>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Task</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {timeEntries.map((entry: TimeEntry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {formatDistance(new Date(entry.startTime), new Date(), { addSuffix: true })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {Math.round(entry.duration)} min
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {entry.task.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{entry.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

TimeEntryList.displayName = "TimeEntryList"
