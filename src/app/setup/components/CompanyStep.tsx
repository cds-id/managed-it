import { CompanyConfig } from '../types'

export function CompanyStep({
  config,
  onChange,
  onNext,
  onBack
}: {
  config: CompanyConfig
  onChange: (config: CompanyConfig) => void
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Company Settings</h2>
      {/* Add company form fields */}
      <div className="flex justify-between pt-4">
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  )
}
