export function useFormatting() {
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatNumber(num: number) {
    return num.toLocaleString('fr-FR')
  }

  return {
    formatDate,
    formatNumber
  }
}