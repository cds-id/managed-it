import { EditClientForm } from "../components/EditClientForm"
import { invoke } from "src/app/blitz-server"
import getClient from "../queries/getClient"
import { notFound } from "next/navigation"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Edit Client",
}
export default async function EditClientPage({ params }: { params: { clientId: string } }) {
  const client = await invoke(getClient, { id: params.clientId }).catch(() => null)

  if (!client) return notFound()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Edit Client</h1>
      <div className="max-w-2xl">
        <EditClientForm client={client} />
      </div>
    </div>
  )
}
