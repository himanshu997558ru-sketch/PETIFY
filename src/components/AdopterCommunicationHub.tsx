import React, { useState } from 'react';
import {
  Search,
  Send,
  Phone,
  Video,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  PawPrint,
  FileText,
  Paperclip,
  Smile,
  ShieldCheck,
  ChevronRight,
  Filter,
  Sparkles,
  MessageSquare,
  AlertCircle,
  MoreVertical,
  Check,
  CheckCheck,
  Award,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAppStore } from '../context/AppContext';

export interface AdopterConversation {
  id: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  avatarUrl: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petImage: string;
  applicationId?: string;
  applicationStep?: number;
  applicationStatus?: 'Pending' | 'Under Review' | 'Approved' | 'Finalized' | 'Rejected';
  hasAppointment?: boolean;
  appointmentDetails?: {
    date: string;
    timeSlot: string;
    type: string;
    status: string;
  };
  unreadCount: number;
  lastMessage: string;
  lastMessageTimestamp: string;
  verifiedAdopter: boolean;
  notes: string;
  screeningTags: string[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'shelter' | 'adopter' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'document' | 'image' | 'schedule' | 'certificate';
    title: string;
    size?: string;
  };
}

const INITIAL_CONVERSATIONS: AdopterConversation[] = [
  {
    id: 'conv-1',
    adopterName: 'Rohit Verma',
    adopterEmail: 'rohit.v@example.com',
    adopterPhone: '+91 98112 34567',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    petName: 'Rocky',
    petSpecies: 'Dog',
    petBreed: 'Golden Retriever',
    petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
    applicationId: 'app-1',
    applicationStep: 2,
    applicationStatus: 'Pending',
    hasAppointment: true,
    appointmentDetails: {
      date: '2025-06-22',
      timeSlot: '11:00 AM - 12:00 PM',
      type: 'In-Person Meet & Greet',
      status: 'Confirmed',
    },
    unreadCount: 1,
    lastMessage: 'I uploaded my backyard video. Let me know if that satisfies the fencing inquiry!',
    lastMessageTimestamp: '10 mins ago',
    verifiedAdopter: true,
    notes: 'Prior Golden Retriever owner for 9 years. Spacious yard in South Delhi.',
    screeningTags: ['Yard Verified', 'Prior Dog Experience', 'Ready for Meet'],
  },
  {
    id: 'conv-2',
    adopterName: 'Anjali Singh',
    adopterEmail: 'anjali.s@example.com',
    adopterPhone: '+91 98223 45678',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    petName: 'Mimi',
    petSpecies: 'Cat',
    petBreed: 'Persian',
    petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
    applicationId: 'app-2',
    applicationStep: 4,
    applicationStatus: 'Approved',
    hasAppointment: true,
    appointmentDetails: {
      date: '2025-06-25',
      timeSlot: '02:00 PM - 03:00 PM',
      type: 'Adoption Handover & Signing',
      status: 'Confirmed',
    },
    unreadCount: 2,
    lastMessage: 'We bought the scratching tree and food bowls! So excited for Saturday pickup.',
    lastMessageTimestamp: '2 hours ago',
    verifiedAdopter: true,
    notes: 'Apartment Persian cat lover. Origin: Persia (Iran), 12–17 yrs lifespan. Grooming routine verified.',
    screeningTags: ['Persian Standard', 'First-Time Cat Mom', 'Screened Balcony'],
  },
  {
    id: 'conv-3',
    adopterName: 'Saurabh Yadav',
    adopterEmail: 'saurabh.y@example.com',
    adopterPhone: '+91 98334 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    petName: 'Charlie',
    petSpecies: 'Dog',
    petBreed: 'Hound Mix',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
    applicationId: 'app-3',
    applicationStep: 1,
    applicationStatus: 'Pending',
    unreadCount: 0,
    lastMessage: 'Could we do a quick 10-minute phone call to understand Charlie’s activity requirements?',
    lastMessageTimestamp: 'Yesterday',
    verifiedAdopter: false,
    notes: 'Lives in Gurugram condo, looking for active jogging buddy.',
    screeningTags: ['Phone Call Requested', 'High Activity'],
  },
  {
    id: 'conv-4',
    adopterName: 'Pooja Sharma',
    adopterEmail: 'pooja.s@example.com',
    adopterPhone: '+91 98445 67890',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    petName: 'Luna',
    petSpecies: 'Cat',
    petBreed: 'Calico Cat',
    petImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=300&q=80',
    applicationId: 'app-4',
    applicationStep: 3,
    applicationStatus: 'Approved',
    unreadCount: 0,
    lastMessage: 'Certificate received and safely saved to my digilocker! Thank you so much for the smooth process.',
    lastMessageTimestamp: '3 days ago',
    verifiedAdopter: true,
    notes: 'Adoption completed with legal certificate issued.',
    screeningTags: ['Finalized', 'Certified Adopter'],
  },
];

const INITIAL_MESSAGE_THREADS: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1-1',
      conversationId: 'conv-1',
      sender: 'system',
      senderName: 'Petify System',
      text: 'Adoption Application #APP-ROCKY-882 submitted by Rohit Verma.',
      timestamp: 'Yesterday 10:15 AM',
    },
    {
      id: 'm-1-2',
      conversationId: 'conv-1',
      sender: 'adopter',
      senderName: 'Rohit Verma',
      text: 'Hello Happy Paws team! We fell in love with Rocky’s profile. Our home has a 6-foot fenced backyard and we have had two retrievers before.',
      timestamp: 'Yesterday 10:18 AM',
    },
    {
      id: 'm-1-3',
      conversationId: 'conv-1',
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text: 'Hi Rohit! Thank you for applying for Rocky. He has wonderful energy and loves retrieving tennis balls. Could you share a quick photo or video of your perimeter fencing?',
      timestamp: 'Yesterday 11:30 AM',
    },
    {
      id: 'm-1-4',
      conversationId: 'conv-1',
      sender: 'adopter',
      senderName: 'Rohit Verma',
      text: 'I uploaded my backyard video. Let me know if that satisfies the fencing inquiry!',
      timestamp: 'Today 10:20 AM',
      attachment: {
        type: 'document',
        title: 'Backyard_Fencing_Specs.pdf',
        size: '2.4 MB',
      },
    },
  ],
  'conv-2': [
    {
      id: 'm-2-1',
      conversationId: 'conv-2',
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text: 'Congratulations Anjali! Your application for Mimi has been fully approved by our adoption committee.',
      timestamp: 'June 20, 2:10 PM',
    },
    {
      id: 'm-2-2',
      conversationId: 'conv-2',
      sender: 'adopter',
      senderName: 'Anjali Singh',
      text: 'This is the best news ever! When can we schedule the handover and finalize the adoption paperwork?',
      timestamp: 'June 20, 2:45 PM',
    },
    {
      id: 'm-2-3',
      conversationId: 'conv-2',
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text: 'We have reserved Saturday, June 25th at 2:00 PM for the official handover and microchip transfer.',
      timestamp: 'June 20, 3:00 PM',
      attachment: {
        type: 'schedule',
        title: 'Meet & Handover: Sat June 25, 2:00 PM',
      },
    },
    {
      id: 'm-2-4',
      conversationId: 'conv-2',
      sender: 'adopter',
      senderName: 'Anjali Singh',
      text: 'We bought the scratching tree and food bowls! So excited for Saturday pickup.',
      timestamp: 'Today 8:30 AM',
    },
  ],
  'conv-3': [
    {
      id: 'm-3-1',
      conversationId: 'conv-3',
      sender: 'adopter',
      senderName: 'Saurabh Yadav',
      text: 'Hi there! I submitted an inquiry for Charlie the hound mix. Is he comfortable around apartment staircases?',
      timestamp: 'June 18, 4:20 PM',
    },
    {
      id: 'm-3-2',
      conversationId: 'conv-3',
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text: 'Hello Saurabh! Charlie is great on leash and has no hip issues, but he does need at least 45 minutes of vigorous exercise daily.',
      timestamp: 'June 18, 5:10 PM',
    },
    {
      id: 'm-3-3',
      conversationId: 'conv-3',
      sender: 'adopter',
      senderName: 'Saurabh Yadav',
      text: 'Could we do a quick 10-minute phone call to understand Charlie’s activity requirements?',
      timestamp: 'Yesterday 06:14 PM',
    },
  ],
  'conv-4': [
    {
      id: 'm-4-1',
      conversationId: 'conv-4',
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text: 'Hi Pooja, here is the official certified adoption certificate for Luna! Microchip #985141002345891 is now registered in your name.',
      timestamp: '3 days ago',
      attachment: {
        type: 'certificate',
        title: 'Official Adoption Certificate #CERT-8902',
      },
    },
    {
      id: 'm-4-2',
      conversationId: 'conv-4',
      sender: 'adopter',
      senderName: 'Pooja Sharma',
      text: 'Certificate received and safely saved to my digilocker! Thank you so much for the smooth process.',
      timestamp: '3 days ago',
    },
  ],
};

const QUICK_REPLIES = [
  'Hi! We reviewed your application and would love to arrange a Meet & Greet.',
  'Could you please share your residential landlord approval letter or HOA guidelines?',
  'Your appointment has been confirmed! Please arrive 10 minutes early at our main reception.',
  'Vaccination and microchip records have been updated and are ready for download.',
  'Thank you for submitting your home photos. Our coordinator has approved step 2!',
];

interface AdopterCommunicationHubProps {
  onScheduleAppointment?: (adopterName: string, petName: string) => void;
  onAdvanceStage?: (appId: string) => void;
  onShowToast?: (msg: string) => void;
  targetAdopter?: string | null;
}

export const AdopterCommunicationHub: React.FC<AdopterCommunicationHubProps> = ({
  onScheduleAppointment,
  onAdvanceStage,
  onShowToast,
  targetAdopter,
}) => {
  const [conversations, setConversations] = useState<AdopterConversation[]>(INITIAL_CONVERSATIONS);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGE_THREADS);
  
  // Selected conversation
  const [selectedConvId, setSelectedConvId] = useState<string>(() => {
    if (targetAdopter) {
      const match = INITIAL_CONVERSATIONS.find(c => c.adopterName.toLowerCase().includes(targetAdopter.toLowerCase()));
      if (match) return match.id;
    }
    return INITIAL_CONVERSATIONS[0].id;
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'All' | 'Unread' | 'Appointment' | 'Approved'>('All');

  // Input state
  const [inputText, setInputText] = useState('');
  const [isCallingModal, setIsCallingModal] = useState<null | { type: 'phone' | 'video'; name: string; number: string }>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2025-06-28');
  const [scheduleTime, setScheduleTime] = useState('11:00 AM - 12:00 PM');
  const [scheduleType, setScheduleType] = useState('In-Person Meet & Greet');

  // Find active conversation
  const activeConversation = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const activeMessages = activeConversation ? (threads[activeConversation.id] || []) : [];

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.adopterName.toLowerCase().includes(q);
      const matchPet = c.petName.toLowerCase().includes(q);
      const matchBreed = c.petBreed.toLowerCase().includes(q);
      const matchEmail = c.adopterEmail.toLowerCase().includes(q);
      if (!matchName && !matchPet && !matchBreed && !matchEmail) return false;
    }
    if (filterTag === 'Unread' && c.unreadCount === 0) return false;
    if (filterTag === 'Appointment' && !c.hasAppointment) return false;
    if (filterTag === 'Approved' && c.applicationStatus !== 'Approved') return false;
    return true;
  });

  const handleSelectConversation = (convId: string) => {
    setSelectedConvId(convId);
    // Mark unread as 0
    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConversation) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text,
      timestamp: 'Just now',
    };

    setThreads(prev => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMsg],
    }));

    setConversations(prev =>
      prev.map(c =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: text,
              lastMessageTimestamp: 'Just now',
            }
          : c
      )
    );

    setInputText('');
    setShowQuickReplies(false);

    if (onShowToast) {
      onShowToast(`Message sent to ${activeConversation.adopterName}`);
    }

    // Simulate warm realistic adopter reply after 2.5s
    setTimeout(() => {
      const replies: Record<string, string> = {
        'conv-1': 'Thank you for following up! We will prepare everything for Rocky and can bring our family along.',
        'conv-2': 'Awesome, we have saved this to our calendar! See you Saturday afternoon.',
        'conv-3': 'Thank you! That makes total sense, I run 5km every morning so that sounds like a great match.',
        'conv-4': 'Thanks again for all the dedication and care from Happy Paws!',
      };

      const replyText = replies[activeConversation.id] || 'Thank you! We received your message and will be in touch shortly.';

      const autoReply: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        conversationId: activeConversation.id,
        sender: 'adopter',
        senderName: activeConversation.adopterName,
        text: replyText,
        timestamp: 'Just now',
      };

      setThreads(currentThreads => ({
        ...currentThreads,
        [activeConversation.id]: [...(currentThreads[activeConversation.id] || []), autoReply],
      }));

      setConversations(currentConvs =>
        currentConvs.map(c =>
          c.id === activeConversation.id
            ? {
                ...c,
                lastMessage: replyText,
                lastMessageTimestamp: 'Just now',
              }
            : c
        )
      );
    }, 2000);
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation) return;

    const scheduleMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      sender: 'shelter',
      senderName: 'Happy Paws Coordinator',
      text: `Appointment invitation sent: ${scheduleType} on ${scheduleDate} at ${scheduleTime}. Looking forward to seeing you!`,
      timestamp: 'Just now',
      attachment: {
        type: 'schedule',
        title: `${scheduleType}: ${scheduleDate} (${scheduleTime})`,
      },
    };

    setThreads(prev => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), scheduleMsg],
    }));

    setConversations(prev =>
      prev.map(c =>
        c.id === activeConversation.id
          ? {
              ...c,
              hasAppointment: true,
              appointmentDetails: {
                date: scheduleDate,
                timeSlot: scheduleTime,
                type: scheduleType,
                status: 'Confirmed',
              },
              lastMessage: `Appointment invitation sent: ${scheduleType}`,
              lastMessageTimestamp: 'Just now',
            }
          : c
      )
    );

    setIsScheduleModalOpen(false);
    if (onShowToast) {
      onShowToast(`Scheduled ${scheduleType} with ${activeConversation.adopterName}`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Banner Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-[#043d2c] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Adopter Communication Center
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Live Chat &amp; Screening
                </span>
              </h2>
              <p className="text-xs text-emerald-200/80">
                Direct messaging, application screening, meet &amp; greet scheduling, and legal document sharing with prospective pet parents.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-800/60 px-3 py-1.5 rounded-xl border border-emerald-700/50 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-100">4 Active Inquiries</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Conversations List, Middle Chat Thread, Right Adopter & Pet Dossier */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT COLUMN: CONVERSATION LIST ================= */}
        <div className="w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
          {/* Search & Filter Bar */}
          <div className="p-3.5 border-b border-slate-200 space-y-2.5 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search adopter, pet, or email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
              {(['All', 'Unread', 'Appointment', 'Approved'] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    filterTag === tag
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Cards */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No conversation found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-emerald-50/70 border-r-4 border-r-emerald-600'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    {/* Adopter Avatar with Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.avatarUrl}
                        alt={conv.adopterName}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                          {conv.adopterName}
                          {conv.verifiedAdopter && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {conv.lastMessageTimestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-0.5">
                        <PawPrint className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">Inquiry for {conv.petName} ({conv.petBreed})</span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-1 leading-snug">
                        {conv.lastMessage}
                      </p>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {conv.applicationStatus && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              conv.applicationStatus === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            App: {conv.applicationStatus}
                          </span>
                        )}
                        {conv.hasAppointment && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            Visit Booked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= MIDDLE COLUMN: INTERACTIVE CHAT THREAD ================= */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
          {/* Active Conversation Header */}
          {activeConversation && (
            <div className="px-5 py-3.5 border-b border-slate-200/90 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.avatarUrl}
                  alt={activeConversation.adopterName}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeConversation.adopterName}
                    </h3>
                    {activeConversation.verifiedAdopter && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        ID Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Applying for <strong className="text-slate-800">{activeConversation.petName}</strong> • {activeConversation.adopterPhone}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setIsCallingModal({
                      type: 'phone',
                      name: activeConversation.adopterName,
                      number: activeConversation.adopterPhone,
                    })
                  }
                  className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-200"
                  title="Phone Screening Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setIsCallingModal({
                      type: 'video',
                      name: activeConversation.adopterName,
                      number: activeConversation.adopterEmail,
                    })
                  }
                  className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-200"
                  title="Virtual Home Screening Video"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Meet</span>
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Flow */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {/* Timeline separator */}
            <div className="text-center my-2">
              <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                Encrypted Shelter-Adopter Communication Channel
              </span>
            </div>

            {activeMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-1.5 text-center text-xs text-amber-900 max-w-md">
                      <span className="font-semibold">{msg.text}</span>
                      <span className="block text-[10px] text-amber-600 mt-0.5">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              const isShelter = msg.sender === 'shelter';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isShelter ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                      isShelter
                        ? 'bg-emerald-700 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/90'
                    }`}
                  >
                    <p className="font-semibold text-[10px] mb-1 opacity-80">
                      {msg.senderName}
                    </p>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Attachment Preview Card */}
                    {msg.attachment && (
                      <div
                        className={`mt-2.5 p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                          isShelter
                            ? 'bg-emerald-800/80 border-emerald-600 text-emerald-100'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {msg.attachment.type === 'schedule' ? (
                            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : msg.attachment.type === 'certificate' ? (
                            <Award className="w-4 h-4 text-emerald-300 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="font-bold text-[11px] truncate">{msg.attachment.title}</p>
                            {msg.attachment.size && (
                              <p className="text-[9px] opacity-75">{msg.attachment.size}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (onShowToast) {
                              onShowToast(`Opened attachment: ${msg.attachment?.title}`);
                            }
                          }}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 ${
                            isShelter ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 px-1">
                    {msg.timestamp}
                    {isShelter && <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Reply Drawer */}
          {showQuickReplies && (
            <div className="p-3 bg-emerald-50/70 border-t border-emerald-100 space-y-1.5 animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Coordinator Quick Response Templates
                </span>
                <button
                  onClick={() => setShowQuickReplies(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(reply)}
                    className="text-left text-xs p-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200/60 text-slate-800 transition-colors shadow-2xs"
                  >
                    "{reply}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Form */}
          <div className="p-3.5 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showQuickReplies ? 'Hide Templates' : 'Insert Quick Screening Reply'}</span>
              </button>
              <span className="text-[10px] text-slate-400">Press Enter to send</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  if (onShowToast) onShowToast('Attachment picker: Health certificate or vet report attached');
                  handleSendMessage('Attached: Official Health & Rabies Vaccination Clearance Record (PDF)');
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type message to ${activeConversation?.adopterName || 'adopter'}...`}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100/80 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ADOPTER & APPLICATION DOSSIER ================= */}
        {activeConversation && (
          <div className="w-80 lg:w-88 bg-slate-50/70 p-5 overflow-y-auto space-y-5 shrink-0 hidden md:block">
            {/* Adopter Profile Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-3">
              <div className="relative inline-block mx-auto">
                <img
                  src={activeConversation.avatarUrl}
                  alt={activeConversation.adopterName}
                  className="w-16 h-16 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-xs"
                />
                {activeConversation.verifiedAdopter && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{activeConversation.adopterName}</h3>
                <p className="text-xs text-slate-500">{activeConversation.adopterEmail}</p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{activeConversation.adopterPhone}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Identity</p>
                  <p className="font-bold text-emerald-700">Verified</p>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <p className="text-[10px] text-slate-400">Prior Pets</p>
                  <p className="font-bold text-slate-800">Yes (Golden)</p>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <p className="text-[10px] text-slate-400">Housing</p>
                  <p className="font-bold text-slate-800">Yard Spec</p>
                </div>
              </div>
            </div>

            {/* Targeted Pet Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Pet Profile
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Listing
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={activeConversation.petImage}
                  alt={activeConversation.petName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activeConversation.petName}</h4>
                  <p className="text-xs text-slate-500">
                    {activeConversation.petSpecies} • {activeConversation.petBreed}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Microchipped &amp; Vaccinated
                  </p>
                </div>
              </div>
            </div>

            {/* Application Stage Progress */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Adoption Screening Status
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  Step {activeConversation.applicationStep || 2} of 4
                </span>
              </div>

              {/* 4 Steps timeline */}
              <div className="space-y-2">
                {[
                  { step: 1, label: 'Application Form' },
                  { step: 2, label: 'Phone & Home Screening' },
                  { step: 3, label: 'Meet & Greet Visit' },
                  { step: 4, label: 'Adoption Finalized' },
                ].map((st) => {
                  const current = activeConversation.applicationStep || 2;
                  const isDone = current >= st.step;
                  const isCurrent = current === st.step;

                  return (
                    <div
                      key={st.step}
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-xs border ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                          : isDone
                          ? 'bg-slate-50 border-slate-200 text-emerald-700'
                          : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : st.step}
                      </div>
                      <span className="flex-1">{st.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Advance Stage button */}
              <button
                onClick={() => {
                  const nextStep = Math.min(4, (activeConversation.applicationStep || 2) + 1);
                  setConversations(prev =>
                    prev.map(c => (c.id === activeConversation.id ? { ...c, applicationStep: nextStep } : c))
                  );
                  if (onShowToast) {
                    onShowToast(`Advanced ${activeConversation.adopterName}'s application to step ${nextStep}`);
                  }
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
              >
                Advance to Next Milestone →
              </button>
            </div>

            {/* Scheduled Visit Details if any */}
            {activeConversation.hasAppointment && activeConversation.appointmentDetails && (
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-purple-900">
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <span>Scheduled Appointment</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-100 space-y-1">
                  <p className="font-bold text-slate-800">{activeConversation.appointmentDetails.type}</p>
                  <p className="text-slate-600">
                    Date: <strong className="text-slate-800">{activeConversation.appointmentDetails.date}</strong>
                  </p>
                  <p className="text-slate-600">
                    Time: <strong className="text-slate-800">{activeConversation.appointmentDetails.timeSlot}</strong>
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {activeConversation.appointmentDetails.status}
                  </span>
                </div>
              </div>
            )}

            {/* Screening Tags & Notes */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Coordinator Notes
              </span>
              <p className="text-slate-600 italic text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{activeConversation.notes}"
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {activeConversation.screeningTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: CALLING SIMULATOR (PHONE / VIDEO) ================= */}
      {isCallingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-pulse">
              {isCallingModal.type === 'phone' ? (
                <Phone className="w-8 h-8" />
              ) : (
                <Video className="w-8 h-8" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isCallingModal.type === 'phone' ? 'Phone Screening Call' : 'Virtual Home Video Screening'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Connecting to {isCallingModal.name}...</p>
              <p className="text-xs font-mono font-semibold text-slate-700 mt-0.5">
                {isCallingModal.number}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-left text-xs text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Screening Checklist:
              </p>
              <p>• Verify pet ownership history &amp; veterinarian references.</p>
              <p>• Review daily exercise commitments &amp; family schedule.</p>
              <p>• Check enclosure fences, balcony netting, and safety.</p>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsCallingModal(null)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SCHEDULE MEET & GREET ================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Schedule Adopter Meet &amp; Greet
                </h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Adopter &amp; Pet</label>
                <input
                  type="text"
                  disabled
                  value={`${activeConversation?.adopterName} • ${activeConversation?.petName}`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointment Type</label>
                <select
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="In-Person Meet & Greet">In-Person Meet & Greet (Play Yard)</option>
                  <option value="Virtual Home Screening Call">Virtual Home Screening Call (Video)</option>
                  <option value="Adoption Finalization & Handover">Adoption Finalization & Handover</option>
                  <option value="Post-Adoption Wellness Check">Post-Adoption Wellness Check</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                Upon scheduling, an automated invitation link, parking directions, and calendar invitation will be posted to the chat channel.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
