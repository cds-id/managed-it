"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledSelect } from "src/app/components/LabeledSelect"
import { TaskSelector } from "./TaskSelector"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { CreateSprintSchema } from "../schemas"
import createSprint from "../mutations/createSprint"
import getClients from "../../clients/queries/getClients"
import getTasks from "../../tasks/queries/getTasks"
import { useState } from "react"

export function SprintForm() {
  const [createSprintMutation] = useMutation(createSprint)
  const [{ clients }] = useQuery(getClients, {})
  const [selectedClient, setSelectedClient] = useState("")
  const router = useRouter()

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(e.target.value)
  }

  return (
    <Form
      submitText="Create Sprint"
      schema={CreateSprintSchema}
      initialValues={{
        name: "",
        clientId: "",
        startDate: "",
        endDate: "",
        taskIds: [],
      }}
      onSubmit={async (values) => {
        try {
          await createSprintMutation(values)
          router.push("/sprints")
          router.refresh()
        } catch (error: any) {
          console.error("Error creating sprint:", error)
          return { [FORM_ERROR]: error.toString() }
        }
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-full">
          <LabeledTextField
            name="name"
            label="Sprint Name"
            placeholder="Enter sprint name"
          />
        </div>

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
            onChange={handleClientChange}
          />
        </div>

        <div className="col-span-full md:col-span-1">
          <LabeledTextField
            name="startDate"
            label="Start Date"
            type="date"
          />
        </div>

        <div className="col-span-full md:col-span-1">
          <LabeledTextField
            name="endDate"
            label="End Date (Optional)"
            type="date"
          />
        </div>
      </div>

      {selectedClient && (
        <div className="mt-8">
          <TaskSelector clientId={selectedClient} />
        </div>
      )}
    </Form>
  )
}
