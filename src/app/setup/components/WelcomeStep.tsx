export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to Managed IT</h2>
      <p className="text-gray-600 mb-6">
        This wizard will help you set up your Managed IT installation. Please follow
        the steps to configure your system.
      </p>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
