import { Zap, AlertTriangle, CheckCircle, Droplets, ArrowRight, Activity, Leaf, Sprout } from 'lucide-react';
import PageLayout from './common/PageLayout';

const NutrientPlan = () => {
    const recommendations = [
        {
            id: 1,
            type: 'Critical',
            title: 'Nitrogen Deficiency Detected',
            description: 'Current levels (410 kg/ha) are trending below optimal range for Wheat vegetative stage. Yield loss risk: High (-15%).',
            action: 'Apply Urea (20kg)',
            icon: Zap,
            color: 'amber',
            bg: 'bg-amber-50'
        },
        {
            id: 2,
            type: 'Routine',
            title: 'Irrigation Schedule Update',
            description: 'Soil moisture is adequate (65%). Delay scheduled irrigation by 24 hours to prevent leaching.',
            action: 'Reschedule',
            icon: Droplets,
            color: 'blue',
            bg: 'bg-blue-50'
        }
    ];

    return (
        <PageLayout
            title="AI Nutrient Plan"
            subtitle="Real-time recommendations optimized for maximum yield and minimum cost."
            actions={
                <div className="flex items-center gap-2 bg-emerald-100/50 px-4 py-2 rounded-xl border border-emerald-200/50 text-emerald-800 text-sm font-bold">
                    <Sprout className="w-4 h-4" />
                    <span>Optimization Score: 92/100</span>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className={`card p-6 border-l-4 ${rec.color === 'amber' ? 'border-l-amber-500' : 'border-l-blue-500'} bg-white group hover:shadow-lg transition-all`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-5">
                                        <div className={`p-4 rounded-2xl ${rec.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <rec.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#2D5016] font-serif">{rec.title}</h3>
                                            <p className="text-[#8D6E63] text-sm mt-1 mb-4 max-w-lg leading-relaxed font-medium">
                                                {rec.description}
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <button className={`
                                                    ${rec.color === 'amber' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'}
                                                    text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2
                                                `}>
                                                    <Zap className="w-4 h-4" /> {rec.action}
                                                </button>
                                                <button className="text-[#8D6E63] hover:text-[#2D5016] hover:bg-[#2D5016]/5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`
                                        ${rec.color === 'amber' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}
                                        text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider
                                    `}>
                                        {rec.type}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className="card p-8 flex flex-col items-center justify-center border-dashed border-2 border-[#6D4C41]/10 bg-transparent opacity-70">
                            <div className="p-4 bg-emerald-50 rounded-full mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <p className="text-[#8D6E63] font-medium">All other parameters within optimal range.</p>
                        </div>
                    </div>
                </div>

                {/* Side Panel: Impact Forecast */}
                <div className="card p-6 flex flex-col h-full bg-gradient-to-br from-[#2D5016] to-[#1A330D] text-white border-none shadow-xl">
                    <h3 className="font-bold text-white mb-8 flex items-center gap-2 text-lg font-serif">
                        <Activity className="w-5 h-5 text-[#81C784]" />
                        Projected Yield Impact
                    </h3>

                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-white/70">Current Prediction</span>
                                <span className="text-white font-mono font-bold text-lg">3.8 Tons/ha</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
                                <div className="bg-white/40 h-3 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-[#81C784]">With Optimization</span>
                                <span className="text-[#81C784] font-mono font-bold text-lg">4.2 Tons/ha</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
                                <div className="bg-[#81C784] h-3 rounded-full relative shadow-[0_0_20px_rgba(129,199,132,0.4)]" style={{ width: '85%' }}>
                                    <div className="absolute right-0 -top-1.5 w-6 h-6 bg-[#81C784] border-4 border-[#244212] rounded-full" />
                                </div>
                            </div>
                            <p className="text-xs text-[#81C784] mt-3 font-bold flex items-center gap-1">
                                <Leaf className="w-3 h-3" /> +10.5% yield increase estimated
                            </p>
                        </div>

                        <div className="p-5 bg-white/10 rounded-2xl border border-white/10 mt-8 backdrop-blur-md">
                            <h4 className="text-[#81C784] font-bold text-sm mb-2 uppercase tracking-wide">ROI Analysis</h4>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Spending <span className="text-white font-bold bg-white/20 px-1 rounded">₹800</span> on Urea today prevents <span className="text-white font-bold bg-white/20 px-1 rounded">₹4,500</span> potential yield loss at harvest.
                            </p>
                        </div>
                    </div>

                    <button className="w-full mt-8 bg-white text-[#2D5016] hover:bg-[#F5F1E8] py-4 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 group">
                        View Detailed Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default NutrientPlan;
