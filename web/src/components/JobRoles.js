import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const JobRoles = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [jobRoles, setJobRoles] = useState([
    {
      id: 1,
      title: 'Forklift Operator',
      description: 'Operate forklifts to move materials in warehouse',
      requirements: ['Valid forklift license', 'Safety certification', '2+ years experience'],
      responsibilities: ['Move materials safely', 'Maintain equipment', 'Follow safety protocols'],
      skillsRequired: ['Forklift operation', 'Safety procedures', 'Material handling'],
      minQualifications: ['Safety Training', 'Forklift Certification'],
      hourlyRate: { min: 18, max: 25 },
      location: 'Warehouse A, Downtown',
      employmentType: 'full-time',
      createdAt: '2023-10-01',
      isActive: true
    },
    {
      id: 2,
      title: 'Safety Inspector',
      description: 'Conduct safety inspections and ensure compliance',
      requirements: ['Safety certification', '3+ years experience', 'Attention to detail'],
      responsibilities: ['Inspect facilities', 'Report violations', 'Train staff on safety'],
      skillsRequired: ['Safety protocols', 'Risk assessment', 'Documentation'],
      minQualifications: ['Safety Training', 'Compliance Certification'],
      hourlyRate: { min: 22, max: 30 },
      location: 'Various Sites',
      employmentType: 'contract',
      createdAt: '2023-10-05',
      isActive: true
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [],
    responsibilities: [],
    skillsRequired: [],
    minQualifications: [],
    hourlyRate: { min: '', max: '' },
    location: '',
    employmentType: 'full-time'
  });
  
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newQualification, setNewQualification] = useState('');

  const handleAddRequirement = () => {
    if (newRequirement.trim() !== '') {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()]
      });
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index) => {
    const newRequirements = [...formData.requirements];
    newRequirements.splice(index, 1);
    setFormData({
      ...formData,
      requirements: newRequirements
    });
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim() !== '') {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, newResponsibility.trim()]
      });
      setNewResponsibility('');
    }
  };

  const handleRemoveResponsibility = (index) => {
    const newResponsibilities = [...formData.responsibilities];
    newResponsibilities.splice(index, 1);
    setFormData({
      ...formData,
      responsibilities: newResponsibilities
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...formData.skillsRequired];
    newSkills.splice(index, 1);
    setFormData({
      ...formData,
      skillsRequired: newSkills
    });
  };

  const handleAddQualification = () => {
    if (newQualification.trim() !== '') {
      setFormData({
        ...formData,
        minQualifications: [...formData.minQualifications, newQualification.trim()]
      });
      setNewQualification('');
    }
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = [...formData.minQualifications];
    newQualifications.splice(index, 1);
    setFormData({
      ...formData,
      minQualifications: newQualifications
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleHourlyRateChange = (field, value) => {
    setFormData({
      ...formData,
      hourlyRate: {
        ...formData.hourlyRate,
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newJobRole = {
      id: jobRoles.length + 1,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    
    setJobRoles([...jobRoles, newJobRole]);
    setFormData({
      title: '',
      description: '',
      requirements: [],
      responsibilities: [],
      skillsRequired: [],
      minQualifications: [],
      hourlyRate: { min: '', max: '' },
      location: '',
      employmentType: 'full-time'
    });
    setShowForm(false);
  };

  const toggleJobRoleStatus = (id) => {
    setJobRoles(jobRoles.map(role => 
      role.id === id ? { ...role, isActive: !role.isActive } : role
    ));
  };

  const deleteJobRole = (id) => {
    if (window.confirm('Are you sure you want to delete this job role?')) {
      setJobRoles(jobRoles.filter(role => role.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Job Roles</h2>
            <p className="text-gray-600 mt-1">Manage job roles for your company</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            {showForm ? 'Cancel' : 'Add Job Role'}
          </button>
        </div>
        
        {showForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Job Role</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    id="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hourlyRateMin" className="block text-sm font-medium text-gray-700">
                      Min Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      name="hourlyRateMin"
                      id="hourlyRateMin"
                      value={formData.hourlyRate.min}
                      onChange={(e) => handleHourlyRateChange('min', e.target.value)}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hourlyRateMax" className="block text-sm font-medium text-gray-700">
                      Max Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      name="hourlyRateMax"
                      id="hourlyRateMax"
                      value={formData.hourlyRate.max}
                      onChange={(e) => handleHourlyRateChange('max', e.target.value)}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                
                {/* Requirements */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                        {req}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Responsibilities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibilities
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add a responsibility"
                      className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddResponsibility}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                        {resp}
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Skills Required */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills Required
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a required skill"
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.skillsRequired.map((skill, index) => (
                      <div key={index} className="inline-flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Minimum Qualifications */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Qualifications
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      placeholder="Add a qualification"
                      className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddQualification}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.minQualifications.map((qual, index) => (
                      <div key={index} className="inline-flex items-center bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-sm">
                        {qual}
                        <button
                          type="button"
                          onClick={() => handleRemoveQualification(index)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create Job Role
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{role.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{role.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{role.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {role.employmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${role.hourlyRate.min} - ${role.hourlyRate.max}/hr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => toggleJobRoleStatus(role.id)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            role.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {role.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteJobRole(role.id)}
                          className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {jobRoles.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No job roles</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new job role.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create Job Role
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobRoles;