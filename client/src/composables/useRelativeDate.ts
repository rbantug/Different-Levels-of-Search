export function useRelativeDate() {
  const formatRelativeDate = (
    timestamp: number | Date,
    options?: {
      short?: boolean
    },
  ): string => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const now = new Date()

    // Normalize to calendar days
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const calendarDiff = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    if (calendarDiff === 0) return 'Today'
    if (calendarDiff === 1) return 'Yesterday'

    if (calendarDiff < 7) {
      return options?.short ? `${calendarDiff}d ago` : `${calendarDiff} days ago`
    }

    if (calendarDiff < 14) {
      return 'A week ago'
    }

    if (calendarDiff < 30) {
      const weeks = Math.floor(calendarDiff / 7)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }

    if (calendarDiff < 365) {
      const months = Math.floor(calendarDiff / 30)

      if (months === 1) return 'A month ago'

      return `${months} months ago`
    }

    const years = Math.floor(calendarDiff / 365)

    if (years === 1) return 'A year ago'

    return `${years} years ago`
  }

  return {
    formatRelativeDate,
  }
}
