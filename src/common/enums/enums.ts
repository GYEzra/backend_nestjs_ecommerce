export enum GenderType {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  UNISEX = 'Unisex',
}

export const enum CUSTOM_MESSAGES {
  UNAUTHORIZED = 'Tài khoản hoặc mật khẩu không chính xác',
  ERROR_MONGO_ID = 'ID phải là kiểu MongoId',
}

export const enum RoleType {
  CUSTOMER = 'Khách hàng',
  ADMIN = 'Quản trị viên',
}

export enum CouponStatus {
  ACTIVE = 'Hoạt động',
  INACTIVE = 'Không hoạt động',
  EXPIED = 'Hết hạn',
}

export enum DiscountType {
  PERCENTAGE = 'Phần trăm',
  FIXED_AMOUNT = 'Số tiền',
}

export enum PaymentMethod {
  Cod = 'Thanh toán khi nhận hàng',
  VNPay = 'Ví điện tử VNPay',
  Momo = 'Ví điện tử Momo',
}

export enum PaymentStatus {
  Pending = 'Đang chờ',
  Paid = 'Đã thanh toán',
  Failed = 'Thất bại',
  Cancelled = 'Đã hủy',
  Refunded = 'Đã hoàn tiền',
}

export enum ShippingMethod {
  Standard = 'Giao hàng tiêu chuẩn',
  Express = 'Giao hàng nhanh',
  SameDay = 'Giao hàng hỏa tốc',
}
