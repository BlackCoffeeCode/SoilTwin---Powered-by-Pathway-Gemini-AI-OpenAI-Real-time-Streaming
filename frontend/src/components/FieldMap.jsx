import { MapPin, Wind, Droplets, Thermometer, Layers, Info } from 'lucide-react';
import PageLayout from './common/PageLayout';

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
            case 'optimal': return 'bg-emerald-100 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300 text-[#2D5016]';
            case 'warning': return 'bg-amber-100 border-amber-200 hover:bg-amber-200 hover:border-amber-300 text-amber-900';
            case 'critical': return 'bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-300 text-red-900';
            default: return 'bg-[#F5F1E8] border-[#D4A574]/20 hover:bg-[#EFEBE0] text-[#8D6E63]';
        }
    };

    return (
        <PageLayout
            title="Sector Alpha Dashboard"
            subtitle="Real-time geospatial monitoring of crop health and soil conditions."
            actions={
                <div className="flex items-center gap-2 text-sm text-[#8D6E63] bg-white/50 px-3 py-1.5 rounded-xl border border-[#D4A574]/20">
                    <Layers className="w-4 h-4" />
                    <span>View: <b>Crop Health</b></span>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Map Viz */}
                <div className="lg:col-span-8 card !p-0 flex flex-col h-[600px] relative overflow-hidden group border-[#2D5016]/10 shadow-lg">
                    {/* Map Header Overlay */}
                    <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md border border-[#2D5016]/10 p-4 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                <MapPin className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#2D5016] text-sm">Sector 4 - Alpha Block</h3>
                                <div className="text-[10px] uppercase font-bold text-[#8D6E63] tracking-wider">Active Monitoring</div>
                            </div>
                        </div>
                        <div className="flex gap-4 text-xs font-medium text-[#5D4037]">
                            <div className="flex items-center gap-1.5 bg-[#F5F1E8] px-2 py-1 rounded-md"><Wind className="w-3.5 h-3.5 text-[#8D6E63]" /> 12 km/h NW</div>
                            <div className="flex items-center gap-1.5 bg-[#F5F1E8] px-2 py-1 rounded-md"><Thermometer className="w-3.5 h-3.5 text-amber-600" /> 24°C</div>
                            <div className="flex items-center gap-1.5 bg-[#F5F1E8] px-2 py-1 rounded-md"><Droplets className="w-3.5 h-3.5 text-blue-500" /> 62% Avg</div>
                        </div>
                    </div>

                    {/* Grid Visualization - Light Mode */}
                    <div className="flex-1 bg-[#Fdfbf7] p-8 flex items-center justify-center relative">
                        {/* Background Grid Lines */}
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: 'linear-gradient(#EFEBE0 1px, transparent 1px), linear-gradient(90deg, #EFEBE0 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                                opacity: 0.6
                            }}
                        />

                        {/* Compass Rose Decoration */}
                        <div className="absolute bottom-8 right-8 w-24 h-24 opacity-10 pointer-events-none">
                            <div className="w-full h-full border-2 border-[#2D5016] rounded-full flex items-center justify-center relative">
                                <div className="absolute top-0 text-[10px] font-bold text-[#2D5016] -mt-2 bg-[#Fdfbf7] px-1">N</div>
                                <div className="w-16 h-16 border border-[#2D5016] rounded-full"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 w-full max-w-2xl aspect-square relative z-0">
                            {plots.map((plot) => (
                                <button
                                    key={plot.id}
                                    className={`rounded-3xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative group/plot shadow-sm hover:shadow-md ${getStatusColor(plot.status)}`}
                                >
                                    <span className="text-3xl font-serif font-bold opacity-30">{plot.id}</span>
                                    <span className="text-sm font-bold mt-2">{plot.type}</span>

                                    {/* Hover Stats */}
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#2D5016] text-white text-xs py-2 px-4 rounded-xl opacity-0 group-hover/plot:opacity-100 transition-all transform group-hover/plot:-translate-y-2 whitespace-nowrap z-20 pointer-events-none shadow-xl">
                                        <div className="font-semibold mb-0.5">Plot {plot.id} Status</div>
                                        <div className="opacity-90">Health: {plot.health}% | Moisture: {plot.moisture}%</div>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#2D5016]"></div>
                                    </div>

                                    {plot.status === 'critical' && (
                                        <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="card p-6 flex-1 border-[#2D5016]/10">
                        <h3 className="text-xl font-bold text-[#2D5016] mb-6 font-serif flex items-center gap-2">
                            <Info className="w-5 h-5" /> Field Metadata
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-[#F5F1E8] p-5 rounded-2xl border border-[#D4A574]/20">
                                <h4 className="text-xs text-[#8D6E63] uppercase tracking-widest mb-2 font-bold">Soil Type</h4>
                                <p className="text-[#2D5016] font-serif text-lg">Alluvial Loamy</p>
                                <p className="text-sm text-[#8D6E63]/80 mt-1">High retention, good functionality.</p>
                            </div>
                            <div className="bg-[#F5F1E8] p-5 rounded-2xl border border-[#D4A574]/20">
                                <h4 className="text-xs text-[#8D6E63] uppercase tracking-widest mb-2 font-bold">Topography</h4>
                                <p className="text-[#2D5016] font-serif text-lg">Flat Gradient (0.5%)</p>
                                <p className="text-sm text-[#8D6E63]/80 mt-1">Optimal for flood irrigation.</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-[#6D4C41]/10">
                            <h4 className="text-xs text-[#8D6E63] uppercase tracking-widest mb-4 font-bold">Legend</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-transparent hover:border-[#2D5016]/10 transition-colors">
                                    <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm" />
                                    <span className="text-sm text-[#5D4037] font-medium">Optimal Growth</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-transparent hover:border-[#2D5016]/10 transition-colors">
                                    <span className="w-3 h-3 bg-amber-500 rounded-full shadow-sm" />
                                    <span className="text-sm text-[#5D4037] font-medium">Nutrient Stress</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-transparent hover:border-[#2D5016]/10 transition-colors">
                                    <span className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                                    <span className="text-sm text-[#5D4037] font-medium">Action Required</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default FieldMap;
