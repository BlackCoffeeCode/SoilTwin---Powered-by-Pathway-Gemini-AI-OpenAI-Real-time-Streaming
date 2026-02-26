import SoilDashboard from './SoilDashboard';
import TrendsView from './TrendsView';
import { getSoilState } from '../api/apiClient';
import { useState, useEffect } from 'react';

const SoilHealthPage = () => {
    const [soilState, setSoilState] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await getSoilState();
            if (data && data.status !== 'No data') setSoilState(data);
        };
        fetch();
        const interval = setInterval(fetch, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 fade-in-up">
            <div className="border-b border-[#6D4C41]/10 pb-6">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2D5016] font-serif">Soil Health</h1>
                <p className="mt-2 text-lg text-[#8D6E63] font-light">Live nutrient readings and 7-day trend analysis from your field's digital twin.</p>
            </div>
            <SoilDashboard state={soilState} />
            <TrendsView />
        </div>
    );
};

export default SoilHealthPage;
