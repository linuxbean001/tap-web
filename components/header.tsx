export default function Header({ title }: { title: string }) {
  return (
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-9">
          {title}
        </h1>
      </div>
    </header>
  )
}
