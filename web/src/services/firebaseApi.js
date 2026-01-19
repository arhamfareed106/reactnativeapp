// Import Firebase services
import { db, auth, storage, functions } from '../firebaseConfig';

// Import Firebase Firestore functions
import { 
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

// Utility functions for Firestore operations
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

const getCollection = async (collectionName, queryConstraints = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Convert our custom constraint format to Firestore where clauses
    queryConstraints.forEach(constraint => {
      if (constraint.field && constraint.operator && constraint.value !== undefined) {
        q = query(q, where(constraint.field, constraint.operator, constraint.value));
      }
    });
    
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error getting collection: ', error);
    throw error;
  }
};

const getDocumentById = async (collectionName, id) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error getting document: ', error);
    throw error;
  }
};

const updateDocument = async (collectionName, id, data) => {
  try {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error('Error updating document: ', error);
    throw error;
  }
};

const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw error;
  }
};

// Specific collection helpers
const addUser = async (userData) => {
  return addDocument('users', userData);
};

const getUsers = async (constraints = []) => {
  return getCollection('users', constraints);
};

const getUserById = async (id) => {
  return getDocumentById('users', id);
};

const updateUser = async (id, userData) => {
  return updateDocument('users', id, userData);
};

const deleteUser = async (id) => {
  return deleteDocument('users', id);
};

const addCompany = async (companyData) => {
  return addDocument('companies', companyData);
};

const getCompanies = async (constraints = []) => {
  return getCollection('companies', constraints);
};

const getCompanyById = async (id) => {
  return getDocumentById('companies', id);
};

const updateCompany = async (id, companyData) => {
  return updateDocument('companies', id, companyData);
};

const addWorker = async (workerData) => {
  return addDocument('workers', workerData);
};

const getWorkers = async (constraints = []) => {
  return getCollection('workers', constraints);
};

const getWorkerById = async (id) => {
  return getDocumentById('workers', id);
};

const updateWorker = async (id, workerData) => {
  return updateDocument('workers', id, workerData);
};

const addTrainer = async (trainerData) => {
  return addDocument('trainers', trainerData);
};

const getTrainers = async (constraints = []) => {
  return getCollection('trainers', constraints);
};

const getTrainerById = async (id) => {
  return getDocumentById('trainers', id);
};

const updateTrainer = async (id, trainerData) => {
  return updateDocument('trainers', id, trainerData);
};

const addJobRole = async (jobRoleData) => {
  return addDocument('jobRoles', jobRoleData);
};

const getJobRoles = async (constraints = []) => {
  return getCollection('jobRoles', constraints);
};

const getJobRoleById = async (id) => {
  return getDocumentById('jobRoles', id);
};

const updateJobRole = async (id, jobRoleData) => {
  return updateDocument('jobRoles', id, jobRoleData);
};

const addTrainingProgram = async (trainingData) => {
  return addDocument('trainingPrograms', trainingData);
};

const getTrainingPrograms = async (constraints = []) => {
  return getCollection('trainingPrograms', constraints);
};

const getTrainingProgramById = async (id) => {
  return getDocumentById('trainingPrograms', id);
};

const updateTrainingProgram = async (id, trainingData) => {
  return updateDocument('trainingPrograms', id, trainingData);
};

const addShift = async (shiftData) => {
  return addDocument('shifts', shiftData);
};

const getShifts = async (constraints = []) => {
  return getCollection('shifts', constraints);
};

const getShiftById = async (id) => {
  return getDocumentById('shifts', id);
};

const updateShift = async (id, shiftData) => {
  return updateDocument('shifts', id, shiftData);
};

const addSubscription = async (subscriptionData) => {
  return addDocument('subscriptions', subscriptionData);
};

const getSubscriptions = async (constraints = []) => {
  return getCollection('subscriptions', constraints);
};

const getSubscriptionById = async (id) => {
  return getDocumentById('subscriptions', id);
};

const updateSubscription = async (id, subscriptionData) => {
  return updateDocument('subscriptions', id, subscriptionData);
};

const addNotification = async (notificationData) => {
  return addDocument('notifications', notificationData);
};

const getNotifications = async (constraints = []) => {
  return getCollection('notifications', constraints);
};

const getNotificationById = async (id) => {
  return getDocumentById('notifications', id);
};

const updateNotification = async (id, notificationData) => {
  return updateDocument('notifications', id, notificationData);
};

// API service using Firebase instead of HTTP calls to Node.js backend

// Auth API
export const authApi = {
  async login(email, password) {
    // Firebase Auth handles authentication
    // This is now handled by Firebase Auth directly
    throw new Error('Use Firebase Auth directly for login');
  },

  async register(userData) {
    // Firebase Auth handles registration
    // This is now handled by Firebase Auth directly
    throw new Error('Use Firebase Auth directly for registration');
  },

  async logout() {
    // Firebase Auth handles logout
    // This is now handled by Firebase Auth directly
    throw new Error('Use Firebase Auth directly for logout');
  }
};

// User API
export const userApi = {
  async getUsers(filters = {}) {
    const constraints = [];
    if (filters.role) {
      constraints.push({ field: 'role', operator: '==', value: filters.role });
    }
    return await getUsers(constraints);
  },

  async getUserById(id) {
    return await getUserById(id);
  },

  async createUser(userData) {
    return await addUser(userData);
  },

  async updateUser(id, userData) {
    return await updateUser(id, userData);
  },

  async deleteUser(id) {
    return await deleteDocument('users', id);
  }
};

// Company API
export const companyApi = {
  async getCompanies(filters = {}) {
    const constraints = [];
    return await getCompanies(constraints);
  },

  async getCompanyById(id) {
    return await getCompanyById(id);
  },

  async createCompany(companyData) {
    return await addCompany(companyData);
  },

  async updateCompany(id, companyData) {
    return await updateCompany(id, companyData);
  },

  async deleteCompany(id) {
    return await deleteDocument('companies', id);
  }
};

// Worker API
export const workerApi = {
  async getWorkers(filters = {}) {
    const constraints = [];
    return await getWorkers(constraints);
  },

  async getWorkerById(id) {
    return await getWorkerById(id);
  },

  async createWorker(workerData) {
    return await addWorker(workerData);
  },

  async updateWorker(id, workerData) {
    return await updateWorker(id, workerData);
  },

  async deleteWorker(id) {
    return await deleteDocument('workers', id);
  }
};

// Trainer API
export const trainerApi = {
  async getTrainers(filters = {}) {
    const constraints = [];
    return await getTrainers(constraints);
  },

  async getTrainerById(id) {
    return await getTrainerById(id);
  },

  async createTrainer(trainerData) {
    return await addTrainer(trainerData);
  },

  async updateTrainer(id, trainerData) {
    return await updateTrainer(id, trainerData);
  },

  async deleteTrainer(id) {
    return await deleteDocument('trainers', id);
  }
};

// Job Role API
export const jobRoleApi = {
  async getJobRoles(filters = {}) {
    const constraints = [];
    if (filters.companyId) {
      constraints.push({ field: 'companyId', operator: '==', value: filters.companyId });
    }
    return await getJobRoles(constraints);
  },

  async getJobRoleById(id) {
    return await getJobRoleById(id);
  },

  async createJobRole(jobRoleData) {
    return await addJobRole(jobRoleData);
  },

  async updateJobRole(id, jobRoleData) {
    return await updateJobRole(id, jobRoleData);
  },

  async deleteJobRole(id) {
    return await deleteDocument('jobRoles', id);
  }
};

// Training Program API
export const trainingProgramApi = {
  async getTrainingPrograms(filters = {}) {
    const constraints = [];
    if (filters.companyId) {
      constraints.push({ field: 'companyId', operator: '==', value: filters.companyId });
    }
    if (filters.trainerId) {
      constraints.push({ field: 'trainerId', operator: '==', value: filters.trainerId });
    }
    return await getTrainingPrograms(constraints);
  },

  async getTrainingProgramById(id) {
    return await getTrainingProgramById(id);
  },

  async createTrainingProgram(trainingData) {
    return await addTrainingProgram(trainingData);
  },

  async updateTrainingProgram(id, trainingData) {
    return await updateTrainingProgram(id, trainingData);
  },

  async deleteTrainingProgram(id) {
    return await deleteDocument('trainingPrograms', id);
  }
};

// Shift API
export const shiftApi = {
  async getShifts(filters = {}) {
    const constraints = [];
    if (filters.companyId) {
      constraints.push({ field: 'companyId', operator: '==', value: filters.companyId });
    }
    if (filters.workerId) {
      constraints.push({ field: 'assignedWorkers', operator: 'array-contains', value: filters.workerId });
    }
    return await getShifts(constraints);
  },

  async getShiftById(id) {
    return await getShiftById(id);
  },

  async createShift(shiftData) {
    return await addShift(shiftData);
  },

  async updateShift(id, shiftData) {
    return await updateShift(id, shiftData);
  },

  async deleteShift(id) {
    return await deleteDocument('shifts', id);
  }
};

// Subscription API
export const subscriptionApi = {
  async getSubscriptions(filters = {}) {
    const constraints = [];
    if (filters.userId) {
      constraints.push({ field: 'userId', operator: '==', value: filters.userId });
    }
    return await getSubscriptions(constraints);
  },

  async getSubscriptionById(id) {
    return await getSubscriptionById(id);
  },

  async createSubscription(subscriptionData) {
    return await addSubscription(subscriptionData);
  },

  async updateSubscription(id, subscriptionData) {
    return await updateSubscription(id, subscriptionData);
  },

  async deleteSubscription(id) {
    return await deleteDocument('subscriptions', id);
  }
};

// Notification API
export const notificationApi = {
  async getNotifications(filters = {}) {
    const constraints = [];
    if (filters.userId) {
      constraints.push({ field: 'recipient', operator: '==', value: filters.userId });
    }
    return await getNotifications(constraints);
  },

  async getNotificationById(id) {
    return await getNotificationById(id);
  },

  async createNotification(notificationData) {
    return await addNotification(notificationData);
  },

  async updateNotification(id, notificationData) {
    return await updateNotification(id, notificationData);
  },

  async deleteNotification(id) {
    return await deleteDocument('notifications', id);
  }
};

// Combined API object
export const api = {
  auth: authApi,
  users: userApi,
  companies: companyApi,
  workers: workerApi,
  trainers: trainerApi,
  jobRoles: jobRoleApi,
  trainingPrograms: trainingProgramApi,
  shifts: shiftApi,
  subscriptions: subscriptionApi,
  notifications: notificationApi
};

export default api;