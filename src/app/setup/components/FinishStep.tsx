export function FinishStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Setup Complete!</h2>
      <p className="text-gray-600 mb-6">
        Your Managed IT system has been successfully configured.
      </p>
      <button
        onClick={onFinish}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Go to Login
      </button>
    </div>
  )
}
