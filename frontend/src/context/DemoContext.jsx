import { createContext, useContext, useState, useCallback } from 'react';

const DemoContext = createContext(null);

export const DemoProvider = ({ children }) => {
    // logs: [{ id, message, type: 'info'|'success'|'warning'|'event', timestamp }]
    const [logs, setLogs] = useState([]);

    // Heartbeat state for visual pulse
    const [lastPollTime, setLastPollTime] = useState(Date.now());

    const addLog = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });

        setLogs(prev => {
            // Keep last 6 logs only to avoid clutter
            const newLogs = [...prev, { id, message, type, timestamp }];
            if (newLogs.length > 6) return newLogs.slice(newLogs.length - 6);
            return newLogs;
        });

        // Auto remove after 5 seconds to keep it clean
        setTimeout(() => {
            setLogs(prev => prev.filter(l => l.id !== id));
        }, 8000);
    }, []);

    const triggerHeartbeat = useCallback(() => {
        setLastPollTime(Date.now());
    }, []);

    return (
        <DemoContext.Provider value={{ logs, addLog, triggerHeartbeat, lastPollTime }}>
            {children}
        </DemoContext.Provider>
    );
};

export const useDemo = () => {
    const context = useContext(DemoContext);
    if (!context) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
};
