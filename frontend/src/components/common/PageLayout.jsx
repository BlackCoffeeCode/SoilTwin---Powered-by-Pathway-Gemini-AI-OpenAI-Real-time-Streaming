import React from 'react';

const PageLayout = ({ title, subtitle, children, actions }) => {
    return (
        <div className="min-h-screen fade-in-up">
            {/* Page Header — matches Home hero design language */}
            {(title || actions) && (
                <div
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(238,245,238,0.4) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderBottom: '1px solid rgba(45, 80, 22, 0.08)',
                        boxShadow: '0 4px 24px rgba(45, 80, 22, 0.05)',
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                {title && (
                                    <h1
                                        style={{
                                            fontFamily: "'Libre Baskerville', Georgia, serif",
                                            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                                            fontWeight: 800,
                                            color: '#0f2e1c',
                                            lineHeight: 1.1,
                                            letterSpacing: '-0.5px',
                                            margin: 0,
                                        }}
                                    >
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <div className="mt-2" style={{ fontSize: '1rem', color: '#4f6f5c', fontWeight: 400, lineHeight: 1.6 }}>
                                        {subtitle}
                                    </div>
                                )}
                            </div>
                            {actions && (
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {actions}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {children}
            </div>
        </div>
    );
};

export default PageLayout;
