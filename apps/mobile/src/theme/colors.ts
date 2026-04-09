export const colors = {
  // Brand
  primary: "#e64326",
  primaryGradientMid: "#f2691a",
  primaryGradientMidOpacized: "#f2691abd",
  primaryGradientEnd: "#f89d00",
  primarySelectedBg: "#FFF0E6",
  placeholder: "#64748b",
  danger: "#d91a1a",
  success: "#10b981",
  successBg: "#dcfce7",
  disabled: "#e2e8f0",
  disabledBg: "#f8fafc",
  opacized: "rgba(0,0,0,0.25)",
  black: "#000",
  white: "#fff",
  transparent: "transparent",
  gray: "#f1f5f9",
  grayOpacized: "rgba(255,255,255,0.7)",
  dark: "#1e293b",
  darkOpacized: "rgba(255,255,255,0.07)",
  purpleBlue: "#4f46e5",
  darkBlue: "#0c4a6e",
  blue: "#0284c7",
  lightBlue: "#7dd3fc",
  blueBg: "#f0f9ff",
  grayDark: "#94a3b8",
  purple: "#8b5cf6",
  yellow: "#fef9c3",
  brown: "#854d0e",
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
