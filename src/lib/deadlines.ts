import type { Deadline } from '../types/models'
import { daysFromToday, formatDate } from './dates'

export interface DeadlineGroups {
  upcoming: Deadline[]
  passed: Deadline[]
}

export function sortDeadlines(deadlines: Deadline[]): Deadline[] {
  return [...deadlines].sort((a, b) => a.date.localeCompare(b.date))
}

export function splitDeadlines(
  deadlines: Deadline[],
  today = new Date(),
): DeadlineGroups {
  const sorted = sortDeadlines(deadlines)
  return {
    upcoming: sorted.filter((deadline) => daysFromToday(deadline.date, today) >= 0),
    passed: sorted.filter((deadline) => daysFromToday(deadline.date, today) < 0),
  }
}

export function relativeDeadlineLabel(date: string, today = new Date()): string {
  const days = daysFromToday(date, today)
  if (days === 0) {
    return 'Due today'
  }
  if (days > 0) {
    return `Due in ${days} day${days === 1 ? '' : 's'}`
  }
  const elapsed = Math.abs(days)
  return `Passed ${elapsed} day${elapsed === 1 ? '' : 's'} ago`
}

export function deadlineLabel(date: string, today = new Date()): string {
  return `${formatDate(date)} · ${relativeDeadlineLabel(date, today)}`
}
