import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { API } from "../api/api";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const formInput =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all";

const Chat = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // Contact user object
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Interview scheduling modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const socketRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    initChat();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
    }
  }, [activeChat]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initChat = async () => {
    try {
      // Fetch current profile
      const profileRes = await API.get("/auth/profile");
      setCurrentUser(profileRes.data);

      // Connect socket
      const socketUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace("/api", "")
        : "http://localhost:5000";
      
      const socket = io(socketUrl, {
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.emit("join", profileRes.data._id);

      // Listen to inbound messages
      socket.on("receiveMessage", (data) => {
        // If data is from the active conversation, append it
        setMessages((prev) => [...prev, data]);
        // Refresh conversations list to update last message preview
        fetchConversations();
      });

      // Fetch active chats
      fetchConversations();
    } catch {
      toast.error("Failed to initialize messenger service");
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await API.get("/chat/conversations");
      let convos = res.data;

      const startUser = location.state?.startWithUser;
      if (startUser) {
        const exists = convos.some((c) => c.user._id === startUser._id);
        if (!exists) {
          const placeholder = {
            user: startUser,
            lastMessage: "Start a new conversation...",
            updatedAt: new Date().toISOString(),
            isRead: true,
          };
          convos = [placeholder, ...convos];
        }
        setActiveChat(startUser);
      }

      setConversations(convos);
    } catch {}
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await API.get(`/chat/${userId}`);
      setMessages(res.data);
    } catch {
      toast.error("Failed to load message history");
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    try {
      const res = await API.post("/chat", {
        receiverId: activeChat._id,
        content: inputMessage.trim(),
      });

      const newMsg = res.data;
      setMessages((prev) => [...prev, newMsg]);
      setInputMessage("");

      // Emit through sockets
      socketRef.current.emit("sendMessage", {
        ...newMsg,
        receiverId: activeChat._id,
      });

      fetchConversations();
    } catch {
      toast.error("Message send failed");
    }
  };

  const handleScheduleInterview = async () => {
    if (!meetingLink || !scheduledAt || !activeChat) {
      toast.error("Please fill in meeting link and scheduled time");
      return;
    }

    try {
      const interviewDetails = {
        scheduledAt,
        meetingLink,
        notes,
      };

      const res = await API.post("/chat", {
        receiverId: activeChat._id,
        content: `Scheduled an interview. Date: ${new Date(scheduledAt).toLocaleString()}`,
        interviewDetails,
      });

      const newMsg = res.data;
      setMessages((prev) => [...prev, newMsg]);

      // Emit socket event
      socketRef.current.emit("sendMessage", {
        ...newMsg,
        receiverId: activeChat._id,
      });

      setShowScheduleModal(false);
      setMeetingLink("");
      setScheduledAt("");
      setNotes("");
      toast.success("Interview scheduled and invite sent! 🗓️");

      fetchConversations();
    } catch {
      toast.error("Failed to send interview invitation");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white flex flex-col pt-1">
      <Toaster position="top-right" />

      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 py-6 flex-1 flex gap-6 min-h-[85vh] h-[85vh]">
        
        {/* Left Side: Conversations List */}
        <div className="w-[300px] sm:w-[350px] bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm flex-shrink-0">
          <div className="p-4 border-b dark:border-slate-800">
            <h2 className="text-base font-bold">Inbox Messages</h2>
            <p className="text-xs text-gray-400 mt-0.5">Real-time chats & interview invites</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y dark:divide-slate-800/60">
            {conversations.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-10">No active conversations</p>
            ) : (
              conversations.map((convo) => {
                const isActive = activeChat?._id === convo.user._id;
                const initials = convo.user.name?.charAt(0).toUpperCase() || "?";
                return (
                  <div
                    key={convo.user._id}
                    onClick={() => setActiveChat(convo.user)}
                    className={`p-4 flex gap-3 cursor-pointer transition-colors ${
                      isActive ? "bg-indigo-50/50 dark:bg-indigo-950/20" : "hover:bg-gray-50 dark:hover:bg-slate-800/35"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{convo.user.name}</h4>
                        <span className="text-[9px] text-gray-400">{new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[10px] text-indigo-500 mt-0.5 capitalize">{convo.user.companyName || convo.user.role}</p>
                      <p className="text-xs text-gray-400 truncate mt-1.5">{convo.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Message Window */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                    {activeChat.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{activeChat.name}</h3>
                    <p className="text-[10px] text-gray-400 capitalize">{activeChat.role} • {activeChat.email}</p>
                  </div>
                </div>

                {/* Scheduling buttons for Employers */}
                {currentUser?.role === "employer" && (
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
                  >
                    🗓️ Schedule Interview
                  </button>
                )}
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender === currentUser?._id;
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl p-4 shadow-xs text-xs leading-relaxed ${
                        isOwn
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/40 dark:border-slate-800"
                      }`}>
                        
                        {/* Normal content */}
                        <p>{msg.content}</p>

                        {/* Special Interview Invite Card */}
                        {msg.interviewDetails && (
                          <div className={`mt-3 p-3 rounded-xl border flex flex-col gap-2 ${
                            isOwn
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white"
                          }`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                              🗓️ INTERVIEW INVITE
                            </span>
                            <p className="text-[11px] font-semibold">
                              Date: {new Date(msg.interviewDetails.scheduledAt).toLocaleString()}
                            </p>
                            {msg.interviewDetails.notes && (
                              <p className="text-[10px] text-gray-400">Notes: {msg.interviewDetails.notes}</p>
                            )}
                            <a
                              href={msg.interviewDetails.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-flex items-center justify-center py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] text-center"
                            >
                              Join Google Meet / Link
                            </a>
                          </div>
                        )}

                        <span className="block text-[9px] mt-1.5 opacity-60 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              {/* Message Footer Inputs */}
              <form onSubmit={sendMessage} className="p-4 border-t dark:border-slate-800 flex gap-2">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-xs text-gray-850 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
              <span className="text-4xl mb-3">💬</span>
              <h3 className="font-bold text-gray-800 dark:text-white">Select a Chat</h3>
              <p className="text-xs max-w-[240px] mt-1 leading-relaxed">
                Click on one of the conversations on the left panel to start messaging candidates or recruiters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── INTERVIEW SCHEDULER MODAL ── */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full border dark:border-slate-800 shadow-2xl">
            <h2 className="text-base font-bold mb-1">Schedule Interview</h2>
            <p className="text-xs text-gray-400 mb-4">Send a dynamic Meet invite link to this candidate</p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Meeting Link *</label>
                <input
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="e.g. https://meet.google.com/xyz-abc-123"
                  className={formInput}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Scheduled Date & Time *</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className={formInput}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Short Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Bring your portfolio design and resume..."
                  rows={2}
                  className={`${formInput} resize-none`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleScheduleInterview}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Send Invitation
              </button>
              <button
                onClick={() => { setShowScheduleModal(false); }}
                className="border border-gray-200 dark:border-slate-800 text-gray-500 hover:bg-gray-50 py-2.5 px-4 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
