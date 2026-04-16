import { Linking } from "react-native";

export const formatDateOfBirth = (dob: string): string => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) return dob;
  const d = new Date(dob);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${d.getFullYear()}`;
  }
  return dob;
};

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function parseISO(iso: string): {
  year: number;
  month: number;
  day: number;
} {
  const today = new Date();
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return { year: y, month: m - 1, day: d };
  }
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  };
}

export function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function todayISO(): string {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

export function openPdf(url: string) {
  Linking.openURL(url).catch(() => {});
}
