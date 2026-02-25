import ActivityLog from './ActivityLog';
import HistoryView from './HistoryView';
import PageLayout from './common/PageLayout';
import { Radio } from 'lucide-react';

const LiveEventsPage = () => {
    return (
        <PageLayout
            title="Live Events"
            subtitle="Real-time event stream from the Pathway pipeline and full operation audit trail."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Live Stream Panel */}
                <div className="lg:col-span-4">
                    <div className="card overflow-hidden !p-0 h-[600px] flex flex-col border border-[#2D5016]/10">
                        <div className="flex items-center gap-3 px-5 py-4 bg-[#0f1421] border-b border-gray-800">
                            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">Live Pipeline Stream</h3>
                            <span className="ml-auto text-[10px] bg-emerald-900/50 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded font-bold">LIVE</span>
                        </div>
                        <div className="flex-1 min-h-0 bg-[#0f1421]">
                            <ActivityLog />
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-8">
                    <HistoryView />
                </div>
            </div>
        </PageLayout>
    );
};

export default LiveEventsPage;
