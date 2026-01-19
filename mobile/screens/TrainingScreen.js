import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TrainingScreen = ({ navigation }) => {
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'Safety Induction Training',
      description: 'Basic safety training for all new employees',
      category: 'Safety',
      duration: 120, // in minutes
      completed: true,
      progress: 100,
      modules: [
        { id: 1, title: 'Introduction to Workplace Safety', completed: true, duration: 15 },
        { id: 2, title: 'Emergency Procedures', completed: true, duration: 20 },
        { id: 3, title: 'Safety Quiz', completed: true, duration: 30 }
      ],
      companyId: 1,
      companyName: 'ABC Corporation',
      completedDate: '2023-10-15'
    },
    {
      id: 2,
      title: 'Forklift Operation Training',
      description: 'Advanced forklift operation techniques',
      category: 'Technical Skills',
      duration: 240, // in minutes
      completed: false,
      progress: 65,
      modules: [
        { id: 1, title: 'Forklift Controls', completed: true, duration: 30 },
        { id: 2, title: 'Loading Techniques', completed: true, duration: 25 },
        { id: 3, title: 'Operation Quiz', completed: false, duration: 35 }
      ],
      companyId: 1,
      companyName: 'ABC Corporation',
      completedDate: null
    },
    {
      id: 3,
      title: 'Customer Service Excellence',
      description: 'Deliver exceptional customer service',
      category: 'Soft Skills',
      duration: 180, // in minutes
      completed: false,
      progress: 30,
      modules: [
        { id: 1, title: 'Communication Skills', completed: true, duration: 45 },
        { id: 2, title: 'Handling Complaints', completed: false, duration: 60 },
        { id: 3, title: 'Service Standards', completed: false, duration: 75 }
      ],
      companyId: 2,
      companyName: 'XYZ Retail',
      completedDate: null
    }
  ]);

  const [enrollableTrainings, setEnrollableTrainings] = useState([]);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // In a real app, this would fetch training data from the API
      // For now, we're using mock data
      setEnrollableTrainings(trainings.filter(t => !t.completed));
    } catch (error) {
      console.error('Error loading training data:', error);
      Alert.alert('Error', 'Failed to load training data');
    }
  };

  const enrollInTraining = async (trainingId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // In a real app, this would make an API call to enroll in the training
      console.log(`Enrolling in training: ${trainingId}`);

      // Update the training in the local state
      setTrainings(trainings.map(training => 
        training.id === trainingId ? { ...training, progress: 5 } : training
      ));

      Alert.alert('Success', 'Successfully enrolled in training!');
    } catch (error) {
      console.error('Error enrolling in training:', error);
      Alert.alert('Error', 'Failed to enroll in training');
    }
  };

  const startTrainingModule = (trainingId, moduleId) => {
    // In a real app, this would navigate to the training module content
    console.log(`Starting training: ${trainingId}, module: ${moduleId}`);
    navigation.navigate('TrainingModule', { trainingId, moduleId });
  };

  const renderTrainingItem = ({ item }) => (
    <View style={styles.trainingCard}>
      <View style={styles.trainingHeader}>
        <View>
          <Text style={styles.trainingTitle}>{item.title}</Text>
          <Text style={styles.trainingCategory}>{item.category}</Text>
          <Text style={styles.trainingCompany}>{item.companyName}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, item.completed ? styles.completedText : styles.inProgressText]}>
            {item.completed ? 'COMPLETED' : 'IN PROGRESS'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.trainingDescription}>{item.description}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${item.progress}%` },
              item.completed ? styles.completedBar : styles.inProgressBar
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      
      <Text style={styles.durationText}>{item.duration} minutes total</Text>
      
      <View style={styles.modulesContainer}>
        <Text style={styles.modulesTitle}>Modules:</Text>
        {item.modules.map((module, index) => (
          <TouchableOpacity
            key={module.id}
            style={[
              styles.moduleItem,
              module.completed ? styles.completedModule : styles.incompleteModule
            ]}
            onPress={() => startTrainingModule(item.id, module.id)}
            disabled={!module.completed && item.progress === 0}
          >
            <Text style={[
              styles.moduleText,
              module.completed ? styles.completedModuleText : styles.incompleteModuleText
            ]}>
              {module.title} ({module.duration} min)
            </Text>
            <Text style={[
              styles.moduleStatus,
              module.completed ? styles.completedStatus : styles.incompleteStatus
            ]}>
              {module.completed ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {!item.completed && item.progress === 0 && (
        <TouchableOpacity
          style={styles.enrollButton}
          onPress={() => enrollInTraining(item.id)}
        >
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trainings</Text>
        <Text style={styles.subtitle}>Track your training progress</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {trainings.length > 0 ? (
          <FlatList
            data={trainings}
            renderItem={renderTrainingItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trainings available</Text>
            <Text style={styles.emptySubtext}>Complete your profile to see relevant trainings</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  trainingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  trainingCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  trainingCompany: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completedText: {
    color: '#10b981',
    backgroundColor: '#d1fae5',
  },
  inProgressText: {
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
  },
  trainingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  completedBar: {
    backgroundColor: '#10b981',
  },
  inProgressBar: {
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  modulesContainer: {
    marginBottom: 12,
  },
  modulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  completedModule: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
  },
  incompleteModule: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  moduleText: {
    fontSize: 14,
    flex: 1,
  },
  completedModuleText: {
    color: '#16a34a',
    fontWeight: '500',
  },
  incompleteModuleText: {
    color: '#1d4ed8',
  },
  moduleStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedStatus: {
    color: '#10b981',
  },
  incompleteStatus: {
    color: '#9ca3af',
  },
  enrollButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  enrollButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default TrainingScreen;