import { useState, useEffect } from 'react';
import { Download, Calendar, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { getHistoryLog } from '../api/apiClient';
import PageLayout from './common/PageLayout';


const HistoryView = () => {
    const [filter, setFilter] = useState('All');

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await getHistoryLog();
            setEvents(data);
            setLoading(false);
        };
        loadHistory();
        // Poll every 5s for updates
        const interval = setInterval(loadHistory, 5000);
        return () => clearInterval(interval);
    }, []);


    const filteredEvents = filter === 'All' ? events : events.filter(e => e.type === filter);

    return (
        <PageLayout
            title="Event History"
            subtitle="Audit trail of all farm operations and environmental inputs."
            actions={
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6D4C41] bg-white/50 border border-[#6D4C41]/10 rounded-xl hover:bg-white transition-all shadow-sm">
                        <Calendar className="w-4 h-4" /> Date Range
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2D5016] rounded-xl hover:bg-[#3E6B1E] transition-all shadow-md shadow-[#2D5016]/20">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Fertilizer', 'Irrigation', 'Harvest', 'Sensor', 'Rainfall'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${filter === f
                                ? 'bg-[#2D5016] text-white border-[#2D5016] shadow-md shadow-[#2D5016]/20'
                                : 'bg-white/50 text-[#8D6E63] border-[#8D6E63]/10 hover:bg-white hover:border-[#8D6E63]/30'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Table Card */}
                <div className="card overflow-hidden !p-0 border border-[#6D4C41]/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F5F1E8]/50 border-b border-[#6D4C41]/5">
                                <tr>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Event ID</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Timestamp</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Type</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Details</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Quantity</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63]">Status</th>
                                    <th className="p-5 text-xs font-bold uppercase tracking-wider text-[#8D6E63] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#6D4C41]/5">
                                {filteredEvents.map((e) => (
                                    <tr key={e.id} className="hover:bg-[#7CB342]/5 transition-colors group">
                                        <td className="p-5 font-mono text-sm text-[#A1887F] font-medium">#{e.id.slice(-4)}</td>
                                        <td className="p-5 text-sm text-[#2D5016] font-medium">
                                            {new Date(e.timestamp).toLocaleDateString()}
                                            <span className="text-[#8D6E63] text-xs ml-2">
                                                {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>

                                        <td className="p-5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${e.type === 'Fertilizer' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                e.type === 'Irrigation' ? 'bg-cyan-100 text-cyan-700 border border-cyan-200' :
                                                    e.type === 'Rainfall' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                        e.type === 'Harvest' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                                            'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                {e.type}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-[#5D4037]">{e.subtype}</td>
                                        <td className="p-5 font-mono text-sm text-[#2D5016] font-semibold">{e.amount}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                {e.status}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="p-2 text-[#8D6E63] hover:text-[#2D5016] hover:bg-[#2D5016]/10 rounded-lg transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loading && (
                            <div className="flex justify-center p-12 text-[#8D6E63]">
                                <Loader2 className="w-6 h-6 animate-spin mr-3 text-[#2D5016]" /> Loading Audit Log...
                            </div>
                        )}
                        {!loading && filteredEvents.length === 0 && (
                            <div className="text-center p-12 text-[#8D6E63]">No events found in history log.</div>
                        )}

                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default HistoryView;
