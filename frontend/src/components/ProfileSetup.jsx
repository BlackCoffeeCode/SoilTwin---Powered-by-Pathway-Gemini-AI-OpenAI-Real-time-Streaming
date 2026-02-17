import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Sprout, Activity, Save, Upload } from 'lucide-react';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        land_size: '',
        crop: 'Wheat',
        nitrogen: 280,
        phosphorus: 18,
        potassium: 120,
        moisture: 20,
        ph: 6.5,
        organic_carbon: 0.5
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    land_size: parseFloat(formData.land_size),
                    nitrogen: parseFloat(formData.nitrogen),
                    phosphorus: parseFloat(formData.phosphorus),
                    potassium: parseFloat(formData.potassium),
                    moisture: parseFloat(formData.moisture),
                    ph: parseFloat(formData.ph),
                    organic_carbon: parseFloat(formData.organic_carbon)
                })
            });

            if (response.ok) {
                // Success animation?
                setTimeout(() => navigate('/'), 500);
            } else {
                alert("Failed to save profile");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 fade-in-up">
            <header>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Farmer Profile & Soil Data
                </h1>
                <p className="text-slate-400 mt-2">Initialize your Digital Twin with accurate ground truth.</p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Details Card */}
                <div className="card p-6 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                            <User className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Farmer Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:border-emerald-500/50 outline-none"
                                placeholder="e.g. Rajesh Kumar"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Location (District/State)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" name="location" required
                                    value={formData.location} onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white focus:border-emerald-500/50 outline-none"
                                    placeholder="e.g. Karnal, Haryana"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Land Size (Acres)</label>
                                <input
                                    type="number" name="land_size" required step="0.1"
                                    value={formData.land_size} onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-white focus:border-emerald-500/50 outline-none"
                                    placeholder="2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Main Crop</label>
                                <div className="relative">
                                    <Sprout className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <select
                                        name="crop"
                                        value={formData.crop} onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-white focus:border-emerald-500/50 outline-none appearance-none"
                                    >
                                        <option value="Wheat">Wheat</option>
                                        <option value="Rice">Rice</option>
                                        <option value="Maize">Maize</option>
                                        <option value="Cotton">Cotton</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Soil Data Card */}
                <div className="card p-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-cyan-500/10">
                                <Activity className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Initial Soil Data</h3>
                        </div>
                        <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                            <Upload className="w-3 h-3" /> Upload Report
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Nitrogen (N) - kg/ha</label>
                            <input
                                type="number" name="nitrogen" required
                                value={formData.nitrogen} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-cyan-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Phosphorus (P) - kg/ha</label>
                            <input
                                type="number" name="phosphorus" required
                                value={formData.phosphorus} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-cyan-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Potassium (K) - kg/ha</label>
                            <input
                                type="number" name="potassium" required
                                value={formData.potassium} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-cyan-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Moisture (%)</label>
                            <input
                                type="number" name="moisture" required step="0.1"
                                value={formData.moisture} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-cyan-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">pH Level</label>
                            <input
                                type="number" name="ph" required step="0.1"
                                value={formData.ph} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-cyan-500/50 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Organic Carbon (%)</label>
                            <input
                                type="number" name="organic_carbon" required step="0.01"
                                value={formData.organic_carbon} onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white text-right font-mono focus:border-cyan-500/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Initializing Twin...' : 'Create Digital Twin'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileSetup;
