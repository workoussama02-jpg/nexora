'use client';
import { useState, useRef, useEffect } from 'react';

const EMOJI_GROUPS: Record<string, string[]> = {
  Faces: ['😀','😃','😄','😁','😆','😅','😂','🙂','😊','😇','🥰','😍','😘','😋','😎','🤔','😐','🙄','😏','😒','😔','😴','😷','🤒','🥳','🤩'],
  Gestures: ['👋','✋','👌','✌️','🤞','🤙','👍','👎','✊','👏','🙌','🙏','🤝','🫶','💪','🤜','🤛'],
  Hearts: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💕','💞','💓','💗','💖','💘','💝','💔','❣️'],
  Nature: ['⭐','🌟','✨','💫','🌈','☀️','🌙','⚡','🔥','❄️','💧','🌸','🌺','🍀','🌊','🌿','🎄'],
  Objects: ['🎉','🎊','🎁','🏆','💯','📌','💡','🔑','💎','🎵','📷','💻','🎶','🎈','🎂','🚀','🎯'],
  Flags: [
    '🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇮🇹','🇪🇸','🇵🇹','🇧🇷','🇲🇽','🇨🇦',
    '🇦🇺','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇮🇩','🇸🇦','🇦🇪','🇷🇺','🇳🇱',
    '🇧🇪','🇨🇭','🇸🇪','🇳🇴','🇩🇰','🇫🇮','🇵🇱','🇹🇷','🇮🇱','🇦🇷',
    '🇿🇦','🇲🇦','🇪🇬','🇳🇬','🇰🇪','🇹🇭','🇻🇳','🇵🇭','🇲🇾','🇸🇬',
    '🇳🇿','🇬🇷','🇨🇿','🇭🇺','🇶🇦','🇵🇰','🇧🇩','🇲🇲','🇮🇷','🇮🇶',
  ],
};

const GROUP_ICONS: Record<string, string> = {
  Faces: '😊', Gestures: '👋', Hearts: '❤️', Nature: '🌟', Objects: '🎉', Flags: '🌍',
};

interface EmojiPickerInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  /** When true, only shows the Flags category */
  flagsOnly?: boolean;
  placeholder?: string;
}

export default function EmojiPickerInput({
  label, value, onChange, helperText, flagsOnly = false, placeholder = 'Type or pick…',
}: EmojiPickerInputProps) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(flagsOnly ? 'Flags' : 'Faces');
  const ref = useRef<HTMLDivElement>(null);

  const groups = flagsOnly ? { Flags: EMOJI_GROUPS.Flags } : EMOJI_GROUPS;
  const groupKeys = Object.keys(groups);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      )}
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 px-3 py-2">
          {value && <span className="text-lg leading-none">{value}</span>}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500"
            placeholder={placeholder}
            maxLength={8}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="px-3 rounded-lg border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-lg transition"
          title="Pick emoji"
        >
          {flagsOnly ? '🌍' : '😊'}
        </button>
      </div>
      {helperText && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helperText}</p>}

      {open && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/20 rounded-xl shadow-xl overflow-hidden">
          {!flagsOnly && (
            <div className="flex border-b border-gray-100 dark:border-white/10 p-1 gap-0.5">
              {groupKeys.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGroup(g)}
                  title={g}
                  className={`flex-1 py-1 text-base rounded transition ${
                    activeGroup === g ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {GROUP_ICONS[g]}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-8 gap-0.5 p-2 max-h-44 overflow-y-auto">
            {(groups[activeGroup] || []).map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onChange(emoji); setOpen(false); }}
                className="text-xl p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition leading-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
