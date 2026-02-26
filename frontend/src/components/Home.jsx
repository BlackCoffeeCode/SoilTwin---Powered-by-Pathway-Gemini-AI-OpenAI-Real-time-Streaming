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
