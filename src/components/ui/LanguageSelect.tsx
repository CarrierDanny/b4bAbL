import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { Language, LanguageOption, SUPPORTED_LANGUAGES } from '../../types';

interface LanguageSelectProps {
  value: Language | null;
  onChange: (language: Language) => void;
  placeholder?: string;
  className?: string;
}

export default function LanguageSelect({
  value,
  onChange,
  placeholder = 'Select Your Language',
  className = '',
}: LanguageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = value
    ? SUPPORTED_LANGUAGES.find((lang) => lang.code === value)
    : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (language: LanguageOption) => {
    onChange(language.code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="stone-input w-full flex items-center justify-between gap-2 cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedLanguage ? 'text-stone-800' : 'text-stone-500 italic'}>
          {selectedLanguage ? (
            <span className="flex items-center gap-2">
              <span>{selectedLanguage.flag}</span>
              <span>{selectedLanguage.name}</span>
              <span className="text-stone-500 text-sm">({selectedLanguage.nativeName})</span>
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          size={20}
          className={`text-stone-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute z-50 w-full mt-2 py-2 bg-gradient-to-b from-stone-100 to-stone-200 border-2 border-stone-500 rounded-lg shadow-lg max-h-60 overflow-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="listbox"
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <li key={language.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(language)}
                  className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-stone-300/50 transition-colors ${
                    value === language.code ? 'bg-stone-300/70' : ''
                  }`}
                  role="option"
                  aria-selected={value === language.code}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="font-crimson text-stone-800">{language.name}</span>
                  <span className="font-crimson text-stone-500 text-sm">
                    ({language.nativeName})
                  </span>
                  {value === language.code && (
                    <Check size={16} className="ml-auto text-gold-accent" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
