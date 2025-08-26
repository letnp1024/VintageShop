export interface ChartItem {
  label: string;
  revenue: number; // hoặc dùng string nếu muốn giữ định dạng BigDecimal
  countSuccess: number;
  countCanceled: number;
}