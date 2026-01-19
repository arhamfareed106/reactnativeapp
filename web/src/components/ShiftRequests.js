import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ShiftRequests = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [shiftRequests, setShiftRequests] = useState([
    {
      id: 1,
      shift: {
        id: 1,
        title: 'Warehouse Night Shift',
        date: '2023-10-15',
        startTime: '22:00',
        endTime: '06:00',
        role: 'Forklift Operator',
        location: 'Warehouse A',
        payRate: 22.50
      },
      worker: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        rating: 4.8,
        completedTrainings: ['Safety Induction', 'Forklift Operation'],
        qualifications: ['Forklift License', 'Safety Certificate']
      },
      status: 'pending',
      requestedAt: '2023-10-14',
      approvedAt: null,
      approvedBy: null
    },
    {
      id: 2,
      shift: {
        id: 3,
        title: 'Weekend Shift - Maintenance',
        date: '2023-10-21',
        startTime: '09:00',
        endTime: '17:00',
        role: 'Maintenance Technician',
        location: 'Main Facility',
        payRate: 20.00
      },
      worker: {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        rating: 4.9,
        completedTrainings: ['Safety Induction', 'Maintenance Basics'],
        qualifications: ['Maintenance Certification']
      },
      status: 'approved',
      requestedAt: '2023-10-13',
      approvedAt: '2023-10-14',
      approvedBy: 'Admin User'
    },
    {
      id: 3,
      shift: {
        id: 2,
        title: 'Day Shift - Safety Inspector',
        date: '2023-10-16',
        startTime: '08:00',
        endTime: '16:00',
        role: 'Safety Inspector',
        location: 'Various Sites',
        payRate: 25.00
      },
      worker: {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 (555) 456-7890',
        rating: 4.5,
        completedTrainings: ['Safety Induction'],
        qualifications: ['Safety Certificate']
      },
      status: 'rejected',
      requestedAt: '2023-10-12',
      approvedAt: null,
      approvedBy: 'Admin User'
    }
  ]);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredRequests = shiftRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const updateRequestStatus = (id, status) => {
    setShiftRequests(shiftRequests.map(request => 
      request.id === id ? { ...request, status, approvedAt: new Date(), approvedBy: user.name } : request
    ));
    
    // Close modal if it's open
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(null);
    }
  };

  const deleteRequest = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setShiftRequests(shiftRequests.filter(request => request.id !== id));
    }
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
  };

  const closeRequestDetails = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shift Requests</h2>
            <p className="text-gray-600 mt-1">Review and manage shift requests from workers</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worker
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {request.worker.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.worker.name}</div>
                          <div className="text-sm text-gray-500">{request.worker.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.shift.title}</div>
                      <div className="text-sm text-gray-500">{request.shift.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.shift.date}</div>
                      <div className="text-sm text-gray-500">{request.shift.startTime} - {request.shift.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.689 0 .995-.986.588-1.81l-1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-900">{request.worker.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.requestedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openRequestDetails(request)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteRequest(request.id)}
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
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shift requests</h3>
              <p className="mt-1 text-sm text-gray-500">No shift requests to display.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Shift Request Details</h3>
                <button
                  onClick={closeRequestDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                {/* Shift Details */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Shift Details</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Title:</span> {selectedRequest.shift.title}</div>
                    <div><span className="font-medium">Role:</span> {selectedRequest.shift.role}</div>
                    <div><span className="font-medium">Date:</span> {selectedRequest.shift.date}</div>
                    <div><span className="font-medium">Time:</span> {selectedRequest.shift.startTime} - {selectedRequest.shift.endTime}</div>
                    <div><span className="font-medium">Location:</span> {selectedRequest.shift.location}</div>
                    <div><span className="font-medium">Pay Rate:</span> ${selectedRequest.shift.payRate}/hr</div>
                  </div>
                </div>
                
                {/* Worker Details */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Worker Details</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedRequest.worker.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedRequest.worker.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedRequest.worker.phone}</div>
                    <div><span className="font-medium">Rating:</span> {selectedRequest.worker.rating}/5</div>
                  </div>
                </div>
                
                {/* Completed Trainings */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Completed Trainings</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRequest.worker.completedTrainings.map((training, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {training}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Qualifications */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Qualifications</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRequest.worker.qualifications.map((qualification, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {qualification}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Status and Actions */}
                <div className="mt-6 flex justify-between">
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Requested:</span> {selectedRequest.requestedAt}
                  </div>
                </div>
                
                {selectedRequest.status === 'pending' && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
                    >
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
              <div className="items-center px-4 py-3 mt-6">
                <button
                  onClick={closeRequestDetails}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftRequests;