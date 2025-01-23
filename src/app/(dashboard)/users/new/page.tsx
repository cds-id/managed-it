import { CreateUserForm } from "src/app/users/components/CreateUserForm"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Create User",
}

export default function NewUserPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/users"
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            ← Back to Users
          </Link>
          <h1 className="text-2xl font-bold mt-4">Create New User</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <CreateUserForm />
        </div>
      </div>
    </div>
  )
}
