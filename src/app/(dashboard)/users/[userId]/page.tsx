import { EditUserForm } from "src/app/users/components/EditUserForm"
import { invoke } from "src/app/blitz-server"
import getUser from ".././../../users/queries/getUser"
import { notFound } from "next/navigation"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Edit User",
}

export default async function EditUserPage({ params }: { params: { userId: string } }) {
  const user = await invoke(getUser, { id: params.userId }).catch(() => null)

  if (!user) return notFound()

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
          <h1 className="text-2xl font-bold mt-4">Edit User</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <EditUserForm user={user} />
        </div>
      </div>
    </div>
  )
}
