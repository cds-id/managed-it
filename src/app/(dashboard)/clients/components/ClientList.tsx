"use client"
import { useQuery } from "@blitzjs/rpc"
import getClients from "../queries/getClients"
import Link from "next/link"
import type { Route } from "next"

export const ClientList = () => {
  const [{ clients }] = useQuery(getClients, {})

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{client.name}</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Contact:</span> {client.contactInfo}
              </p>
              {client.notes && (
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Notes:</span> {client.notes}
                </p>
              )}
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6">
            <Link
              href={`/clients/${client.id}` as Route}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              Edit Client →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
