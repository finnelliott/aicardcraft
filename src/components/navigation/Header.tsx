import Image from 'next/image';

export default function Header() {
  return (
    <header className="">
      <nav className="mx-auto flex max-w-7xl items-center justify-center p-4 py-6" aria-label="Global">
        <div className="flex">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">AI Card Craft</span>
            <Image width={795} height={107} className="h-8 w-auto" src="/logo.png" alt="" />
          </a>
        </div>
      </nav>
    </header>
  )
}
