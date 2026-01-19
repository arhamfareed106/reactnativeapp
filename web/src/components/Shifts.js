import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Shifts = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [shifts, setShifts] = useState([
    {
      id: 1,
      title: 'Warehouse Night Shift',
      description: 'Overnight warehouse operations',
      jobRole: 'Forklift Operator',
      startDate: '2023-10-15',
      endDate: '2023-10-15',
      startTime: '22:00',
      endTime: '06:00',
      requiredWorkers: 3,
      assignedWorkers: [
        { id: 1, name: 'John Doe', status: 'confirmed' },
        { id: 2, name: 'Jane Smith', status: 'confirmed' }
      ],
      location: 'Warehouse A, Downtown',
      payRate: 22.50,
      status: 'open',
      requests: [
        { id: 1, workerId: 3, workerName: 'Bob Johnson', status: 'pending', requestedAt: '2023-10-14' }
      ]
    },
    {
      id: 2,
      title: 'Day Shift - Safety Inspector',
      description: 'Daily safety inspections',
      jobRole: 'Safety Inspector',
      startDate: '2023-10-16',
      endDate: '2023-10-16',
      startTime: '08:00',
      endTime: '16:00',
      requiredWorkers: 1,
      assignedWorkers: [
        { id: 1, name: 'Alice Brown', status: 'confirmed' }
      ],
      location: 'Various Sites',
      payRate: 25.00,
      status: 'filled',
      requests: []
    },
    {
      id: 3,
      title: 'Weekend Shift - Maintenance',
      description: 'Facility maintenance tasks',
      jobRole: 'Maintenance Technician',
      startDate: '2023-10-21',
      endDate: '2023-10-22',
      startTime: '09:00',
      endTime: '17:00',
      requiredWorkers: 2,
      assignedWorkers: [],
      location: 'Main Facility',
      payRate: 20.00,
      status: 'open',
      requests: [
        { id: 1, workerId: 4, workerName: 'Charlie Wilson', status: 'pending', requestedAt: '2023-10-14' },
        { id: 2, workerId: 5, workerName: 'Diana Lee', status: 'pending', requestedAt: '2023-10-13' }
      ]
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobRole: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    requiredWorkers: 1,
    location: '',
    payRate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newShift = {
      id: shifts.length + 1,
      ...formData,
      assignedWorkers: [],
      status: 'open',
      requests: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setShifts([...shifts, newShift]);
    setFormData({
      title: '',
      description: '',
      jobRole: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      requiredWorkers: 1,
      location: '',
      payRate: ''
    });
    setShowForm(false);
  };

  const updateShiftStatus = (id, status) => {
    setShifts(shifts.map(shift => 
      shift.id === id ? { ...shift, status } : shift
    ));
  };

  const deleteShift = (id) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(shift => shift.id !== id));
    }
  };

  const getRequestCount = (shift) => {
    return shift.requests.filter(req => req.status === 'pending').length;
  };

  const getFilledCount = (shift) => {
    return shift.assignedWorkers.length;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shifts</h2>
            <p className="text-gray-600 mt-1">Manage shifts for your company</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            {showForm ? 'Cancel' : 'Create Shift'}
          </button>
        </div>
        
        {showForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Shift</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Shift Title *
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
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">
                    Job Role *
                  </label>
                  <select
                    name="jobRole"
                    id="jobRole"
                    value={formData.jobRole}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select a job role</option>
                    <option value="Forklift Operator">Forklift Operator</option>
                    <option value="Safety Inspector">Safety Inspector</option>
                    <option value="Maintenance Technician">Maintenance Technician</option>
                    <option value="Crane Operator">Crane Operator</option>
                  </select>
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
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="requiredWorkers" className="block text-sm font-medium text-gray-700">
                    Required Workers *
                  </label>
                  <input
                    type="number"
                    name="requiredWorkers"
                    id="requiredWorkers"
                    value={formData.requiredWorkers}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="payRate" className="block text-sm font-medium text-gray-700">
                    Pay Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    name="payRate"
                    id="payRate"
                    value={formData.payRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create Shift
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
                    Shift
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staffing
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
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{shift.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{shift.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shift.jobRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shift.startDate}</div>
                      <div className="text-sm text-gray-500">{shift.startTime} - {shift.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shift.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getFilledCount(shift)}/{shift.requiredWorkers} filled
                      </div>
                      <div className="text-sm text-gray-500">
                        {getRequestCount(shift)} pending requests
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(getFilledCount(shift) / shift.requiredWorkers) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        shift.status === 'open' ? 'bg-green-100 text-green-800' :
                        shift.status === 'filled' ? 'bg-blue-100 text-blue-800' :
                        shift.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        shift.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {shift.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => updateShiftStatus(shift.id, shift.status === 'open' ? 'closed' : 'open')}
                          className={`${
                            shift.status === 'open' 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {shift.status === 'open' ? 'Close' : 'Open'}
                        </button>
                        <button
                          onClick={() => deleteShift(shift.id)}
                          className="text-red-600 hover:text-red-900"
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
          
          {shifts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shifts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new shift.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create Shift
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shifts;