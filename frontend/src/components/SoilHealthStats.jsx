import { useState, useEffect } from 'react';
import { fetchOGDData } from '../api/apiClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Database, AlertCircle, Search } from 'lucide-react';

const SoilHealthStats = () => {
    // Default to a known working resource ID if possible, or leave empty to prompt user
    const [resourceId, setResourceId] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = async () => {
        if (!resourceId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await fetchOGDData(resourceId);
            if (result && result.records) {
                setData(result.records);
            } else {
                setError('No records found or invalid format.');
            }
        } catch (e) {
            setError('Failed to fetch data.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Government Soil Health Statistics (ODG)
            </h3>

            <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={resourceId}
                        onChange={(e) => setResourceId(e.target.value)}
                        placeholder="Enter OGD Resource ID (e.g., 9ef84268...)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={loadData}
                    disabled={loading || !resourceId}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch Data'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {!data && !loading && !error && (
                <div className="text-center py-12 text-slate-500 text-sm">
                    Enter a valid Resource ID from data.gov.in to visualize Soil Health Card statistics.
                </div>
            )}

            {data && (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="state_ut"
                                stroke="#94a3b8"
                                fontSize={10}
                                tickFormatter={(val) => val ? val.substring(0, 10) : ''}
                            />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total_soil_health_cards_distributed"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-center text-slate-500 mt-2">
                        Displaying "Total Cards Distributed" by State/UT
                    </p>
                </div>
            )}
        </div>
    );
};

export default SoilHealthStats;
