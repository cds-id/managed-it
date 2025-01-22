import { useSession } from "@blitzjs/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useAuthorize = (allowedRoles?: string[]) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session.userId) {
      router.push("/login")
      return
    }

    if (allowedRoles && !allowedRoles.includes(session?.role ?? "")) {
      router.push("/")
      return
    }
  }, [session, router, allowedRoles])

  return session
}
