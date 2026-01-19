import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
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
      sunday: { start: '', end: '', available: false }
    },
    preferences: {
      locationRadius: 10,
      preferredRoles: [],
      workEnvironment: {
        indoor: false,
        outdoor: false,
        remote: false
      }
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipcode: '',
          country: ''
        },
        skills: user.skills || [],
        certifications: user.certifications || [],
        qualifications: user.qualifications || [],
        availability: user.availability || {
          monday: { start: '', end: '', available: false },
          tuesday: { start: '', end: '', available: false },
          wednesday: { start: '', end: '', available: false },
          thursday: { start: '', end: '', available: false },
          friday: { start: '', end: '', available: false },
          saturday: { start: '', end: '', available: false },
          sunday: { start: '', end: '', available: false }
        },
        preferences: user.preferences || {
          locationRadius: 10,
          preferredRoles: [],
          workEnvironment: {
            indoor: false,
            outdoor: false,
            remote: false
          }
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value
      }
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData({
      ...formData,
      skills: newSkills
    });
  };

  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setNewCertification({
      ...newCertification,
      [name]: value
    });
  };

  const handleAddCertification = () => {
    if (newCertification.name.trim() !== '') {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification]
      });
      setNewCertification({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
    }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          [field]: value
        }
      }
    });
  };

  const handleWorkEnvironmentChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        workEnvironment: {
          ...formData.preferences.workEnvironment,
          [name]: checked
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to update the profile
    console.log('Profile updated:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    id="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    id="zipcode"
                    value={formData.address.zipcode}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
              
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Add
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Certifications */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Certifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="certName" className="block text-sm font-medium text-gray-700">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="certName"
                    value={newCertification.name}
                    onChange={handleCertificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="certIssuer" className="block text-sm font-medium text-gray-700">
                    Issuer
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    id="certIssuer"
                    value={newCertification.issuer}
                    onChange={handleCertificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    id="issueDate"
                    value={newCertification.issueDate}
                    onChange={handleCertificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    id="expiryDate"
                    value={newCertification.expiryDate}
                    onChange={handleCertificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    id="credentialId"
                    value={newCertification.credentialId}
                    onChange={handleCertificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    name="credentialUrl"
                    id="credentialUrl"
                    value={newCertification.credentialUrl}
                    onChange={handleCertificationChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleAddCertification}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Add Certification
              </button>
              
              <div className="mt-4">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-2">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{cert.name}</h4>
                      <span className="text-sm text-gray-500">{cert.issuer}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Issued: {cert.issueDate} | Expires: {cert.expiryDate}
                    </div>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Availability */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
              
              <div className="space-y-4">
                {Object.keys(formData.availability).map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24 capitalize font-medium">{day}</div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability[day].available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-500">Available</span>
                    </div>
                    {formData.availability[day].available && (
                      <>
                        <input
                          type="time"
                          value={formData.availability[day].start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                          className="border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                        />
                        <span className="mx-2">to</span>
                        <input
                          type="time"
                          value={formData.availability[day].end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                          className="border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Preferences */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Radius (miles)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.preferences.locationRadius}
                    onChange={(e) => setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        locationRadius: parseInt(e.target.value)
                      }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Environment
                  </label>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="indoor"
                      checked={formData.preferences.workEnvironment.indoor}
                      onChange={handleWorkEnvironmentChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Indoor</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="outdoor"
                      checked={formData.preferences.workEnvironment.outdoor}
                      onChange={handleWorkEnvironmentChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Outdoor</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={formData.preferences.workEnvironment.remote}
                      onChange={handleWorkEnvironmentChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Remote</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;