"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import InvestigationTimeline from "../components/InvestigationTimeline";
import ThreatChart from "../components/ThreatChart";
import RiskProgressChart from "../components/RiskProgressChart";
import IntelligenceCard from "../components/IntelligenceCard";
import "leaflet/dist/leaflet.css";
import WellbeingChat from "../components/WellbeingChat";

import {
  Shield,
  Globe,
  AlertTriangle,
  Search,
  Activity,
  Terminal as TerminalIcon,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-zinc-950 flex items-center justify-center border-t border-cyan-500/10">
      <div className="text-cyan-400 flex items-center gap-3 font-mono text-sm tracking-wider">
        <Activity className="animate-spin h-5 w-5 text-cyan-400" />
        <span>INITIALIZING GEOSPATIAL THREAT MATRIX...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  const [urlInput, setUrlInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>("—");

  const handleInvestigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await axios.post("API_URL/api/investigate", {
        url: urlInput,
      });

      const data = response.data;
      console.log("Cyber Backend Payload Received:", data);

      setReport(data);
      setTimestamp(new Date().toLocaleString());
    } catch (err: any) {
      console.error("AXIOS_ERROR:", err);
      setError(
        err.response?.data?.detail ||
          "Investigation analysis failed. Connection dropped."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <header className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-lg border border-cyan-400/20 shadow-lg shadow-cyan-500/10">
              <Shield className="h-6 w-6 text-black stroke-[2]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 tracking-widest font-bold uppercase">
                  System Active
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                CyberSecureMind{" "}
                <span className="text-zinc-600 font-normal">|</span>{" "}
                Cybercrime Defense
              </h1>
            </div>
          </div>

          <div className="font-mono text-xs text-zinc-500 bg-zinc-900/50 px-3 py-1.5 rounded-md border border-zinc-800">
            SECURE PROTOCOL // TLS 1.3
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12">
        <div className="space-y-3 max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-mono">
            Autonomous Cybercrime Intelligence Platform
          </h2>

          <p className="text-zinc-400 leading-relaxed text-base">
            CyberSecureMind unifies Cybersecurity Intelligence, Financial
            Intelligence, GTM Intelligence, and Compliance Monitoring into a
            single AI-driven platform.
          </p>
        </div>

        <section className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-800 pointer-events-none select-none hidden sm:block">
            MODULE: AGENT_SCANNER_v2.6
          </div>

          <form onSubmit={handleInvestigate} className="space-y-4">
            <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase font-semibold">
              Target Investigation Domain / URL
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-600" />

                <input
                  type="text"
                  placeholder="Paste malicious web links or phishing targets..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-cyan-300 shadow-lg shadow-cyan-400/10 active:scale-[0.98] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin text-black" />
                    <span>Investigating...</span>
                  </>
                ) : (
                  <>
                    <TerminalIcon className="h-4 w-4 text-black stroke-[2.5]" />
                    <span>Investigate Threat</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 rounded-xl text-sm font-mono flex gap-3 items-start"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
            <div>
              <strong className="block text-red-300 mb-1">
                Execution Interrupted:
              </strong>
              {error}
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-4 w-1/4 bg-zinc-800 rounded" />
                <div className="h-8 w-3/4 bg-zinc-800 rounded" />
                <div className="h-4 w-1/2 bg-zinc-800 rounded" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-72 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-6 w-1/3 bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-800 rounded" />
                <div className="h-4 w-full bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        )}

        {report && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-6 right-6 flex items-center justify-center h-20 w-20 rounded-full bg-zinc-900/50 border border-zinc-800">
                  <div className="text-center">
                    <span className="block font-mono text-xl font-bold text-white">
                      {report.fraud_score ?? 0}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">
                      Score
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                    System Verdict Report
                  </span>

                  <h3 className="text-lg font-mono font-bold text-cyan-400 break-all pr-24">
                    {report.target}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {(report.fraud_score ?? 0) >= 20 ||
                  (report.confidence ?? 0) >= 40 ||
                  report.severity === "medium" ||
                  report.severity === "high" ||
                  report.severity === "critical" ? (
                    <span className="px-3 py-1 text-xs font-mono font-bold bg-red-950 border border-red-700 text-red-400 rounded-md">
                      🚨 THREAT DETECTED
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-mono font-bold bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-md">
                      🛡️ CLEAN DOMAIN PROFILE
                    </span>
                  )}

                  <span className="text-zinc-400 font-mono text-sm">
                    RISK GRADE:
                    <strong className="text-white ml-2">
                      {report.threat_type || report.threat || "UNKNOWN"}
                    </strong>
                  </span>
                </div>

                <hr className="border-zinc-900" />

                <div className="space-y-3">
                  <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                    Incident Executive Summary
                  </h4>

                  <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 font-sans">
                    {report.summary ||
                      "No description data provided by analysis engine."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  AI Threat Classification
                </h4>

                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-mono text-xs">
                      Threat Type
                    </span>

                    <span className="text-red-400 font-bold uppercase">
                      {report.threat_type || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-mono text-xs">
                      Confidence
                    </span>

                    <span className="text-cyan-400 font-bold">
                      {report.confidence || 0}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-mono text-xs">
                      Severity
                    </span>

                    <span className="text-yellow-400 uppercase font-bold">
                      {report.severity || "unknown"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-zinc-800">
                    <div className="text-zinc-500 text-xs font-mono mb-2">
                      AI Explanation
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {report.ai_explanation || "No AI explanation generated."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-b from-zinc-950 to-black border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 font-mono text-[9px] tracking-widest px-3 py-1 border-b border-l border-zinc-900 rounded-bl-lg uppercase font-bold">
                  AI/ML Agent Core
                </div>

                <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  Mitigation Guidance
                </h4>

                <div className="text-zinc-300 text-xs font-mono leading-relaxed bg-zinc-900/50 p-4 border border-zinc-900 rounded-xl max-h-[350px] overflow-y-auto whitespace-pre-line custom-scrollbar">
                  {report.ai_advice}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>TIMESTAMP:</span>
                  <span>{timestamp}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {report && !loading && (
          <div className="space-y-8">
            {(report.target_analytics || [
              {
                target: report.target,
                telemetry: report.telemetry,
                finance_data: report.finance_data,
                market_data: report.market_data,
                risk_breakdown: [
                  { time: "Fraud Score", threats: report?.fraud_score || 0 },
                  { time: "AI Confidence", threats: report?.confidence || 0 },
                  {
                    time: "Compliance",
                    threats: report?.compliance_score || 0,
                  },
                  { time: "Indicators", threats: report?.indicators || 0 },
                ],
                risk_progression: [
                  { stage: "SERP", score: 10 },
                  { stage: "Browser", score: 25 },
                  { stage: "Fraud", score: report?.fraud_score || 0 },
                  { stage: "AI", score: report?.confidence || 0 },
                  {
                    stage: "Final",
                    score: Math.max(
                      report?.fraud_score || 0,
                      report?.confidence || 0
                    ),
                  },
                ],
              },
            ]).map((item: any, index: number) => (
              <div
                key={index}
                className="space-y-6 border border-zinc-900 rounded-2xl p-6 bg-zinc-950/40"
              >
                <h3 className="text-cyan-400 font-mono font-bold break-all">
                  Target {index + 1}: {item.target}
                </h3>

                <InvestigationTimeline
                  telemetry={item.telemetry}
                  duration={report.investigation_time}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 w-full min-w-0">
                    <h3 className="text-white text-sm font-mono font-bold mb-4 uppercase tracking-widest">
                      Risk Signal Breakdown
                    </h3>

                    <ThreatChart data={item.risk_breakdown} />
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 w-full min-w-0">
                    <h3 className="text-white text-sm font-mono font-bold mb-4 uppercase tracking-widest">
                      Investigation Risk Progression
                    </h3>

                    <RiskProgressChart data={item.risk_progression} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <IntelligenceCard
                    title="Financial Fraud Intelligence"
                    type="finance"
                    data={item.finance_data}
                  />

                  <IntelligenceCard
                    title="Market & Threat Intelligence"
                    type="market"
                    data={item.market_data}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="space-y-4">
          <div className="border border-zinc-900 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl shadow-black">
            <div className="border-b border-zinc-900 bg-zinc-900/40 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400 animate-pulse" />

                <h2 className="font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase">
                  Global Cyber Intelligence Matrix
                </h2>
              </div>

              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full font-mono font-medium border border-emerald-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                GEO-NODES ACTIVE
              </span>
            </div>

            {report && !loading ? (
              <MapComponent currentThreat={report} />
            ) : (
              <div className="h-[500px] flex items-center justify-center text-zinc-500 font-mono text-sm">
                Run an investigation to generate live geo-threat telemetry.
              </div>
            )}
          </div>
        </section>

        <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-900 text-zinc-500 text-xs font-mono">
          <div className="flex gap-3 items-start p-4 bg-zinc-950/40 rounded-xl border border-zinc-900/50">
            <MapPin className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-400 block font-semibold mb-0.5">
                Geospatial Intelligence
              </span>
              Locates phishing operations, illegal servers, and fake banking
              setups across regional zones.
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-zinc-950/40 rounded-xl border border-zinc-900/50">
            <Clock className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-400 block font-semibold mb-0.5">
                Automated Workflows
              </span>
              Multi-agent structures gather data, check compliance, and prompt
              immediate defense actions.
            </div>
          </div>

          <div className="flex gap-3 items-start p-4 bg-zinc-950/40 rounded-xl border border-zinc-900/50">
            <Briefcase className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-zinc-400 block font-semibold mb-0.5">
                Compliance Alignment
              </span>
              Cross-references domain metrics with regulatory databases to
              detect scams early.
            </div>
          </div>
        </footer>

        <WellbeingChat />
      </main>
    </div>
  );
}