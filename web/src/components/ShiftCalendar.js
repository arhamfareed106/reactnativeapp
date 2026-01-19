import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';

const ShiftCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock shift data
  const shifts = [
    {
      id: 1,
      title: 'Warehouse Night Shift',
      date: '2023-10-15',
      startTime: '22:00',
      endTime: '06:00',
      role: 'Forklift Operator',
      location: 'Warehouse A',
      workersNeeded: 3,
      workersAssigned: 2,
      status: 'open'
    },
    {
      id: 2,
      title: 'Day Shift - Safety Inspector',
      date: '2023-10-16',
      startTime: '08:00',
      endTime: '16:00',
      role: 'Safety Inspector',
      location: 'Various Sites',
      workersNeeded: 1,
      workersAssigned: 1,
      status: 'filled'
    },
    {
      id: 3,
      title: 'Weekend Shift - Maintenance',
      date: '2023-10-21',
      startTime: '09:00',
      endTime: '17:00',
      role: 'Maintenance Technician',
      location: 'Main Facility',
      workersNeeded: 2,
      workersAssigned: 0,
      status: 'open'
    },
    {
      id: 4,
      title: 'Morning Shift - Operator',
      date: '2023-10-18',
      startTime: '06:00',
      endTime: '14:00',
      role: 'Machine Operator',
      location: 'Production Floor',
      workersNeeded: 4,
      workersAssigned: 3,
      status: 'open'
    }
  ];

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getShiftsForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return shifts.filter(shift => shift.date === dateString);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'filled':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Shift Calendar</h2>
        <div className="flex items-center">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="mx-4 text-lg font-semibold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = startOfMonth(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="py-2 text-center text-sm font-medium text-gray-700">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 border-b border-gray-200">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfMonth(monthStart);
    const endDate = endOfMonth(monthStart);
    const dateFormat = 'd';
    const rows = [];

    let days = [];
    const day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        if (day <= endDate && isSameMonth(day, monthStart)) {
          formattedDate = format(day, dateFormat);
        } else {
          formattedDate = '';
        }

        const cloneDay = new Date(day);
        const dayShifts = getShiftsForDate(cloneDay);
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toString()}
            className={`min-h-32 border border-gray-200 p-2 ${
              !isSameMonth(day, monthStart) ? 'bg-gray-100 text-gray-400' : 'bg-white'
            } ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex justify-between">
              <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {formattedDate}
              </span>
              {dayShifts.length > 0 && (
                <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                  {dayShifts.length}
                </span>
              )}
            </div>
            <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
              {dayShifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm ${
                    shift.status === 'open' ? 'bg-blue-50 border border-blue-200' :
                    shift.status === 'filled' ? 'bg-green-50 border border-green-200' :
                    shift.status === 'in-progress' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-purple-50 border border-purple-200'
                  }`}
                >
                  <div className="font-medium truncate">{shift.title}</div>
                  <div className="text-gray-600">{shift.startTime} - {shift.endTime}</div>
                  <div className="flex justify-between">
                    <span className={`px-1 rounded ${getStatusColor(shift.status)}`}>
                      {shift.status}
                    </span>
                    <span>{shift.workersAssigned}/{shift.workersNeeded}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="grid-rows-5">{rows}</div>;
  };

  const getShiftsForSelectedDate = () => {
    return getShiftsForDate(selectedDate);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {renderHeader()}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar */}
            <div className="md:w-7/12">
              <div className="calendar">
                {renderDays()}
                {renderCells()}
              </div>
            </div>
            
            {/* Selected Date Details */}
            <div className="md:w-5/12">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shifts for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                
                {getShiftsForSelectedDate().length > 0 ? (
                  <div className="space-y-4">
                    {getShiftsForSelectedDate().map((shift) => (
                      <div key={shift.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">{shift.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shift.status)}`}>
                            {shift.status}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div>{shift.startTime} - {shift.endTime}</div>
                          <div>Role: {shift.role}</div>
                          <div>Location: {shift.location}</div>
                          <div className="flex justify-between mt-2">
                            <span>Workers: {shift.workersAssigned}/{shift.workersNeeded}</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(shift.workersAssigned / shift.workersNeeded) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">
                            View Details
                          </button>
                          <button className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200">
                            Assign Workers
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No shifts</h3>
                    <p className="mt-1 text-sm text-gray-500">No shifts scheduled for this date.</p>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Total Shifts</div>
                  <div className="text-2xl font-bold text-gray-900">{shifts.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Open Shifts</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {shifts.filter(s => s.status === 'open').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftCalendar;