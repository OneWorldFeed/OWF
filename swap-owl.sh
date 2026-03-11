#!/usr/bin/env bash
# ============================================================
#  OWF — Swap geometric OwlSVG → SoftOwlSVG in DM components
#  Run from project root:  bash swap-owl.sh
# ============================================================
set -e
GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔ UPDATED${NC}  $1"; }
info() { echo -e "${CYAN}▸${NC} $1"; }

echo ""
info "Swapping geometric owl → soft illustrated owl..."
echo ""

# ─────────────────────────────────────────────────────────────
# 1. OwlBadge.tsx
# ─────────────────────────────────────────────────────────────
cat > src/components/dm/OwlBadge.tsx << 'EOF'
"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import SoftOwlSVG from "./SoftOwlSVG";

interface Props {
  convo: Conversation;
  onClick?: () => void;
}

// Map streak tier → SoftOwlSVG palette (small badge size)
function getBadgePalette(tier: string, atRisk: boolean, broken: boolean) {
  if (broken)  return { bg:"", card:"", body:"#2A3040", face:"#3A4050", eye:"#3D5268", halo:"rgba(61,82,104,0.15)", haloBright:"rgba(61,82,104,0.08)", ring:"#2A3040", accent:"#3D5268", text:"#3D5268" };
  if (atRisk)  return { bg:"", card:"", body:"#6B5020", face:"#A07828", eye:"#E8B84B", halo:"rgba(232,184,75,0.22)", haloBright:"rgba(232,184,75,0.15)", ring:"#6B5020", accent:"#E8B84B", text:"#E8B84B" };
  switch (tier) {
    case "high": return { bg:"", card:"", body:"#7C5C2A", face:"#C09040", eye:"#FFD97A", halo:"rgba(232,184,75,0.35)", haloBright:"rgba(232,184,75,0.2)",  ring:"#7C5C2A", accent:"#FFD060", text:"#FFD060" };
    case "mid":  return { bg:"", card:"", body:"#5C4420", face:"#8B6830", eye:"#E8B84B", halo:"rgba(232,184,75,0.25)", haloBright:"rgba(232,184,75,0.12)", ring:"#5C4420", accent:"#E8B84B", text:"#E8B84B" };
    case "low":  return { bg:"", card:"", body:"#3D3020", face:"#5C4830", eye:"#B89040", halo:"rgba(184,144,64,0.15)", haloBright:"rgba(184,144,64,0.08)", ring:"#3D3020", accent:"#B89040", text:"#B89040" };
    default:     return { bg:"", card:"", body:"#1E2535", face:"#2A3545", eye:"#3D5268", halo:"rgba(0,0,0,0)",         haloBright:"rgba(0,0,0,0)",          ring:"#1E2535", accent:"#3D5268", text:"#3D5268" };
  }
}

export default function OwlBadge({ convo, onClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const tier    = getStreakTier(convo.streak);
  const label   = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  if (!label) return null;
  const palette = getBadgePalette(tier, convo.atRisk, convo.broken);
  const labelColor = convo.broken ? "#3D5268" : convo.atRisk ? "#F59E0B" : "#E8B84B";

  return (
    <div
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      title={label.long}
      style={{ display:"flex", alignItems:"center", gap:4, cursor:"pointer", padding:"2px 4px", borderRadius:6, transition:"background 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <SoftOwlSVG size={24} palette={palette} animate={false} />
      <span style={{ fontSize:11, fontWeight:700, color:labelColor, whiteSpace:"nowrap" }}>
        {label.short}
      </span>
    </div>
  );
}
EOF
ok "src/components/dm/OwlBadge.tsx"

# ─────────────────────────────────────────────────────────────
# 2. ThreadStreakBar.tsx
# ─────────────────────────────────────────────────────────────
cat > src/components/dm/ThreadStreakBar.tsx << 'EOF'
"use client";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import SoftOwlSVG from "./SoftOwlSVG";

const C = { border:"#1A2535", muted:"#3D5268", gold:"#E8B84B", sub:"#7A95AE" };

function getBarPalette(tier: string, atRisk: boolean, broken: boolean) {
  if (broken)  return { bg:"", card:"", body:"#2A3040", face:"#3A4050", eye:"#3D5268", halo:"rgba(61,82,104,0.15)",  haloBright:"rgba(61,82,104,0.08)", ring:"#2A3040", accent:"#3D5268", text:"#3D5268" };
  if (atRisk)  return { bg:"", card:"", body:"#8B6520", face:"#C09040", eye:"#FFD060", halo:"rgba(232,184,75,0.3)",  haloBright:"rgba(232,184,75,0.18)", ring:"#8B6520", accent:"#FFD060", text:"#FFD060" };
  switch (tier) {
    case "high": return { bg:"", card:"", body:"#7C5C2A", face:"#C09040", eye:"#FFD97A", halo:"rgba(232,184,75,0.35)", haloBright:"rgba(232,184,75,0.2)",  ring:"#7C5C2A", accent:"#FFD060", text:"#FFD060" };
    case "mid":  return { bg:"", card:"", body:"#5C4420", face:"#8B6830", eye:"#E8B84B", halo:"rgba(232,184,75,0.25)", haloBright:"rgba(232,184,75,0.12)", ring:"#5C4420", accent:"#E8B84B", text:"#E8B84B" };
    case "low":  return { bg:"", card:"", body:"#3D3020", face:"#5C4830", eye:"#B89040", halo:"rgba(184,144,64,0.15)", haloBright:"rgba(184,144,64,0.08)", ring:"#3D3020", accent:"#B89040", text:"#B89040" };
    default:     return { bg:"", card:"", body:"#1E2535", face:"#2A3545", eye:"#3D5268", halo:"rgba(0,0,0,0)",          haloBright:"rgba(0,0,0,0)",          ring:"#1E2535", accent:"#3D5268", text:"#3D5268" };
  }
}

interface Props {
  convo: Conversation;
  onOwlClick: () => void;
}

export default function ThreadStreakBar({ convo, onOwlClick }: Props) {
  if (!convo.streak && !convo.broken) return null;
  const tier    = getStreakTier(convo.streak);
  const oc      = getOwlColors(tier, convo.atRisk, convo.broken);
  const label   = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  const palette = getBarPalette(tier, convo.atRisk, convo.broken);
  if (!label) return null;

  const labelColor = convo.broken ? C.muted : convo.atRisk ? "#F59E0B" : C.gold;

  return (
    <div
      onClick={onOwlClick}
      style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        padding:"10px 20px",
        background:`radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`,
        borderBottom:`1px solid ${C.border}`,
        cursor:"pointer", transition:"background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = `radial-gradient(ellipse at 50% 100%, ${oc.halo} 0%, transparent 80%)`)}
      onMouseLeave={e => (e.currentTarget.style.background = `radial-gradient(ellipse at 50% 100%, ${oc.haloStrong} 0%, transparent 80%)`)}
    >
      <SoftOwlSVG size={36} palette={palette} animate={convo.atRisk} />
      <div>
        <span style={{ fontSize:13, fontWeight:700, color:labelColor }}>{label.short}</span>
        {convo.atRisk  && <span style={{ fontSize:11, color:"#F59E0B", marginLeft:8 }}>· Ends today</span>}
        {convo.broken  && <span style={{ fontSize:11, color:C.muted,   marginLeft:8 }}>· Tap to see history</span>}
        {!convo.atRisk && !convo.broken && <span style={{ fontSize:11, color:C.muted, marginLeft:8 }}>· Tap to see details</span>}
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/ThreadStreakBar.tsx"

# ─────────────────────────────────────────────────────────────
# 3. AtRiskBanner.tsx
# ─────────────────────────────────────────────────────────────
cat > src/components/dm/AtRiskBanner.tsx << 'EOF'
"use client";
import type { Conversation } from "@/types/dm";
import SoftOwlSVG from "./SoftOwlSVG";

const AT_RISK_PALETTE = {
  bg:"", card:"", body:"#8B6520", face:"#C09040", eye:"#FFD060",
  halo:"rgba(232,184,75,0.3)", haloBright:"rgba(232,184,75,0.18)",
  ring:"#8B6520", accent:"#FFD060", text:"#FFD060",
};

interface Props {
  convo: Conversation;
  onDismiss: () => void;
}

export default function AtRiskBanner({ convo, onDismiss }: Props) {
  if (!convo.atRisk) return null;
  return (
    <div style={{
      margin:"0 16px 12px",
      background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)",
      borderRadius:10, padding:"9px 14px",
      display:"flex", alignItems:"center", gap:10,
      animation:"owfFadeIn 0.3s ease",
    }}>
      <SoftOwlSVG size={28} palette={AT_RISK_PALETTE} animate />
      <span style={{ fontSize:12.5, color:"#F59E0B", flex:1, lineHeight:1.5 }}>
        Your streak ends today if you both don't send a message.
      </span>
      <button onClick={onDismiss} style={{ background:"none", border:"none", color:"#3D5268", cursor:"pointer", fontSize:16, padding:2, fontFamily:"inherit" }}>×</button>
    </div>
  );
}
EOF
ok "src/components/dm/AtRiskBanner.tsx"

# ─────────────────────────────────────────────────────────────
# 4. StreakSheet.tsx
# ─────────────────────────────────────────────────────────────
cat > src/components/dm/StreakSheet.tsx << 'EOF'
"use client";
import { useEffect } from "react";
import { getStreakTier, getOwlColors, getStreakLabel } from "@/lib/streak";
import type { Conversation } from "@/types/dm";
import SoftOwlSVG from "./SoftOwlSVG";

const C = {
  surface:"#0D1219", border:"#1A2535", text:"#E2EAF2",
  sub:"#7A95AE", muted:"#3D5268", gold:"#E8B84B", aurora:"#00D4AA",
};

function getSheetPalette(tier: string, atRisk: boolean, broken: boolean) {
  if (broken)  return { bg:"", card:"", body:"#2A3040", face:"#3A4050", eye:"#3D5268", halo:"rgba(61,82,104,0.2)",   haloBright:"rgba(61,82,104,0.1)",  ring:"#2A3040", accent:"#3D5268", text:"#7A95AE" };
  if (atRisk)  return { bg:"", card:"", body:"#8B6520", face:"#C09040", eye:"#FFD060", halo:"rgba(232,184,75,0.35)", haloBright:"rgba(232,184,75,0.2)", ring:"#8B6520", accent:"#FFD060", text:"#FFD060" };
  switch (tier) {
    case "high": return { bg:"", card:"", body:"#7C5C2A", face:"#C09040", eye:"#FFD97A", halo:"rgba(232,184,75,0.4)",  haloBright:"rgba(232,184,75,0.22)", ring:"#7C5C2A", accent:"#FFD060", text:"#FFD060" };
    case "mid":  return { bg:"", card:"", body:"#5C4420", face:"#8B6830", eye:"#E8B84B", halo:"rgba(232,184,75,0.28)", haloBright:"rgba(232,184,75,0.14)", ring:"#5C4420", accent:"#E8B84B", text:"#E8B84B" };
    case "low":  return { bg:"", card:"", body:"#3D3020", face:"#5C4830", eye:"#B89040", halo:"rgba(184,144,64,0.2)",  haloBright:"rgba(184,144,64,0.1)",  ring:"#3D3020", accent:"#B89040", text:"#B89040" };
    default:     return { bg:"", card:"", body:"#1E2535", face:"#2A3545", eye:"#3D5268", halo:"rgba(0,0,0,0)",          haloBright:"rgba(0,0,0,0)",          ring:"#1E2535", accent:"#3D5268", text:"#3D5268" };
  }
}

interface Props { convo: Conversation; onClose: () => void; }

export default function StreakSheet({ convo, onClose }: Props) {
  const tier    = getStreakTier(convo.streak);
  const oc      = getOwlColors(tier, convo.atRisk, convo.broken);
  const label   = getStreakLabel(convo.streak, convo.atRisk, convo.broken, convo.lastStreak);
  const palette = getSheetPalette(tier, convo.atRisk, convo.broken);
  const days    = convo.streak || 0;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:3000,
      background:"rgba(4,7,11,0.88)", backdropFilter:"blur(16px)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      padding:20, animation:"owfFadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:420, marginBottom:20,
        background:C.surface, border:`1px solid ${C.border}`,
        borderRadius:24, overflow:"hidden",
        boxShadow:`0 0 60px ${oc.halo}, 0 24px 48px rgba(0,0,0,0.8)`,
        animation:"owfSlideUp 0.3s cubic-bezier(0.34,1.4,0.64,1)",
      }}>
        {/* Hero */}
        <div style={{
          padding:"36px 0 24px",
          background:`radial-gradient(ellipse at 50% 60%, ${oc.halo} 0%, transparent 70%)`,
          display:"flex", flexDirection:"column", alignItems:"center", gap:12,
          position:"relative",
        }}>
          <SoftOwlSVG size={110} palette={palette} animate />
          <div style={{ textAlign:"center" }}>
            {convo.broken ? (
              <>
                <div style={{ fontSize:22, fontWeight:900, color:C.muted }}>Streak ended</div>
                <div style={{ fontSize:14, color:C.muted, marginTop:4 }}>You reached a {convo.lastStreak}-day streak together.</div>
              </>
            ) : convo.atRisk ? (
              <>
                <div style={{ fontSize:22, fontWeight:900, color:"#F59E0B" }}>{days}-day streak</div>
                <div style={{ fontSize:14, color:C.sub, marginTop:4 }}>⚠ Your streak ends today if you both don't send a message.</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:32, fontWeight:900, color:C.gold }}>{days} days</div>
                <div style={{ fontSize:14, color:C.sub, marginTop:4, maxWidth:280, textAlign:"center", lineHeight:1.5 }}>{label?.long}</div>
              </>
            )}
          </div>
          <button onClick={onClose} style={{
            position:"absolute", top:14, right:16,
            background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`,
            borderRadius:"50%", width:30, height:30,
            cursor:"pointer", color:C.muted, fontSize:17, fontFamily:"inherit",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>×</button>
        </div>

        {/* Details */}
        <div style={{ padding:"0 24px 28px" }}>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18, display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, color:C.sub }}>Both send at least one message daily</span>
              <span style={{ fontSize:13, fontWeight:700, color:convo.broken ? C.muted : C.aurora }}>
                {convo.broken ? "—" : "✓ Active"}
              </span>
            </div>
            {convo.started && (
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, color:C.sub }}>Streak started</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{convo.started}</span>
              </div>
            )}
            {convo.longest && (
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, color:C.sub }}>Longest streak together</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.gold }}>{convo.longest} days</span>
              </div>
            )}
          </div>
          {convo.atRisk && (
            <div style={{ marginTop:18, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:10, padding:"11px 14px" }}>
              <p style={{ margin:0, fontSize:12.5, color:"#F59E0B", lineHeight:1.55 }}>
                To keep this streak, you both need to send at least one message today.
              </p>
            </div>
          )}
          <p style={{ margin:"18px 0 0", textAlign:"center", fontSize:11, color:C.muted, lineHeight:1.6 }}>
            This owl lights up when you keep the conversation going daily.<br/>
            Streaks are visible only to the two of you.
          </p>
        </div>
      </div>
    </div>
  );
}
EOF
ok "src/components/dm/StreakSheet.tsx"

# ─────────────────────────────────────────────────────────────
# DONE
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Soft owl swapped in all DM components${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Updated:"
echo "   src/components/dm/OwlBadge.tsx       ← list row badge"
echo "   src/components/dm/ThreadStreakBar.tsx ← streak bar in thread"
echo "   src/components/dm/AtRiskBanner.tsx    ← at-risk warning"
echo "   src/components/dm/StreakSheet.tsx     ← bottom sheet detail"
echo ""
echo "  Now run:  npm run dev"
echo ""