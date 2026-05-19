export interface WalletData {
  balance: number;
  iban: string;
  weeklyTrend: number;
}

export interface Transaction {
  id: number;
  name: string;
  sub: string;
  amount: string;
  isIncome: boolean;
}
