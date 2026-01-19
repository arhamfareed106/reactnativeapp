import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { NotificationProvider } from './context/NotificationContext';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Shifts from './components/Shifts';
import ShiftCalendar from './components/ShiftCalendar';
import JobRoles from './components/JobRoles';
import TrainingPrograms from './components/TrainingPrograms';
import Trainers from './components/Trainers';
import Workers from './components/Workers';
import Profile from './components/Profile';
import CompanyVerification from './components/CompanyVerification';
import ShiftRequests from './components/ShiftRequests';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import SubscriptionManagement from './components/SubscriptionManagement';
import PaymentHistory from './components/PaymentHistory';
import CompanySubscription from './components/CompanySubscription';
import WorkerSubscription from './components/WorkerSubscription';

import Notifications from './components/Notifications';
import FirebaseNotificationSetup from './components/FirebaseNotificationSetup';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <Router>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <FirebaseNotificationSetup />
              <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/" element={<ProtectedRoute />}/>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/shifts" element={<Shifts />} />
                  <Route path="/calendar" element={<ShiftCalendar />} />
                  <Route path="/job-roles" element={<JobRoles />} />
                  <Route path="/training-programs" element={<TrainingPrograms />} />
                  <Route path="/trainers" element={<Trainers />} />
                  <Route path="/workers" element={<Workers />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/company-verification" element={<CompanyVerification />} />
                  <Route path="/shift-requests" element={<ShiftRequests />} />
                  <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
                  <Route path="/admin/payment-history" element={<PaymentHistory />} />
                  <Route path="/company/subscription" element={<CompanySubscription />} />
                  <Route path="/worker/subscription" element={<WorkerSubscription />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </Provider>
  );
}

export default App;