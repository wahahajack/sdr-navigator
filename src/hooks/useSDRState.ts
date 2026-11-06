import { useState, useCallback } from 'react';
import { 
  NatureType, 
  PuzzleKey, 
  NATURE_AUTO_MAP, 
  PUZZLE_META,
  CONVERSATION_TREES,
  BRANCHES,
  AE_DATA,
  ConversationNode,
  detectLanguage,
  detectModel,
  detectOEMIntent,
  detectPartnerIntent,
  detectSupportIntent,
  getRegionConfig
} from '@/lib/sdrData';

export interface CustomerInfo {
  name: string;
  company: string;
  email: string;
  wa: string;
  firstMessage: string;
  channels: ('email' | 'whatsapp')[];
}

export interface LIECSMGData {
  L: string; // Location/Country
  I: string; // Identity/Business Mode
  E: string; // Experience
  C: string; // Channel
  S: string; // Stage
  M: string; // Model Interest
  G: string; // Language/Region
}

export interface SDRState {
  nature: NatureType;
  round: number;
  node: string;
  customerInfo: CustomerInfo;
  liecsmgData: LIECSMGData;
  confirmed: boolean;
  history: string[];
  selectedPuzzle: PuzzleKey | null;
  finishType: string | null;
}

const initialCustomerInfo: CustomerInfo = {
  name: '',
  company: '',
  email: '',
  wa: '',
  firstMessage: '',
  channels: []
};

const initialLIECSMGData: LIECSMGData = {
  L: '',
  I: '',
  E: '',
  C: '',
  S: '',
  M: '',
  G: ''
};

const initialState: SDRState = {
  nature: 'high',
  round: 1,
  node: 'r1',
  customerInfo: initialCustomerInfo,
  liecsmgData: initialLIECSMGData,
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
      liecsmgData: { ...prev.liecsmgData, [key]: value }
    }));
  }, []);

  const selectPuzzle = useCallback((key: PuzzleKey | null) => {
    setState(prev => ({ ...prev, selectedPuzzle: key }));
  }, []);

  const updateCustomerInfo = useCallback((field: keyof CustomerInfo, value: string | ('email' | 'whatsapp')[]) => {
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
      const puzzles: Record<PuzzleKey, boolean> = {
        L: !!state.liecsmgData.L,
        I: !!state.liecsmgData.I,
        E: !!state.liecsmgData.E,
        C: !!state.liecsmgData.C,
        S: !!state.liecsmgData.S,
        M: !!state.liecsmgData.M,
        G: !!state.liecsmgData.G
      };
      return dialogue.script_gen(puzzles, {
        loc: state.liecsmgData.L,
        iden: state.liecsmgData.I,
        model: state.liecsmgData.M,
        lang: state.liecsmgData.G
      });
    }
    return dialogue.script || '';
  }, [state.liecsmgData]);

  const getPuzzleCount = useCallback(() => {
    return Object.values(state.liecsmgData).filter(v => v.trim() !== '').length;
  }, [state.liecsmgData]);

  const getGrade = useCallback(() => {
    const count = getPuzzleCount();
    const mFilled = state.liecsmgData.M.trim() !== '';
    const gFilled = state.liecsmgData.G.trim() !== '';
    
    if (state.finishType === 'retail') return { grade: 'C', label: 'C-GRADE: RETAIL', color: 'muted' };
    if (state.finishType === 'support') return { grade: 'C', label: 'C-GRADE: SUPPORT', color: 'muted' };
    if (state.finishType === 'support_tech') return { grade: 'C', label: 'C-GRADE: TECH SUPPORT', color: 'muted' };
    if (state.finishType === 'support_install') return { grade: 'C', label: 'C-GRADE: INSTALL SUPPORT', color: 'muted' };
    if (state.finishType === 'nurture') return { grade: 'B', label: 'B-GRADE: NURTURE', color: 'warning' };
    
    // OEM/Partner nature gets higher priority regardless of puzzle count
    if (state.nature === 'oem' || state.nature === 'partner') {
      return { 
        grade: 'A', 
        label: state.confirmed ? 'A-GRADE: STRATEGIC / DIRECTOR' : 'POTENTIAL A-GRADE: STRATEGIC',
        color: 'primary'
      };
    }
    
    if (count >= 5 || (count >= 4 && mFilled && gFilled)) {
      return { 
        grade: 'A', 
        label: state.confirmed ? 'A-GRADE: READY FOR AE' : 'POTENTIAL A-GRADE',
        color: 'primary'
      };
    }
    if (count >= 3 || (count >= 2 && mFilled)) {
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
  }, [getPuzzleCount, state.confirmed, state.finishType, state.nature, state.liecsmgData]);

  const getRecommendedAE = useCallback(() => {
    const loc = state.liecsmgData.L;
    if (!loc) return 'Leo';
    const config = getRegionConfig(loc);
    return config.ae;
  }, [state.liecsmgData.L]);

  const generateBriefing = useCallback((aeName: string) => {
    const recommendedAE = getRecommendedAE();
    const aeInfo = AE_DATA[recommendedAE] || AE_DATA['Leo'];
    
    let text = `[TEYES SDR INTELLIGENCE BRIEFING v7.0]\n`;
    text += `====================================\n`;
    text += `CONTACT INFO:\n`;
    text += `- Name: ${state.customerInfo.name || 'N/A'}\n`;
    text += `- Company: ${state.customerInfo.company || 'N/A'}\n`;
    text += `- Email: ${state.customerInfo.email || 'N/A'}\n`;
    text += `- WhatsApp: ${state.customerInfo.wa || 'N/A'}\n`;
    text += `- Channels: ${state.customerInfo.channels.length > 0 ? state.customerInfo.channels.join(', ').toUpperCase() : 'N/A'}\n`;
    text += `- First Message: ${state.customerInfo.firstMessage || 'N/A'}\n`;
    text += `- Entry Type: ${state.nature.toUpperCase()}\n`;
    text += `------------------------------------\n`;
    text += `LIECS-LM AUDIT (7 Dimensions):\n`;
    text += `- [L] Location: ${state.liecsmgData.L || 'EMPTY'}\n`;
    text += `- [I] Identity: ${state.liecsmgData.I || 'EMPTY'}\n`;
    text += `- [E] Experience: ${state.liecsmgData.E || 'EMPTY'}\n`;
    text += `- [C] Channel: ${state.liecsmgData.C || 'EMPTY'}\n`;
    text += `- [S] Stage: ${state.liecsmgData.S || 'EMPTY'}\n`;
    text += `- [M] Model Interest: ${state.liecsmgData.M || 'EMPTY'}\n`;
    text += `- [G] Language: ${state.liecsmgData.G || 'EMPTY'}\n`;
    text += `------------------------------------\n`;
    text += `INTENT DETECTION:\n`;
    text += `- Detected Language: ${detectLanguage(state.customerInfo.firstMessage).toUpperCase()}\n`;
    text += `- Detected Model: ${detectModel(state.customerInfo.firstMessage) || 'N/A'}\n`;
    text += `- OEM Intent: ${detectOEMIntent(state.customerInfo.firstMessage) ? 'YES' : 'NO'}\n`;
    text += `- Partner Intent: ${detectPartnerIntent(state.customerInfo.firstMessage) ? 'YES' : 'NO'}\n`;
    text += `- Support Intent: ${detectSupportIntent(state.customerInfo.firstMessage) ? 'YES' : 'NO'}\n`;
    text += `------------------------------------\n`;
    text += `CHAT TRACE LOG:\n`;
    state.history.forEach(line => text += line + `\n`);
    text += `====================================\n`;
    text += `RECOMMENDED AE: ${aeInfo.name} (${recommendedAE})\n`;
    text += `- Region: ${aeInfo.region}\n`;
    text += `- Languages: ${aeInfo.languages.join(', ')}\n`;
    text += `- Specialties: ${aeInfo.specialties.join(', ')}\n`;
    text += `- Email: ${aeInfo.email}\n`;
    text += `- WhatsApp: ${aeInfo.wa}\n`;
    text += `====================================\n`;
    text += `ASSIGNED BY SDR | TO AE: ${aeName}\n`;
    return text;
  }, [state, getRecommendedAE]);

  // Auto-detect nature based on first message
  const autoDetectNature = useCallback((message: string): NatureType => {
    const lower = message.toLowerCase();
    
    if (detectSupportIntent(message) && (lower.includes('bought') || lower.includes('purchased') || lower.includes('own') || lower.includes('my unit') || lower.includes('firmware') || lower.includes('update'))) {
      return 'support';
    }
    if (detectOEMIntent(message)) return 'oem';
    if (detectPartnerIntent(message)) return 'partner';
    if (lower.includes('distributor') && lower.includes('application')) return 'high';
    if (lower.includes('download') && lower.includes('catalog')) return 'interested';
    if (lower.includes('interest') || lower.includes('price') || lower.includes('cost')) return 'eval';
    return 'grey';
  }, []);

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
    getRecommendedAE,
    generateBriefing,
    autoDetectNature
  };
}
