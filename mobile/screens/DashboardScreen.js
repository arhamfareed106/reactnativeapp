import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DashboardScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    completedTrainings: 0,
    pendingRequests: 0,
    upcomingShifts: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // Get user profile
      const userRes = await axios.get('http://localhost:5000/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUserData(userRes.data.data);

      // Get stats
      const statsRes = await axios.get('http://localhost:5000/api/v1/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userData?.name || 'User'}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Training')}
          >
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>🎓</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats.completedTrainings || 0}</Text>
              <Text style={styles.statLabel}>Trainings Completed</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Shifts')}
          >
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>📅</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats.upcomingShifts || 0}</Text>
              <Text style={styles.statLabel}>Upcoming Shifts</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Shifts')}
          >
            <View style={styles.statIcon}>
              <Text style={styles.statIconText}>⏳</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats.pendingRequests || 0}</Text>
              <Text style={styles.statLabel}>Pending Requests</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.shiftAction]}
              onPress={() => navigation.navigate('Shifts')}
            >
              <Text style={styles.actionButtonText}>Browse Shifts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.trainingAction]}
              onPress={() => navigation.navigate('Training')}
            >
              <Text style={styles.actionButtonText}>My Trainings</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.profileAction]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.actionButtonText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.companiesAction]}
              onPress={() => navigation.navigate('Companies')}
            >
              <Text style={styles.actionButtonText}>Companies</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>✅</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Training Completed</Text>
                <Text style={styles.activitySubtitle}>Safety Induction Module</Text>
                <Text style={styles.activityTime}>2 days ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>📅</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Shift Approved</Text>
                <Text style={styles.activitySubtitle}>Night Shift at ABC Corp</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>💰</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Payment Received</Text>
                <Text style={styles.activitySubtitle}>Payment for last week's shifts</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    margin: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 10,
  },
  statIconText: {
    fontSize: 24,
  },
  statContent: {},
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#137fec',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flex: 0.48,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  shiftAction: {
    backgroundColor: '#dcfce7',
  },
  trainingAction: {
    backgroundColor: '#dbeafe',
  },
  profileAction: {
    backgroundColor: '#fef3c7',
  },
  companiesAction: {
    backgroundColor: '#ede9fe',
  },
  actionButtonText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 16,
  },
  activityContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityList: {
    marginTop: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    marginRight: 10,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '600',
    color: '#1f2937',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
});

export default DashboardScreen;