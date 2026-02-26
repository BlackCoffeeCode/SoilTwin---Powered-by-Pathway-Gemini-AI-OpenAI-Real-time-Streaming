import { useNavigate } from 'react-router-dom';
import { User, MapPin, Sprout, Activity, Save, Upload } from 'lucide-react';
import PageLayout from './common/PageLayout';
import React, { useState, useEffect } from 'react';


const ProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // New state for file upload
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [reports, setReports] = useState([]);
    const [fetchingReports, setFetchingReports] = useState(false);

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

    // New file selection handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            uploadFileToS3(file);
        }
    };

    // New S3 upload function
    const uploadFileToS3 = async (file) => {
  setUploading(true);
  setUploadMessage('');

  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('soiltwin_token');
  const baseURL = import.meta.env.VITE_API_URL || 'https://d2bebk7g4ys5zv.cloudfront.net/api';

  try {
    const response = await fetch(`${baseURL}/upload-soil-report`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      setUploadMessage('✅ Upload successful! File saved to cloud.');
      setUploadFile(null);
      fetchReports();  // Refresh the report list
    } else {
      setUploadMessage(`❌ Upload failed: ${data.detail || 'Unknown error'}`);
    }
  } catch (error) {
    setUploadMessage(`❌ Upload error: ${error.message}`);
  } finally {
    setUploading(false);
  }
};

    

const fetchReports = async () => {
  setFetchingReports(true);
  try {
    const token = localStorage.getItem('soiltwin_token');
    const response = await fetch('https://d2bebk7g4ys5zv.cloudfront.net/api/soil-reports', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setReports(data);
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
  } finally {
    setFetchingReports(false);
  }
};

// Fetch reports when component mounts
useEffect(() => {
  fetchReports();
}, []);

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
        <PageLayout
            title="Digital Twin Setup"
            subtitle="Initialize your farm's virtual clone with precision data for accurate AI simulations."
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Farmer Details */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="card p-8 border-[#2D5016]/10 relative group bg-white/60">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <User className="w-24 h-24 text-[#2D5016]" />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3.5 rounded-2xl bg-[#2D5016]/5 border border-[#2D5016]/10">
                                <User className="w-6 h-6 text-[#2D5016]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif text-[#2D5016] font-bold">Farmer Profile</h3>
                                <p className="text-sm text-[#8D6E63] font-medium">Personal & Field Identity</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="group/input">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2 group-focus-within/input:text-[#2D5016] transition-colors">Full Name</label>
                                <input
                                    type="text" name="name" required
                                    value={formData.name} onChange={handleChange}
                                    className="w-full bg-[#F5F1E8]/50 border-2 border-transparent focus:bg-white focus:border-[#7CB342]/50 rounded-xl px-4 py-3.5 text-[#2D5016] placeholder-[#A1887F]/50 outline-none transition-all duration-300 font-medium"
                                    placeholder="e.g. Rajesh Kumar"
                                />
                            </div>

                            <div className="group/input">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2 group-focus-within/input:text-[#2D5016] transition-colors">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-[#8D6E63]/50" />
                                    <input
                                        type="text" name="location" required
                                        value={formData.location} onChange={handleChange}
                                        className="w-full bg-[#F5F1E8]/50 border-2 border-transparent focus:bg-white focus:border-[#7CB342]/50 rounded-xl pl-12 pr-4 py-3.5 text-[#2D5016] placeholder-[#A1887F]/50 outline-none transition-all duration-300 font-medium"
                                        placeholder="District, State"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="group/input">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2 group-focus-within/input:text-[#2D5016] transition-colors">Acres</label>
                                    <input
                                        type="number" name="land_size" required step="0.1"
                                        value={formData.land_size} onChange={handleChange}
                                        className="w-full bg-[#F5F1E8]/50 border-2 border-transparent focus:bg-white focus:border-[#7CB342]/50 rounded-xl px-4 py-3.5 text-[#2D5016] placeholder-[#A1887F]/50 outline-none transition-all duration-300 font-medium font-mono text-lg"
                                        placeholder="0.0"
                                    />
                                </div>
                                <div className="group/input">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-2 group-focus-within/input:text-[#2D5016] transition-colors">Crop</label>
                                    <div className="relative">
                                        <Sprout className="absolute left-3.5 top-3.5 w-5 h-5 text-[#8D6E63]/50 pointer-events-none" />
                                        <select
                                            name="crop"
                                            value={formData.crop} onChange={handleChange}
                                            className="w-full bg-[#F5F1E8]/50 border-2 border-transparent focus:bg-white focus:border-[#7CB342]/50 rounded-xl pl-10 pr-4 py-3.5 text-[#2D5016] outline-none appearance-none cursor-pointer transition-all duration-300 font-medium hover:bg-[#F5F1E8]"
                                        >
                                            <option value="Wheat">Wheat 🌾</option>
                                            <option value="Rice">Rice 🍚</option>
                                            <option value="Maize">Maize 🌽</option>
                                            <option value="Cotton">Cotton ☁️</option>
                                        </select>
                                        <div className="absolute right-4 top-4 text-[#8D6E63]/50 pointer-events-none text-xs">▼</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decoration Card */}
                    <div className="bg-gradient-to-br from-[#2D5016] to-[#1a330d] rounded-2xl p-6 text-white text-center relative overflow-hidden group shadow-lg">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h4 className="font-serif text-lg mb-1 opacity-90">Ready to simulate?</h4>
                            <p className="text-xs text-white/60 mb-4">Set accurate baselines for best AI results.</p>
                            <div className="h-1 w-16 bg-[#7CB342] mx-auto rounded-full group-hover:w-24 transition-all duration-500"></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Soil Data */}
                <div className="lg:col-span-7">
                    <div className="card p-8 border-[#2D5016]/10 relative bg-white/70">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 rounded-2xl bg-[#7CB342]/10 border border-[#7CB342]/20">
                                    <Activity className="w-6 h-6 text-[#7CB342]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif text-[#2D5016] font-bold">Initial Soil Report</h3>
                                    <p className="text-sm text-[#8D6E63] font-medium">Baseline Chemical Composition</p>
                                </div>
                            </div>
                            {/* Modified upload button section */}
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="file-upload"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('file-upload').click()}
                                        disabled={uploading}
                                        className="text-xs font-bold text-[#7CB342] bg-[#7CB342]/5 hover:bg-[#7CB342]/10 px-4 py-2 rounded-lg border border-[#7CB342]/20 transition-all flex items-center gap-2 group"
                                    >
                                        <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                        {uploading ? 'Uploading...' : 'Upload Lab Report'}
                                    </button>
                                    {uploadFile && !uploading && (
                                        <span className="text-xs text-[#8D6E63]">Selected: {uploadFile.name}</span>
                                    )}
                                </div>
                                {uploadMessage && (
                                    <div className={`text-xs mt-1 ${uploadMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                                        {uploadMessage}
                                    </div>
                                )}
                            </div>
                        </div>

                                    {reports.length > 0 && (
  <div className="mt-8">
    <h4 className="font-semibold text-[#2D5016] mb-4">Your Uploaded Reports</h4>
    <ul className="space-y-2">
      {reports.map(report => (
        <li key={report._id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
          <span className="text-sm text-gray-700">{report.filename}</span>
          <a
            href={report.view_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7CB342] hover:underline text-sm"
          >
            View
          </a>
        </li>
      ))}
    </ul>
  </div>
)}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                            {[
                                { label: "Nitrogen (N)", name: "nitrogen", unit: "kg/ha", color: "emerald" },
                                { label: "Phosphorus (P)", name: "phosphorus", unit: "kg/ha", color: "orange" },
                                { label: "Potassium (K)", name: "potassium", unit: "kg/ha", color: "red" },
                                { label: "Moisture", name: "moisture", unit: "%", step: "0.1", color: "blue" },
                                { label: "pH Level", name: "ph", unit: "scale", step: "0.1", color: "purple" },
                                { label: "Org. Carbon", name: "organic_carbon", unit: "%", step: "0.01", color: "stone" }
                            ].map((field) => (
                                <div key={field.name} className="bg-[#Fdfbf7] rounded-2xl p-4 border border-[#F5F1E8] hover:border-[#D4A574]/30 hover:shadow-lg hover:shadow-[#D4A574]/5 transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#8D6E63]">{field.label}</label>
                                        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#F5F1E8] text-[#8D6E63]/60 font-medium">
                                            {field.unit}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name={field.name}
                                            step={field.step || "1"}
                                            required
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full bg-transparent text-2xl font-serif font-medium text-[#2D5016] placeholder-[#A1887F]/30 outline-none border-b-2 border-transparent focus:border-[#7CB342] transition-colors py-1 pl-1"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end border-t border-[#F5F1E8] pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-gradient-to-r from-[#2D5016] via-[#3E6B1E] to-[#7CB342] text-white font-bold text-lg shadow-xl shadow-[#2D5016]/20 hover:shadow-2xl hover:shadow-[#2D5016]/30 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl"></div>
                                <Save className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">{loading ? 'Initializing Twin...' : 'Create Digital Twin'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </PageLayout>
    );
};

export default ProfileSetup;
