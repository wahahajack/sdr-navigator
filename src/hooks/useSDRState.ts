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

export interface CustomerInfo {
  name: string;
  company: string;
  email: string;
  wa: string;
}

export interface LIECSData {
  L: string; // Location/Country
  I: string; // Identity/Business Mode
  E: string; // Experience
  C: string; // Channel
  S: string; // Stage
}

export interface SDRState {
  nature: NatureType;
  round: number;
  node: string;
  customerInfo: CustomerInfo;
  liecsData: LIECSData;
  confirmed: boolean;
  history: string[];
  selectedPuzzle: PuzzleKey | null;
  finishType: string | null;
}

const initialCustomerInfo: CustomerInfo = {
  name: '',
  company: '',
  email: '',
  wa: ''
};

const initialLIECSData: LIECSData = {
  L: '',
  I: '',
  E: '',
  C: '',
  S: ''
};

const initialState: SDRState = {
  nature: 'high',
  round: 1,
  node: 'r1',
  customerInfo: initialCustomerInfo,
  liecsData: initialLIECSData,
  confirmed: false,
  history: [],
  selectedPuzzle: null,
  finishType: null
};

export function useSDRState() {
  const [state, setState] = useState<SDRState>(initialState);

  const updateNature = useCallback((nature: NatureType) => {
    setState(prev => ({
      ...prev,
      nature,
      round: 1,
      node: 'r1',
      confirmed: false,
      history: [],
      selectedPuzzle: null,
      finishType: null
    }));
  }, []);

  const updateLIECSField = useCallback((key: PuzzleKey, value: string) => {
    setState(prev => ({
      ...prev,
      liecsData: { ...prev.liecsData, [key]: value }
    }));
  }, []);

  const selectPuzzle = useCallback((key: PuzzleKey | null) => {
    setState(prev => ({ ...prev, selectedPuzzle: key }));
  }, []);

  const updateCustomerInfo = useCallback((field: keyof CustomerInfo, value: string) => {
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
    setState(prev => ({
      ...prev,
      round: 1,
      node: 'r1',
      confirmed: false,
      history: [],
      selectedPuzzle: null,
      finishType: null
    }));
  }, []);

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
      // Create puzzles object from liecsData for compatibility
      const puzzles: Record<PuzzleKey, boolean> = {
        L: !!state.liecsData.L,
        I: !!state.liecsData.I,
        E: !!state.liecsData.E,
        C: !!state.liecsData.C,
        S: !!state.liecsData.S
      };
      return dialogue.script_gen(puzzles, {
        loc: state.liecsData.L,
        iden: state.liecsData.I
      });
    }
    return dialogue.script || '';
  }, [state.liecsData]);

  const getPuzzleCount = useCallback(() => {
    return Object.values(state.liecsData).filter(v => v.trim() !== '').length;
  }, [state.liecsData]);

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
    text += `CONTACT INFO:\n`;
    text += `- Name: ${state.customerInfo.name || 'N/A'}\n`;
    text += `- Company: ${state.customerInfo.company || 'N/A'}\n`;
    text += `- Email: ${state.customerInfo.email || 'N/A'}\n`;
    text += `- WhatsApp: ${state.customerInfo.wa || 'N/A'}\n`;
    text += `- Entry Type: ${state.nature.toUpperCase()}\n`;
    text += `------------------------------------\n`;
    text += `LIECS AUDIT:\n`;
    text += `- [L] Location: ${state.liecsData.L || 'EMPTY'}\n`;
    text += `- [I] Identity: ${state.liecsData.I || 'EMPTY'}\n`;
    text += `- [E] Experience: ${state.liecsData.E || 'EMPTY'}\n`;
    text += `- [C] Channel: ${state.liecsData.C || 'EMPTY'}\n`;
    text += `- [S] Stage: ${state.liecsData.S || 'EMPTY'}\n`;
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
    updateLIECSField,
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
