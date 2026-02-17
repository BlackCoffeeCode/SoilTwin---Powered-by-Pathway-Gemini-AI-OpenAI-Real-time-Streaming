import { MapPin, Wind, Droplets, Thermometer } from 'lucide-react';

const FieldMap = () => {
    // Mock Plots Data
    const plots = [
        { id: 'A1', type: 'Wheat', health: 92, moisture: 65, status: 'optimal' },
        { id: 'A2', type: 'Wheat', health: 88, moisture: 60, status: 'optimal' },
        { id: 'A3', type: 'Fallow', health: 0, moisture: 40, status: 'inactive' },
        { id: 'B1', type: 'Rice', health: 45, moisture: 85, status: 'critical' },
        { id: 'B2', type: 'Rice', health: 70, moisture: 75, status: 'warning' },
        { id: 'B3', type: 'Rice', health: 72, moisture: 72, status: 'warning' },
        { id: 'C1', type: 'Mustard', health: 95, moisture: 55, status: 'optimal' },
        { id: 'C2', type: 'Mustard', health: 91, moisture: 52, status: 'optimal' },
        { id: 'C3', type: 'Mustard', health: 89, moisture: 50, status: 'optimal' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'optimal': return 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30';
            case 'warning': return 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30';
            case 'critical': return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
            default: return 'bg-gray-800 border-gray-700 hover:bg-gray-700';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Map Viz */}
            <div className="lg:col-span-8 praman-card p-0 flex flex-col h-[600px] relative overflow-hidden group">
                {/* Map Header Overlay */}
                <div className="absolute top-4 left-4 z-10 bg-[#0f1421]/90 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <h3 className="font-bold text-gray-100">Sector 4 - Alpha Block</h3>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1"><Wind className="w-3 h-3" /> 12 km/h NW</div>
                        <div className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> 24°C</div>
                        <div className="flex items-center gap-1"><Droplets className="w-3 h-3" /> 62% Avg</div>
                    </div>
                </div>

                {/* Grid Visualization */}
                <div className="flex-1 bg-[#161c2e] p-8 flex items-center justify-center relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            opacity: 0.2
                        }}
                    />

                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl aspect-square relative z-0">
                        {plots.map((plot) => (
                            <button
                                key={plot.id}
                                className={`rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative group/plot ${getStatusColor(plot.status)}`}
                            >
                                <span className="text-2xl font-bold text-gray-200 opacity-80">{plot.id}</span>
                                <span className="text-sm font-medium text-gray-400 mt-1">{plot.type}</span>

                                {/* Hover Stats */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover/plot:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                    Health: {plot.health}% | Moisture: {plot.moisture}%
                                </div>

                                {plot.status === 'critical' && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="praman-card p-6 flex-1">
                    <h3 className="text-lg font-bold text-white mb-4">Field Metadata</h3>

                    <div className="space-y-4">
                        <div className="bg-[#1f2937] p-4 rounded-xl border border-gray-700">
                            <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-1">Soil Type</h4>
                            <p className="text-gray-200 font-medium">Alluvial Loamy</p>
                            <p className="text-xs text-gray-500 mt-1">High retention, good functionality.</p>
                        </div>
                        <div className="bg-[#1f2937] p-4 rounded-xl border border-gray-700">
                            <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-1">Topography</h4>
                            <p className="text-gray-200 font-medium">Flat Gradient (0.5%)</p>
                            <p className="text-xs text-gray-500 mt-1">Optimal for flood irrigation.</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Legend</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-emerald-500 rounded-full opacity-50" />
                                <span className="text-sm text-gray-400">Optimal Growth</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-amber-500 rounded-full opacity-50" />
                                <span className="text-sm text-gray-400">Nutrient Stress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-red-500 rounded-full opacity-50" />
                                <span className="text-sm text-gray-400">Action Required</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldMap;
