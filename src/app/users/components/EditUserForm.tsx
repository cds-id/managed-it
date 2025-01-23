"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledSelect } from "src/app/components/LabeledSelect"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { UpdateUserSchema } from "../schemas"
import updateUser from "../mutations/updateUser"
import deleteUser from "../mutations/deleteUser"
import { useState } from "react"
import { User } from "../queries/getUsers"

interface EditUserFormProps {
  user: User
}

export function EditUserForm({ user }: EditUserFormProps) {
  const [updateUserMutation] = useMutation(updateUser)
  const [deleteUserMutation] = useMutation(deleteUser)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Form
        submitText="Update User"
        schema={UpdateUserSchema}
        initialValues={{
          id: user.id,
          name: user.name || "",
          email: user.email,
          role: user.role as "ADMIN"| "WORKER",
        }}
        onSubmit={async (values) => {
          try {
            await updateUserMutation(values)
            router.push("/users")
            router.refresh()
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              return { email: "This email is already being used" }
            }
            return { [FORM_ERROR]: error.toString() }
          }
        }}
        className="space-y-6"
      >
        <LabeledTextField
          name="name"
          label="Name"
          placeholder="Full name"
        />
        <LabeledTextField
          name="email"
          label="Email"
          placeholder="Email address"
        />
        <LabeledTextField
          name="password"
          label="New Password (optional)"
          placeholder="Leave blank to keep current password"
          type="password"
        />
        <LabeledSelect
          name="role"
          label="Role"
          options={[
            { label: "Worker", value: "WORKER" },
            { label: "Admin", value: "ADMIN" },
          ]}
        />
      </Form>

      <div className="mt-6">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete User
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteUserMutation({ id: user.id })
                  router.push("/users")
                  router.refresh()
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
