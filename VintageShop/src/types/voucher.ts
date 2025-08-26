export interface Voucher {
  id: number;
  voucherCode: string;
  startDate: string;
  endDate: string;
  discountPercentage: number | null;
  status: number;
}