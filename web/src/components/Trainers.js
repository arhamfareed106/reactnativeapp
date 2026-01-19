import React from 'react';

const Trainers = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trainers</h1>
        <p className="mt-2 text-gray-600">Manage training professionals</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Trainer List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">All registered trainers in the system</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center">
                  <span className="text-white font-medium">TR</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Tom Rodriguez</p>
                  <p className="text-sm text-gray-500">Applebee's Trainer</p>
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
                  <span className="text-white font-medium">SJ</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">McDonald's Trainer</p>
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
                  <span className="text-white font-medium">MP</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Michael Peterson</p>
                  <p className="text-sm text-gray-500">Starbucks Trainer</p>
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

export default Trainers;