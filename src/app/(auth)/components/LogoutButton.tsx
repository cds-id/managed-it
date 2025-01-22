"use client"
import styles from "../../styles/Home.module.css"
import logout from "../mutations/logout"
import { useRouter } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"

export function LogoutButton() {
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  return (
    <button
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={async () => {
        await logoutMutation()
        router.refresh()
      }}
    >
      Logout
    </button>
  )
}
