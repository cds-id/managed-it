import { invoke } from "src/app/blitz-server"
import getSprint from "../queries/getSprint"
import { notFound } from "next/navigation"
import { Metadata } from 'next'
import Link from "next/link"
import { SprintDetail } from "../components/SprintDetail"

export const metadata: Metadata = {
  title: "Sprint Details",
}

export default async function SprintDetailPage({ params }: { params: { sprintId: string } }) {
  const sprint = await invoke(getSprint, { id: params.sprintId }).catch(() => null)

  if (!sprint) return notFound()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Link
            href="/sprints"
            className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            ← Back to Sprints
          </Link>
        </div>
        <SprintDetail sprint={sprint} />
      </div>
    </div>
  )
}
