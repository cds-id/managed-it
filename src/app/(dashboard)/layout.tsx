import { useAuthenticatedBlitzContext } from "src/app/blitz-server"
import { Suspense } from "react"
import type { Route } from "next"
import {DashboardLayoutClient} from "../layouts/DashboardLayoutClient"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login" as Route,
  })

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </Suspense>
  )
}
