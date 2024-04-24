export interface Expense {
    id: string;
    name: string;
    amount: number;
    category: ExpenseCategory;
    date: Date;
    isIncome: boolean;
}

export enum ExpenseCategory {
    WOHNEN = 'WOHNEN',
    ESSEN = 'ESSEN',
    GESUNDHEIT = 'GESUNDHEIT',
    KLEIDUNG = 'KLEIDUNG',
    TRANSPORT = 'TRANSPORT',
    FREIZEIT = 'FREIZEIT',
    SONSTIGES = 'SONSTIGES'
}