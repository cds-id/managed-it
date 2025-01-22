import { ClientForm } from "../components/ClientForm"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "New Client",
}
export default function NewClientPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 sm:text-3xl">Create New Client</h1>
      <div className="max-w-2xl mx-auto">
        <ClientForm />
      </div>
    </div>
  )
}
