import React, { useState } from 'react';
import { User, Sparkles, ArrowRight } from 'lucide-react';

interface UserNameModalProps {
  isOpen: boolean;
  currentName: string;
  onSave: (name: string) => void;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const UserNameModal: React.FC<UserNameModalProps> = ({
  isOpen,
  currentName,
  onSave,
  canDismiss = false,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(currentName || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Please enter your name to proceed.');
      return;
    }
    if (trimmed.length > 25) {
      setError('Name cannot exceed 25 characters.');
      return;
    }
    setError('');
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl p-6 relative overflow-hidden">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#38BDF8] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>zero_trace Identity</span>
            </div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Enter Your Name</h2>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] mb-5 leading-relaxed">
          Welcome to zero_trace. Enter your name or handle to personalize your profile, track real-time quiz ratings, and display on the developer dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#94A3B8] mb-1.5 font-medium">
              DEVELOPER NAME
            </label>
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Alex Coder"
              className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none font-sans transition-colors"
            />
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            {canDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155]/40 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
