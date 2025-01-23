"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import setupDb from './actions/setupDb'
import { createAdmin } from './actions/createAdmin'
import setupCompany from './actions/setupCompany'
import type { DatabaseConfig, AdminUser, CompanyConfig } from './types'
import { WelcomeStep } from './components/WelcomeStep'
import { DatabaseStep } from './components/DatabaseStep'
import { AdminStep } from './components/AdminStep'
import { CompanyStep } from './components/CompanyStep'
import { FinishStep } from './components/FinishStep'

const steps = [
  'Welcome',
  'Database Setup',
  'Admin Account',
  'Company Settings',
  'Finish'
]

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
    database: 'managed_it'
  })

  const [adminConfig, setAdminConfig] = useState<AdminUser>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>({
    name: '',
    email: '',
    phone: '',
    address: '',
    language: 'EN',
    uploadProvider: 'local',
    ossConfig: null
  })

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={() => setCurrentStep(1)} />
      case 1:
        return (
          <DatabaseStep
            config={dbConfig}
            onChange={setDbConfig}
            onNext={handleDatabaseSetup}
            onBack={() => setCurrentStep(0)}
          />
        )
      case 2:
        return (
          <AdminStep
            config={adminConfig}
            onChange={setAdminConfig}
            onNext={handleAdminSetup}
            onBack={() => setCurrentStep(1)}
          />
        )
      case 3:
        return (
          <CompanyStep
            config={companyConfig}
            onChange={setCompanyConfig}
            onNext={handleCompanySetup}
            onBack={() => setCurrentStep(2)}
          />
        )
      case 4:
        return <FinishStep onFinish={() => router.push('/login')} />
    }
  }

  const handleDatabaseSetup = async () => {
    try {
      setLoading(true)
      setError('')
      await setupDb(dbConfig)
      setCurrentStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSetup = async () => {
    try {
      setLoading(true)
      setError('')
      await createAdmin(adminConfig)
      setCurrentStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySetup = async () => {
    try {
      setLoading(true)
      setError('')
      await setupCompany(companyConfig)
      setCurrentStep(4)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <nav className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${
                index < steps.length - 1 ? 'w-full' : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full mx-4 ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Current Step */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </div>
    </div>
  )
}
