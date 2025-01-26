"use client"
import { useState, useEffect } from "react"
import { useMutation } from "@blitzjs/rpc"
import createTimeEntry from "../mutations/createTimeEntry"
import { Task } from "@prisma/client"
import { Dialog } from "@headlessui/react"

interface TimeTrackerModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
}

export function TimeTrackerModal({ task, isOpen, onClose }: TimeTrackerModalProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [duration, setDuration] = useState(0)
  const [description, setDescription] = useState("")
  const [createTimeEntryMutation] = useMutation(createTimeEntry)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking])

  const handleStart = () => {
    setIsTracking(true)
    setStartTime(new Date())
  }

  const handleStop = async () => {
    if (!startTime) return

    try {
      await createTimeEntryMutation({
        taskId: task.id,
        startTime,
        endTime: new Date(),
        duration: Math.floor(duration / 60), // Convert seconds to minutes
        description,
      })
      setIsTracking(false)
      setStartTime(null)
      setDuration(0)
      setDescription("")
      onClose()
    } catch (error) {
      console.error("Failed to save time entry:", error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onClose={() => !isTracking && onClose()} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Time Tracker - {task.title}
          </Dialog.Title>

          <div className="space-y-4">
            <div className="text-3xl font-mono text-center">{formatDuration(duration)}</div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you working on?"
              className="w-full p-2 border rounded-md"
              rows={3}
              disabled={!isTracking}
            />

            <div className="flex justify-end space-x-3">
              {!isTracking ? (
                <>
                  <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button
                    onClick={handleStart}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Start
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
