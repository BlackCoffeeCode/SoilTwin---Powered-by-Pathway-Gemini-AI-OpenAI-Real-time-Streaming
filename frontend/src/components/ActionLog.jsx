import { useDemo } from '../context/DemoContext';
import { Activity, ArrowRight, Database, CloudRain } from 'lucide-react';

const ActionLog = () => {
    const { logs } = useDemo();

    if (logs.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'event': return <CloudRain className="w-3 h-3 text-blue-400" />;
            case 'success': return <Database className="w-3 h-3 text-emerald-400" />;
            case 'warning': return <Activity className="w-3 h-3 text-amber-400" />;
            default: return <ArrowRight className="w-3 h-3 text-slate-400" />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'event': return 'border-blue-500/30 bg-blue-900/40 text-blue-100';
            case 'success': return 'border-emerald-500/30 bg-emerald-900/40 text-emerald-100';
            case 'warning': return 'border-amber-500/30 bg-amber-900/40 text-amber-100';
            default: return 'border-slate-700 bg-slate-900/60 text-slate-300';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {logs.map((log) => (
                <div
                    key={log.id}
                    className={`
                        flex items-center gap-3 p-3 rounded-lg border backdrop-blur-md shadow-xl
                        text-xs font-mono animate-in slide-in-from-right-10 fade-in duration-300
                        ${getColor(log.type)}
                    `}
                >
                    <span className="opacity-50 text-[10px]">{log.timestamp}</span>
                    <div className="p-1 rounded bg-black/20">
                        {getIcon(log.type)}
                    </div>
                    <span>{log.message}</span>
                </div>
            ))}
        </div>
    );
};

export default ActionLog;
