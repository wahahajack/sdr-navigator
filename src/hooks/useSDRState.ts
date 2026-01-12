import { useState, useCallback } from 'react';
import { 
  NatureType, 
  PuzzleKey, 
  NATURE_AUTO_MAP, 
  PUZZLE_META,
  CONVERSATION_TREES,
  BRANCHES,
  ConversationNode
} from '@/lib/sdrData';

export interface SDRState {
  nature: NatureType;
  round: number;
  node: string;
  puzzles: Record<PuzzleKey, boolean>;
  confirmed: boolean;
  history: string[];
  customerInfo: {
    email: string;
    wa: string;
    loc: string;
    iden: string;
  };
  selectedPuzzle: PuzzleKey | null;
  finishType: string | null;
}

const initialPuzzles: Record<PuzzleKey, boolean> = {
  L: false,
  I: false,
  E: false,
  C: false,
  S: false
};

const initialState: SDRState = {
  nature: 'high',
  round: 1,
  node: 'r1',
  puzzles: { ...initialPuzzles, L: true, I: true },
  confirmed: false,
  history: [],
  customerInfo: { email: '', wa: '', loc: '', iden: '' },
  selectedPuzzle: null,
  finishType: null
};

export function useSDRState() {
  const [state, setState] = useState<SDRState>(initialState);

  const updateNature = useCallback((nature: NatureType) => {
    const autoPuzzles = NATURE_AUTO_MAP[nature];
    const newPuzzles = { ...initialPuzzles };
    autoPuzzles.forEach(key => {
      newPuzzles[key] = true;
    });
    
    setState(prev => ({
      ...prev,
      nature,
      round: 1,
      node: 'r1',
      puzzles: newPuzzles,
      confirmed: false,
      history: [],
      selectedPuzzle: null,
      finishType: null
    }));
  }, []);

  const togglePuzzle = useCallback((key: PuzzleKey, value: boolean) => {
    setState(prev => ({
      ...prev,
      puzzles: { ...prev.puzzles, [key]: value }
    }));
  }, []);

  const selectPuzzle = useCallback((key: PuzzleKey | null) => {
    setState(prev => ({ ...prev, selectedPuzzle: key }));
  }, []);

  const updateCustomerInfo = useCallback((field: keyof SDRState['customerInfo'], value: string) => {
    setState(prev => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, [field]: value }
    }));
  }, []);

  const handleReply = useCallback((next: string) => {
    if (next.startsWith('finish_')) {
      setState(prev => ({
        ...prev,
        finishType: next.replace('finish_', '')
      }));
    } else {
      setState(prev => ({
        ...prev,
        node: next,
        round: prev.round + 1
      }));
    }
  }, []);

  const addToHistory = useCallback((entry: string) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, entry]
    }));
  }, []);

  const confirmFlow = useCallback(() => {
    setState(prev => ({ ...prev, confirmed: true }));
  }, []);

  const resetFlow = useCallback(() => {
    updateNature(state.nature);
  }, [state.nature, updateNature]);

  const getCurrentDialogue = useCallback((): ConversationNode | null => {
    if (state.node === 'r1') {
      return CONVERSATION_TREES[state.nature]?.r1 || null;
    }
    const parts = state.node.split('.');
    if (parts.length > 1) {
      return CONVERSATION_TREES[parts[0] as NatureType]?.[parts[1] as 'r1'] || null;
    }
    return BRANCHES[state.node] || null;
  }, [state.nature, state.node]);

  const getScript = useCallback((dialogue: ConversationNode | null): string => {
    if (!dialogue) return '';
    if (dialogue.script_gen) {
      return dialogue.script_gen(state.puzzles, {
        loc: state.customerInfo.loc,
        iden: state.customerInfo.iden
      });
    }
    return dialogue.script || '';
  }, [state.puzzles, state.customerInfo]);

  const getPuzzleCount = useCallback(() => {
    return Object.values(state.puzzles).filter(Boolean).length;
  }, [state.puzzles]);

  const getGrade = useCallback(() => {
    const count = getPuzzleCount();
    if (state.finishType === 'retail') return { grade: 'C', label: 'C-GRADE: RETAIL', color: 'muted' };
    if (state.finishType === 'support') return { grade: 'C', label: 'C-GRADE: SUPPORT', color: 'muted' };
    if (state.finishType === 'nurture') return { grade: 'B', label: 'B-GRADE: NURTURE', color: 'warning' };
    
    if (count >= 4) {
      return { 
        grade: 'A', 
        label: state.confirmed ? 'A-GRADE: READY FOR AE' : 'POTENTIAL A-GRADE',
        color: 'primary'
      };
    }
    if (count >= 2) {
      return { 
        grade: 'B', 
        label: state.confirmed ? 'B-GRADE: NURTURE/EMAIL' : 'QUALIFYING B-GRADE',
        color: 'warning'
      };
    }
    return { 
      grade: 'C', 
      label: state.confirmed ? 'C-GRADE: DISCARD' : 'C-GRADE / FRAGMENTED',
      color: 'muted'
    };
  }, [getPuzzleCount, state.confirmed, state.finishType]);

  const generateBriefing = useCallback((aeName: string) => {
    let text = `[TEYES SDR INTELLIGENCE BRIEFING]\n`;
    text += `====================================\n`;
    text += `IDENTITY:\n`;
    text += `- Email: ${state.customerInfo.email || 'N/A'}\n`;
    text += `- WhatsApp: ${state.customerInfo.wa || 'N/A'}\n`;
    text += `- Entry: ${state.nature.toUpperCase()}\n`;
    text += `------------------------------------\n`;
    text += `PRE-FILLED DATA:\n`;
    text += `- Form Loc: ${state.customerInfo.loc || 'EMPTY'}\n`;
    text += `- Form Iden: ${state.customerInfo.iden || 'EMPTY'}\n`;
    text += `------------------------------------\n`;
    text += `LIECS AUDIT:\n`;
    (Object.keys(state.puzzles) as PuzzleKey[]).forEach(k => {
      text += `[${state.puzzles[k] ? 'X' : ' '}] ${PUZZLE_META[k].title}\n`;
    });
    text += `------------------------------------\n`;
    text += `CHAT TRACE LOG:\n`;
    state.history.forEach(line => text += line + `\n`);
    text += `====================================\n`;
    text += `ASSIGNED BY SDR | TO AE: ${aeName}\n`;
    return text;
  }, [state]);

  return {
    state,
    updateNature,
    togglePuzzle,
    selectPuzzle,
    updateCustomerInfo,
    handleReply,
    addToHistory,
    confirmFlow,
    resetFlow,
    getCurrentDialogue,
    getScript,
    getPuzzleCount,
    getGrade,
    generateBriefing
  };
}
