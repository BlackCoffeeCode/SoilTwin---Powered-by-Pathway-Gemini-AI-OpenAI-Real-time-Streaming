import { Droplets, Zap, Activity, Sprout } from 'lucide-react';

const StatCard = ({ label, value, unit, status, color }) => {
    // Color mapping for Tailwind classes
    const colors = {
        blue: 'text-blue-400',
        green: 'text-emerald-400',
        amber: 'text-amber-400',
        purple: 'text-purple-400'
    };

    return (
        <div className="card flex items-center justify-between p-5 relative overflow-hidden group">
            <div className={`absolute right-0 top-0 p-20 opacity-5 bg-${color}-500 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 transition-opacity group-hover:opacity-20`}></div>

            <div>
                <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">{label}</p>
                <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold text-white`}>{value}</span>
                    <span className="text-xs text-gray-500 font-mono mb-1">{unit}</span>
                </div>
            </div>

            <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 ${colors[color]}`}>
                {label === 'Moisture' && <Droplets className="w-5 h-5" />}
                {label === 'Nitrogen' && <Zap className="w-5 h-5" />}
                {label === 'Phosphorus' && <Activity className="w-5 h-5" />}
                {label === 'Potassium' && <Sprout className="w-5 h-5" />}
            </div>
        </div>
    );
};

const SoilDashboard = ({ state }) => {
    // Default mock state if null
    const s = state || {
        nitrogen: 420,
        phosphorus: 45,
        potassium: 300,
        moisture: 65,
        ph: 6.5
    };

    // Calculate a simple "Soil Health Score" for the visual
    const score = Math.min(100, Math.round((s.nitrogen / 600 + s.phosphorus / 60 + s.potassium / 400 + s.moisture / 100) / 4 * 100));

    // CSS variable for the circle progress
    const circleStyle = { '--score-percent': `${score}%` };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main Score Card (Double Width) */}
            <div className="md:col-span-1 card flex flex-col items-center justify-center py-8 relative">
                <div className="soil-circle mb-4" style={circleStyle}>
                    <span className="soil-score-text">{score}</span>
                </div>
                <h3 className="text-lg font-bold text-white">Overall Health</h3>
                <p className="text-sm text-emerald-400 font-medium mt-1">Optimal Condition</p>
            </div>

            {/* Individual Metrics */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Moisture"
                    value={Number(s.moisture).toFixed(1)}
                    unit="%"
                    color="blue"
                    status="Optimal"
                />
                <StatCard
                    label="Nitrogen"
                    value={Number(s.nitrogen).toFixed(0)}
                    unit="kg/ha"
                    color="amber"
                    status="Warning"
                />
                <StatCard
                    label="Phosphorus"
                    value={Number(s.phosphorus).toFixed(0)}
                    unit="kg/ha"
                    color="green"
                    status="Good"
                />
                <StatCard
                    label="Potassium"
                    value={Number(s.potassium).toFixed(0)}
                    unit="kg/ha"
                    color="purple"
                    status="Good"
                />
            </div>
        </div>
    );
};

export default SoilDashboard;
