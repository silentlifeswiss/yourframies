/**
 * Formats a numeric price into Indian Rupee currency standard.
 * e.g. 12999 => "₹12,999"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Validates standard 6-digit Indian Postal PIN codes.
 */
export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim())
}

/**
 * Validates 10-digit Indian mobile numbers.
 */
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/[\s-+]/g, '').slice(-10))
}
