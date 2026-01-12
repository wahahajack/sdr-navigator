import { ConversationNode, SPECIAL_SCRIPTS, Reply } from '@/lib/sdrData';
import { toast } from 'sonner';

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

  const handleScriptClick = () => {
    copyToClipboard(script);
    if (!script.includes('[SDR Step')) {
      onAddHistory(`[SDR Step ${round}]: ${script}`);
    }
  };

  const roundDots = Array(4).fill(null).map((_, i) => (
    <span 
      key={i} 
      className={`w-1.5 h-1.5 rounded-full ${i < round ? 'bg-primary' : 'bg-muted/30'}`}
    />
  ));

  return (
    <div className="sdr-panel flex-1 flex flex-col overflow-hidden relative p-0">
      {/* Header */}
      <div className="px-5 py-2.5 bg-muted/10 border-b border-border flex justify-between items-center">
        <h2 className="sdr-label italic">04. WhatsApp Chat Simulation</h2>
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
        <div className="p-2.5 bg-card border-b border-border shadow-sm flex justify-between items-start">
          <div>
            <p className="text-[8px] font-bold text-accent uppercase mb-0.5 tracking-widest">
              Internal Mindset
            </p>
            <p className="text-[11px] text-foreground font-medium italic">
              {dialogue?.thinking}
            </p>
          </div>
          <div className="flex flex-col space-y-1">
            <button 
              onClick={() => copySpecial('No Response')}
              className="text-[8px] bg-warning/20 text-warning px-2 py-0.5 rounded font-black border border-warning/30 hover:bg-warning/30 transition-all uppercase"
            >
              No Reply Follow-up
            </button>
            <button 
              onClick={() => copySpecial('Timezone')}
              className="text-[8px] bg-accent/20 text-accent px-2 py-0.5 rounded font-black border border-accent/30 hover:bg-accent/30 transition-all uppercase"
            >
              Timezone Alert
            </button>
          </div>
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
          {dialogue?.replies && dialogue.replies.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-[9px] font-bold text-muted-foreground uppercase px-1 tracking-widest">
                Branching: Customer Responses (4 Slots)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {dialogue.replies.map((reply, index) => (
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
              </div>
            </div>
          )}
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
