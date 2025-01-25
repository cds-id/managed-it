"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledSelect } from "src/app/components/LabeledSelect"
import { MultiSelect } from "src/app/components/MultiSelect"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { UpdateTaskSchema } from "../schemas"
import updateTask from "../mutations/updateTask"
import deleteTask from "../mutations/deleteTask"
import getClients from "../../clients/queries/getClients"
import getUsers from "../../../users/queries/getUsers"
import { Task } from "@prisma/client"
import { useState } from "react"
import { User } from "src/app/users/queries/getUsers"
import { RichTextEditor } from "@/src/app/components/CKEditor"
import { useFormikContext } from "formik"
import { TaskForEdit, TaskAssignee } from "../types"

interface EditTaskFormProps {
  task: TaskForEdit
}

// Create a separate component for the rich text editor that will be used inside the Form
const TaskDescriptionField = () => {
  const { values, setFieldValue } = useFormikContext<any>()
  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <RichTextEditor
        initialValue={values.description || ""}
        onChange={(content) => setFieldValue("description", content)}
        placeholder="Enter task description..."
      />
    </div>
  )
}

export function EditTaskForm({ task }: EditTaskFormProps) {
  const [updateTaskMutation] = useMutation(updateTask)
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [{ clients }] = useQuery(getClients, {})
  const [{ users }] = useQuery(getUsers, {})
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  return (
    <>
      <Form
        schema={UpdateTaskSchema}
        submitText="Update Task"
        className="mx-auto w-full max-w-3xl bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-4 md:p-8"
        initialValues={{
          id: task.id,
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          clientId: task.clientId,
          deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
          assigneeIds: task.assignees.map((user) => user.id),
        }}
        onSubmit={async (values) => {
          try {
            await updateTaskMutation(values)
            router.push("/tasks")
            router.refresh()
          } catch (error: any) {
            return { [FORM_ERROR]: error.toString() }
          }
        }}
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <div className="col-span-full md:col-span-2">
              <LabeledTextField name="title" label="Title" placeholder="Task title" />
            </div>

            <TaskDescriptionField />

            <div className="col-span-full md:col-span-1">
              <LabeledSelect
                name="clientId"
                label="Client"
                options={clients.map((client) => ({
                  label: client.name,
                  value: client.id,
                }))}
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <LabeledSelect
                name="priority"
                label="Priority"
                options={[
                  { label: "Low", value: "LOW" },
                  { label: "Medium", value: "MEDIUM" },
                  { label: "High", value: "HIGH" },
                ]}
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <LabeledSelect
                name="status"
                label="Status"
                options={[
                  { label: "To Do", value: "TODO" },
                  { label: "In Progress", value: "IN_PROGRESS" },
                  { label: "Done", value: "DONE" },
                ]}
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <LabeledTextField name="deadline" label="Deadline" type="datetime-local" />
            </div>

            <div className="col-span-full md:col-span-2">
              <MultiSelect
                name="assigneeIds"
                label="Assign To"
                options={users.map((user: User) => ({
                  label: user.name || user.email,
                  value: user.id,
                }))}
              />
            </div>
          </div>
        </div>
      </Form>

      <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Delete Task
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Delete Task</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this task? This action cannot be undone.
                      </p>
                    </div>
                    {deleteError && <p className="mt-2 text-sm text-red-600">{deleteError}</p>}
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={isDeleting}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 sm:ml-3 sm:w-auto"
                    onClick={async () => {
                      setIsDeleting(true)
                      setDeleteError(null)
                      try {
                        await deleteTaskMutation({ id: task.id })
                        router.push("/tasks")
                        router.refresh()
                      } catch (error: any) {
                        console.error(error)
                        setDeleteError("Failed to delete task. Please try again.")
                      } finally {
                        setIsDeleting(false)
                      }
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 sm:mt-0 sm:w-auto"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
