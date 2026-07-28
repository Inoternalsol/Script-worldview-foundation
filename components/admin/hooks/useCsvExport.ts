import { useCallback } from 'react'

export function useCsvExport<T>() {
  const exportCsv = useCallback((filename: string, headers: string[], data: T[], rowMapper: (item: T) => string[]) => {
    const rows = data.map(rowMapper).map(row => 
      row.map(cell => {
        if (cell === null || cell === undefined) return ''
        const str = String(cell)
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      })
    )

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return { exportCsv }
}
