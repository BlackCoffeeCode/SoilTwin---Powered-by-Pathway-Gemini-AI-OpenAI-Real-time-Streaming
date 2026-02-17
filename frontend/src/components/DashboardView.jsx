import SoilDashboard from './SoilDashboard';
import EventControls from './EventControls';
import ChatBox from './ChatBox';
import WeatherWidget from './WeatherWidget'; // Import WeatherWidget
import ActivityLog from './ActivityLog'; // New
import { useDemo } from '../context/DemoContext'; // New
import { useEffect, useState } from 'react';

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
        <div className="space-y-6 fade-in-up">
            {/* Dashboard Header (Moved from Global App.jsx) */}
            <header className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {profile ? `${profile.name} (${profile.location.split(',')[0]})` : 'Alpha Sector Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>{profile ? profile.location : 'Punjab, District 4'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-emerald-400" />
                            <span>Crop: <span className="text-white font-mono">{profile ? profile.crop : 'Wheat (Demo)'}</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <WeatherWidget location={profile ? profile.location : 'Ludhiana,IN'} />

                    <div className={`live-badge transition-all duration-300 ${pulse ? 'scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : ''}`}>
                        <span className={`live-dot ${pulse ? 'bg-emerald-300' : ''}`}></span>
                        SYSTEM LIVE
                    </div>
                </div>
            </header>

            {/* Section 1: Soil Overview Cards */}
            <SoilDashboard state={soilState} />

            {/* Section 2 & 3: Live Events & AI Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Live Event Panel (Left, larger) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="card h-[320px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Live Operations Center</h3>
                            <button className="text-xs text-blue-400 hover:text-white transition">Full Simulation Log &rarr;</button>
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col gap-4">
                            <EventControls />
                            <div className="flex-1 min-h-0 border-t border-slate-700/50 pt-2">
                                <ActivityLog />
                            </div>
                        </div>
                    </div>

                    {/* Impact Metrics Row - Dynamic per Profile */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="card p-5">
                            <p className="text-sm text-gray-400 mb-1">Water Saved</p>
                            <p className="text-2xl font-bold text-cyan-400">
                                {!profile || profile.crop === 'Wheat' ? '12.4 kL' : '0.0 kL'}
                            </p>
                            <div className="text-xs text-green-500 mt-2">
                                {!profile || profile.crop === 'Wheat' ? '+15% vs Avg' : 'Baseline Set'}
                            </div>
                        </div>
                        <div className="card p-5">
                            <p className="text-sm text-gray-400 mb-1">Overuse Reduction</p>
                            <p className="text-2xl font-bold text-emerald-400">
                                {!profile || profile.crop === 'Wheat' ? '24%' : '0%'}
                            </p>
                            <div className="text-xs text-green-500 mt-2">Optimal NPK</div>
                        </div>
                        <div className="card p-5">
                            <p className="text-sm text-gray-400 mb-1">Cost Efficiency</p>
                            <p className="text-2xl font-bold text-amber-400">
                                {!profile || profile.crop === 'Wheat' ? '₹ 8,400' : '₹ 0'}
                            </p>
                            <div className="text-xs text-green-500 mt-2">Projection</div>
                        </div>
                    </div>
                </div>

                {/* AI Advisory Panel (Right) */}
                <div className="lg:col-span-4">
                    <div className="card h-full flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">AI Field Advisor</h3>
                            <p className="text-xs text-gray-400">Gemini 2.0 Flash • Real-time</p>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ChatBox />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
