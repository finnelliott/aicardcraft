import AppSteps from "@/components/application/AppSteps";

export default function Layout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode,
  }) {
        return (
            <div className="w-screen min-h-screen bg-gray-50 py-12">
                <div className="w-full max-w-2xl mx-auto sm:p-4">
                <div className="pb-4">
                    <h1 className="w-full text-center font-semibold text-3xl text-indigo-600 tracking-tight pb-2">One-of-One Cards</h1>
                    <p className="w-full max-w-sm mx-auto font-medium text-lg text-gray-600 tracking-tight text-center">Generate a unique card for any occasion using the power of&nbsp;AI.</p>
                </div>
                {children}
                </div>
            </div>
        )
}