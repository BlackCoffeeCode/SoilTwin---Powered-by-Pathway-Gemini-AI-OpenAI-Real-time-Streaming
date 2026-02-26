import { ShieldCheck, FlaskConical, Microscope, BarChart3, Award, TrendingUp } from 'lucide-react';

const stats = [
    { icon: ShieldCheck, label: 'Health Score', value: '82 / 100', sub: 'Good condition', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    { icon: FlaskConical, label: 'Organic Matter', value: '3.2%', sub: 'Optimal range', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
    { icon: Microscope, label: 'Microbial Activity', value: 'High', sub: 'Active soil biome', color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
    { icon: BarChart3, label: 'Field Capacity', value: '78%', sub: 'Water retention', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    { icon: TrendingUp, label: 'Yield Forecast', value: '+12%', sub: 'vs. last season', color: '#e11d48', bg: 'rgba(225,29,72,0.1)', border: 'rgba(225,29,72,0.2)' },
    { icon: Award, label: 'Nutrient Balance', value: 'Balanced', sub: 'NPK ratio optimal', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
];

const SoilHealthStats = () => (
    <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 36, height: 36, background: 'rgba(45,80,22,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#2D5016" />
            </div>
            <h3 style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: '1.3rem', fontWeight: 700, color: '#0f2e1c', margin: 0 }}>
                Soil Health Summary
            </h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {stats.map(({ icon: Icon, label, value, sub, color, bg, border }) => (
                <div
                    key={label}
                    style={{
                        flex: '1 1 160px', display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px 20px',
                        background: 'rgba(255,255,255,0.78)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: `1.5px solid ${border}`,
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(45,80,22,0.05)',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,80,22,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,80,22,0.05)'; }}
                >
                    <div style={{ width: 44, height: 44, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color={color} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700, color: '#0f2e1c', lineHeight: 1 }}>{value}</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8D6E63', marginTop: '3px' }}>{label}</div>
                        {sub && <div style={{ fontSize: '11px', color: '#8D6E63', marginTop: '2px' }}>{sub}</div>}
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default SoilHealthStats;
