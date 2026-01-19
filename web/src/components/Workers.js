import React from 'react';

const Workers = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
        <p className="mt-2 text-gray-600">Manage platform workers</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Worker List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">All registered workers in the system</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">Certified in Applebee's training</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-400 flex items-center justify-center">
                  <span className="text-white font-medium">AS</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Alice Smith</p>
                  <p className="text-sm text-gray-500">Certified in McDonald's training</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </li>
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-white font-medium">MJ</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Mike Johnson</p>
                  <p className="text-sm text-gray-500">Pending Starbucks certification</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Workers;