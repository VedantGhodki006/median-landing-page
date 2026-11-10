const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Indian digit grouping with the rupee sign, e.g. 1245300 → "₹12,45,300". */
export function formatINR(value: number): string {
  return `₹${inr.format(Math.round(value))}`;
}
