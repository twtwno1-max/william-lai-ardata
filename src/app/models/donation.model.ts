export interface Donation {
  serial_no: number;
  candidate_or_party: string;
  election_name: string;
  transaction_date: string;
  category: string;
  donor_or_recipient: string;
  id_number?: string;
  income_amount: number;
  donation_method?: string;
  deposit_date?: string;
  money_type: string;
  address?: string;
}

export interface DonationCategory {
  name: string;
  value: number;
  percentage?: number;
}

export interface ChartData {
  name: string;
  value: number;
} 