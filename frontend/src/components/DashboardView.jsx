import SoilDashboard from './SoilDashboard';
import EventControls from './EventControls';
import ChatBox from './ChatBox';
import WeatherWidget from './WeatherWidget'; // Import WeatherWidget
import ActivityLog from './ActivityLog'; // New
import { useDemo } from '../context/DemoContext'; // New
import { useEffect, useState } from 'react';
import PageLayout from './common/PageLayout';

import { MapPin, Target } from 'lucide-react';

const DashboardView = ({ soilState, profile }) => {
    const { lastPollTime } = useDemo(); // Get heartbeat
    const [pulse, setPulse] = useState(false);

    // Trigger animation when poll time changes
    useEffect(() => {
        setPulse(true);
        const t = setTimeout(() => setPulse(false), 500);
        return () => clearTimeout(t);
    }, [lastPollTime]);

    return (
        <PageLayout
            title={profile ? `${profile.name} (${profile.location.split(',')[0]})` : 'Alpha Sector Dashboard'}
            subtitle={
                <div className="flex items-center gap-4 text-sm font-medium mt-1">
                    <div className="flex items-center gap-1.5 text-[#8D6E63]">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{profile ? profile.location : 'Punjab, District 4'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8D6E63]">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span>Crop: <span className="text-[#2D5016] font-bold font-serif">{profile ? profile.crop : 'Wheat (Demo)'}</span></span>
                    </div>
                </div>
            }
            actions={
                <div className="flex items-center gap-4">
                    <WeatherWidget location={profile ? profile.location : 'Ludhiana,IN'} />

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${pulse ? 'bg-emerald-100 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-white/50 border-[#2D5016]/10'}`}>
                        <span className={`w-2 h-2 rounded-full ${pulse ? 'bg-emerald-500' : 'bg-emerald-500/50'} shadow-[0_0_10px_rgba(16,185,129,0.5)]`}></span>
                        <span className="text-xs font-bold text-[#2D5016] tracking-wide">SYSTEM LIVE</span>
                    </div>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Section 1: Soil Overview Cards */}
                <SoilDashboard state={soilState} />

                {/* Section 2 & 3: Live Events & AI Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Live Event Panel (Left, larger) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="card h-[350px] flex flex-col border-[#2D5016]/10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[#2D5016] font-serif">Live Operations Center</h3>
                                <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition bg-blue-50 px-3 py-1 rounded-lg">Full Simulation Log &rarr;</button>
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col gap-4">
                                <EventControls />
                                <div className="flex-1 min-h-0 border-t border-[#6D4C41]/5 pt-2">
                                    <ActivityLog />
                                </div>
                            </div>
                        </div>

                        {/* Impact Metrics Row - Dynamic per Profile */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="card p-5 border-cyan-100 bg-cyan-50/30">
                                <p className="text-xs font-bold uppercase tracking-wider text-cyan-800 mb-1">Water Saved</p>
                                <p className="text-3xl font-serif font-bold text-cyan-600">
                                    {!profile || profile.crop === 'Wheat' ? '12.4 kL' : '0.0 kL'}
                                </p>
                                <div className="text-xs font-medium text-cyan-700 mt-2 bg-cyan-100/50 inline-block px-2 py-0.5 rounded">
                                    {!profile || profile.crop === 'Wheat' ? '+15% vs Avg' : 'Baseline Set'}
                                </div>
                            </div>
                            <div className="card p-5 border-emerald-100 bg-emerald-50/30">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">Overuse Reduction</p>
                                <p className="text-3xl font-serif font-bold text-emerald-600">
                                    {!profile || profile.crop === 'Wheat' ? '24%' : '0%'}
                                </p>
                                <div className="text-xs font-medium text-emerald-700 mt-2 bg-emerald-100/50 inline-block px-2 py-0.5 rounded">Optimal NPK</div>
                            </div>
                            <div className="card p-5 border-amber-100 bg-amber-50/30">
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Cost Efficiency</p>
                                <p className="text-3xl font-serif font-bold text-amber-600">
                                    {!profile || profile.crop === 'Wheat' ? '₹ 8,400' : '₹ 0'}
                                </p>
                                <div className="text-xs font-medium text-amber-700 mt-2 bg-amber-100/50 inline-block px-2 py-0.5 rounded">Projection</div>
                            </div>
                        </div>
                    </div>

                    {/* AI Advisory Panel (Right) */}
                    <div className="lg:col-span-4 h-[350px] lg:h-auto">
                        <ChatBox />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default DashboardView;
