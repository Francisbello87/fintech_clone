import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./mmkv-storage";
export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  title: string;
};

export type BalanceState = {
  transactions: Transaction[];
  runTransaction: (transaction: Transaction) => void;
  balance: () => number;
  clearTransactions: () => void;
};

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      runTransaction: (transaction: Transaction) => {
        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));
      },
      balance: () => get().transactions.reduce((acc, t) => acc + t.amount, 0),
      clearTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: "balance-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
