interface LiveRegionProps {
  message: string
}

export default function LiveRegion({ message }: LiveRegionProps) {
  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}
