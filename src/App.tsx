import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  MoreVertical, 
  Search, 
  Settings, 
  Maximize2,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface TradingPair {
  id: string;
  pair: string;
  bid: number;
  ask: number;
  change: number;
  status: 'active' | 'paused' | 'pending';
  high: number;
  low: number;
  decimals: number;
}

const INITIAL_DATA: TradingPair[] = [
  { id: '1', pair: 'EUR / USD', bid: 1.08421, ask: 1.08425, change: 0.12, status: 'active', high: 1.08550, low: 1.08310, decimals: 5 },
  { id: '2', pair: 'GBP / USD', bid: 1.26348, ask: 1.26354, change: -0.08, status: 'active', high: 1.26600, low: 1.26200, decimals: 5 },
  { id: '3', pair: 'USD / JPY', bid: 150.124, ask: 150.131, change: 0.45, status: 'active', high: 150.450, low: 149.800, decimals: 3 },
  { id: '4', pair: 'AUD / USD', bid: 0.65412, ask: 0.65418, change: -0.21, status: 'paused', high: 0.65600, low: 0.65300, decimals: 5 },
  { id: '5', pair: 'USD / CAD', bid: 1.35084, ask: 1.35091, change: 0.03, status: 'active', high: 1.35250, low: 1.34900, decimals: 5 },
  { id: '6', pair: 'NZD / USD', bid: 0.61245, ask: 0.61252, change: 0.15, status: 'active', high: 0.61400, low: 0.61100, decimals: 5 },
  { id: '7', pair: 'EUR / GBP', bid: 0.85741, ask: 0.85747, change: 0.05, status: 'pending', high: 0.85850, low: 0.85650, decimals: 5 },
  { id: '8', pair: 'USD / CHF', bid: 0.88124, ask: 0.88131, change: -0.12, status: 'active', high: 0.88350, low: 0.88050, decimals: 5 },
];

export default function App() {
  const [data, setData] = useState<TradingPair[]>(INITIAL_DATA);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(item => {
        const volatility = 0.00005 * (item.decimals === 3 ? 100 : 1);
        const change = (Math.random() - 0.5) * volatility;
        return {
          ...item,
          bid: item.bid + change,
          ask: item.ask + change,
          change: item.change + (Math.random() - 0.5) * 0.01
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-slate-950 text-slate-300 selection:bg-blue-500/30">
      {/* Top Navigation / Status Bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight text-sm">FX TERMINAL</span>
          </div>
          <nav className="flex gap-4">
            {['Dashboard', 'Watchlist', 'Portfolio', 'Alerts'].map(item => (
              <button key={item} className={`text-xs font-medium ${item === 'Watchlist' ? 'text-white' : 'text-slate-500 hover:text-slate-300 transition-colors'}`}>
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search pairs..." 
              className="bg-slate-800 border-none rounded py-1 pl-8 pr-3 text-xs w-48 focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-slate-600"
            />
          </div>
          <button className="p-1 hover:bg-slate-800 rounded transition-colors">
            <Settings size={16} className="text-slate-400" />
          </button>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-500">CONN: LONDON_S01</span>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white tracking-tight">Main Watchlist</h1>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 tracking-wider">SECURE</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium transition-colors border border-slate-700">
              <Bell size={14} />
              Set Global Alert
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors shadow-lg shadow-blue-900/20">
              New Order
            </button>
          </div>
        </div>

        {/* High-Density Table */}
        <div className="bg-slate-900/40 rounded-lg border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="pl-4 pr-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none w-10">#</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Asset Pair</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-right">Bid</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-right">Ask</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-right">Change %</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Status</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-right">24h High</th>
                  <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-right">24h Low</th>
                  <th className="pl-2 pr-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {data.map((row, idx) => (
                  <tr 
                    key={row.id} 
                    id={`row-${row.id}`}
                    className={`group transition-colors duration-75 relative ${hoveredRow === row.id ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'}`}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="pl-4 pr-2 py-1.5 text-[10px] font-mono text-slate-600 align-middle">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white tracking-tight">{row.pair}</span>
                        <span className="text-[9px] text-slate-600 font-medium uppercase tracking-tighter">SPOT · {row.id.padStart(3, '0')}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 font-mono text-xs text-right tabular-nums align-middle">
                      <PriceCell value={row.bid} decimals={row.decimals} />
                    </td>
                    <td className="px-2 py-1.5 font-mono text-xs text-right tabular-nums align-middle">
                      <PriceCell value={row.ask} decimals={row.decimals} />
                    </td>
                    <td className={`px-2 py-1.5 font-mono text-xs text-right tabular-nums align-middle ${row.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {row.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-2 py-1.5 align-middle">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          row.status === 'active' ? 'bg-emerald-500' : 
                          row.status === 'paused' ? 'bg-slate-500' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                        }`} />
                        <span className="text-[10px] font-semibold text-slate-400 capitalize">
                          {row.status === 'pending' ? 'Halted' : row.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 font-mono text-[11px] text-slate-500 text-right tabular-nums align-middle">
                      {row.high.toFixed(row.decimals)}
                    </td>
                    <td className="px-2 py-1.5 font-mono text-[11px] text-slate-500 text-right tabular-nums align-middle">
                      {row.low.toFixed(row.decimals)}
                    </td>
                    <td className="pl-2 pr-4 py-1.5 align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setEditingAlertId(editingAlertId === row.id ? null : row.id)}
                          className={`p-1 rounded transition-all duration-200 ${editingAlertId === row.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100'}`}
                        >
                          <Bell size={12} />
                        </button>
                        <button className="p-1 text-slate-500 hover:text-white hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <MoreVertical size={12} />
                        </button>
                      </div>
                    </td>
                    {/* Inline Alert Edit Overlay (Conceptual) */}
                    <AnimatePresence>
                      {editingAlertId === row.id && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="absolute inset-0 z-10 bg-blue-600/90 backdrop-blur-sm flex items-center px-4 justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-white">SET ALERT FOR {row.pair}</span>
                            <div className="flex items-center bg-white/10 rounded overflow-hidden p-0.5">
                              <input 
                                type="text" 
                                defaultValue={row.bid.toFixed(row.decimals)}
                                className="bg-transparent border-none text-xs font-mono text-white p-1 w-24 outline-none focus:ring-0"
                              />
                            </div>
                            <span className="text-[10px] text-white/70">TRIGGER WHEN PRICE DROPS BELOW</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingAlertId(null)} className="text-[10px] font-bold text-white uppercase tracking-wider px-3 py-1 bg-white/20 hover:bg-white/30 rounded">Cancel</button>
                            <button onClick={() => setEditingAlertId(null)} className="text-[10px] font-bold text-white uppercase tracking-wider px-3 py-1 bg-white rounded text-blue-600">Save Alert</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <AlertCircle size={10} />
                <span>Market volatility is currently HIGH (3.4σ)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              LAST UPDATE: {new Date().toLocaleTimeString()} · SEC: 128-BIT_TLS
            </div>
          </div>
        </div>

        {/* Floating Controls */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2">
          <button className="w-10 h-10 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-xl border border-slate-700">
            <Maximize2 size={18} />
          </button>
          <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors shadow-2xl shadow-blue-500/20">
            <Search size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}

function PriceCell({ value, decimals }: { value: number, decimals: number }) {
  const parts = value.toFixed(decimals).split('.');
  const intPart = parts[0];
  const decimalPart = parts[1];
  
  // Highlighting key figures (last 2 digits) for speed of scanning in forex
  const pips = decimalPart.slice(-2);
  const base = decimalPart.slice(0, -2);

  return (
    <div className="flex items-baseline justify-end">
      <span className="text-slate-400 opacity-60 text-[10px]">{intPart}.</span>
      <span className="text-slate-200">{base}</span>
      <span className="text-white font-bold text-[13px] leading-none">{pips}</span>
    </div>
  );
}
