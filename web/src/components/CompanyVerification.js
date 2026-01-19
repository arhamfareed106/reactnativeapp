import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CompanyVerification = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [company, setCompany] = useState({
    name: 'Sample Company',
    description: 'A sample company for demonstration',
    website: 'https://samplecompany.com',
    phone: '+1 (555) 123-4567',
    email: 'contact@samplecompany.com',
    address: {
      street: '123 Business St',
      city: 'Business City',
      state: 'CA',
      zipcode: '90210',
      country: 'USA'
    },
    industry: 'technology',
    verificationStatus: 'pending',
    verificationDocuments: [
      'business_license.pdf',
      'insurance_certificate.pdf',
      'tax_registration.pdf'
    ],
    logo: null
  });

  const [verificationSteps, setVerificationSteps] = useState([
    { id: 1, title: 'Company Information', completed: true, description: 'Basic company details submitted' },
    { id: 2, title: 'Documents Uploaded', completed: true, description: 'Required documents provided' },
    { id: 3, title: 'Admin Review', completed: false, description: 'Awaiting admin approval' },
    { id: 4, title: 'Account Activated', completed: false, description: 'Final activation step' },
  ]);

  useEffect(() => {
    // In a real app, this would fetch company data from the API
    // For now, we're using mock data
  }, []);

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, this would upload the file to the server
      console.log('Uploading file:', file.name);
    }
  };

  const handleResubmit = () => {
    // In a real app, this would resubmit the verification request
    console.log('Resubmitting verification request');
    alert('Verification request resubmitted successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Company Verification</h2>
          <p className="text-gray-600 mt-1">Track the status of your company verification process</p>
        </div>
        
        <div className="p-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg mb-6 ${getStatusColor(company.verificationStatus)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Verification Status</h3>
                <p className="capitalize">{company.verificationStatus}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getStatusColor(company.verificationStatus)}`}>
                {company.verificationStatus}
              </span>
            </div>
          </div>
          
          {/* Verification Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Process</h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {verificationSteps.map((step, stepIdx) => (
                  <li key={step.id}>
                    <div className="relative pb-8">
                      {stepIdx !== verificationSteps.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ${step.completed ? 'bg-green-500 ring-green-200' : 'bg-gray-100 ring-gray-200'} ring-inset`}>
                            {step.completed ? (
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-gray-500">{step.id}</span>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{step.title}</p>
                            <p className="text-sm text-gray-500">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <p className="mt-1 text-sm text-gray-900">{company.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{company.industry}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{company.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <p className="mt-1 text-sm text-gray-900">{company.website}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{company.phone}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{company.email}</p>
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <p className="mt-1 text-sm text-gray-900">{company.address.street}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <p className="mt-1 text-sm text-gray-900">{company.address.city}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="mt-1 text-sm text-gray-900">{company.address.state}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zipcode</label>
                  <p className="mt-1 text-sm text-gray-900">{company.address.zipcode}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <p className="mt-1 text-sm text-gray-900">{company.address.country}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Verification Documents */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.verificationDocuments.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-500">Uploaded</p>
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                      Preview
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Additional Documents</label>
              <div className="flex items-center">
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Contact Support
            </button>
            
            {company.verificationStatus === 'rejected' && (
              <button
                onClick={handleResubmit}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Resubmit for Verification
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyVerification;