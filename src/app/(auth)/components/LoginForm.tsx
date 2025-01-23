"use client"
import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/app/components/Form"
import login from "@/src/app/(auth)/mutations/login"
import { Login } from "../validations"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import type { Route } from "next"
import { useState } from "react" // Add this import

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()
  const next = useSearchParams()?.get("next")
  const [error, setError] = useState<string | null>(null) // Add error state

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Login</h1>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            setError(null) // Clear any previous errors
            await loginMutation(values)
            router.refresh()
            if (next) {
              router.push(next as Route)
            } else {
              router.push("/")
            }
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              // Set more user-friendly error message
              setError("Invalid email or password. Please try again.")
              return { email: " ", password: " " } // Clear form fields
            } else {
              setError("An unexpected error occurred. Please try again.")
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }
        }}
        className="space-y-6"
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />

        {/* Display error message */}
        {error && (
          <div className="text-sm text-red-600 font-medium rounded-md bg-red-50 p-3">{error}</div>
        )}

        <div className="text-sm">
          <Link href={"/forgot-password"} className="text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </Link>
        </div>
      </Form>
    </>
  )
}
