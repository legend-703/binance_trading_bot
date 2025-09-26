export function percentChange(oldVal: number, newVal: number) {
  if (!oldVal) return 0;
  return ((newVal - oldVal) / oldVal) * 100;
}