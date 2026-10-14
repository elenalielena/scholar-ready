const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function toDate(value: string | Date): Date {
  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return new Date(value)
}

function startOfDay(value: string | Date): Date {
  const date = toDate(value)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(toDate(value))
}

export function daysFromToday(value: string | Date, today = new Date()): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const targetDay = startOfDay(value).getTime()
  const todayDay = startOfDay(today).getTime()
  return Math.round((targetDay - todayDay) / millisecondsPerDay)
}

export function formatHKD(amount: number): string {
  return `HK$${new Intl.NumberFormat('en-GB').format(amount)}`
}
