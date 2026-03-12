"use client";
import { useEffect, useState } from "react";
import type { Circle, CircleMember, CirclePost, CircleCollection } from "@/data/circles";

type Tab = "feed" | "members" | "collections" | "chat";

interface Props {
  circle:  Circle;
  onClose: () => void;
}

const MOCK_CHAT = [
  { senderId: "other1", text: "Did everyone see the update? 👀",         ts: "9:42 AM" },
  { senderId: "me",     text: "Just saw it — looks great!",               ts: "9:43 AM" },
  { senderId: "other2", text: "Same, I think this is the best yet.",      ts: "9:44 AM" },
  { senderId: "other1", text: "Agreed. When are we all getting together?", ts: "9:45 AM" },
  { senderId: "me",     text: "Next weekend works for me",                ts: "9:46 AM" },
];

function Avatar({ member, size = 48 }: { member: CircleMember; size?: number }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `${member.accent}22`,
        border: `1.5px solid ${member.accent}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: Math.round(size * 0.3), fontWeight: 800, color: member.accent,
      }}>
        {member.initials}
      </div>
      {member.online && (
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: 10, height: 10, borderRadius: "50%",
          background: "#22C55E", border: "2px solid var(--owf-bg)",
        }} />
      )}
    </div>
  );
}

export default function CircleDetail({ circle, onClose }: Props) {
  const [tab,     setTab]     = useState<Tab>("feed");
  const [closing, setClosing] = useState(false);
  const [tabKey,  setTabKey]  = useState(0);

  function close() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 300);
  }

  function switchTab(t: Tab) {
    setTab(t);
    setTabKey(k => k + 1);
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const memberMap = Object.fromEntries(circle.members.map(m => [m.id, m]));

  const TABS: { id: Tab; label: string }[] = [
    { id: "feed",        label: "Feed"        },
    { id: "members",     label: "Members"     },
    { id: "collections", label: "Collections" },
    { id: "chat",        label: "Chat"        },
  ];

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(4,7,11,0.85)", backdropFilter: "blur(20px)",
        display: "flex", justifyContent: "flex-end",
        opacity: closing ? 0 : 1, transition: closing ? "opacity 0.3s ease" : "none",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, height: "100vh",
          background: "var(--owf-bg)",
          borderLeft: "1px solid var(--owf-border)",
          display: "flex", flexDirection: "column",
          animation: closing ? "none" : "circleSlideIn 0.35s cubic-bezier(0.34,1,0.64,1)",
          transform: closing ? "translateX(100%)" : "translateX(0)",
          transition: closing ? "transform 0.3s ease" : "none",
          overflow: "hidden",
        }}
      >
        <style>{`
          @keyframes circleSlideIn {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
          @keyframes circleFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes circleMemberIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* ── HEADER ── */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          height: 60, flexShrink: 0,
          background: "var(--owf-bg)", backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
          borderBottom: `1px solid ${circle.color}50`,
          boxShadow: `0 1px 0 ${circle.color}30`,
        }}>
          <button onClick={close} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--owf-text-muted)", fontSize: 20, padding: "4px 8px 4px 0",
            display: "flex", alignItems: "center",
          }}>←</button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span style={{ fontSize: 20 }}>{circle.emoji}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--owf-text)" }}>{circle.name}</span>
          </div>
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "var(--owf-text-muted)",
          }}>Edit</button>
        </div>

        {/* ── HERO BAND ── */}
        <div style={{
          padding: "20px 20px 0",
          background: `radial-gradient(ellipse at 50% 0%, ${circle.color}18 0%, transparent 70%)`,
          borderBottom: "1px solid var(--owf-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 40 }}>{circle.emoji}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--owf-text)" }}>{circle.name}</div>
                <div style={{ fontSize: 13, color: "var(--owf-text-muted)", marginTop: 2 }}>{circle.description}</div>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 99,
                background: `${circle.color}18`, border: `1px solid ${circle.color}40`,
                fontSize: 12, fontWeight: 700, color: circle.color,
              }}>
                {circle.memberCount} members
              </div>
              <div style={{ fontSize: 11, color: "var(--owf-text-muted)", marginTop: 4 }}>{circle.lastActive}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => switchTab(t.id)} style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                padding: "10px 6px", fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? circle.color : "var(--owf-text-muted)",
                borderBottom: tab === t.id ? `2px solid ${circle.color}` : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div key={tabKey} style={{
          flex: 1, overflowY: "auto", padding: 20,
          display: "flex", flexDirection: "column", gap: 14,
          animation: "circleFadeIn 0.15s ease",
        }}>

          {/* FEED */}
          {tab === "feed" && circle.posts.map(post => {
            const member = memberMap[post.memberId];
            if (!member) return null;
            return (
              <div key={post.id} style={{
                background: "var(--owf-surface)", border: "1px solid var(--owf-border)",
                borderLeft: `3px solid ${post.moodColor}99`,
                borderRadius: 16, padding: "14px 16px",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar member={member} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--owf-text)" }}>{member.name}</div>
                    <div style={{ fontSize: 11, color: "var(--owf-text-muted)" }}>📍 {post.city} · {post.ts}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: post.moodColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: post.moodColor, fontWeight: 600 }}>{post.mood}</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--owf-text)" }}>{post.text}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--owf-text-muted)" }}>👍 {post.likes}</span>
                  <span style={{ fontSize: 12, color: "var(--owf-text-muted)" }}>💬 {post.comments}</span>
                </div>
              </div>
            );
          })}

          {/* MEMBERS */}
          {tab === "members" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {circle.members.map((member, i) => (
                <div key={member.id} className="owf-member-card" style={{
                  background: "var(--owf-surface)",
                  border: `1px solid ${member.accent}22`,
                  borderRadius: 20, padding: 16,
                  display: "flex", flexDirection: "column", gap: 10,
                  cursor: "pointer", transition: "all 0.2s",
                  animation: `circleMemberIn 0.35s ${i * 40}ms ease both`,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Avatar member={member} size={48} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--owf-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.name}</div>
                      <div style={{ fontSize: 12, color: "var(--owf-text-muted)", marginTop: 1 }}>@{member.handle}</div>
                      <div style={{ fontSize: 11, color: "var(--owf-text-muted)", marginTop: 2 }}>📍 {member.city}, {member.country}</div>
                    </div>
                  </div>
                  {member.bio && (
                    <p style={{
                      margin: 0, fontSize: 12, color: "var(--owf-text-muted)", fontStyle: "italic",
                      lineHeight: 1.5, overflow: "hidden",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>
                      {member.bio}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <div>
                      {(member.streak ?? 0) > 0 && (
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: "#F59E0B",
                          background: "rgba(245,158,11,0.12)", padding: "2px 7px", borderRadius: 99,
                        }}>🔥 {member.streak}d</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 99, cursor: "pointer",
                        background: "none", border: `1px solid ${member.accent}50`, color: member.accent,
                      }}>Profile →</button>
                      <button style={{
                        fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 99, cursor: "pointer",
                        background: member.accent, border: "none", color: "#fff",
                      }}>Message</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COLLECTIONS */}
          {tab === "collections" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {circle.collections.map(col => (
                <div key={col.id} className="owf-collection-card" style={{
                  borderRadius: 20, overflow: "hidden", cursor: "pointer",
                  aspectRatio: "5/6",
                  background: `linear-gradient(160deg, ${col.cover}44 0%, ${col.cover}22 60%, ${col.cover}11 100%)`,
                  border: `1px solid ${col.cover}40`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 10, padding: 16,
                  transition: "transform 0.2s",
                  boxShadow: `0 4px 20px ${col.cover}20`,
                }}>
                  <span style={{ fontSize: 36 }}>{col.emoji}</span>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--owf-text)" }}>{col.name}</div>
                    <div style={{ fontSize: 12, color: "var(--owf-text-muted)", marginTop: 3 }}>{col.count} saved</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHAT */}
          {tab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
              <div style={{
                flex: 1, display: "flex", flexDirection: "column", gap: 10,
                paddingBottom: 16,
              }}>
                {MOCK_CHAT.map((msg, i) => {
                  const isMe    = msg.senderId === "me";
                  const member  = isMe ? null : circle.members[i % circle.members.length];
                  const showName = !isMe && (i === 0 || MOCK_CHAT[i - 1].senderId !== msg.senderId);
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                      {showName && member && (
                        <div style={{ fontSize: 11, color: "var(--owf-text-muted)", marginBottom: 3, marginLeft: 12 }}>
                          {member.name}
                        </div>
                      )}
                      <div style={{
                        maxWidth: "75%", padding: "10px 14px", borderRadius: 18,
                        borderBottomRightRadius: isMe ? 4 : 18,
                        borderBottomLeftRadius: isMe ? 18 : 4,
                        background: isMe ? "#1A65FF" : "var(--owf-surface)",
                        border: isMe ? "none" : "1px solid var(--owf-border)",
                        fontSize: 14, lineHeight: 1.5,
                        color: isMe ? "#fff" : "var(--owf-text)",
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--owf-text-muted)", marginTop: 3, marginLeft: isMe ? 0 : 12, marginRight: isMe ? 4 : 0 }}>
                        {msg.ts}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{
                borderTop: "1px solid var(--owf-border)", paddingTop: 14,
                display: "flex", flexDirection: "column", gap: 8,
              }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--owf-text-muted)", textAlign: "center" }}>
                  This is a group preview. Full chat opens in Messages.
                </p>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 14,
                  background: "var(--owf-surface)", border: "1px solid var(--owf-border)",
                }}>
                  <span style={{ flex: 1, fontSize: 13, color: "var(--owf-text-muted)" }}>
                    Message {circle.name}…
                  </span>
                  <button style={{
                    fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 10, cursor: "pointer",
                    background: circle.color, border: "none", color: "#fff", whiteSpace: "nowrap",
                  }}>
                    Open in Messages →
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
