import { useState, useCallback } from 'react';
import type { RefractionData } from '@/schemas/consultation';

interface CopiedRefraction {
  OD: RefractionData;
  OG: RefractionData;
  source: 'consultation';
  timestamp: number;
}

let copiedRefraction: CopiedRefraction | null = null;

export function useCopiedRefraction() {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback((data: CopiedRefraction) => {
    copiedRefraction = data;
    setHasCopied(true);
  }, []);

  const paste = useCallback((): CopiedRefraction | null => {
    return copiedRefraction;
  }, []);

  const clear = useCallback(() => {
    copiedRefraction = null;
    setHasCopied(false);
  }, []);

  return { copy, paste, clear, hasCopied };
}
