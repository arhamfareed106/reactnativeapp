import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TrainingPrograms = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [trainingPrograms, setTrainingPrograms] = useState([
    {
      id: 1,
      title: 'Safety Induction Training',
      description: 'Basic safety training for all new employees',
      category: 'Safety',
      duration: 120, // in minutes
      modules: [
        { id: 1, title: 'Introduction to Workplace Safety', description: 'Overview of safety policies', contentType: 'video', contentUrl: 'https://example.com/safety-intro', duration: 15, order: 1 },
        { id: 2, title: 'Emergency Procedures', description: 'What to do in emergencies', contentType: 'document', contentUrl: 'https://example.com/emergency-procedures', duration: 20, order: 2 },
        { id: 3, title: 'Safety Quiz', description: 'Test your safety knowledge', contentType: 'quiz', duration: 30, order: 3 }
      ],
      requiredFor: ['Forklift Operator', 'Safety Inspector'],
      createdAt: '2023-10-01',
      isActive: true
    },
    {
      id: 2,
      title: 'Forklift Operation Training',
      description: 'Advanced forklift operation techniques',
      category: 'Technical Skills',
      duration: 240, // in minutes
      modules: [
        { id: 1, title: 'Forklift Controls', description: 'Understanding forklift controls', contentType: 'video', contentUrl: 'https://example.com/forklift-controls', duration: 30, order: 1 },
        { id: 2, title: 'Loading Techniques', description: 'Proper loading procedures', contentType: 'document', contentUrl: 'https://example.com/loading-techniques', duration: 25, order: 2 },
        { id: 3, title: 'Operation Quiz', description: 'Test forklift operation knowledge', contentType: 'quiz', duration: 35, order: 3 }
      ],
      requiredFor: ['Forklift Operator'],
      createdAt: '2023-10-05',
      isActive: true
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    category: 'Safety',
    modules: [],
    requiredFor: []
  });
  
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    contentType: 'video',
    contentUrl: '',
    duration: '',
    order: 1
  });
  
  const [newRequiredRole, setNewRequiredRole] = useState('');
  const [availableJobRoles] = useState(['Forklift Operator', 'Safety Inspector', 'Crane Operator', 'Maintenance Technician']);

  const handleAddModule = () => {
    if (moduleForm.title.trim() !== '') {
      const newModule = {
        ...moduleForm,
        id: programForm.modules.length + 1,
        duration: parseInt(moduleForm.duration) || 0,
        order: programForm.modules.length + 1
      };
      
      setProgramForm({
        ...programForm,
        modules: [...programForm.modules, newModule]
      });
      
      setModuleForm({
        title: '',
        description: '',
        contentType: 'video',
        contentUrl: '',
        duration: '',
        order: programForm.modules.length + 2
      });
    }
  };

  const handleRemoveModule = (moduleId) => {
    const updatedModules = programForm.modules
      .filter(module => module.id !== moduleId)
      .map((module, index) => ({
        ...module,
        order: index + 1
      }));
    
    setProgramForm({
      ...programForm,
      modules: updatedModules
    });
  };

  const handleAddRequiredRole = () => {
    if (newRequiredRole.trim() !== '' && !programForm.requiredFor.includes(newRequiredRole.trim())) {
      setProgramForm({
        ...programForm,
        requiredFor: [...programForm.requiredFor, newRequiredRole.trim()]
      });
      setNewRequiredRole('');
    }
  };

  const handleRemoveRequiredRole = (role) => {
    setProgramForm({
      ...programForm,
      requiredFor: programForm.requiredFor.filter(r => r !== role)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProgram = {
      id: trainingPrograms.length + 1,
      ...programForm,
      duration: programForm.modules.reduce((sum, module) => sum + (parseInt(module.duration) || 0), 0),
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    
    setTrainingPrograms([...trainingPrograms, newProgram]);
    setProgramForm({
      title: '',
      description: '',
      category: 'Safety',
      modules: [],
      requiredFor: []
    });
    setShowForm(false);
  };

  const toggleProgramStatus = (id) => {
    setTrainingPrograms(trainingPrograms.map(program => 
      program.id === id ? { ...program, isActive: !program.isActive } : program
    ));
  };

  const deleteProgram = (id) => {
    if (window.confirm('Are you sure you want to delete this training program? This action cannot be undone.')) {
      setTrainingPrograms(trainingPrograms.filter(program => program.id !== id));
    }
  };

  const selectProgram = (program) => {
    setSelectedProgram(program);
  };

  const closeProgramDetails = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Training Programs</h2>
            <p className="text-gray-600 mt-1">Create and manage training programs for your workers</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            {showForm ? 'Cancel' : 'Create Training Program'}
          </button>
        </div>
        
        {showForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Training Program</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Program Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={programForm.title}
                    onChange={(e) => setProgramForm({...programForm, title: e.target.value})}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={programForm.description}
                    onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={programForm.category}
                    onChange={(e) => setProgramForm({...programForm, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Safety">Safety</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Required For Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required For Roles
                  </label>
                  <div className="flex">
                    <select
                      value={newRequiredRole}
                      onChange={(e) => setNewRequiredRole(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select a role</option>
                      {availableJobRoles
                        .filter(role => !programForm.requiredFor.includes(role))
                        .map((role, index) => (
                          <option key={index} value={role}>{role}</option>
                        ))
                      }
                    </select>
                    <button
                      type="button"
                      onClick={handleAddRequiredRole}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {programForm.requiredFor.map((role, index) => (
                      <div key={index} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                        {role}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequiredRole(role)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Modules Section */}
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Training Modules</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Add New Module</h5>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700">
                            Module Title *
                          </label>
                          <input
                            type="text"
                            id="moduleTitle"
                            value={moduleForm.title}
                            onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <input
                            type="text"
                            id="moduleDescription"
                            value={moduleForm.description}
                            onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">
                            Content Type
                          </label>
                          <select
                            id="contentType"
                            value={moduleForm.contentType}
                            onChange={(e) => setModuleForm({...moduleForm, contentType: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="video">Video</option>
                            <option value="document">Document</option>
                            <option value="quiz">Quiz</option>
                            <option value="interactive">Interactive</option>
                          </select>
                        </div>
                        
                        {moduleForm.contentType !== 'quiz' && (
                          <div>
                            <label htmlFor="contentUrl" className="block text-sm font-medium text-gray-700">
                              Content URL
                            </label>
                            <input
                              type="url"
                              id="contentUrl"
                              value={moduleForm.contentUrl}
                              onChange={(e) => setModuleForm({...moduleForm, contentUrl: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                              Duration (min)
                            </label>
                            <input
                              type="number"
                              id="duration"
                              value={moduleForm.duration}
                              onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                              min="0"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                              Order
                            </label>
                            <input
                              type="number"
                              id="order"
                              value={moduleForm.order}
                              onChange={(e) => setModuleForm({...moduleForm, order: e.target.value})}
                              min="1"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleAddModule}
                          className="w-full inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                        >
                          Add Module
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Added Modules</h5>
                      
                      {programForm.modules.length === 0 ? (
                        <p className="text-sm text-gray-500">No modules added yet</p>
                      ) : (
                        <div className="space-y-3">
                          {programForm.modules.map((module) => (
                            <div key={module.id} className="border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between">
                                <div>
                                  <h6 className="text-sm font-medium text-gray-900">{module.title}</h6>
                                  <p className="text-xs text-gray-500">{module.description}</p>
                                  <div className="flex items-center mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {module.contentType}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">{module.duration} min</span>
                                    <span className="ml-2 text-xs text-gray-500">Order: {module.order}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveModule(module.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create Training Program
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
                    Program
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required For
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
                {trainingPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{program.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{program.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{program.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(program.duration / 60)}h {program.duration % 60}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {program.modules.length} modules
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {program.requiredFor.slice(0, 2).join(', ')}
                        {program.requiredFor.length > 2 && ` +${program.requiredFor.length - 2}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => selectProgram(program)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleProgramStatus(program.id)}
                          className={`${
                            program.isActive 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {program.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteProgram(program.id)}
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
          
          {trainingPrograms.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No training programs</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new training program.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Create Training Program
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{selectedProgram.title}</h3>
                <button
                  onClick={closeProgramDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{selectedProgram.description}</p>
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Training Modules</h4>
                  <div className="mt-2 space-y-2">
                    {selectedProgram.modules.map((module, index) => (
                      <div key={module.id} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{module.title}</h5>
                            <p className="text-xs text-gray-500">{module.description}</p>
                            <div className="flex items-center mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {module.contentType}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">{module.duration} min</span>
                              <span className="ml-2 text-xs text-gray-500">Order: {module.order}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Required For</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProgram.requiredFor.map((role, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="items-center px-4 py-3 mt-4">
                <button
                  onClick={closeProgramDetails}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none w-full"
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

export default TrainingPrograms;