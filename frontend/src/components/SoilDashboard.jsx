import { Droplets, Zap, Leaf, Wind, ThermometerSun, Activity } from 'lucide-react';

const getMax = (label) => {
    const maxValues = { Nitrogen: 600, Phosphorus: 100, Potassium: 500, Moisture: 100, pH: 14, Temperature: 50 };
    return maxValues[label] || 100;
};

const MetricCard = ({ label, value, unit, icon: Icon, color, bg, border, trend, description }) => {
    const numVal = value !== undefined && value !== null ? Number(value) : null;
    const pct = numVal !== null ? Math.min(100, Math.max(0, (numVal / getMax(label)) * 100)) : 0;

    return (
        <div
            style={{
                background: 'rgba(255, 255, 255, 0.78)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1.5px solid ${border}`,
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(45,80,22,0.05), 0 8px 28px rgba(45,80,22,0.06)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(45,80,22,0.14)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,80,22,0.05), 0 8px 28px rgba(45,80,22,0.06)'; }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, background: bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={color} />
                </div>
                {trend !== undefined && (
                    <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                        background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: trend >= 0 ? '#059669' : '#dc2626',
                    }}>
                        {trend >= 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            {/* Value */}
            <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8D6E63', marginBottom: '4px' }}>{label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2rem', fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700, color: '#0f2e1c', lineHeight: 1 }}>
                        {numVal !== null ? numVal.toFixed(1) : '—'}
                    </span>
                    <span style={{ fontSize: '13px', color: '#8D6E63', fontWeight: 500 }}>{unit}</span>
                </div>
                {description && <p style={{ fontSize: '11px', color: '#8D6E63', marginTop: '4px', fontWeight: 400 }}>{description}</p>}
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden', marginTop: 'auto' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
            </div>
        </div>
    );
};

const SoilDashboard = ({ state }) => {
    const metrics = [
        {
            label: 'Nitrogen', value: state?.nitrogen_kg_ha ?? state?.N ?? state?.nitrogen ?? null,
            unit: 'kg/ha', icon: Leaf, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)',
            trend: 2, description: 'Primary macronutrient for growth',
        },
        {
            label: 'Phosphorus', value: state?.phosphorus_kg_ha ?? state?.P ?? state?.phosphorus ?? null,
            unit: 'kg/ha', icon: Zap, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)',
            trend: -1, description: 'Root development & energy transfer',
        },
        {
            label: 'Potassium', value: state?.potassium_kg_ha ?? state?.K ?? state?.potassium ?? null,
            unit: 'kg/ha', icon: Activity, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)',
            trend: 0, description: 'Disease resistance & water regulation',
        },
        {
            label: 'Moisture', value: state?.soil_moisture_pct ?? state?.moisture ?? null,
            unit: '%', icon: Droplets, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)',
            trend: -3, description: 'Volumetric water content',
        },
        {
            label: 'pH', value: state?.ph ?? state?.pH ?? null,
            unit: 'pH', icon: ThermometerSun, color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)',
            description: 'Soil acidity / alkalinity level',
        },
        {
            label: 'Temperature', value: state?.soil_temp_c ?? state?.temperature ?? null,
            unit: '°C', icon: Wind, color: '#e11d48', bg: 'rgba(225,29,72,0.1)', border: 'rgba(225,29,72,0.2)',
            description: 'Topsoil temperature reading',
        },
    ];

    const isLive = state && state.status !== 'No data';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Live status banner */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
                background: isLive ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${isLive ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.3)'}`,
                borderRadius: '14px',
                fontSize: '14px', fontWeight: 500,
                color: isLive ? '#065f46' : '#92400e',
            }}>
                <Activity size={16} style={{ flexShrink: 0, animation: isLive ? 'none' : 'pulse-natural 2s infinite' }} />
                {isLive
                    ? <>Live soil data synchronized from Pathway AI pipeline
                        {state?.timestamp && <span style={{ marginLeft: 'auto', fontSize: '12px', fontFamily: 'monospace', color: '#059669' }}>
                            Updated: {new Date(state.timestamp).toLocaleTimeString()}
                        </span>}</>
                    : 'Pathway pipeline is streaming — soil data will appear shortly...'
                }
            </div>

            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {metrics.map(m => <MetricCard key={m.label} {...m} />)}
            </div>
        </div>
    );
};

export default SoilDashboard;
