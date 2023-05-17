export default function CardWithHeader({ header, body}: { header: React.ReactNode, body: React.ReactNode }) {
    return (
      <div className="divide-y divide-gray-200 overflow-hidden sm:rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          { header }
        </div>
        <div className="px-4 py-5 sm:p-6">{ body }</div>
      </div>
    )
  }
  