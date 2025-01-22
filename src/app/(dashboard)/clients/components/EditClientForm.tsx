"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import updateClient from "../mutations/updateClient"
import deleteClient from "../mutations/deleteClient"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useState } from "react"
import { Client } from "@prisma/client"

type EditClientFormProps = {
  client: Client
}

const EditClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
  notes: z.string().optional(),
})

export const EditClientForm = ({ client }:EditClientFormProps) => {
  const [updateClientMutation] = useMutation(updateClient)
  const [deleteClientMutation] = useMutation(deleteClient)
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Client Information</h2>
          <Form
            schema={EditClientSchema}
            submitText="Update Client"
            className="space-y-6"
            initialValues={{
              id: client.id,
              name: client.name,
              contactInfo: client.contactInfo,
              notes: client.notes || "",
            }}
            onSubmit={async (values) => {
              try {
                await updateClientMutation(values)
                router.push("/clients")
                router.refresh()
              } catch (error: any) {
                if (error.code === "P2002" && error.meta?.target?.includes("name")) {
                  return { name: "This client name is already being used" }
                }
                return { [FORM_ERROR]: error.toString() }
              }
            }}
          >
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <LabeledTextField
                  name="name"
                  label="Client Name"
                  placeholder="Enter client name"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="sm:col-span-1">
                <LabeledTextField
                  name="contactInfo"
                  label="Contact Information"
                  placeholder="Email, phone, or address"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <LabeledTextField
                  name="notes"
                  label="Notes"
                  placeholder="Additional notes about the client"
                  className="mt-1 block w-full"
                />
                <p className="mt-2 text-sm text-gray-500">Brief notes about the client (optional)</p>
              </div>
            </div>
          </Form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="mr-2 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete Client
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete Client
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this client? This action cannot be undone and will also delete:
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-500">
                        <li>All tasks associated with this client</li>
                        <li>All sprints associated with this client</li>
                        <li>All sprint-task relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 sm:ml-3 sm:w-auto"
                    onClick={async () => {
                      try {
                        await deleteClientMutation({ id: client.id })
                        router.push("/clients")
                        router.refresh()
                      } catch (error) {
                        console.error(error)
                      }
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto"
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
    </div>
  )
}
