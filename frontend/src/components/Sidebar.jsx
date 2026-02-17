import {
    LayoutDashboard,
    Sprout,
    Activity,
    MessageSquareText,
    FlaskConical,
    Settings,
    ShieldCheck,
    Globe,
    User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    // Structure based on User Request
    const navItems = [
        { icon: Globe, label: 'Home', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: User, label: 'Profile & Data', path: '/profile' },
        { icon: Sprout, label: 'Soil Health', path: '/trends' },
        { icon: Activity, label: 'Live Events', path: '/history' },
        { icon: MessageSquareText, label: 'Advisory Chat', path: '/plan' },
        { icon: FlaskConical, label: 'Simulation', path: '/map' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <aside className="w-[260px] sidebar-container flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-8 pb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">SoilTwin</h1>
                        <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">AI Dashboard</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom Actions / Admin */}
            <div className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase">System Secure</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Firmware v2.4.0 active. All nodes online.</p>
                </div>

                <Link
                    to="/admin"
                    className={`sidebar-item ${isActive('/admin') ? 'active' : ''}`}
                >
                    <Settings className="w-5 h-5" />
                    <span>Admin Settings</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
