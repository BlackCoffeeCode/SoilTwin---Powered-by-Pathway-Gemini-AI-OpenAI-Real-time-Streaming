import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { ArrowUpRight, TrendingDown } from 'lucide-react';
import SoilHealthStats from './SoilHealthStats';
import PageLayout from './common/PageLayout';

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
        <PageLayout
            title="Soil Health Trends"
            subtitle="7-Day Analysis of nutrient depletion and moisture retention."
            actions={
                <div className="bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-[#6D4C41]/10 flex text-xs font-medium shadow-sm">
                    <button className="px-4 py-1.5 bg-[#2D5016] text-white rounded-lg shadow-md transition-all">Week</button>
                    <button className="px-4 py-1.5 text-[#6D4C41] hover:bg-[#7CB342]/10 rounded-lg transition-all">Month</button>
                    <button className="px-4 py-1.5 text-[#6D4C41] hover:bg-[#7CB342]/10 rounded-lg transition-all">Season</button>
                </div>
            }
        >
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Nitrogen Chart */}
                    <div className="card h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-bold text-[#2D5016] font-serif">Nitrogen (N) Levels</h3>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-bold border border-emerald-100">
                                <ArrowUpRight className="w-4 h-4" /> +12%
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorN" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#374151' }}
                                    />
                                    <Area type="monotone" dataKey="N" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorN)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Moisture Chart */}
                    <div className="card h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-bold text-[#2D5016] font-serif">Soil Moisture %</h3>
                            </div>
                            <div className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm font-bold border border-red-100">
                                <TrendingDown className="w-4 h-4" /> -5%
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#374151' }}
                                    />
                                    <Line type="monotone" dataKey="M" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Combined View */}
                <div className="card p-8">
                    <h3 className="text-xl font-bold text-[#2D5016] font-serif mb-8">Composite NPK Analysis</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis dataKey="day" stroke="#9ca3af" dy={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" dx={-10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="N" stroke="#f59e0b" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="P" stroke="#10b981" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="K" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="pt-4">
                    <SoilHealthStats />
                </div>
            </div>
        </PageLayout>
    );
};

export default TrendsView;
