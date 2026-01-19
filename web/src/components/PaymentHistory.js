import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Fetch payment history
  const fetchPaymentHistory = async (page = 1) => {
    try {
      let query = `page=${page}`;
      if (filters.status) query += `&status=${filters.status}`;
      if (filters.startDate && filters.endDate) {
        query += `&startDate=${filters.startDate}&endDate=${filters.endDate}`;
      }

      const response = await axios.get(`/api/v1/subscriptions/payment-history?${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching payment history');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory(currentPage);
  }, [filters, currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-primary">
                <div className="size-6">
                  <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Workforce Platform</h2>
              </div>
              <div className="flex items-center gap-9">
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Dashboard</a>
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Companies</a>
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Trainers</a>
                <a className="text-primary text-sm font-bold leading-normal border-b-2 border-primary" href="#">Payments</a>
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Reports</a>
              </div>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
              <label className="flex flex-col min-w-40 h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
                  <div className="text-slate-400 flex bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4">
                    <span className="material-symbols-outlined text-xl">search</span>
                  </div>
                  <input 
                    className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-0 h-full placeholder:text-slate-400 px-4 pl-2 text-sm font-normal" 
                    placeholder="Search transactions..." 
                    value="" 
                  />
                </div>
              </label>
              <div className="flex gap-2">
                <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">notifications</span>
                </button>
                <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">settings</span>
                </button>
              </div>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-slate-700" data-alt="Avatar of the super admin" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCxhdPNhaUqWWnkZEj6n2_WzBqps8_2qdkOqqTWB_HBMaqRlEi1R6wRaVVktvVANVdDS3AQ3ApBuTxw3M9iWcAxkHaaCnxhfaeZTrNJ6kCLVi_bYUt3g63qdqzauKGMDpZjseY49FC6MindZoTeyigvNWbU72XI40A74jhHcTM0ll4z5JfIkmR0JTohU9cj7Nq-lo-MH4qAVzGCLiDlv_RG-tVJ1sSgIp5q_abiHBIVyGBs_8X6TP24ZaPzM8TVr3wrYMAYNkc54w")'}}></div>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full flex-1 px-4 sm:px-10 py-8">
              {/* Page Heading */}
              <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Payment & Revenue Logs</p>
                  <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage platform-wide financial transactions and revenue growth.</p>
                </div>
                <button className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-all">
                  <span className="material-symbols-outlined">download</span>
                  <span className="truncate">Export CSV</span>
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                  <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">$128,430.00</p>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+12.5% vs last month</span>
                  </div>
                </div>
                <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Pending Payouts</p>
                  <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">$12,250.00</p>
                  <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>48 scheduled transfers</span>
                  </div>
                </div>
                <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Payment Success Rate</p>
                  <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">98.2%</p>
                  <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-bold">
                    <span className="material-symbols-outlined text-sm">trending_down</span>
                    <span>-0.4% drop</span>
                  </div>
                </div>
              </div>

              {/* Revenue Trends Chart */}
              <div className="mb-8">
                <div className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">Revenue Trends</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Daily earnings over the last 30 days</p>
                    </div>
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white">30 Days</button>
                      <button className="px-4 py-1.5 text-xs font-bold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-colors">90 Days</button>
                      <button className="px-4 py-1.5 text-xs font-bold rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-colors">1 Year</button>
                    </div>
                  </div>
                  <div className="flex min-h-[240px] flex-1 flex-col gap-8 py-4">
                    <svg fill="none" height="200" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_revenue)"></path>
                      <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#137fec" strokeLinecap="round" strokeWidth="3"></path>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_revenue" x1="236" x2="236" y1="1" y2="149">
                          <stop stopColor="#137fec" stopOpacity="0.2"></stop>
                          <stop offset="1" stopColor="#137fec" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="flex justify-between px-2">
                      <p className="text-slate-400 text-xs font-bold tracking-wider">OCT 01</p>
                      <p className="text-slate-400 text-xs font-bold tracking-wider">OCT 07</p>
                      <p className="text-slate-400 text-xs font-bold tracking-wider">OCT 14</p>
                      <p className="text-slate-400 text-xs font-bold tracking-wider">OCT 21</p>
                      <p className="text-slate-400 text-xs font-bold tracking-wider">OCT 30</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Ledger */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight mb-4">Transaction Ledger</h2>
                  {/* Filters Bar */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-slate-400 text-xl">corporate_fare</span>
                        <select 
                          className="form-select w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 focus:ring-primary focus:border-primary"
                          value={filters.company || ''}
                          onChange={(e) => handleFilterChange('company', e.target.value)}
                        >
                          <option value="">All Companies</option>
                          <option>AeroGlobal Inc.</option>
                          <option>TechStream Logistics</option>
                          <option>BuildRight Construction</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-slate-400 text-xl">filter_list</span>
                        <select 
                          className="form-select w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 focus:ring-primary focus:border-primary"
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-slate-400 text-xl">calendar_today</span>
                        <input 
                          className="form-input w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 focus:ring-primary focus:border-primary" 
                          placeholder="Start Date" 
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-slate-400 text-xl">calendar_today</span>
                        <input 
                          className="form-input w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 focus:ring-primary focus:border-primary" 
                          placeholder="End Date" 
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      className="h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => {
                        setFilters({
                          status: '',
                          startDate: '',
                          endDate: ''
                        });
                        setCurrentPage(1);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-slate-400">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono text-slate-500">{transaction.transactionId || `TRX-${1000000 + index}`}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{transaction.company?.name || transaction.user?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${transaction.amount || 0}.00</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(transaction.status)}`}>
                              {transaction.status || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-primary text-sm font-bold hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Showing {(currentPage - 1) * 25 + 1} to {Math.min(currentPage * 25, pagination.totalRecords)} of {pagination.totalRecords} transactions</p>
                  <div className="flex gap-2">
                    <button 
                      className="flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button 
                        key={i+1}
                        className={`flex items-center justify-center rounded-lg h-9 w-9 ${
                          currentPage === i+1 
                            ? 'bg-primary text-white font-bold' 
                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                        }`}
                        onClick={() => setCurrentPage(i+1)}
                      >
                        {i+1}
                      </button>
                    ))}
                    <button 
                      className="flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                      disabled={currentPage === pagination.totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {/* Footer */}
          <footer className="mt-auto px-10 py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-slate-400 text-xs">
            © 2023 Workforce Platform. Secure Payments & Automated Revenue Tracking.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;