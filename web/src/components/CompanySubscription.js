import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanySubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Available plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 49,
      features: ['Up to 10 workers', 'Basic scheduling', 'Email support'],
      description: 'Perfect for small businesses getting started'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 149,
      features: ['Up to 50 workers', 'Advanced scheduling', 'Priority support', 'Analytics dashboard'],
      description: 'Ideal for growing businesses'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited workers', 'Custom integrations', 'Dedicated account manager', '24/7 support'],
      description: 'For large organizations with custom needs'
    }
  ];

  // Fetch user's subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/v1/subscriptions/my-subscriptions', {
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

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubscribe = async (plan) => {
    try {
      // Create subscription with payment method
      const response = await axios.post('/api/v1/subscriptions', {
        planType: plan.id,
        amount: typeof plan.price === 'number' ? plan.price : 0,
        currency: 'USD',
        billingCycle: 'monthly',
        paymentMethod: 'stripe'
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // If it's a Stripe subscription, redirect to payment
      if (response.data.clientSecret) {
        // Here you would typically redirect to Stripe checkout
        // For now, we'll just show a message
        alert('Redirecting to payment...');
      }

      fetchSubscriptions(); // Refresh subscriptions
      setShowUpgradeModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error subscribing to plan');
    }
  };

  const handleCancel = async (subscriptionId) => {
    try {
      await axios.put(`/api/v1/subscriptions/${subscriptionId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchSubscriptions(); // Refresh subscriptions
    } catch (err) {
      setError(err.response?.data?.message || 'Error cancelling subscription');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const currentSubscription = subscriptions.length > 0 ? subscriptions[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600 mb-6">Manage your company's subscription plan and billing information</p>

          {/* Current Subscription Card */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Plan</h2>
                {currentSubscription ? (
                  <>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      {currentSubscription.planType.charAt(0).toUpperCase() + currentSubscription.planType.slice(1)}
                    </p>
                    <p className="text-gray-600 mb-4">
                      ${typeof currentSubscription.amount === 'number' ? currentSubscription.amount : 'Custom'} / {currentSubscription.billingCycle}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentSubscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : currentSubscription.status === 'cancelled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentSubscription.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : currentSubscription.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {currentSubscription.paymentStatus.charAt(0).toUpperCase() + currentSubscription.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Ends on {currentSubscription.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No active subscription</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {!currentSubscription ? (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Subscribe Now
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      Change Plan
                    </button>
                    <button
                      className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium"
                      onClick={() => handleCancel(currentSubscription._id)}
                    >
                      Cancel Subscription
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Plan Options */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-6 ${
                    currentSubscription?.planType === plan.id 
                      ? 'border-green-500 ring-2 ring-green-500/20' 
                      : 'border-gray-200'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                    </span>
                    <span className="text-gray-600"> / month</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      currentSubscription?.planType === plan.id
                        ? 'bg-gray-100 text-gray-900 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    onClick={() => {
                      if (currentSubscription?.planType !== plan.id) {
                        setSelectedPlan(plan);
                        setShowUpgradeModal(true);
                      }
                    }}
                    disabled={currentSubscription?.planType === plan.id}
                  >
                    {currentSubscription?.planType === plan.id ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Information */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <p className="text-gray-900">•••• •••• •••• 4242 (Visa)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                <p className="text-gray-900">
                  {currentSubscription?.endDate 
                    ? new Date(currentSubscription.endDate).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                <p className="text-gray-900 capitalize">
                  {currentSubscription?.billingCycle || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto Renewal</label>
                <p className="text-gray-900">
                  {currentSubscription?.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedPlan ? `Upgrade to ${selectedPlan.name}` : 'Choose a Plan'}
            </h3>
            
            {selectedPlan && (
              <div className="mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ${typeof selectedPlan.price === 'number' ? selectedPlan.price : selectedPlan.price} / month
                </p>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                onClick={() => {
                  if (selectedPlan) {
                    handleSubscribe(selectedPlan);
                  }
                }}
              >
                {currentSubscription ? 'Upgrade Plan' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySubscription;