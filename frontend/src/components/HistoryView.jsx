import { useState, useEffect } from 'react';
import { Download, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { getHistoryLog } from '../api/apiClient';


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
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Event History Log</h2>
                    <p className="text-gray-400 text-sm">Audit trail of all farm operations and environmental inputs.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-praman btn-praman-ghost">
                        <Calendar className="w-4 h-4" /> Date Range
                    </button>
                    <button className="btn-praman btn-praman-primary">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Fertilizer', 'Irrigation', 'Harvest', 'Sensor', 'Rainfall'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1f2937] text-gray-400 hover:text-white hover:bg-[#374151]'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="praman-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#161c2e] text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-semibold">Event ID</th>
                                <th className="p-4 font-semibold">Timestamp</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Details</th>
                                <th className="p-4 font-semibold">Quantity</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                            {filteredEvents.map((e) => (
                                <tr key={e.id} className="hover:bg-[#161c2e]/50 transition-colors group">
                                    <td className="p-4 font-mono text-gray-500">#{e.id.slice(-4)}</td>
                                    <td className="p-4 text-white font-medium">
                                        {new Date(e.timestamp).toLocaleDateString()}
                                        <span className="text-gray-500 text-xs ml-2">
                                            {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${e.type === 'Fertilizer' ? 'bg-amber-500/10 text-amber-500' :
                                            e.type === 'Irrigation' ? 'bg-cyan-500/10 text-cyan-500' :
                                                e.type === 'Rainfall' ? 'bg-blue-500/10 text-blue-500' :
                                                    e.type === 'Harvest' ? 'bg-rose-500/10 text-rose-500' :
                                                        'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {e.type}
                                        </span>
                                    </td>
                                    <td className="p-4">{e.subtype}</td>
                                    <td className="p-4 font-mono">{e.amount}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {e.status}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-600 hover:text-blue-400 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="flex justify-center p-8 text-gray-500">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Audit Log...
                        </div>
                    )}
                    {!loading && filteredEvents.length === 0 && (
                        <div className="text-center p-8 text-gray-500">No events found in history log.</div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HistoryView;
