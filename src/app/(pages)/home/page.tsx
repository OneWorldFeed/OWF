"use client"

import { useState } from "react"
import { Signal } from "@/types/signal"
import { SIGNALS } from "@/data/signals"
import { SignalCard } from "@/components/feed/SignalCard"
import { SignalModal } from "@/components/feed/SignalModal"
import { GlobalMomentsStrip } from "@/components/feed/GlobalMomentsStrip"

const FEED_TABS = ["For You", "Nature", "Space", "Ocean", "Volcano", "Culture"]

export default function HomePage() {
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null)
  const [activeTab, setActiveTab]       = useState(0)

  // TODO: replace with Firestore query when Firebase is connected
  const signals = SIGNALS

  return (
    <div style={{ padding: "24px 0 60px" }}>

      {/* Feed header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: "0 0 3px", fontSize: 24, fontWeight: 900, color: "var(--owf-text)", letterSpacing: "-0.025em" }}>
              The Feed
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "var(--owf-text-muted)" }}>
              {signals.length} live signals · updating now
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--owf-raised)", border: "1px solid var(--owf-border)",
            borderRadius: 8, padding: "5px 11px", fontSize: 11, color: "var(--owf-text-sub)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", animation: "owfLivePulse 1.8s infinite" }} />
            Live now
          </div>
        </div>

        {/* Tab strip */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
          {FEED_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                background: activeTab === i ? "rgba(26,110,255,0.14)" : "transparent",
                border: activeTab === i ? "1px solid rgba(26,110,255,0.38)" : "1px solid transparent",
                color: activeTab === i ? "#60A5FA" : "var(--owf-text-muted)",
                fontSize: 12.5, fontWeight: activeTab === i ? 700 : 500,
                padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Global Moments */}
      <GlobalMomentsStrip signals={signals} onSelect={setActiveSignal} />

      {/* Signal Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
      }}>
        {signals.map((signal, i) => (
          <SignalCard
            key={signal.id}
            signal={signal}
            index={i}
            onWatch={setActiveSignal}
          />
        ))}
      </div>

      {/* Modal */}
      {activeSignal && (
        <SignalModal
          signal={activeSignal}
          onClose={() => setActiveSignal(null)}
        />
      )}
    </div>
  )
}
