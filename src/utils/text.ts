export function truncateTextInMiddle(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text
  }

  const ellipsis = '...'
  const halfMaxLength = Math.floor((maxLength - ellipsis.length) / 2)
  const truncatedText =
    text.slice(0, halfMaxLength) + ellipsis + text.slice(-halfMaxLength)
  return truncatedText
}
