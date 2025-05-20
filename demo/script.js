// 模擬資料
const mockData = {
    income: {
        labels: ['個人捐贈', '營利事業捐贈', '政黨捐贈', '人民團體捐贈', '匿名捐贈'],
        data: [45000000, 35000000, 15000000, 5000000, 1000000],
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    },
    expense: {
        labels: ['宣傳支出', '人事支出', '租用支出', '交通支出', '雜支支出'],
        data: [40000000, 20000000, 15000000, 10000000, 5000000],
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }
};

// 格式化金額
function formatCurrency(amount) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        maximumFractionDigits: 0
    }).format(amount);
}

// 計算百分比
function calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(1) + '%';
}

// 繪製收入圖表
function createIncomeChart() {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    const total = mockData.income.data.reduce((a, b) => a + b, 0);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: mockData.income.labels,
            datasets: [{
                data: mockData.income.data,
                backgroundColor: mockData.income.colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Microsoft JhengHei', 'PingFang TC', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = calculatePercentage(value, total);
                            return `${context.label}: ${formatCurrency(value)} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

// 繪製支出圖表
function createExpenseChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const total = mockData.expense.data.reduce((a, b) => a + b, 0);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mockData.expense.labels,
            datasets: [{
                label: '支出金額',
                data: mockData.expense.data,
                backgroundColor: mockData.expense.colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = calculatePercentage(value, total);
                            return `${formatCurrency(value)} (${percentage})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// 更新表格資料
function updateTable() {
    const tableBody = document.getElementById('dataTable');
    const totalIncome = mockData.income.data.reduce((a, b) => a + b, 0);
    const totalExpense = mockData.expense.data.reduce((a, b) => a + b, 0);
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 添加收入資料
    mockData.income.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        const amount = mockData.income.data[index];
        const percentage = calculatePercentage(amount, totalIncome);
        
        row.innerHTML = `
            <td>${label}</td>
            <td>${formatCurrency(amount)}</td>
            <td>${percentage}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // 添加支出資料
    mockData.expense.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        const amount = mockData.expense.data[index];
        const percentage = calculatePercentage(amount, totalExpense);
        
        row.innerHTML = `
            <td>${label}</td>
            <td>${formatCurrency(amount)}</td>
            <td>${percentage}</td>
        `;
        tableBody.appendChild(row);
    });
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    createIncomeChart();
    createExpenseChart();
    updateTable();
}); 