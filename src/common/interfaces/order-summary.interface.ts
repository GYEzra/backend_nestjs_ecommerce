export interface OrderSummary {
  itemCount: number;
  subTotal: number;
  shippingCost: number;
  couponDiscount: number;
  taxes: number;
  total: number;
}
