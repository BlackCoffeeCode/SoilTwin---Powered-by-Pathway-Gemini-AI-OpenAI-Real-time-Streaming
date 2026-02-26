import { useState } from 'react';
import { triggerEvent } from '../api/apiClient';
import { useDemo } from '../context/DemoContext'; // New
import { CloudRain, Droplets, Zap, Sprout, Tractor, Layers } from 'lucide-react';

const ActionButton = ({ icon: Icon, label, color, onClick, loading }) => {
    // Dynamic gradients based on type
    const gradients = {
        blue: 'from-blue-600 to-blue-400',
        cyan: 'from-cyan-600 to-cyan-400',
        amber: 'from-amber-500 to-yellow-400',
        purple: 'from-purple-600 to-pink-500',
        emerald: 'from-emerald-600 to-green-400'
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`
                relative group overflow-hidden w-full
                bg-[#1e293b] hover:bg-[#334155] border border-gray-700 
                rounded-xl p-4 transition-all duration-300
                flex flex-col items-center justify-center gap-2
            `}
        >
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${gradients[color]} transition-opacity`} />

            <div className={`
                p-3 rounded-full bg-gradient-to-br ${gradients[color]} 
                text-white shadow-lg shadow-${color}-500/20 
                group-hover:scale-110 transition-transform duration-300
            `}>
                <Icon className="w-5 h-5" />
            </div>

            <span className="text-xs font-semibold text-gray-300 group-hover:text-white tracking-wide">
                {label}
            </span>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
            )}
        </button>
    );
};

const EventControls = () => {
    const [loading, setLoading] = useState(null);
    const { addLog } = useDemo(); // New



    const handleEvent = async (type, data, label) => {
        if (loading) return;
        setLoading(label);

        // Demo Log
        addLog(`🌧️ Sending [${label}] event to API...`, 'event');

        try {
            const res = await triggerEvent(type, data);

            // Log optimistic update
            if (res.new_state) {
                addLog(`⚡ Optimistic UI Update Applied (Instant)`, 'warning');
                setTimeout(() => {
                    addLog(`✅ Pathway Engine Synced (Single Source of Truth)`, 'success');
                }, 4000); // Simulate the lag for demonstration
            }

        } catch (e) {
            console.error(e);
            addLog(`❌ Event Failed: ${e.message}`, 'error');
        }
        setTimeout(() => setLoading(null), 800);
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 content-start">
                <ActionButton
                    icon={CloudRain}
                    label="Rain (25mm)"
                    color="blue"
                    loading={loading === 'rain25'}
                    onClick={() => handleEvent('rain', { amount: 25 }, 'rain25')}
                />
                <ActionButton
                    icon={Droplets}
                    label="Irrigate"
                    color="cyan"
                    loading={loading === 'irri'}
                    onClick={() => handleEvent('irrigation', { liters: 50000 }, 'irri')}
                />
                <ActionButton
                    icon={Zap}
                    label="Add Urea"
                    color="amber"
                    loading={loading === 'urea'}
                    onClick={() => handleEvent('fertilizer', { type: 'urea', amount: 20 }, 'urea')}
                />
                <ActionButton
                    icon={Sprout}
                    label="Add DAP"
                    color="purple"
                    loading={loading === 'dap'}
                    onClick={() => handleEvent('fertilizer', { type: 'dap', amount: 25 }, 'dap')}
                />
                <ActionButton
                    icon={Tractor}
                    label="Harvest"
                    color="emerald"
                    loading={loading === 'harv'}
                    onClick={() => handleEvent('harvest', { crop: 'Wheat' }, 'harv')}
                />
            </div>

        </div>
    );
};

export default EventControls;
