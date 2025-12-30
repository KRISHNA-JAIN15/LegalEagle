import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Send,
  Paperclip,
  Pin,
  Trash2,
  MoreVertical,
  FileText,
  X,
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
  Home,
  LogOut,
  User,
  Edit2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import "./Chat.css";

// Helper function to load initial state from localStorage
const loadInitialState = () => {
  const savedChats = localStorage.getItem("legalEagleChats");
  if (savedChats) {
    try {
      return JSON.parse(savedChats);
    } catch {
      return [];
    }
  }
  return [];
};

const Chat = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState(loadInitialState);
  const [activeChat, setActiveChat] = useState(() => {
    const initialChats = loadInitialState();
    return initialChats.length > 0 ? initialChats[0].id : null;
  });
  const [messages, setMessages] = useState(() => {
    const initialChats = loadInitialState();
    return initialChats.length > 0 ? initialChats[0].messages || [] : [];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(() => {
    const initialChats = loadInitialState();
    return initialChats.length > 0 ? initialChats[0].document || null : null;
  });
  const [showChatMenu, setShowChatMenu] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [userName] = useState(() => localStorage.getItem("userName") || "User");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("legalEagleChats", JSON.stringify(chats));
    } else {
      localStorage.removeItem("legalEagleChats");
    }
  }, [chats]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatId = () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createNewChat = () => {
    const newChat = {
      id: generateChatId(),
      title: "New Chat",
      messages: [],
      document: null,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setMessages([]);
    setUploadedFile(null);
    setShowChatMenu(null);
  };

  const selectChat = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChat(chatId);
      setMessages(chat.messages || []);
      setUploadedFile(chat.document || null);
    }
    setShowChatMenu(null);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    const updatedChats = chats.filter((c) => c.id !== chatId);
    setChats(updatedChats);

    if (activeChat === chatId) {
      if (updatedChats.length > 0) {
        setActiveChat(updatedChats[0].id);
        setMessages(updatedChats[0].messages || []);
        setUploadedFile(updatedChats[0].document || null);
      } else {
        setActiveChat(null);
        setMessages([]);
        setUploadedFile(null);
      }
    }
    setShowChatMenu(null);
  };

  const togglePinChat = (chatId, e) => {
    e.stopPropagation();
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
    setShowChatMenu(null);
  };

  const startRenameChat = (chatId, currentTitle, e) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
    setShowChatMenu(null);
  };

  const saveRename = (chatId) => {
    if (editingTitle.trim()) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                title: editingTitle.trim(),
                updatedAt: new Date().toISOString(),
              }
            : chat
        )
      );
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const cancelRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleRenameKeyPress = (e, chatId) => {
    if (e.key === "Enter") {
      saveRename(chatId);
    } else if (e.key === "Escape") {
      cancelRename();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's a PDF or document
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, Word document, or text file.");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    setUploadedFile(fileData);

    // Update the chat with the document
    if (activeChat) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                document: fileData,
                updatedAt: new Date().toISOString(),
              }
            : chat
        )
      );
    }

    setIsUploading(false);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeDocument = () => {
    setUploadedFile(null);
    if (activeChat) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, document: null, updatedAt: new Date().toISOString() }
            : chat
        )
      );
    }
  };

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !activeChat) return;

    const userMessage = {
      id: generateMessageId(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    // Update chat title if it's the first message
    const currentChat = chats.find((c) => c.id === activeChat);
    const isFirstMessage = currentChat?.messages?.length === 0;
    const messageText = inputMessage.trim();

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        id: generateMessageId(),
        role: "assistant",
        content: generateMockResponse(),
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);

      // Update chat in state
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: finalMessages,
                title: isFirstMessage
                  ? messageText.slice(0, 30) +
                    (messageText.length > 30 ? "..." : "")
                  : chat.title,
                updatedAt: new Date().toISOString(),
              }
            : chat
        )
      );

      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = () => {
    const responses = [
      "Based on my analysis of legal documents, I can provide the following insights regarding your query. The key legal principles that apply here include...",
      "After reviewing the relevant legal framework, I've identified several important points to consider. First, the applicable statutes suggest...",
      "Your question touches on an important area of law. According to established legal precedents and current regulations...",
      "I've analyzed this from a legal perspective. Here's what you should know about this matter...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Filter and sort chats
  const filteredChats = chats
    .filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  return (
    <div className="chat-page">
      {/* Top Navigation Bar */}
      <nav className="chat-navbar">
        <div className="chat-navbar-left">
          <Link to="/" className="chat-navbar-brand">
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="chat-navbar-logo"
            >
              <path d="M20 4L4 36h32L20 4z" fill="#ff4d00" />
              <path d="M20 12L10 32h20L20 12z" fill="#fff" />
            </svg>
            <span>LegalEagle</span>
          </Link>
        </div>
        <div className="chat-navbar-right">
          <Link to="/" className="chat-navbar-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <div className="chat-navbar-user">
            <User size={18} />
            <span>{userName}</span>
          </div>
          <button className="chat-navbar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="chat-content">
        {/* Sidebar */}
        <aside className={`chat-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">Chats</h2>
            <button className="new-chat-btn" onClick={createNewChat}>
              <Plus size={20} />
              <span>New Chat</span>
            </button>
          </div>

          <div className="sidebar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="chat-list">
            {pinnedChats.length > 0 && (
              <div className="chat-group">
                <div className="chat-group-header">
                  <Pin size={14} />
                  <span>Pinned</span>
                </div>
                {pinnedChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onClick={() => selectChat(chat.id)}
                    onDelete={(e) => deleteChat(chat.id, e)}
                    onPin={(e) => togglePinChat(chat.id, e)}
                    onRename={(e) => startRenameChat(chat.id, chat.title, e)}
                    showMenu={showChatMenu === chat.id}
                    onMenuToggle={(e) => {
                      e.stopPropagation();
                      setShowChatMenu(
                        showChatMenu === chat.id ? null : chat.id
                      );
                    }}
                    formatDate={formatDate}
                    isEditing={editingChatId === chat.id}
                    editingTitle={editingTitle}
                    onEditingTitleChange={setEditingTitle}
                    onSaveRename={() => saveRename(chat.id)}
                    onCancelRename={cancelRename}
                    onRenameKeyPress={(e) => handleRenameKeyPress(e, chat.id)}
                  />
                ))}
              </div>
            )}

            {regularChats.length > 0 && (
              <div className="chat-group">
                {pinnedChats.length > 0 && (
                  <div className="chat-group-header">
                    <MessageSquare size={14} />
                    <span>Recent</span>
                  </div>
                )}
                {regularChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onClick={() => selectChat(chat.id)}
                    onDelete={(e) => deleteChat(chat.id, e)}
                    onPin={(e) => togglePinChat(chat.id, e)}
                    onRename={(e) => startRenameChat(chat.id, chat.title, e)}
                    showMenu={showChatMenu === chat.id}
                    onMenuToggle={(e) => {
                      e.stopPropagation();
                      setShowChatMenu(
                        showChatMenu === chat.id ? null : chat.id
                      );
                    }}
                    formatDate={formatDate}
                    isEditing={editingChatId === chat.id}
                    editingTitle={editingTitle}
                    onEditingTitleChange={setEditingTitle}
                    onSaveRename={() => saveRename(chat.id)}
                    onCancelRename={cancelRename}
                    onRenameKeyPress={(e) => handleRenameKeyPress(e, chat.id)}
                  />
                ))}
              </div>
            )}

            {filteredChats.length === 0 && (
              <div className="empty-chats">
                <MessageSquare size={48} strokeWidth={1} />
                <p>No chats yet</p>
                <span>Start a new conversation</span>
              </div>
            )}
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <header className="chat-header">
                <div className="chat-header-info">
                  <h3>
                    {chats.find((c) => c.id === activeChat)?.title || "Chat"}
                  </h3>
                  {uploadedFile && (
                    <div className="chat-header-document">
                      <FileText size={14} />
                      <span>{uploadedFile.name}</span>
                    </div>
                  )}
                </div>
                <div className="chat-header-actions">
                  {!uploadedFile && (
                    <button
                      className="header-action-btn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload Document"
                    >
                      <Paperclip size={20} />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: "none" }}
                  />
                </div>
              </header>

              {/* Document Banner */}
              {uploadedFile && (
                <div className="document-banner">
                  <div className="document-info">
                    <FileText size={20} />
                    <div className="document-details">
                      <span className="document-name">{uploadedFile.name}</span>
                      <span className="document-size">
                        {formatFileSize(uploadedFile.size)}
                      </span>
                    </div>
                  </div>
                  <button className="remove-document" onClick={removeDocument}>
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Messages Area */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-welcome">
                    <div className="welcome-icon">
                      <MessageSquare size={48} strokeWidth={1.5} />
                    </div>
                    <h3>Start a Conversation</h3>
                    <p>
                      Ask any legal question or upload a document for analysis.
                      LegalEagle AI will help you understand complex legal
                      matters.
                    </p>
                    {!uploadedFile && (
                      <button
                        className="upload-prompt-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip size={18} />
                        Upload a Document
                      </button>
                    )}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.role === "user" ? "user" : "assistant"
                      }`}
                    >
                      <div className="message-content">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="message assistant">
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chat-input-container">
                {isUploading && (
                  <div className="uploading-indicator">
                    <Loader2 size={16} className="spin" />
                    <span>Uploading document...</span>
                  </div>
                )}
                <div className="chat-input-wrapper">
                  <textarea
                    placeholder="Type your legal question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="chat-input"
                  />
                  <button
                    className={`send-btn ${
                      inputMessage.trim() ? "active" : ""
                    }`}
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="input-hint">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">
                <MessageSquare size={64} strokeWidth={1} />
              </div>
              <h3>Welcome to LegalEagle Chat</h3>
              <p>Select a chat or create a new one to get started</p>
              <button className="create-chat-btn" onClick={createNewChat}>
                <Plus size={20} />
                Create New Chat
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Chat Item Component
const ChatItem = ({
  chat,
  isActive,
  onClick,
  onDelete,
  onPin,
  onRename,
  showMenu,
  onMenuToggle,
  formatDate,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onSaveRename,
  onCancelRename,
  onRenameKeyPress,
}) => {
  return (
    <div
      className={`chat-item ${isActive ? "active" : ""} ${
        chat.isPinned ? "pinned" : ""
      }`}
      onClick={onClick}
    >
      <div className="chat-item-icon">
        {chat.document ? <FileText size={18} /> : <MessageSquare size={18} />}
      </div>
      <div className="chat-item-content">
        <div className="chat-item-title">
          {chat.isPinned && <Pin size={12} className="pin-indicator" />}
          {isEditing ? (
            <input
              type="text"
              className="chat-title-input"
              value={editingTitle}
              onChange={(e) => onEditingTitleChange(e.target.value)}
              onKeyDown={onRenameKeyPress}
              onBlur={onSaveRename}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span>{chat.title}</span>
          )}
        </div>
        <div className="chat-item-meta">
          <span>{formatDate(chat.updatedAt)}</span>
          {chat.document && <span>· {chat.document.name.slice(0, 15)}...</span>}
        </div>
      </div>
      <div className="chat-item-actions">
        <button className="chat-menu-btn" onClick={onMenuToggle}>
          <MoreVertical size={16} />
        </button>
        {showMenu && (
          <div className="chat-menu">
            <button onClick={onRename}>
              <Edit2 size={14} />
              <span>Rename</span>
            </button>
            <button onClick={onPin}>
              <Pin size={14} />
              <span>{chat.isPinned ? "Unpin" : "Pin"}</span>
            </button>
            <button onClick={onDelete} className="delete-btn">
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
