// frontend/web-app/src/services/scheduleService.js

const API_URL = '/api/schedules';

export const getSchedules = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error fetching schedules');
        return await response.json();
    } catch (error) {
        console.error("❌ API Error:", error);
        return [];
    }
};

export const createSchedule = async (scheduleData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData),
        });
        if (!response.ok) throw new Error('Error creating schedule');
        return await response.json();
    } catch (error) {
        console.error("❌ API Error:", error);
        throw error;
    }
};