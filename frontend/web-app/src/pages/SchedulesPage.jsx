// frontend/web-app/src/pages/SchedulesPage.jsx
import React, { useState, useEffect } from 'react';
import { getSchedules, createSchedule } from '../services/scheduleService';

const SchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [formData, setFormData] = useState({
        courseName: '',
        professorId: '',
        roomId: '',
        startTime: '',
        endTime: ''
    });

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = async () => {
        const data = await getSchedules();
        setSchedules(data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createSchedule(formData);
        setFormData({ courseName: '', professorId: '', roomId: '', startTime: '', endTime: '' });
        loadSchedules();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🗓️ Schedule Management</h1>

            {/* Formulario de Creación */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Add New Class Schedule</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input type="text" name="courseName" placeholder="Course Name" value={formData.courseName} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="text" name="professorId" placeholder="Professor ID" value={formData.professorId} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="text" name="roomId" placeholder="Room ID" value={formData.roomId} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} required className="border p-2 rounded" />
                    <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required className="border p-2 rounded" />
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                        Save Schedule
                    </button>
                </form>
            </div>

            {/* Table the Schedules */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 bg-gray-50 border-gray-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Course</th>
                            <th className="px-6 py-4">Professor</th>
                            <th className="px-6 py-4">Room</th>
                            <th className="px-6 py-4">Start Time</th>
                            <th className="px-6 py-4">End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => (
                            <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">{schedule.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{schedule.courseName}</td>
                                <td className="px-6 py-4">{schedule.professorId}</td>
                                <td className="px-6 py-4">{schedule.roomId}</td>
                                <td className="px-6 py-4">{new Date(schedule.startTime).toLocaleString()}</td>
                                <td className="px-6 py-4">{new Date(schedule.endTime).toLocaleString()}</td>
                            </tr>
                        ))}
                        {schedules.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No schedules found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchedulesPage;