"use client"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getUsers from "../../../users/queries/getUsers"
import updateUserRole from "../../../users/mutations/updateUserRole"
import { UserRole } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/src/app/utils/formatDate"
import { Route } from "next"

export function UserList() {
  const [{ users }, { refetch }] = useQuery(getUsers, {})
  const [updateUserRoleMutation] = useMutation(updateUserRole)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setIsUpdating(true)
      await updateUserRoleMutation({ userId, role: newRole })
      await refetch()
      router.refresh()
    } catch (error) {
      console.error("Failed to update user role:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name/Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="font-medium text-gray-900">{user.name || "No name"}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/users/${user.id}` as Route}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {user.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}
