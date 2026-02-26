const API_BASE_URL = '/api';

// Helper to get auth token
const getAuthHeaders = () => {
    const token = localStorage.getItem('soiltwin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper for handling 401 responses
const handleUnauthorized = () => {
    localStorage.removeItem('soiltwin_token');
    localStorage.removeItem('soiltwin_user');
    window.location.href = '/login';
};

export const getSoilState = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/soil-state`, {
            headers: getAuthHeaders(),
        });

        if (response.status === 401) {
            handleUnauthorized();
            return null;
        }

        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching soil state:', error);
        return null;
    }
};

export const getProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: getAuthHeaders(),
        });

        if (response.status === 401) {
            handleUnauthorized();
            return null;
        }

        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const triggerEvent = async (type, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ type, amount: data.amount || 0 }),
        });

        if (response.status === 401) {
            handleUnauthorized();
            return { status: 'error', detail: 'Unauthorized' };
        }

        return await response.json();
    } catch (error) {
        console.error('Error triggering event:', error);
        return { status: 'error' };
    }
};

export const askQuestion = async (text) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify({ text }),
        });

        if (response.status === 401) {
            handleUnauthorized();
            return { answer: 'Session expired. Please log in again.' };
        }

        return await response.json();
    } catch (error) {
        console.error('Error asking question:', error);
        return { answer: 'Error connecting to AI service.' };
    }
};

export const fetchOGDData = async (resourceId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/external/ogd/${resourceId}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch OGD data');
        return await response.json();
    } catch (error) {
        console.error('OGD Error:', error);
        return null;
    }
};

export const fetchWeather = async (location = "Ludhiana,IN") => {
    try {
        const response = await fetch(`${API_BASE_URL}/external/weather?location=${location}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch weather');
        return await response.json();
    } catch (error) {
        console.error('Weather Error:', error);
        return null;
    }
};

export const getHistoryLog = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/history`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("History fetch error:", error);
        return [];
    }
};

// Export axios-like apiClient for compatibility
export const apiClient = {
    post: async (url, data, config = {}) => {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.replace('/api', '')}`;
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
                ...config.headers,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw { response: { status: response.status, data: error } };
        }

        return { data: await response.json() };
    }
};
