import { ErrorBoundary } from './components/ErrorBoundary'
import { ConfigProvider } from './providers/ConfigProvider'
import { BlitzProvider } from "./blitz-client"
import { Inter } from "next/font/google"
import "./styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "Managed IT",
    template: "%s | Managed IT"
  },
  description: "IT Service Management System",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BlitzProvider>
          <ErrorBoundary>
            <ConfigProvider>
              {children}
            </ConfigProvider>
          </ErrorBoundary>
        </BlitzProvider>
      </body>
    </html>
  )
}
