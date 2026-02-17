import { Zap, AlertTriangle, CheckCircle, Droplets, ArrowRight, Activity } from 'lucide-react';

const NutrientPlan = () => {
    const recommendations = [
        {
            id: 1,
            type: 'Critical',
            title: 'Nitrogen Deficiency Detected',
            description: 'Current levels (410 kg/ha) are trending below optimal range for Wheat vegetative stage. Yield loss risk: High (-15%).',
            action: 'Apply Urea (20kg)',
            icon: Zap,
            color: 'amber'
        },
        {
            id: 2,
            type: 'Routine',
            title: 'Irrigation Schedule Update',
            description: 'Soil moisture is adequate (65%). Delay scheduled irrigation by 24 hours to prevent leaching.',
            action: 'Reschedule',
            icon: Droplets,
            color: 'blue'
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">AI Nutrient Plan</h2>
                    <p className="text-gray-400 text-sm">Real-time recommendations optimized for maximum yield and minimum cost.</p>
                </div>

                <div className="space-y-4">
                    {recommendations.map((rec) => (
                        <div key={rec.id} className={`praman-card p-6 border-l-4 ${rec.color === 'amber' ? 'border-l-amber-500' : 'border-l-blue-500'} bg-gradient-to-r from-[#161c2e] to-[#1f2937]`}>
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-full ${rec.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        <rec.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1 mb-3 max-w-md">
                                            {rec.description}
                                        </p>
                                        <div className="flex gap-3">
                                            <button className={`
                                                ${rec.color === 'amber' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}
                                                text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2
                                            `}>
                                                <Zap className="w-4 h-4" /> {rec.action}
                                            </button>
                                            <button className="text-gray-400 hover:text-white px-4 py-2 text-sm font-medium">
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <span className={`
                                    ${rec.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}
                                    text-xs px-2 py-1 rounded font-bold uppercase
                                `}>
                                    {rec.type}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="praman-card p-6 flex items-center justify-center border-dashed border-2 border-gray-800 bg-transparent opacity-50">
                        <div className="text-center">
                            <CheckCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">All other parameters within optimal range.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Panel: Impact Forecast */}
            <div className="praman-card p-6 flex flex-col h-full bg-gradient-to-b from-[#1f2937] to-[#161c2e]">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Projected Yield Impact
                </h3>

                <div className="flex-1 space-y-8">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Current Prediction</span>
                            <span className="text-white font-mono font-bold">3.8 Tons/ha</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-gray-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-emerald-400">With Optimization</span>
                            <span className="text-emerald-400 font-mono font-bold">4.2 Tons/ha</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full relative" style={{ width: '85%' }}>
                                <div className="absolute right-0 -top-1 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            </div>
                        </div>
                        <p className="text-xs text-emerald-500 mt-2 font-medium">+10.5% yield increase estimated</p>
                    </div>

                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mt-8">
                        <h4 className="text-emerald-400 font-bold text-sm mb-1">ROI Analysis</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Spending <span className="text-white font-bold">₹800</span> on Urea today prevents <span className="text-white font-bold">₹4,500</span> potential yield loss at harvest.
                        </p>
                    </div>
                </div>

                <button className="w-full mt-6 bg-[#0f1421] hover:bg-[#1f2937] text-gray-300 py-3 rounded-xl text-sm font-semibold border border-gray-700 transition-colors flex items-center justify-center gap-2 group">
                    View Detailed Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default NutrientPlan;
