import { useDemo } from '../context/DemoContext';
import { Clock, Droplets, CloudRain, Zap, Sprout, Tractor, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const ActivityLog = () => {
    const { logs } = useDemo();


    const getIcon = (type) => {
        if (type === 'event') return <Zap className="w-4 h-4 text-blue-400" />;
        if (type === 'success') return <CheckCircle className="w-4 h-4 text-green-400" />;
        if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
        if (type === 'error') return <AlertTriangle className="w-4 h-4 text-red-400" />;
        return <Info className="w-4 h-4 text-gray-400" />;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#161c2e]">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide">Event Stream</h3>
                </div>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">LIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 p-2 custom-scrollbar bg-[#0f1421]">
                {logs.length === 0 ? (
                    <div className="text-center text-xs text-gray-600 py-8">Waiting for events...</div>
                ) : (
                    logs.slice().reverse().map((log) => (
                        <div key={log.id} className="flex gap-3 p-3 rounded-lg hover:bg-[#161c2e] transition-colors border-b border-gray-800/50 last:border-0 group animate-in fade-in slide-in-from-top-2">
                            <div className={`mt-0.5 p-1.5 rounded bg-[#1f2937] group-hover:bg-[#374151] transition-colors`}>
                                {getIcon(log.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-gray-300 capitalize">
                                        {log.type === 'event' ? 'System Event' : log.type}
                                    </p>
                                    <span className="text-[10px] text-gray-600 font-mono">
                                        {log.timestamp}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-mono mt-0.5 break-words">
                                    {log.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLog;

