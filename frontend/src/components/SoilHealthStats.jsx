<<<<<<< HEAD
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
=======
import { ShieldCheck, FlaskConical, Microscope, BarChart3, Award, TrendingUp } from 'lucide-react';

const stats = [
    { icon: ShieldCheck, label: 'Health Score', value: '82 / 100', sub: 'Good condition', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    { icon: FlaskConical, label: 'Organic Matter', value: '3.2%', sub: 'Optimal range', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
    { icon: Microscope, label: 'Microbial Activity', value: 'High', sub: 'Active soil biome', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
    { icon: BarChart3, label: 'Field Capacity', value: '78%', sub: 'Water retention', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    { icon: TrendingUp, label: 'Yield Forecast', value: '+12%', sub: 'vs. last season', color: '#e11d48', bg: 'rgba(225,29,72,0.1)', border: 'rgba(225,29,72,0.2)' },
    { icon: Award, label: 'Nutrient Balance', value: 'Balanced', sub: 'NPK ratio optimal', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
];

const SoilHealthStats = () => (
    <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 36, height: 36, background: 'rgba(45,80,22,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#2D5016" />
            </div>
            <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '1.3rem', fontWeight: 700, color: '#0f2e1c', margin: 0 }}>
                Soil Health Summary
            </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {stats.map(({ icon: Icon, label, value, sub, color, bg, border }) => (
                <div
                    key={label}
                    style={{
                        flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px 20px',
                        background: 'rgba(255,255,255,0.78)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: `1.5px solid ${border}`,
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(45,80,22,0.05)',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,80,22,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,80,22,0.05)'; }}
                >
                    <div style={{ width: 44, height: 44, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color={color} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700, color: '#0f2e1c', lineHeight: 1 }}>{value}</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8D6E63', marginTop: '3px' }}>{label}</div>
                        {sub && <div style={{ fontSize: '11px', color: '#8D6E63', marginTop: '2px' }}>{sub}</div>}
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default SoilHealthStats;
>>>>>>> df922889ce3a92ea64a7083a83bf9092b0b7935b
