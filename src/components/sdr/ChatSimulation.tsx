import { useState } from 'react';
import { ConversationNode, SPECIAL_SCRIPTS, Reply } from '@/lib/sdrData';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Clock, MessageSquareX } from 'lucide-react';

interface ChatSimulationProps {
  round: number;
  dialogue: ConversationNode | null;
  script: string;
  onReply: (next: string) => void;
  onAddHistory: (entry: string) => void;
  onReset: () => void;
  onConfirm: () => void;
}

const ChatSimulation = ({
  round,
  dialogue,
  script,
  onReply,
  onAddHistory,
  onReset,
  onConfirm
}: ChatSimulationProps) => {
  const [customResponse, setCustomResponse] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const copySpecial = (type: string) => {
    const text = SPECIAL_SCRIPTS[type]?.replace('[Name]', '[Customer Name]') || '';
    copyToClipboard(text);
  };

  const handleReplyClick = (reply: Reply) => {
    onAddHistory(`[Customer]: ${reply.text}`);
    onReply(reply.next);
  };

  const handleCustomReply = () => {
    if (customResponse.trim()) {
      onAddHistory(`[Customer]: ${customResponse}`);
      setCustomResponse('');
      // Continue to next generic branch
      onReply('custom_response');
    }
  };

  const handleScriptClick = () => {
    copyToClipboard(script);
    // Always log SDR message to history
    onAddHistory(`[SDR]: ${script}`);
  };

  const handleNoReplyFollowup = () => {
    const text = SPECIAL_SCRIPTS['No Response']?.replace('[Name]', '[Customer Name]') || '';
    copyToClipboard(text);
    onAddHistory(`[SDR - No Reply Follow-up]: ${text}`);
    toast.success('No Reply Follow-up script copied & logged');
  };

  const handleTimezoneAlert = () => {
    const text = SPECIAL_SCRIPTS['Timezone']?.replace('[Name]', '[Customer Name]') || '';
    copyToClipboard(text);
    onAddHistory(`[SDR - Timezone Alert]: ${text}`);
    toast.info('⏰ Timezone Alert: Reminder set - follow up when AE is online');
  };

  const roundDots = Array(4).fill(null).map((_, i) => (
    <span 
      key={i} 
      className={`w-1.5 h-1.5 rounded-full ${i < round ? 'bg-primary' : 'bg-muted/30'}`}
    />
  ));

  // Show only first 3 preset replies, 4th slot is for custom input
  const presetReplies = dialogue?.replies?.slice(0, 3) || [];

  return (
    <div className="sdr-panel flex flex-col relative p-0 min-h-[500px]">
      {/* Header */}
      <div className="px-5 py-2.5 bg-muted/10 border-b border-border flex justify-between items-center">
        <h2 className="sdr-label italic">02. WhatsApp Chat Simulation</h2>
        <div className="flex items-center space-x-3">
          <span className="text-[9px] font-bold text-muted-foreground uppercase">
            Step <span>{round}</span>
          </span>
          <div className="flex space-x-1">
            {roundDots}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-muted/5">
        {/* Thinking Area */}
        <div className="p-2.5 bg-card border-b border-border shadow-sm">
          <p className="text-[8px] font-bold text-accent uppercase mb-0.5 tracking-widest">
            Internal Mindset
          </p>
          <p className="text-[11px] text-foreground font-medium italic">
            {dialogue?.thinking}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto custom-scroll space-y-5">
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-muted-foreground uppercase px-1 tracking-tighter">
              SDR Script (Automation Mapping Ready)
            </p>
            <div className="flex justify-start">
              <div 
                onClick={handleScriptClick}
                className="wa-bubble"
              >
                <p className="text-[13px] text-foreground font-medium leading-relaxed">
                  {script}
                </p>
                <span className="crm-tag">
                  {dialogue?.tag || 'CRM: LOG_ONLY'}
                </span>
                <span className="absolute -right-2 -top-2 bg-primary text-primary-foreground text-[7px] px-1.5 py-0.5 rounded shadow-sm font-bold uppercase tracking-widest">
                  Copy
                </span>
              </div>
            </div>
          </div>

          {/* Response Options */}
          {(presetReplies.length > 0 || dialogue?.replies) && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-[9px] font-bold text-muted-foreground uppercase px-1 tracking-widest">
                Branching: Customer Responses (4 Slots)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {presetReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleReplyClick(reply)}
                    className="response-btn"
                  >
                    <span className="font-bold text-foreground leading-tight">
                      "{reply.text}"
                    </span>
                    <span className="text-[7px] text-accent font-black uppercase mt-1 tracking-tighter">
                      Logic Branch &gt;
                    </span>
                  </button>
                ))}
                {/* Custom Input Slot */}
                <div className="response-btn flex flex-col items-stretch p-2">
                  <Input
                    type="text"
                    value={customResponse}
                    onChange={(e) => setCustomResponse(e.target.value)}
                    placeholder="Type custom response..."
                    className="w-full px-2 py-1 bg-card border-border text-[10px] h-auto mb-1.5"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCustomReply();
                    }}
                  />
                  <button
                    onClick={handleCustomReply}
                    disabled={!customResponse.trim()}
                    className="text-[8px] text-accent font-black uppercase tracking-tighter hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Custom &gt;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - No Reply & Timezone */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <button 
              onClick={handleNoReplyFollowup}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-warning/20 text-warning rounded-lg font-black border border-warning/30 hover:bg-warning/30 transition-all"
            >
              <MessageSquareX className="w-4 h-4" />
              <span className="text-[9px] uppercase">No Reply Follow-up</span>
            </button>
            <button 
              onClick={handleTimezoneAlert}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-accent/20 text-accent rounded-lg font-black border border-accent/30 hover:bg-accent/30 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span className="text-[9px] uppercase">Timezone Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-card border-t border-border flex justify-between items-center shadow-inner">
        <button 
          onClick={onReset}
          className="text-[9px] text-muted-foreground hover:text-destructive font-bold uppercase transition-colors"
        >
          Clear Simulation
        </button>
        <button 
          onClick={onConfirm}
          className="btn-confirm bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest transition-all shadow-lg"
        >
          End & Generate Final Intelligence Pack
        </button>
      </div>
    </div>
  );
};

export default ChatSimulation;
