export interface Expense {
  serial_no: number;
  candidate_or_party: string;
  election_name: string;
  transaction_date: string;
  category: string;
  donor_or_recipient: string;
  id_number?: string;
  expenditure_amount: number;
  purpose?: string;
  money_type: string;
  address?: string;
  phone_number?: string;
  disclosed_recipient?: string;
}

export interface ExpenseCategory {
  name: string;
  value: number;
  percentage?: number;
} 