import React from 'react';

const AdminDashboard = () => {
  // Mock data for admin dashboard
  const adminStats = [
    { name: 'Total Users', value: '1,248', change: '+12%', changeType: 'positive' },
    { name: 'Active Companies', value: '86', change: '+5%', changeType: 'positive' },
    { name: 'Pending Verifications', value: '14', change: '-3', changeType: 'negative' },
    { name: 'Revenue (Monthly)', value: '$42,560', change: '+8.2%', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, action: 'New company registered', user: 'TechCorp Inc.', time: '2 mins ago', type: 'company' },
    { id: 2, action: 'User suspended', user: 'John Doe', time: '15 mins ago', type: 'user' },
    { id: 3, action: 'Payment received', user: 'Global Logistics', time: '1 hour ago', type: 'payment' },
    { id: 4, action: 'Training approved', user: 'Safety First Ltd.', time: '3 hours ago', type: 'training' },
  ];

  const pendingVerifications = [
    { id: 1, company: 'Construction Co.', owner: 'Mike Johnson', date: '2023-10-15', status: 'pending' },
    { id: 2, company: 'Health Services LLC', owner: 'Sarah Williams', date: '2023-10-14', status: 'pending' },
    { id: 3, company: 'Manufacturing Inc', owner: 'Robert Brown', date: '2023-10-12', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-500 text-sm">System-wide oversight and management panel for the workforce platform.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.name}</p>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 
                stat.changeType === 'negative' ? 'bg-red-100 text-red-800' : 
                'bg-orange-100 text-orange-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Grid (Recent Activities + Pending Verifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Recent System Activity</h3>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{activity.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                        activity.type === 'company' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'user' ? 'bg-red-100 text-red-800' :
                        activity.type === 'payment' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Pending Company Verifications</h3>
            <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-full">3 URGENT</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-gray-100">
              {pendingVerifications.map((verification) => (
                <li key={verification.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{verification.company}</p>
                      <p className="text-sm text-gray-500">Owner: {verification.owner}</p>
                      <p className="text-xs text-gray-400">Submitted: {verification.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Platform Health Metrics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Health Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700">User Engagement</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="text-xs text-gray-500">78% active users this month</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700">System Performance</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
            </div>
            <p className="text-xs text-gray-500">95% uptime this quarter</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700">Security Score</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-gray-500">92% compliance rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;