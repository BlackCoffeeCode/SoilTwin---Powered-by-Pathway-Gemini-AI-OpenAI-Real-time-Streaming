import { useState, useEffect } from 'react';
import { fetchWeather } from '../api/apiClient';
import { CloudRain, Sun, Droplets, Wind, AlertCircle } from 'lucide-react';

const WeatherWidget = ({ location }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchWeather(location || "Ludhiana,IN");
            setWeather(data);
            setLoading(false);
        };
        load();

        // Refresh every 10 minutes
        const interval = setInterval(load, 600000);
        return () => clearInterval(interval);
    }, [location]);

    if (loading) return (
        <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse">
            <Sun className="w-4 h-4" /> Loading Weather...
        </div>
    );

    // Fallback if weather is null (API failure)
    const displayWeather = weather || {
        temp: 28.5,
        humidity: 65,
        rain: 0,
        description: "Sunny (Demo)",
        icon: "01d",
        impact: "Ideal for harvest"
    };

    if (!displayWeather) return null;

    return (
        <div className="flex items-center gap-4 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
                <img
                    src={`https://openweathermap.org/img/wn/${displayWeather.icon}.png`}
                    alt="Weather"
                    className="w-8 h-8"
                />
                <div>
                    <div className="text-white font-bold text-sm">{displayWeather.temp}°C</div>
                    <div className="text-xs text-slate-400 capitalize">{displayWeather.description}</div>
                </div>
            </div>

            <div className="h-8 w-px bg-slate-700 mx-1 hidden sm:block"></div>

            <div className="hidden sm:flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-xs text-blue-300">
                    <Droplets className="w-3 h-3" />
                    <span>{displayWeather.humidity}% Hum</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    {displayWeather.rain > 0 ? (
                        <>
                            <CloudRain className="w-3 h-3 text-blue-400" />
                            <span>{displayWeather.rain}mm Rain</span>
                        </>
                    ) : (
                        <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-1.5 rounded border border-emerald-900/50">
                            {displayWeather.impact}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
