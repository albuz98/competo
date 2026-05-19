import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";
import { WalletData, Transaction } from "../types/wallet";

const mockWalletData: WalletData = {
  balance: 34500.9,
  iban: "123 456 789 0",
  weeklyTrend: 1234,
};

const mockTransactions: Transaction[] = [
  { id: 1, name: "Barrio FC", sub: 'TORNEO "24 Ore Parona"', amount: "-5 €", isIncome: false },
  { id: 2, name: "Barrio FC", sub: 'TORNEO "24 Ore Parona"', amount: "-5 €", isIncome: false },
  { id: 3, name: "Barrio FC", sub: 'TORNEO "24 Ore Parona"', amount: "-5 €", isIncome: false },
  { id: 4, name: "Atletico Pontesne", sub: 'TORNEO "Copa del Sol"', amount: "+20 €", isIncome: true },
  { id: 5, name: "Real Deborah", sub: 'TORNEO "Campionato Estivo"', amount: "-5 €", isIncome: false },
];

export async function fetchWalletData(token: string): Promise<WalletData> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_WALLET) {
    await new Promise((r) => setTimeout(r, 300));
    return { ...mockWalletData };
  }
  return apiFetch<WalletData>("/api/v1/wallet", {}, token);
}

export async function fetchTransactions(token: string): Promise<Transaction[]> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_TRANSACTIONS) {
    await new Promise((r) => setTimeout(r, 300));
    return [...mockTransactions];
  }
  return apiFetch<Transaction[]>("/api/v1/wallet/transactions", {}, token);
}
