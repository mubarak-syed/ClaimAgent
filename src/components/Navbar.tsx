import React from 'react';
import { ShieldAlert, RefreshCw, Mail, CheckCircle2, UserCheck, Zap } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onReset: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  currentUser?: User | null;
  hasToken?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  autonomousMode?: boolean;
  onToggleAutonomous?: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  currentUser,
  hasToken,
  onSignIn,
  onSignOut,
  autonomousMode,
  onToggleAutonomous,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ClaimLens
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-medium hidden md:inline">Claims Dispute Agent</span>
        </div>

        {/* Zone 2: Three JTBD workflow stages */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="text-blue-600 font-semibold">1. Upload Notice & Policy</span>
          <span>&rarr;</span>
          <span>2. Gemini Multimodal Audit</span>
          <span>&rarr;</span>
          <span>3. Appeal, PDF & Gmail Dispatch</span>
        </div>

        {/* Zone 3: Actions & Google Connection Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Autonomous Dispatch Pill */}
          {onToggleAutonomous && (
            <button
              onClick={() => onToggleAutonomous(!autonomousMode)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer border ${
                autonomousMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Autonomous Dispatch: Prepares and prompts dispatch upon audit completion"
            >
              <Zap className={`w-3 h-3 ${autonomousMode ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
              <span>{autonomousMode ? 'Auto-Dispatch ON' : 'Auto-Dispatch OFF'}</span>
            </button>
          )}

          {/* Google Auth Status / Button */}
          {currentUser && hasToken ? (
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-slate-700 font-medium truncate max-w-[120px] sm:max-w-[160px]">
                {currentUser.email}
              </span>
              <button
                onClick={onSignOut}
                className="text-[10px] text-slate-400 hover:text-slate-700 ml-1 underline cursor-pointer"
                title="Disconnect Gmail"
              >
                Logout
              </button>
            </div>
          ) : (
            onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="Connect Gmail to autonomously send formal appeal packages"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Connect Gmail</span>
              </button>
            )
          )}

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
