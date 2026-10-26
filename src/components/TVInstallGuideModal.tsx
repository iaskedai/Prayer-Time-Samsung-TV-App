import React, { useState } from 'react';
import { X, Tv, Globe, Terminal, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

interface TVInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const TVInstallGuideModal: React.FC<TVInstallGuideModalProps> = ({
  isOpen,
  onClose,
  appUrl
}) => {
  const [activeMethod, setActiveMethod] = useState<'browser' | 'native'>('browser');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-panel-highlight rounded-3xl p-6 lg:p-8 flex flex-col max-h-[90vh] shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                How to Run on Samsung Smart TV
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Choose the easiest method for your setup (Instant Web or Native .wgt)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Method Switcher */}
        <div className="flex gap-2 my-4 p-1 bg-slate-900/60 rounded-xl border border-white/5 shrink-0">
          <button
            onClick={() => setActiveMethod('browser')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMethod === 'browser'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Method 1: TV Browser (Fastest - No Setup)</span>
          </button>
          <button
            onClick={() => setActiveMethod('native')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMethod === 'native'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Method 2: Native App (.wgt Package)</span>
          </button>
        </div>

        {/* Method Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm text-slate-300">
          {activeMethod === 'browser' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white font-['Outfit']">Instant Playback via Samsung TV Web Browser</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    No developer account or SDK installation needed. The app is fully responsive and supports Samsung Smart TV remote D-Pad buttons right inside the browser.
                  </p>
                </div>
              </div>

              {/* URL Box */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2">
                <label className="text-xs font-mono uppercase text-slate-400 block font-semibold">
                  Application Hosted URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUrl ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <ol className="space-y-3 pt-1">
                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-white block font-['Outfit']">Open Internet on Samsung TV</strong>
                    <span className="text-xs text-slate-400">On your Samsung Smart TV, open the pre-installed <strong>Internet</strong> (Web Browser) app.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-white block font-['Outfit']">Enter URL & Bookmark</strong>
                    <span className="text-xs text-slate-400">Type in the URL above using the on-screen keyboard, then click the star icon to bookmark it or set it as the browser start page.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-white block font-['Outfit']">Switch to Full Screen</strong>
                    <span className="text-xs text-slate-400">Click the <strong>Fullscreen</strong> icon at the bottom of the dashboard or press the browser's full-screen toggle. Use remote Arrow keys and OK to navigate.</span>
                  </div>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Terminal className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white font-['Outfit']">Install as a Native App on TV Home Ribbon</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Installs the app directly onto your Samsung TV with its own home screen icon using the included <code className="text-cyan-300 font-mono">config.xml</code> and Tizen CLI.
                  </p>
                </div>
              </div>

              {/* Step 1: Developer Mode */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center shrink-0">1</span>
                  <h4 className="font-bold text-white font-['Outfit']">Enable Developer Mode on Samsung TV</h4>
                </div>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 pl-2">
                  <li>Turn on your Samsung Smart TV and open the <strong>Apps</strong> menu.</li>
                  <li>On the physical TV remote, press digits: <strong className="text-cyan-300 font-mono">1 2 3 4 5</strong>.</li>
                  <li>A <strong>Developer Mode configuration pop-up</strong> will appear.</li>
                  <li>Switch Developer Mode to <strong className="text-emerald-400">ON</strong>, enter your PC's local IP address, and select <strong>OK</strong>.</li>
                  <li>Hold the TV remote <strong>Power</strong> button down for 5 seconds until the TV restarts to apply.</li>
                </ul>
              </div>

              {/* Step 2: Build & Package */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center shrink-0">2</span>
                  <h4 className="font-bold text-white font-['Outfit']">Package & Install using Tizen CLI / SDB</h4>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 border border-white/5 space-y-1 overflow-x-auto">
                  <p className="text-slate-500"># 1. Connect to your TV over Wi-Fi (find TV IP in Settings &gt; Network Status)</p>
                  <p className="text-cyan-400">sdb connect 192.168.1.XXX</p>
                  <p className="text-slate-500 mt-2"># 2. Package into a .wgt widget file using config.xml</p>
                  <p className="text-cyan-400">tizen package -t wgt -s &lt;YourSamsungCertificate&gt; -- dist/</p>
                  <p className="text-slate-500 mt-2"># 3. Install onto the TV</p>
                  <p className="text-cyan-400">tizen install -n TizenPrayerDashboard.wgt -t &lt;TV_Device_ID&gt;</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            Tested on Samsung Tizen OS 3.0, 4.0, 5.0, 6.0, 7.0 & 8.0
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-mono shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
