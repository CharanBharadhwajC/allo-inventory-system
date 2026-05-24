export function isExpired(date: Date) {
  return new Date() > new Date(date)
}