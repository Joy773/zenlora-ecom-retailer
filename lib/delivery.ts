export function getDeliveryFee(city: string): number | null {
  const normalizedCity = city.trim().toLowerCase();
  if (!normalizedCity) return null;

  return normalizedCity === "dhaka" || normalizedCity === "ঢাকা" ? 70 : 130;
}
