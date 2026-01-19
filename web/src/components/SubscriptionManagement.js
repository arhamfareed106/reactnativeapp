import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [stats, setStats] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/v1/subscriptions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubscriptions(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching subscriptions');
      setLoading(false);
    }
  };

  // Fetch subscription stats
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/v1/subscriptions/stats/overview', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get('/api/v1/subscriptions/payment-history', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPaymentHistory(response.data.data);
    } catch (err) {
      console.error('Error fetching payment history:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
    fetchPaymentHistory();
  }, []);

  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setShowModal(true);
  };

  const handleSavePlan = async (updatedPlan) => {
    try {
      const response = await axios.put(`/api/v1/subscriptions/${updatedPlan._id}`, updatedPlan, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update the subscription in the list
      setSubscriptions(prev => prev.map(sub => 
        sub._id === updatedPlan._id ? response.data.data : sub
      ));
      
      setShowModal(false);
      setCurrentPlan(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating subscription');
    }
  };

  const handleCreatePlan = async (newPlan) => {
    try {
      const response = await axios.post('/api/v1/subscriptions', newPlan, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSubscriptions(prev => [...prev, response.data.data]);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating subscription');
    }
  };

  const handleArchivePlan = async (id) => {
    try {
      await axios.delete(`/api/v1/subscriptions/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSubscriptions(prev => prev.filter(sub => sub._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error archiving subscription');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d1b12] dark:text-white min-h-screen">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#cfe7d7] dark:border-[#2a3e2f] bg-white dark:bg-[#162a1d] px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-[#0d1b12] dark:text-primary">
            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-black">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h2 className="text-[#0d1b12] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Admin Dashboard</h2>
          </div>
          <label className="flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#4c9a66] flex border-none bg-[#e7f3eb] dark:bg-[#223528] items-center justify-center pl-4 rounded-l-lg">
                <span className="material-symbols-outlined text-sm">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d1b12] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#e7f3eb] dark:bg-[#223528] h-full placeholder:text-[#4c9a66] px-4 rounded-l-none pl-2 text-base font-normal" 
                placeholder="Search accounts..." 
                value="" 
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-9">
            <a className="text-[#0d1b12] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Dashboard</a>
            <a className="text-[#0d1b12] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Users</a>
            <a className="text-primary text-sm font-bold leading-normal border-b-2 border-primary py-1" href="#">Subscriptions</a>
            <a className="text-[#0d1b12] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Reports</a>
          </nav>
          <div className="flex gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#e7f3eb] dark:bg-[#223528] text-[#0d1b12] dark:text-white">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#e7f3eb] dark:bg-[#223528] text-[#0d1b12] dark:text-white relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-accent-orange rounded-full"></span>
            </button>
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" data-alt="User profile avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDeRTD2z9VzRMv7y9WUG8libG6shAmo2Tu9CQqwx4WEMX7MvEBrGCZU8ZoekxVx9gUnAKCy75AerpqQ-mzv1_jcRXf-l8iUZBTSu88saiX3GlgJh50lV-iYr5IvKWI-nUlFiseqwR9RGpvqQoMJCBvCxAHLkLCR4EwL8Tbf4kWthUqvvDQfXbgqxivygCanaFkzQggJ4jNfD0bu-gKMygkfInTe_i8DRp154gOtBiz8ws6sYzP5W71RKPGhC8vZ1galc7jMc9ApMA")'}}></div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto w-full px-10 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4 text-sm font-medium">
          <a className="text-[#4c9a66] hover:underline" href="#">Super Admin</a>
          <span className="text-[#4c9a66]">/</span>
          <span className="text-[#0d1b12] dark:text-white">Subscription Tiers</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
          <div>
            <h1 className="text-[#0d1b12] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Subscription Management</h1>
            <p className="text-[#4c9a66] dark:text-gray-400 mt-1">Define and manage platform pricing tiers for companies and trainers.</p>
          </div>
          <button 
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-black text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all"
            onClick={() => {
              setCurrentPlan({
                planType: '',
                amount: 0,
                billingCycle: 'monthly',
                features: [],
                tagline: ''
              });
              setShowModal(true);
            }}
          >
            <span className="material-symbols-outlined mr-2">add</span>
            <span className="truncate">Create New Tier</span>
          </button>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a3e2f] bg-white dark:bg-[#162a1d] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#4c9a66] text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <p className="text-[#0d1b12] dark:text-white tracking-tight text-3xl font-bold">${stats.totalRevenue || 0}</p>
            <p className="text-[#078829] text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +12% vs last month
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a3e2f] bg-white dark:bg-[#162a1d] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#4c9a66] text-sm font-semibold uppercase tracking-wider">Active Companies</p>
              <span className="material-symbols-outlined text-primary">business</span>
            </div>
            <p className="text-[#0d1b12] dark:text-white tracking-tight text-3xl font-bold">{stats.activeCompanies || 0}</p>
            <p className="text-[#078829] text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +5% this week
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a3e2f] bg-white dark:bg-[#162a1d] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#4c9a66] text-sm font-semibold uppercase tracking-wider">Pending Renewals</p>
              <span className="material-symbols-outlined text-accent-orange">warning</span>
            </div>
            <p className="text-[#0d1b12] dark:text-white tracking-tight text-3xl font-bold">{stats.pendingRenewals || 0}</p>
            <p className="text-accent-orange text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">priority_high</span> 3 critical (Past Due)
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a3e2f] bg-white dark:bg-[#162a1d] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#4c9a66] text-sm font-semibold uppercase tracking-wider">Avg. Plan Value</p>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <p className="text-[#0d1b12] dark:text-white tracking-tight text-3xl font-bold">${stats.avgPlanValue || 0}</p>
            <p className="text-[#078829] text-sm font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +8% increase
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-[#162a1d] rounded-xl border border-[#cfe7d7] dark:border-[#2a3e2f] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f] flex justify-between items-center bg-[#fcfdfc] dark:bg-[#1a2e22]">
            <h3 className="font-bold text-lg">Active Subscription Tiers</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[#cfe7d7] dark:border-[#2a3e2f] rounded-lg hover:bg-[#f0f7f2] dark:hover:bg-[#223528]">
                <span className="material-symbols-outlined text-base">filter_list</span> Filter
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-[#cfe7d7] dark:border-[#2a3e2f] rounded-lg hover:bg-[#f0f7f2] dark:hover:bg-[#223528]">
                <span className="material-symbols-outlined text-base">download</span> Export
              </button>
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fcf9] dark:bg-[#1a2e22] text-[#4c9a66] text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f]">Plan Name</th>
                <th className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f]">Monthly Price</th>
                <th className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f]">Active Companies</th>
                <th className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f]">Included Features</th>
                <th className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f]">Status Alerts</th>
                <th className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfe7d7] dark:divide-[#2a3e2f]">
              {subscriptions.map((sub, index) => (
                <tr key={sub._id} className="hover:bg-[#f8fcf9] dark:hover:bg-[#1d3325] transition-colors group">
                  <td className="px-6 py-5 font-bold text-[#0d1b12] dark:text-white">{sub.planType}</td>
                  <td className="px-6 py-5 text-primary font-bold">${sub.amount} /mo</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sub.activeCompanies || 0}</span>
                      <div className="w-12 h-1 bg-[#e7f3eb] dark:bg-[#223528] rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-3/4"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {sub.features && sub.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#e7f3eb] dark:bg-[#223528] rounded text-xs font-medium">{feature}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      sub.status === 'active' ? 'bg-[#e7f3eb] text-[#078829] dark:bg-[#1a3a24]' : 
                      sub.status === 'past_due' ? 'bg-orange-100 text-accent-orange dark:bg-orange-950/40' : 
                      'bg-orange-50 text-accent-orange border border-orange-200 dark:bg-orange-900/20 dark:border-orange-900'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        sub.status === 'active' ? 'bg-primary' : 
                        sub.status === 'past_due' ? 'bg-accent-orange' : 
                        'bg-accent-orange'
                      } mr-1.5`}></span> 
                      {sub.status === 'active' ? 'Healthy' : sub.status === 'past_due' ? 'Past Due' : 'Trial Expiring'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      className="text-primary font-bold hover:underline"
                      onClick={() => handleEditPlan(sub)}
                    >
                      Edit Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Edit Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#162a1d] w-full max-w-xl rounded-xl shadow-2xl border border-primary/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#cfe7d7] dark:border-[#2a3e2f] flex justify-between items-center bg-[#f8fcf9] dark:bg-[#1a2e22]">
              <h3 className="text-xl font-bold">Edit Plan Details: {currentPlan.planType || 'New Tier'}</h3>
              <button 
                className="text-[#4c9a66] hover:text-[#0d1b12] dark:hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#4c9a66]">Plan Name</label>
                  <input 
                    className="form-input rounded-lg border-[#cfe7d7] dark:border-[#2a3e2f] dark:bg-[#223528] focus:border-primary focus:ring-primary w-full" 
                    type="text" 
                    value={currentPlan.planType}
                    onChange={(e) => setCurrentPlan({...currentPlan, planType: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#4c9a66]">Price (USD/mo)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      className="form-input rounded-lg border-[#cfe7d7] dark:border-[#2a3e2f] dark:bg-[#223528] focus:border-primary focus:ring-primary w-full pl-8" 
                      type="number" 
                      value={currentPlan.amount}
                      onChange={(e) => setCurrentPlan({...currentPlan, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#4c9a66]">Billing Interval</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="billing" 
                      checked={currentPlan.billingCycle === 'monthly'}
                      onChange={() => setCurrentPlan({...currentPlan, billingCycle: 'monthly'})}
                      className="form-radio text-primary focus:ring-primary border-[#cfe7d7] dark:bg-[#223528]" 
                    />
                    <span className="font-medium group-hover:text-primary transition-colors">Monthly Billing</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="billing" 
                      checked={currentPlan.billingCycle === 'yearly'}
                      onChange={() => setCurrentPlan({...currentPlan, billingCycle: 'yearly'})}
                      className="form-radio text-primary focus:ring-primary border-[#cfe7d7] dark:bg-[#223528]" 
                    />
                    <span className="font-medium group-hover:text-primary transition-colors">Annual Billing (-15%)</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#4c9a66]">Core Permissions & Features</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 border border-[#cfe7d7] dark:border-[#2a3e2f] rounded-lg bg-[#f8fcf9] dark:bg-[#1a2e22] cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox rounded text-primary focus:ring-primary dark:bg-[#223528]"
                      checked={currentPlan.features?.includes('AI Talent Matching')}
                      onChange={(e) => {
                        const newFeatures = e.target.checked 
                          ? [...(currentPlan.features || []), 'AI Talent Matching'] 
                          : (currentPlan.features || []).filter(f => f !== 'AI Talent Matching');
                        setCurrentPlan({...currentPlan, features: newFeatures});
                      }}
                    />
                    <span className="text-sm font-semibold">AI Talent Matching</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-[#cfe7d7] dark:border-[#2a3e2f] rounded-lg bg-[#f8fcf9] dark:bg-[#1a2e22] cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox rounded text-primary focus:ring-primary dark:bg-[#223528]"
                      checked={currentPlan.features?.includes('Priority Support Ticketing')}
                      onChange={(e) => {
                        const newFeatures = e.target.checked 
                          ? [...(currentPlan.features || []), 'Priority Support Ticketing'] 
                          : (currentPlan.features || []).filter(f => f !== 'Priority Support Ticketing');
                        setCurrentPlan({...currentPlan, features: newFeatures});
                      }}
                    />
                    <span className="text-sm font-semibold">Priority Support Ticketing</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-[#cfe7d7] dark:border-[#2a3e2f] rounded-lg bg-[#f8fcf9] dark:bg-[#1a2e22] cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox rounded text-primary focus:ring-primary dark:bg-[#223528]"
                      checked={currentPlan.features?.includes('Custom API Access')}
                      onChange={(e) => {
                        const newFeatures = e.target.checked 
                          ? [...(currentPlan.features || []), 'Custom API Access'] 
                          : (currentPlan.features || []).filter(f => f !== 'Custom API Access');
                        setCurrentPlan({...currentPlan, features: newFeatures});
                      }}
                    />
                    <span className="text-sm font-semibold">Custom API Access</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-[#cfe7d7] dark:border-[#2a3e2f] rounded-lg bg-[#f8fcf9] dark:bg-[#1a2e22] cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox rounded text-primary focus:ring-primary dark:bg-[#223528]"
                      checked={currentPlan.features?.includes('Advanced Analytics')}
                      onChange={(e) => {
                        const newFeatures = e.target.checked 
                          ? [...(currentPlan.features || []), 'Advanced Analytics'] 
                          : (currentPlan.features || []).filter(f => f !== 'Advanced Analytics');
                        setCurrentPlan({...currentPlan, features: newFeatures});
                      }}
                    />
                    <span className="text-sm font-semibold">Advanced Analytics</span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#4c9a66]">Public Tagline</label>
                <textarea 
                  className="form-textarea rounded-lg border-[#cfe7d7] dark:border-[#2a3e2f] dark:bg-[#223528] focus:border-primary focus:ring-primary w-full text-sm" 
                  placeholder="e.g. For growing teams that need smarter hiring solutions..."
                  rows="2"
                  value={currentPlan.tagline}
                  onChange={(e) => setCurrentPlan({...currentPlan, tagline: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="px-8 py-6 bg-[#f8fcf9] dark:bg-[#1a2e22] border-t border-[#cfe7d7] dark:border-[#2a3e2f] flex justify-between items-center">
              {currentPlan._id && (
                <button 
                  className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => handleArchivePlan(currentPlan._id)}
                >
                  <span className="material-symbols-outlined text-lg">archive</span> Archive Plan
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button 
                  className="px-6 py-2 rounded-lg font-bold border border-[#cfe7d7] dark:border-[#2a3e2f] hover:bg-[#e7f3eb] dark:hover:bg-[#223528] transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-8 py-2 rounded-lg font-bold bg-primary text-black hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
                  onClick={() => currentPlan._id ? handleSavePlan(currentPlan) : handleCreatePlan(currentPlan)}
                >
                  {currentPlan._id ? 'Save Tier Changes' : 'Create New Tier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;