import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * Xuất dữ liệu JSON ra Excel
 * @param data Mảng object JSON
 * @param fileName Tên file (mặc định: export.xlsx)
 * @param sheetName Tên sheet (mặc định: Sheet1)
 */
export function exportJsonToExcel(
  data: Record<string, any>[],
  fileName: string = 'export.xlsx',
  sheetName: string = 'Sheet1'
) {
  if (!data || !data.length) {
    console.warn('Không có dữ liệu để xuất Excel')
    return
  }

  // Tạo worksheet từ JSON
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Xuất file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName)
}
