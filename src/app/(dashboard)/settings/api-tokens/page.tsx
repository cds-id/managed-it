import { Metadata } from "next"
import { ApiTokenList } from "./components/ApiTokenList"

export const metadata: Metadata = {
  title: "API Tokens",
}

export default function ApiTokensPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">API Tokens</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your API tokens for third-party integrations
          </p>
        </div>
      </div>
      <ApiTokenList />
    </div>
  )
}
