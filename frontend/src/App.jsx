import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DemoProvider, useDemo } from './context/DemoContext'; // New
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import RoleGuard from './components/RoleGuard';
import HorizontalNav from './components/HorizontalNav';
import DashboardView from './components/DashboardView';
import ProfileSetup from './components/ProfileSetup';
import Home from './components/Home';
import FieldMap from './components/FieldMap';
import HistoryView from './components/HistoryView';
import TrendsView from './components/TrendsView';
import NutrientPlan from './components/NutrientPlan';
import ActionLog from './components/ActionLog'; // New
import SoilHealthPage from './components/SoilHealthPage';
import LiveEventsPage from './components/LiveEventsPage';
import AdvisoryChatPage from './components/AdvisoryChatPage';
import SimulationPage from './components/SimulationPage';
import { getSoilState, getProfile } from './api/apiClient';
import { Target } from 'lucide-react';

function AppContent() {
    const [soilState, setSoilState] = useState(null);
    const [profile, setProfile] = useState(null);
    const location = useLocation();
    const { triggerHeartbeat, addLog } = useDemo(); // Use Demo Context

    const fetchData = async () => {
        try {
            triggerHeartbeat(); // Visual Pulse

            // Fetch Soil State
            const stateData = await getSoilState();
            if (stateData && stateData.status !== "No data") {
                setSoilState(stateData);
            }

            // Fetch Profile
            const profileJson = await getProfile();
            if (profileJson && profileJson.status === "Found") {
                setProfile(profileJson.data);
            }
        } catch (e) {
            console.error("Failed to fetch data", e);
        }
    };

    useEffect(() => {
        // Only fetch data if not on login/register/password-reset pages
        if (!location.pathname.match(/\/(login|register|forgot-password|reset-password)/)) {
            fetchData();
            const interval = setInterval(fetchData, 2000);
            return () => clearInterval(interval);
        }
    }, [location.pathname]);

    // Don't show nav on auth pages
    const showNav = !location.pathname.match(/\/(login|register|forgot-password|reset-password)/);

    return (
        <div className="app-container">
            {showNav && <HorizontalNav />}

            <ActionLog /> {/* Live System Log */}

            <main className={showNav ? "main-content" : ""}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home profile={profile} />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardView soilState={soilState} profile={profile} />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfileSetup />
                        </ProtectedRoute>
                    } />
                    <Route path="/trends" element={
                        <ProtectedRoute>
                            <div className="card min-h-[600px]"><TrendsView /></div>
                        </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <div className="card min-h-[600px]"><HistoryView /></div>
                        </ProtectedRoute>
                    } />
                    <Route path="/plan" element={
                        <ProtectedRoute>
                            <div className="card min-h-[600px]"><NutrientPlan /></div>
                        </ProtectedRoute>
                    } />
                    <Route path="/map" element={
                        <ProtectedRoute>
                            <div className="card min-h-[600px]"><FieldMap /></div>
                        </ProtectedRoute>
                    } />

                    {/* Nav routes */}
                    <Route path="/soil-health" element={
                        <ProtectedRoute><SoilHealthPage /></ProtectedRoute>
                    } />
                    <Route path="/profile-data" element={
                        <ProtectedRoute><ProfileSetup /></ProtectedRoute>
                    } />
                    <Route path="/live-events" element={
                        <ProtectedRoute><LiveEventsPage /></ProtectedRoute>
                    } />
                    <Route path="/advisory-chat" element={
                        <ProtectedRoute><AdvisoryChatPage /></ProtectedRoute>
                    } />
                    <Route path="/simulation" element={
                        <ProtectedRoute><SimulationPage /></ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={['admin']} fallback={
                                <div className="card min-h-[600px] flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                                        <span className="text-4xl">🚫</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-red-600">Access Denied</h3>
                                    <p className="text-slate-600 mt-2">Administrator privileges required.</p>
                                </div>
                            }>
                                <div className="card min-h-[600px] flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                                        <Target className="w-10 h-10 text-purple-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold" style={{ color: '#9333ea' }}>👑 Administrator Panel</h3>
                                    <p className="text-slate-600 mt-2">Welcome to the admin dashboard.</p>
                                    <div className="mt-6 text-sm text-slate-500">
                                        <p>User management, system settings, and analytics coming soon...</p>
                                    </div>
                                </div>
                            </RoleGuard>
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <DemoProvider>
                <Router>
                    <AppContent />
                </Router>
            </DemoProvider>
        </AuthProvider>
    );
}
