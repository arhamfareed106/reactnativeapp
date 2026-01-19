import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer';
import shiftReducer from '../reducers/shiftReducer';
import jobRoleReducer from '../reducers/jobRoleReducer';
import trainingReducer from '../reducers/trainingReducer';
import companyReducer from '../reducers/companyReducer';
import workerReducer from '../reducers/workerReducer';
import subscriptionReducer from '../reducers/subscriptionReducer';
import notificationReducer from '../reducers/notificationReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    shifts: shiftReducer,
    jobRoles: jobRoleReducer,
    training: trainingReducer,
    companies: companyReducer,
    workers: workerReducer,
    subscriptions: subscriptionReducer,
    notifications: notificationReducer
  },
});

export { store };