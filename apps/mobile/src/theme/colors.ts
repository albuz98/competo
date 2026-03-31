export const colors = {
  // Brand
  primary: "#e64326",
  primaryGradientMid: "#f2691a",
  primaryGradientMidOpacized: "#f2691abd",
  primaryGradientEnd: "#f89d00",
  primarySelectedBg: "#FFF0E6",
  disabled: "#e2e8f0",
  disabledBg: "#f8fafc",
  placeholder: "#64748b",

  // Semantic
  danger: "#d91a1a",
  success: "#10b981",
} as const;

export const colorGradient = [
  colors.primary,
  colors.primaryGradientMid,
  colors.primaryGradientEnd,
] as const;

export const colorGradientReverse = [
  colors.primaryGradientEnd,
  colors.primaryGradientMid,
  colors.primary,
] as const;
