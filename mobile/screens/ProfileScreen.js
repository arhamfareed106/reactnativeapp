import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    skills: [],
    certifications: [],
    qualifications: [],
    availability: {
      monday: { start: '', end: '', available: false },
      tuesday: { start: '', end: '', available: false },
      wednesday: { start: '', end: '', available: false },
      thursday: { start: '', end: '', available: false },
      friday: { start: '', end: '', available: false },
      saturday: { start: '', end: '', available: false },
      sunday: { start: '', end: '', available: false },
    },
    preferences: {
      locationRadius: 10,
      preferredRoles: [],
      workEnvironment: {
        indoor: false,
        outdoor: false,
        remote: false,
      },
    },
  });

  const [newSkill, setNewSkill] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // In a real app, this would make an API call to fetch the user profile
      // For now, we'll use mock data
      setUserData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipcode: '12345',
          country: 'USA',
        },
        skills: ['Forklift Operation', 'Safety Protocols', 'Team Leadership'],
        certifications: [
          { name: 'Forklift License', issuer: 'Safety Corp', issueDate: '2023-01-15', expiryDate: '2024-01-15' },
          { name: 'First Aid', issuer: 'Red Cross', issueDate: '2022-06-10', expiryDate: '2025-06-10' },
        ],
        qualifications: ['Safety Training', 'Operations Training'],
        availability: {
          monday: { start: '08:00', end: '16:00', available: true },
          tuesday: { start: '08:00', end: '16:00', available: true },
          wednesday: { start: '08:00', end: '16:00', available: true },
          thursday: { start: '08:00', end: '16:00', available: true },
          friday: { start: '08:00', end: '16:00', available: true },
          saturday: { start: '', end: '', available: false },
          sunday: { start: '', end: '', available: false },
        },
        preferences: {
          locationRadius: 10,
          preferredRoles: ['Operator', 'Supervisor'],
          workEnvironment: {
            indoor: true,
            outdoor: false,
            remote: false,
          },
        },
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  const handleAddressChange = (field, value) => {
    setUserData({
      ...userData,
      address: {
        ...userData.address,
        [field]: value,
      },
    });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setUserData({
      ...userData,
      availability: {
        ...userData.availability,
        [day]: {
          ...userData.availability[day],
          [field]: value,
        },
      },
    });
  };

  const handleWorkEnvironmentChange = (field) => {
    setUserData({
      ...userData,
      preferences: {
        ...userData.preferences,
        workEnvironment: {
          ...userData.preferences.workEnvironment,
          [field]: !userData.preferences.workEnvironment[field],
        },
      },
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setUserData({
        ...userData,
        skills: [...userData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...userData.skills];
    newSkills.splice(index, 1);
    setUserData({
      ...userData,
      skills: newSkills,
    });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // In a real app, this would make an API call to update the profile
      // For now, we'll just show a success message
      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.editButtonText}>
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {editing ? (
          <View style={styles.form}>
            {/* Personal Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={userData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={userData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={userData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={userData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Street</Text>
                <TextInput
                  style={styles.input}
                  value={userData.address.street}
                  onChangeText={(value) => handleAddressChange('street', value)}
                />
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    value={userData.address.city}
                    onChangeText={(value) => handleAddressChange('city', value)}
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={userData.address.state}
                    onChangeText={(value) => handleAddressChange('state', value)}
                  />
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Zipcode</Text>
                  <TextInput
                    style={styles.input}
                    value={userData.address.zipcode}
                    onChangeText={(value) => handleAddressChange('zipcode', value)}
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput
                    style={styles.input}
                    value={userData.address.country}
                    onChangeText={(value) => handleAddressChange('country', value)}
                  />
                </View>
              </View>
            </View>

            {/* Skills */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Add a new skill"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddSkill}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.skillsContainer}>
                {userData.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveSkill(index)}
                      style={styles.removeSkillButton}
                    >
                      <Text style={styles.removeSkillText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Availability</Text>
              
              {Object.entries(userData.availability).map(([day, data]) => (
                <View key={day} style={styles.availabilityRow}>
                  <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  <Switch
                    value={data.available}
                    onValueChange={(value) => handleAvailabilityChange(day, 'available', value)}
                  />
                  {data.available && (
                    <View style={styles.timeInputs}>
                      <TextInput
                        style={[styles.input, styles.timeInput]}
                        value={data.start}
                        onChangeText={(value) => handleAvailabilityChange(day, 'start', value)}
                        placeholder="Start"
                        keyboardType="numeric"
                      />
                      <Text style={styles.toText}>to</Text>
                      <TextInput
                        style={[styles.input, styles.timeInput]}
                        value={data.end}
                        onChangeText={(value) => handleAvailabilityChange(day, 'end', value)}
                        placeholder="End"
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.preferenceRow}>
                <Text style={styles.label}>Location Radius (miles)</Text>
                <TextInput
                  style={[styles.input, styles.shortInput]}
                  value={userData.preferences.locationRadius.toString()}
                  onChangeText={(value) => handleInputChange('preferences', {
                    ...userData.preferences,
                    locationRadius: parseInt(value) || 10,
                  })}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.preferenceRow}>
                <Text style={styles.label}>Work Environment:</Text>
              </View>
              
              <View style={styles.row}>
                <View style={styles.environmentOption}>
                  <Text style={styles.label}>Indoor</Text>
                  <Switch
                    value={userData.preferences.workEnvironment.indoor}
                    onValueChange={() => handleWorkEnvironmentChange('indoor')}
                  />
                </View>
                
                <View style={styles.environmentOption}>
                  <Text style={styles.label}>Outdoor</Text>
                  <Switch
                    value={userData.preferences.workEnvironment.outdoor}
                    onValueChange={() => handleWorkEnvironmentChange('outdoor')}
                  />
                </View>
                
                <View style={styles.environmentOption}>
                  <Text style={styles.label}>Remote</Text>
                  <Switch
                    value={userData.preferences.workEnvironment.remote}
                    onValueChange={() => handleWorkEnvironmentChange('remote')}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileView}>
            {/* Personal Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{userData.firstName} {userData.lastName}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Street:</Text>
                <Text style={styles.infoValue}>{userData.address.street}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>City:</Text>
                <Text style={styles.infoValue}>{userData.address.city}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>State:</Text>
                <Text style={styles.infoValue}>{userData.address.state}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Zipcode:</Text>
                <Text style={styles.infoValue}>{userData.address.zipcode}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Country:</Text>
                <Text style={styles.infoValue}>{userData.address.country}</Text>
              </View>
            </View>

            {/* Skills */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              
              <View style={styles.skillsContainer}>
                {userData.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Certifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              
              {userData.certifications.map((cert, index) => (
                <View key={index} style={styles.certificationItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>Issuer: {cert.issuer}</Text>
                  <Text style={styles.certDates}>Issued: {cert.issueDate} | Expires: {cert.expiryDate}</Text>
                </View>
              ))}
            </View>

            {/* Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Availability</Text>
              
              {Object.entries(userData.availability).map(([day, data]) => (
                <View key={day} style={styles.availabilityRow}>
                  <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  <Text style={styles.availabilityText}>
                    {data.available ? `${data.start} - ${data.end}` : 'Unavailable'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location Radius:</Text>
                <Text style={styles.infoValue}>{userData.preferences.locationRadius} miles</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Work Environment:</Text>
                <Text style={styles.infoValue}>
                  {userData.preferences.workEnvironment.indoor ? 'Indoor ' : ''}
                  {userData.preferences.workEnvironment.outdoor ? 'Outdoor ' : ''}
                  {userData.preferences.workEnvironment.remote ? 'Remote' : ''}
                </Text>
              </View>
            </View>
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
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editButton: {
    backgroundColor: '#137fec',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  form: {
    // Styles for edit form
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  flexInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#137fec',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '600',
  },
  removeSkillButton: {
    marginLeft: 5,
  },
  removeSkillText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    width: 80,
  },
  availabilityText: {
    fontSize: 16,
    color: '#6b7280',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  timeInput: {
    width: 80,
    textAlign: 'center',
  },
  toText: {
    marginHorizontal: 5,
    color: '#6b7280',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shortInput: {
    width: 80,
    textAlign: 'center',
  },
  environmentOption: {
    alignItems: 'center',
    marginRight: 15,
  },
  certificationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  certName: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  certIssuer: {
    color: '#6b7280',
    marginBottom: 2,
  },
  certDates: {
    color: '#9ca3af',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#137fec',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileView: {
    // Styles for profile view
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#1f2937',
    width: 100,
  },
  infoValue: {
    flex: 1,
    color: '#6b7280',
  },
});

export default ProfileScreen;