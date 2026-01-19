import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkerSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Worker subscription plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic Access',
      price: 9.99,
      features: ['Browse available shifts', 'Apply to 5 shifts/month', 'Basic profile'],
      description: 'Essential access to the platform'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 19.99,
      features: ['Browse unlimited shifts', 'Apply to 20 shifts/month', 'Enhanced profile', 'Priority applications'],
      description: 'Recommended for active workers'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      features: ['Unlimited shift applications', 'Full profile access', 'Application tracking', 'Exclusive opportunities'],
      description: 'Best value for power users'
    }
  ];

  // Fetch worker's subscription
  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/api/v1/subscriptions/my-subscriptions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.data.length > 0) {
        setSubscription(response.data.data[0]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching subscription');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSubscribe = async (plan) => {
    try {
      // Create subscription with payment method
      const response = await axios.post('/api/v1/subscriptions', {
        planType: plan.id,
        amount: plan.price,
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

      fetchSubscription(); // Refresh subscription
      setShowPaymentModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error subscribing to plan');
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    
    try {
      await axios.put(`/api/v1/subscriptions/${subscription._id}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchSubscription(); // Refresh subscription
    } catch (err) {
      setError(err.response?.data?.message || 'Error cancelling subscription');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription & Access</h1>
          <p className="text-gray-600 mb-6">Manage your subscription to access shifts and platform features</p>

          {/* Current Subscription Card */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Plan</h2>
                {subscription ? (
                  <>
                    <p className="text-3xl font-bold text-green-600 mb-2">
                      {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)}
                    </p>
                    <p className="text-gray-600 mb-4">
                      ${typeof subscription.amount === 'number' ? subscription.amount.toFixed(2) : 'Custom'} / {subscription.billingCycle}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : subscription.status === 'cancelled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscription.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : subscription.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.paymentStatus.charAt(0).toUpperCase() + subscription.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Renews on {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                    
                    {/* Show warning if subscription is expiring soon */}
                    {subscription.status !== 'active' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <span className="font-medium">Warning:</span> Your subscription is not active. 
                          Renew to continue accessing shifts.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">No active subscription. Subscribe to access platform features.</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {!subscription ? (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    Subscribe Now
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      Change Plan
                    </button>
                    <button
                      className="border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium"
                      onClick={handleCancel}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plans</h2>
            <p className="text-gray-600 mb-6">Choose the plan that best fits your needs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-6 ${
                    subscription?.planType === plan.id 
                      ? 'border-green-500 ring-2 ring-green-500/20' 
                      : 'border-gray-200'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price.toFixed(2)}
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
                      subscription?.planType === plan.id
                        ? 'bg-gray-100 text-gray-900 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    onClick={() => {
                      if (subscription?.planType !== plan.id) {
                        setSelectedPlan(plan);
                        setShowPaymentModal(true);
                      }
                    }}
                    disabled={subscription?.planType === plan.id}
                  >
                    {subscription?.planType === plan.id ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits of Subscription */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Subscribe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Access to More Opportunities</h3>
                  <p className="text-gray-600 text-sm">Unlock exclusive shifts and opportunities reserved for subscribers.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Priority Applications</h3>
                  <p className="text-gray-600 text-sm">Get prioritized consideration for shifts when you apply.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Enhanced Profile Visibility</h3>
                  <p className="text-gray-600 text-sm">Increase your chances of being selected by companies.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Application Tracking</h3>
                  <p className="text-gray-600 text-sm">Track the status of your shift applications in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedPlan ? `Subscribe to ${selectedPlan.name}` : 'Choose a Plan'}
            </h3>
            
            {selectedPlan && (
              <div className="mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ${selectedPlan.price.toFixed(2)} / month
                </p>
                <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
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
                  setShowPaymentModal(false);
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
                {subscription ? 'Change Plan' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerSubscription;