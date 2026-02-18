import React from 'react';

const PageLayout = ({ title, subtitle, children, actions }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 fade-in-up">
            {/* Header Section */}
            {(title || actions) && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#6D4C41]/10 pb-6">
                    <div>
                        {title && <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2D5016] font-serif">{title}</h1>}
                        {subtitle && <p className="mt-2 text-lg text-[#8D6E63] font-light">{subtitle}</p>}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-3">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default PageLayout;
