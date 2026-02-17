import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { ArrowUpRight, TrendingDown } from 'lucide-react';
import SoilHealthStats from './SoilHealthStats'; // Fixed duplicate import or missing import

const TrendsView = () => {
    const data = [
        { day: 'Mon', N: 420, P: 45, K: 300, M: 65 },
        { day: 'Tue', N: 415, P: 44, K: 298, M: 62 },
        { day: 'Wed', N: 410, P: 44, K: 295, M: 58 },
        { day: 'Thu', N: 405, P: 43, K: 290, M: 55 }, // Consumed
        { day: 'Fri', N: 460, P: 50, K: 310, M: 85 }, // Fert + Rain
        { day: 'Sat', N: 455, P: 49, K: 308, M: 82 },
        { day: 'Sun', N: 450, P: 49, K: 305, M: 78 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">Soil Health Trends</h2>
                    <p className="text-gray-400 text-sm">7-Day Analysis of nutrient depletion and moisture retention.</p>
                </div>
                <div className="bg-[#1f2937] p-1 rounded-lg flex text-xs font-medium">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md shadow">Week</button>
                    <button className="px-3 py-1 text-gray-400 hover:text-white">Month</button>
                    <button className="px-3 py-1 text-gray-400 hover:text-white">Season</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nitrogen Chart */}
                <div className="praman-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-200">Nitrogen (N) Levels</h3>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                            <ArrowUpRight className="w-4 h-4" /> +12%
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorN" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="N" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorN)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Moisture Chart */}
                <div className="praman-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-200">Soil Moisture %</h3>
                        <div className="flex items-center gap-1 text-red-400 text-sm font-bold">
                            <TrendingDown className="w-4 h-4" /> -5%
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="M" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Combined View */}
            <div className="praman-card p-6">
                <h3 className="font-bold text-gray-200 mb-6">Composite NPK Analysis</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="day" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#111827' }} />
                            <Legend />
                            <Line type="monotone" dataKey="N" stroke="#f59e0b" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="P" stroke="#10b981" />
                            <Line type="monotone" dataKey="K" stroke="#8b5cf6" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <SoilHealthStats /> {/* OGD Integration */}
        </div>
    );
};

export default TrendsView;
