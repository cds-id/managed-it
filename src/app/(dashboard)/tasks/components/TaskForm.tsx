"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledSelect } from "src/app/components/LabeledSelect"
import { MultiSelect } from "src/app/components/MultiSelect"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { CreateTaskSchema } from "../schemas"
import createTask from "../mutations/createTask"
import getClients from "../../clients/queries/getClients"
import getUsers from "../../../users/queries/getUsers"
import { User } from "src/app/users/queries/getUsers"
import { RichTextEditor } from "@/src/app/components/CKEditor"
import { useFormikContext } from "formik" // Add this import
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
export function TaskForm() {
  const [createTaskMutation] = useMutation(createTask)
  const [{ clients }] = useQuery(getClients, {})
  const [{ users }] = useQuery(getUsers, {})
  const router = useRouter()

  return (
    <Form
      submitText="Create Task"
      schema={CreateTaskSchema}
      className="mx-auto w-full max-w-3xl bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-4 md:p-8"
      initialValues={{
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        clientId: "",
        deadline: "",
        assigneeIds: [],
      }}
      onSubmit={async (values) => {
        try {
          const result = await createTaskMutation(values)
          console.log("Task created:", result)
          router.push("/tasks")
          router.refresh()
        } catch (error: any) {
          console.error("Error creating task:", error)
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
              options={[
                { label: "Select a client", value: "" },
                ...clients.map((client) => ({
                  label: client.name,
                  value: client.id,
                })),
              ]}
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
  )
}
