import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Papa } from 'ngx-papaparse';

import { Donation, DonationCategory } from '../models/donation.model';
import { Expense, ExpenseCategory } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient,
    private papa: Papa
  ) { }

  getIncomes(): Observable<Donation[]> {
    return this.http.get('assets/incomes.csv', { responseType: 'text' })
      .pipe(
        map(csv => {
          const result = this.papa.parse(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
          });
          return result.data as Donation[];
        })
      );
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get('assets/expenditures.csv', { responseType: 'text' })
      .pipe(
        map(csv => {
          const result = this.papa.parse(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
          });
          return result.data as Expense[];
        })
      );
  }

  getIncomeCategories(incomes: Donation[]): DonationCategory[] {
    const categories = new Map<string, number>();
    
    incomes.forEach(income => {
      const category = income.category;
      const amount = income.income_amount || 0;
      
      if (categories.has(category)) {
        categories.set(category, categories.get(category)! + amount);
      } else {
        categories.set(category, amount);
      }
    });

    const total = Array.from(categories.values()).reduce((sum, amount) => sum + amount, 0);
    
    return Array.from(categories.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: (value / total) * 100
    }));
  }

  getExpenseCategories(expenses: Expense[]): ExpenseCategory[] {
    const categories = new Map<string, number>();
    
    expenses.forEach(expense => {
      const category = expense.category;
      const amount = expense.expenditure_amount || 0;
      
      if (categories.has(category)) {
        categories.set(category, categories.get(category)! + amount);
      } else {
        categories.set(category, amount);
      }
    });

    const total = Array.from(categories.values()).reduce((sum, amount) => sum + amount, 0);
    
    return Array.from(categories.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: (value / total) * 100
    }));
  }

  // 格式化金額
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0
    }).format(amount);
  }
} 