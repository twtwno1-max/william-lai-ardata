import { Component, OnInit } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DataService } from '../../services/data.service';
import { Donation, DonationCategory, ChartData } from '../../models/donation.model';
import { Expense, ExpenseCategory } from '../../models/expense.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule, NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    // BrowserAnimationsModule,
  ]
})
export class DashboardComponent implements OnInit {
  // 資料
  incomes: Donation[] = [];
  expenses: Expense[] = [];
  incomeCategories: DonationCategory[] = [];
  expenseCategories: ExpenseCategory[] = [];

  // 圖表資料
  incomeChartData: ChartData[] = [];
  expenseChartData: ChartData[] = [];

  // 圖表設定
  view: [number, number] = [700, 400];

  // 顏色配置
  colorScheme: Color = {
    name: 'Political Donations',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF']
  };

  // 顯示設定
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = '類別';
  yAxisLabel = '金額';

  // 加載狀態
  loading: boolean = true;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // 載入收入資料
    this.dataService.getIncomes().subscribe({
      next: (data) => {
        this.incomes = data;
        this.incomeCategories = this.dataService.getIncomeCategories(data);
        this.prepareIncomeChartData();
      },
      error: (error) => {
        console.error('載入收入資料錯誤:', error);
      }
    });

    // 載入支出資料
    this.dataService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
        this.expenseCategories = this.dataService.getExpenseCategories(data);
        this.prepareExpenseChartData();
        this.loading = false;
      },
      error: (error) => {
        console.error('載入支出資料錯誤:', error);
        this.loading = false;
      }
    });
  }

  prepareIncomeChartData(): void {
    this.incomeChartData = this.incomeCategories.map(category => ({
      name: category.name,
      value: category.value
    }));
  }

  prepareExpenseChartData(): void {
    this.expenseChartData = this.expenseCategories.map(category => ({
      name: category.name,
      value: category.value
    }));
  }

  formatCurrency(amount: number): string {
    return this.dataService.formatCurrency(amount);
  }

  onSelect(event: any): void {
    console.log('選擇項目:', event);
  }
  
  // 計算總額的輔助函數
  getTotalIncome(): number {
    return this.incomeCategories.reduce((sum, cat) => sum + cat.value, 0);
  }
  
  getTotalExpense(): number {
    return this.expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
  }
  
  // 獲取當前年份
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
} 