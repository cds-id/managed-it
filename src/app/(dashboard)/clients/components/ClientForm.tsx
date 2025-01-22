"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import createClient from "../mutations/createClient"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { CreateClientSchema } from "../schemas"

export const ClientForm = () => {
  const [createClientMutation] = useMutation(createClient)
  const router = useRouter()

  return (
    <Form
      schema={CreateClientSchema}
      submitText="Create Client"
      initialValues={{ name: "", contactInfo: "", notes: "" }}
      onSubmit={async (values) => {
        try {
          await createClientMutation(values)
          router.push("/clients")
          router.refresh()
        } catch (error: any) {
          if (error.code === "P2002" && error.meta?.target?.includes("name")) {
            return { name: "This client name is already being used" }
          }
          return { [FORM_ERROR]: error.toString() }
        }
      }}
      className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
    >
      <div className="space-y-6">
        <div>
          <LabeledTextField
            name="name"
            label="Client Name"
            placeholder="Enter client name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <LabeledTextField
            name="contactInfo"
            label="Contact Information"
            placeholder="Email, phone, or address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <LabeledTextField
            name="notes"
            label="Notes"
            placeholder="Additional information about the client"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </Form>
  )
}
