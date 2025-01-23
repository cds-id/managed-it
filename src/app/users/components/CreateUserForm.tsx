"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { LabeledSelect } from "src/app/components/LabeledSelect"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { CreateUserSchema } from "../schemas"
import createUser from "../mutations/createUser"

export function CreateUserForm() {
  const [createUserMutation] = useMutation(createUser)
  const router = useRouter()

  return (
    <Form
      submitText="Create User"
      schema={CreateUserSchema}
      initialValues={{
        name: "",
        email: "",
        password: "",
        role: "WORKER",
      }}
      onSubmit={async (values) => {
        try {
          await createUserMutation(values)
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
        label="Password"
        placeholder="Password"
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
  )
}
