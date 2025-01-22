import { redirect } from "next/navigation"
import { invoke } from "./blitz-server"
import getCurrentUser from "./users/queries/getCurrentUser"

export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)

  if (currentUser) {
    redirect("/dashboard")
  }

  redirect("/login")
}
