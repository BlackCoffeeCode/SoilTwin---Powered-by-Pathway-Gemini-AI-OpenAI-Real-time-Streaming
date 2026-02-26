import ChatBox from './ChatBox';
import PageLayout from './common/PageLayout';
import { Sparkles, BookOpen, Leaf, Droplets, CloudRain } from 'lucide-react';

const SAMPLE_PROMPTS = [
    { icon: Leaf, text: 'What is the current nitrogen status of my field?' },
    { icon: Droplets, text: 'Should I irrigate today given the soil moisture levels?' },
    { icon: CloudRain, text: 'How will the last rainfall affect my crop yield?' },
    { icon: BookOpen, text: 'Recommend a fertilizer schedule for Wheat this week.' },
];

const AdvisoryChatPage = () => {
    return (
        <PageLayout
            title="AI Advisory Chat"
            subtitle="Ask our Pathway-powered RAG engine for real-time soil and crop recommendations."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Sidebar — Quick Prompts */}
                <div className="lg:col-span-4 space-y-5">
                    <div className="card p-6 border-[#2D5016]/10">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-[#2D5016]/5 rounded-xl">
                                <Sparkles className="w-5 h-5 text-[#2D5016]" />
                            </div>
                            <h3 className="font-bold text-[#2D5016] font-serif text-lg">Quick Prompts</h3>
                        </div>
                        <div className="space-y-3">
                            {SAMPLE_PROMPTS.map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F1E8]/50 hover:bg-[#F5F1E8] border border-transparent hover:border-[#7CB342]/20 cursor-pointer transition-all group"
                                >
                                    <div className="p-1.5 bg-white rounded-lg border border-[#7CB342]/20 mt-0.5 group-hover:border-[#7CB342]/40 transition-colors">
                                        <Icon className="w-4 h-4 text-[#2D5016]" />
                                    </div>
                                    <p className="text-sm text-[#5D4037] font-medium leading-snug">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5 bg-gradient-to-br from-[#2D5016] to-[#1a330d] text-white">
                        <h4 className="font-serif text-base font-bold mb-1">Powered by Pathway RAG</h4>
                        <p className="text-sm text-white/70 leading-relaxed" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                            Your field's live sensor data, soil history, and agronomic research docs are embedded and retrieved in real-time for every answer.
                        </p>
                    </div>
                </div>

                {/* Main Chat */}
                <div className="lg:col-span-8 h-[640px]">
                    <ChatBox />
                </div>
            </div>
        </PageLayout>
    );
};

export default AdvisoryChatPage;
