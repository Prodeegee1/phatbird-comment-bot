"use client";

import { useState, useRef } from "react";

const MOCK_COMMENTS = [
  { id: "fb_001", platform: "facebook", author: "Chisom Eze", avatar: "CE", text: "Love this post! Where can I get more info?", postTitle: "New collection drop 🔥", time: "2m ago", type: "simple" },
  { id: "ig_001", platform: "instagram", author: "tunde_vibes", avatar: "TV", text: "This is amazing 😍😍", postTitle: "Summer lookbook", time: "5m ago", type: "simple" },
  { id: "fb_002", platform: "facebook", author: "Ada Nwosu", avatar: "AN", text: "I ordered last week and still haven't received my package. It's been 8 days now and I'm very disappointed.", postTitle: "Customer appreciation post", time: "8m ago", type: "complex" },
];

const MOCK_OUTREACH = [
  { id: "out_001", platform: "instagram", creator: "@vogue_africa", avatar: "VA", postText: "We are seeing a massive shift towards structured, architectural dresses this season. What are your thoughts?", time: "1h ago", apiAccessible: false, status: "drafted", draft: "Absolutely agree. We're leaning heavily into structured Mikado designs for our new Afro LUXE pieces. It gives such a regal finish." },
  { id: "out_002", platform: "facebook", creator: "Lagos Fashion Week (Official)", avatar: "LF", postText: "Who is ready for the runway? Drop your favourite accessories below.", time: "3h ago", apiAccessible: true, status: "drafted", draft: "Counting down the days! Nothing finishes a runway look quite like a bold headband and matching jewellery set." },
  { id: "out_003", platform: "instagram", creator: "@style_inspo_uk", avatar: "SI", postText: "Holiday prep starts now. Packing light but keeping it chic.", time: "4h ago", apiAccessible: false, status: "drafted", draft: "The perfect strategy. Our Holiday Shop is full of easy-chic sets that save so much space in the suitcase." },
];

const PlatformIcon = ({ platform, size = 16 }: { platform: string, size?: number }) => {
  if (platform === "facebook") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#igGrad)">
      <defs>
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
};

export default function MetaCommentBot() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [comments] = useState(MOCK_COMMENTS);
  const [outreach, setOutreach] = useState(MOCK_OUTREACH);
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);
  
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const copyOutreach = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setOutreach(prev => prev.map(o => o.id === id ? { ...o, status: "copied" } : o));
    showToast("Copied to clipboard! Ready to paste.");
  };

  const approveOutreachPost = (id: string) => {
    setOutreach(prev => prev.map(o => o.id === id ? { ...o, status: "posted" } : o));
    showToast("Comment published via API ✓");
  };

  const s = {
    app: { fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#0f0f13", color: "#e8e8f0" },
    header: { background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 28px" },
    topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
    logo: { display: "flex", alignItems: "center", gap: 12 },
    logoIcon: { width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
    logoText: { fontSize: 20, fontWeight: 800, color: "#fff" },
    navTabs: { display: "flex", gap: 10, background: "rgba(0,0,0,0.2)", padding: 6, borderRadius: 12, width: "fit-content" },
    tabBtn: (active: boolean) => ({ padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", background: active ? "#667eea" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", transition: "all 0.2s" }),
    feed: { padding: "28px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 900, margin: "0 auto" },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 22px" },
    cardTop: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 },
    avatar: (platform: string) => ({ width: 44, height: 44, borderRadius: "50%", background: platform === "facebook" ? "linear-gradient(135deg, #1877F2, #42b0ff)" : "linear-gradient(135deg, #f09433, #bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", flexShrink: 0 }),
    textBubble: { fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8, marginTop: 8 },
    replyBox: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, marginBottom: 12 },
    actions: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
    btn: (variant: string) => {
      const styles: Record<string, any> = {
        primary: { background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", border: "none" },
        success: { background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none" },
        outline: { background: "transparent", color: "#667eea", border: "1px solid #667eea" },
      };
      return { ...styles[variant], padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" };
    },
    apiBadge: (accessible: boolean) => ({ fontSize: 11, padding: "4px 8px", borderRadius: 6, background: accessible ? "rgba(34,197,94,0.1)" : "rgba(251,191,36,0.1)", color: accessible ? "#4ade80" : "#fbbf24", marginLeft: "auto", border: `1px solid ${accessible ? "rgba(34,197,94,0.2)" : "rgba(251,191,36,0.2)"}` }),
    toast: (type: string) => ({ position: "fixed" as const, bottom: 24, right: 24, padding: "14px 22px", borderRadius: 14, background: type === "error" ? "#dc2626" : "#22c55e", color: "#fff", fontSize: 14, fontWeight: 600, zIndex: 1000 })
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.topBar}>
          <div style={s.logo}>
            <div style={s.logoIcon}>🤖</div>
            <div style={s.logoText}>Phatbird Command Centre</div>
          </div>
        </div>
        <div style={s.navTabs}>
          <button style={s.tabBtn(activeTab === "inbox")} onClick={() => setActiveTab("inbox")}>📥 Inbox Triage</button>
          <button style={s.tabBtn(activeTab === "outreach")} onClick={() => setActiveTab("outreach")}>🎯 Creator Outreach</button>
        </div>
      </div>

      <div style={s.feed}>
        {activeTab === "inbox" ? (
          comments.map(comment => (
            <div key={comment.id} style={s.card}>
               <div style={s.cardTop}>
                  <div style={s.avatar(comment.platform)}>{comment.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{comment.author}</div>
                    <div style={s.textBubble}>"{comment.text}"</div>
                  </div>
               </div>
            </div>
          ))
        ) : (
          outreach.map(item => (
            <div key={item.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.avatar(item.platform)}>{item.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PlatformIcon platform={item.platform} size={14}/>
                    <span style={{ fontWeight: 700 }}>{item.creator}</span>
                    <span style={s.apiBadge(item.apiAccessible)}>
                      {item.apiAccessible ? "⚡ API Connected" : "📋 Manual Paste"}
                    </span>
                  </div>
                  <div style={s.textBubble}>"{item.postText}"</div>
                </div>
              </div>
              
              <div style={s.replyBox}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontWeight: 700 }}>🤖 STRATEGIC DRAFT</div>
                <div style={{ fontSize: 14, color: "#fff" }}>{item.draft}</div>
              </div>

              <div style={s.actions}>
                {item.apiAccessible ? (
                  <button 
                    style={s.btn(item.status === "posted" ? "outline" : "success")} 
                    onClick={() => approveOutreachPost(item.id)}
                    disabled={item.status === "posted"}
                  >
                    {item.status === "posted" ? "✅ Published" : "✓ Approve & Auto-Post"}
                  </button>
                ) : (
                  <button 
                    style={s.btn(item.status === "copied" ? "outline" : "primary")} 
                    onClick={() => copyOutreach(item.draft, item.id)}
                  >
                    {item.status === "copied" ? "✅ Copied" : "📋 Copy to Clipboard"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
}