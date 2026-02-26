<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Droplet, Leaf } from 'lucide-react';

const Home = ({ profile }) => {
    const navigate = useNavigate();

    return (
        <div className="living-earth-hero">
            {/* Hero Section */}
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Living Earth<br />Platform
                    </h1>
                    <p className="hero-subtitle">
                        Empowering India's environmental future through AI-powered soil health monitoring, real-time analytics, and sustainable agriculture practices.
                    </p>

                    {/* Badge Pills */}
                    <div className="hero-badges">
                        <span className="badge-pill active">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered
                        </span>
                        <span className="badge-pill">
                            <Droplet className="w-4 h-4" />
                            Real-Time Monitoring
                        </span>
                        <span className="badge-pill">
                            <Leaf className="w-4 h-4" />
                            Sustainable Impact
                        </span>
                    </div>
                </div>

                {/* Decorative Tree Illustration */}
                <div className="hero-illustration">
                    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" className="botanical-tree">
                        {/* Tree Trunk */}
                        <path d="M240 380 Q245 320 250 260 Q255 320 260 380" fill="#6D4C41" stroke="#5D432F" strokeWidth="2" />

                        {/* Roots with Indian Architecture */}
                        <g opacity="0.7">
                            <path d="M250 380 L220 420 M250 380 L280 420 M250 380 L190 440 M250 380 L310 440"
                                stroke="#6D4C41" strokeWidth="3" fill="none" />
                            {/* Taj Mahal silhouette */}
                            <path d="M200 450 L210 430 L220 450 L230 430 L240 450 L250 420 L260 450 L270 430 L280 450 L290 430 L300 450"
                                fill="#8D6E63" opacity="0.4" />
                        </g>

                        {/* Main Canopy - Organic Swirls */}
                        <circle cx="250" cy="200" r="120" fill="#7CB342" opacity="0.3" />
                        <circle cx="200" cy="180" r="80" fill="#81C784" opacity="0.4" />
                        <circle cx="300" cy="180" r="80" fill="#81C784" opacity="0.4" />
                        <circle cx="250" cy="140" r="90" fill="#2D5016" opacity="0.3" />

                        {/* Decorative Leaves */}
                        <g className="floating-leaves">
                            <ellipse cx="180" cy="160" rx="15" ry="25" fill="#7CB342" opacity="0.6" transform="rotate(-20 180 160)" />
                            <ellipse cx="320" cy="160" rx="15" ry="25" fill="#7CB342" opacity="0.6" transform="rotate(20 320 160)" />
                            <ellipse cx="250" cy="100" rx="15" ry="25" fill="#2D5016" opacity="0.7" />
                            <ellipse cx="220" cy="200" rx="12" ry="20" fill="#81C784" opacity="0.6" transform="rotate(-30 220 200)" />
                            <ellipse cx="280" cy="200" rx="12" ry="20" fill="#81C784" opacity="0.6" transform="rotate(30 280 200)" />
                        </g>

                        {/* Golden Flowers */}
                        <g className="flowers">
                            <circle cx="200" cy="140" r="8" fill="#D4A574" />
                            <circle cx="300" cy="150" r="8" fill="#D4A574" />
                            <circle cx="250" cy="120" r="10" fill="#D4A574" />
                            <circle cx="270" cy="180" r="7" fill="#D4A574" opacity="0.8" />
                        </g>

                        {/* Swirls and ornamental details */}
                        <path d="M160 180 Q150 170 160 160" stroke="#6D4C41" strokeWidth="2" fill="none" opacity="0.5" />
                        <path d="M340 180 Q350 170 340 160" stroke="#6D4C41" strokeWidth="2" fill="none" opacity="0.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Home;
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Droplets, Leaf, Zap, Brain, BarChart3, FlaskConical, Radio, ArrowRight, Shield } from 'lucide-react';
import 'animate.css';

const FEATURES = [
    {
        icon: Brain,
        title: 'Pathway RAG Engine',
        desc: 'Ask questions about your soil, crop health, or nutrient balance — answers grounded in live sensor data and agronomic docs.',
        color: '#7C3AED',
        bg: 'rgba(124,58,237,0.07)',
        link: '/advisory-chat',
    },
    {
        icon: Radio,
        title: 'Real-Time Soil Streaming',
        desc: 'Pathway continuously ingests NPK, moisture, pH sensor data and reflects changes across the digital twin within seconds.',
        color: '#0ea5e9',
        bg: 'rgba(14,165,233,0.07)',
        link: '/soil-health',
    },
    {
        icon: FlaskConical,
        title: 'Event Simulation',
        desc: 'Trigger rain, irrigation, fertilizer or harvest events and instantly watch the soil state update — powered by the streaming pipeline.',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.07)',
        link: '/simulation',
    },
    {
        icon: BarChart3,
        title: 'Trend Analytics',
        desc: '7-day NPK depletion curves, moisture retention charts, and composite soil health scoring for smarter farm decisions.',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.07)',
        link: '/soil-health',
    },
    {
        icon: Leaf,
        title: 'AI Nutrient Planning',
        desc: 'Get crop-specific fertilizer recommendations with cost optimisation — tailored to your region, season, and field baseline.',
        color: '#2D5016',
        bg: 'rgba(45,80,22,0.07)',
        link: '/plan',
    },
    {
        icon: Shield,
        title: 'Multi-User Access',
        desc: 'Role-based access for Farmers and Admins. Each user manages their own digital twin profile and field data independently.',
        color: '#e11d48',
        bg: 'rgba(225,29,72,0.07)',
        link: '/profile-data',
    },
];

const STATS = [
    { value: 'Live', label: 'Pathway Data Pipeline', icon: '⚡' },
    { value: 'RAG', label: 'AI Advisory Engine', icon: '🤖' },
    { value: 'NPK+', label: 'Soil Parameters Tracked', icon: '🌱' },
    { value: 'OpenAI', label: 'LLM Backend', icon: '🧠' },
];

const Home = ({ profile }) => {
    const navigate = useNavigate();

    return (
        <div style={{ background: 'linear-gradient(160deg, #eef5ee 0%, #dfe8e2 50%, #e8f0e4 100%)', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* ===== HERO SECTION ===== */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '48px' }}>

                {/* LEFT */}
                <div style={{ maxWidth: '600px' }} className="animate__animated animate__fadeInLeft">

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
                        <span style={badgeStyle}><Sparkles size={14} /> Pathway AI</span>
                        <span style={badgeStyle}><Zap size={14} /> Real-Time Streaming</span>
                        <span style={badgeStyle}><Leaf size={14} /> Soil Digital Twin</span>
                    </div>

                    {/* Headline */}
                    <h1 style={titleStyle}>
                        {profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'SoilTwin'}<br />
                        <span style={{ color: '#2D5016', fontStyle: 'italic' }}>Digital Twin for</span><br />
                        <span style={{ color: '#4f9d44' }}>Smart Agriculture</span>
                    </h1>

                    {/* Description */}
                    <p style={subtitleStyle}>
                        SoilTwin creates a <strong>live virtual clone of your farm field</strong> — powered by{' '}
                        <strong>Pathway's real-time streaming pipeline</strong>, OpenAI's LLM, and a RAG engine trained on
                        soil science docs. Monitor NPK levels, simulate irrigation events, and get AI advisory — all in real-time.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/dashboard')} style={ctaStyle}>
                            Go to Dashboard &nbsp;→
                        </button>
                        <button onClick={() => navigate('/advisory-chat')} style={secondaryCtaStyle}>
                            <Brain size={16} style={{ marginRight: '8px' }} /> Ask AI Advisor
                        </button>
                    </div>

                    {/* Powered by strip */}
                    <p style={{ marginTop: '28px', fontSize: '12px', color: '#8D6E63', letterSpacing: '0.05em', fontWeight: 500 }}>
                        POWERED BY &nbsp;Pathway · OpenAI · Google Gemini · Real-Time Event Streaming
                    </p>
                </div>

                {/* RIGHT — Animated SVG */}
                <div className="animate__animated animate__fadeInRight animate__slow" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 420 480" xmlns="http://www.w3.org/2000/svg" width="380" style={{ animation: 'floatTree 4s ease-in-out infinite' }}>
                        {/* Ground */}
                        <ellipse cx="210" cy="430" rx="130" ry="16" fill="#8D6E63" opacity="0.15" />
                        {/* Trunk */}
                        <path d="M200 380 Q205 310 210 240 Q215 310 220 380" fill="#6D4C41" stroke="#5D432F" strokeWidth="2" />
                        {/* Roots */}
                        <g opacity="0.6">
                            <path d="M210 380 L185 415 M210 380 L235 415 M210 380 L160 430 M210 380 L260 430" stroke="#6D4C41" strokeWidth="2.5" fill="none" />
                        </g>
                        {/* Canopy layers */}
                        <circle cx="210" cy="185" r="110" fill="#7CB342" opacity="0.22" />
                        <circle cx="170" cy="165" r="75" fill="#81C784" opacity="0.38" />
                        <circle cx="250" cy="165" r="75" fill="#81C784" opacity="0.38" />
                        <circle cx="210" cy="125" r="85" fill="#2D5016" opacity="0.30" />
                        <circle cx="210" cy="100" r="60" fill="#388E3C" opacity="0.40" />
                        {/* Sparkle dots — live "sensor" nodes */}
                        {[
                            [145, 145, '#f59e0b'], [270, 155, '#3b82f6'], [195, 80, '#10b981'],
                            [235, 195, '#e11d48'], [160, 200, '#7C3AED']
                        ].map(([cx, cy, color], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="6" fill={color} opacity="0.85" />
                                <circle cx={cx} cy={cy} r="12" fill={color} opacity="0.15">
                                    <animate attributeName="r" values="6;14;6" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.15;0;0.15" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                                </circle>
                            </g>
                        ))}
                        {/* Data stream lines */}
                        <line x1="145" y1="145" x2="210" y2="240" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                        <line x1="270" y1="155" x2="210" y2="240" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                        <line x1="195" y1="80" x2="210" y2="240" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                    </svg>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(45,80,22,0.08)', borderBottom: '1px solid rgba(45,80,22,0.08)', padding: '20px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '24px' }}>
                    {STATS.map(({ value, label, icon }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2D5016', fontFamily: 'serif', lineHeight: 1.1 }}>
                                {icon} {value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8D6E63', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== FEATURES GRID ===== */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#0f2e1c', fontFamily: 'serif', marginBottom: '12px' }}>
                        Everything your farm needs
                    </h2>
                    <p style={{ fontSize: '17px', color: '#4f6f5c', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                        From live sensor ingestion to AI-powered advisory, SoilTwin covers the entire precision agriculture stack.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {FEATURES.map(({ icon: Icon, title, desc, color, bg, link }) => (
                        <div
                            key={title}
                            onClick={() => navigate(link)}
                            style={{
                                background: 'rgba(255,255,255,0.75)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(45,80,22,0.08)',
                                borderRadius: '20px',
                                padding: '28px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(45,80,22,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ width: '48px', height: '48px', background: bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <Icon size={22} color={color} />
                            </div>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f2e1c', marginBottom: '8px' }}>{title}</h3>
                            <p style={{ fontSize: '14px', color: '#4f6f5c', lineHeight: 1.65, marginBottom: '16px' }}>{desc}</p>
                            <span style={{ fontSize: '13px', fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Explore <ArrowRight size={14} />
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section style={{ background: 'rgba(45,80,22,0.04)', borderTop: '1px solid rgba(45,80,22,0.07)', padding: '64px 40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 800, color: '#0f2e1c', fontFamily: 'serif', marginBottom: '48px' }}>
                        How SoilTwin works
                    </h2>
                    <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                            { step: '01', title: 'Sensor Data Ingested', desc: 'NPK, moisture, pH, rainfall data streams into Pathway in real-time via JSONL feeds.', icon: '📡' },
                            { step: '02', title: 'Pathway Processes Events', desc: 'Streaming pipeline aggregates, transforms, and scores soil state within milliseconds.', icon: '⚡' },
                            { step: '03', title: 'RAG Indexes Knowledge', desc: 'Soil science docs, fertilizer guides, and weather data are embedded and indexed for retrieval.', icon: '🧠' },
                            { step: '04', title: 'AI Advisory Generated', desc: 'Ask any question — Gemini/OpenAI answers using live soil state + retrieved agronomic context.', icon: '🤖' },
                        ].map(({ step, title, desc, icon }, i) => (
                            <div key={step} style={{ flex: '1 1 220px', maxWidth: '280px', textAlign: 'center', padding: '24px 20px', position: 'relative' }}>
                                {i < 3 && <div style={{ position: 'absolute', top: '36px', right: '-16px', fontSize: '22px', color: '#cfe0d5', zIndex: 0 }}>→</div>}
                                <div style={{ fontSize: '40px', marginBottom: '14px' }}>{icon}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#4f9d44', letterSpacing: '0.1em', marginBottom: '8px' }}>STEP {step}</div>
                                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f2e1c', marginBottom: '8px' }}>{title}</h4>
                                <p style={{ fontSize: '13px', color: '#4f6f5c', lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '48px' }}>
                        <button onClick={() => navigate('/simulation')} style={ctaStyle}>
                            Try the Simulation Lab →
                        </button>
                    </div>
                </div>
            </section>

            {/* Float animation */}
            <style>{`
                @keyframes floatTree {
                    0%   { transform: translateY(0px); }
                    50%  { transform: translateY(-14px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

/* ===== STYLES ===== */
const badgeStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px', borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.75)',
    border: '1px solid #cfe0d5',
    fontSize: '13px', fontWeight: 600, color: '#2D5016',
};
const titleStyle = {
    fontSize: '56px', lineHeight: 1.08, fontWeight: 800,
    marginBottom: '22px', color: '#0f2e1c', fontFamily: 'serif',
};
const subtitleStyle = {
    fontSize: '17px', lineHeight: 1.75, color: '#4f6f5c', marginBottom: '36px',
};
const ctaStyle = {
    display: 'inline-flex', alignItems: 'center',
    backgroundColor: '#1f6b3a', color: 'white',
    padding: '14px 32px', fontSize: '16px', fontWeight: 600,
    borderRadius: '40px', border: 'none', cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(31,107,58,0.28)',
    transition: 'background 0.2s, transform 0.15s',
};
const secondaryCtaStyle = {
    display: 'inline-flex', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: '#2D5016', padding: '14px 28px', fontSize: '16px', fontWeight: 600,
    borderRadius: '40px', border: '1.5px solid rgba(45,80,22,0.2)',
    cursor: 'pointer', transition: 'background 0.2s',
};

export default Home;
>>>>>>> df922889ce3a92ea64a7083a83bf9092b0b7935b
