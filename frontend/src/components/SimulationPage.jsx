import EventControls from './EventControls';
import ActivityLog from './ActivityLog';
import PageLayout from './common/PageLayout';
import SoilDashboard from './SoilDashboard';
import { getSoilState } from '../api/apiClient';
import { useState, useEffect } from 'react';
import { FlaskConical, Info } from 'lucide-react';

const SimulationPage = () => {
    const [soilState, setSoilState] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await getSoilState();
            if (data && data.status !== 'No data') setSoilState(data);
        };
        fetch();
        const interval = setInterval(fetch, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <PageLayout
            title="Simulation Lab"
            subtitle="Trigger real-time farm events and watch the Pathway pipeline update your digital twin instantly."
            actions={
                <div className="flex items-center gap-2 text-sm text-[#8D6E63] bg-white/60 border border-[#2D5016]/10 px-4 py-2 rounded-xl">
                    <FlaskConical className="w-4 h-4 text-[#2D5016]" />
                    <span className="font-medium">Events update soil state in real-time</span>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Info Banner */}
                <div className="flex items-start gap-3 p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl text-blue-800">
                    <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-500" />
                    <p className="text-sm font-medium">
                        Each event is processed by the <strong>Pathway streaming engine</strong> and reflected in the soil state within seconds.
                        Watch the nutrient cards below update after triggering an event.
                    </p>
                </div>

                {/* Event Controls */}
                <div className="card p-6 border-[#2D5016]/10">
                    <h3 className="text-lg font-bold text-[#2D5016] font-serif mb-5">Trigger Farm Events</h3>
                    <EventControls />
                </div>

                {/* Live Soil Response */}
                <div>
                    <h3 className="text-lg font-bold text-[#2D5016] font-serif mb-4">Live Soil Response</h3>
                    <SoilDashboard state={soilState} />
                </div>

                {/* Event Stream */}
                <div className="card overflow-hidden !p-0 h-[350px] flex flex-col border border-[#2D5016]/10">
                    <div className="px-5 py-4 bg-[#0f1421] border-b border-gray-800 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">Pipeline Event Stream</h3>
                    </div>
                    <div className="flex-1 min-h-0 bg-[#0f1421]">
                        <ActivityLog />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default SimulationPage;
