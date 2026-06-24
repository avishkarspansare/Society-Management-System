export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`${sizes[size] || sizes.md} ${className} border-2 border-surface-700 border-t-primary-500 rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <Spinner size="lg" />
      <p className="text-surface-400 text-sm animate-pulse">Loading...</p>
    </div>
  )
}
