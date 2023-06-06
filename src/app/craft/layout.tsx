export default function Layout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode,
  }) {
        return (
            <div className="w-full h-full">
                <div className="w-full max-w-7xl mx-auto sm:p-4">
                {children}
                </div>
            </div>
        )
}