import { useState, useEffect } from 'react';
import { AE_DATA } from '@/lib/sdrData';
import { toast } from 'sonner';

interface IntelligencePanelProps {
  confirmed: boolean;
  puzzleCount: number;
  grade: { grade: string; label: string; color: string };
  generateBriefing: (aeName: string) => string;
}

const IntelligencePanel = ({
  confirmed,
  puzzleCount,
  grade,
  generateBriefing
}: IntelligencePanelProps) => {
  const [selectedAE, setSelectedAE] = useState('Sarah');
  const [briefing, setBriefing] = useState('');

  useEffect(() => {
    if (confirmed) {
      setBriefing(generateBriefing(selectedAE));
    }
  }, [confirmed, selectedAE, generateBriefing]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const shareBriefing = (method: 'WA' | 'Email') => {
    copyToClipboard(briefing);
    toast.success(`Intel ready for ${selectedAE} by ${method}`);
  };

  const score = (puzzleCount / 5) * 100;
  
  const getGaugeColor = () => {
    if (puzzleCount >= 4) return 'stroke-primary';
    if (puzzleCount >= 2) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const gradeStyles = {
    primary: confirmed 
      ? 'bg-primary text-primary-foreground shadow-lg' 
      : 'bg-primary/20 text-primary border border-primary/30',
    warning: confirmed 
      ? 'bg-warning text-warning-foreground shadow-lg' 
      : 'bg-warning/20 text-warning border border-warning/30',
    muted: 'bg-muted/20 text-muted-foreground border border-border'
  };

  return (
    <section className="col-span-12 lg:col-span-3 flex flex-col space-y-3">
      <div className={`sdr-panel flex flex-col transition-all duration-500 relative ${confirmed ? 'confirmed-panel' : ''}`}>
        <h2 className="sdr-label-accent mb-3 border-b border-border pb-2">
          05. Intelligence & Execution
        </h2>

        {/* Gauge */}
        <div className="relative w-full max-w-[280px] mx-auto h-[110px] mb-2">
          <svg className="w-full h-full" viewBox="0 0 100 60">
            {/* Background arc */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              stroke="hsl(var(--muted) / 0.3)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 55 A 40 40 0 0 1 90 55"
              fill="none"
              className={getGaugeColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 1.26} 126`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            <text x="50" y="45" textAnchor="middle" className="text-[12px] font-black fill-foreground">
              {puzzleCount}/5
            </text>
            <text x="50" y="55" textAnchor="middle" className="text-[6px] uppercase fill-muted-foreground font-bold">
              Qualified
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          {/* Grade Display */}
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1.5 tracking-tighter">
              Potential Grade (A/B/C)
            </p>
            <div className={`p-2.5 rounded-lg text-center font-black tracking-widest text-[10px] uppercase ${gradeStyles[grade.color as keyof typeof gradeStyles]}`}>
              {grade.label}
            </div>
          </div>

          {/* Handover Package */}
          <div className={`space-y-3 transition-all duration-500 ${confirmed ? '' : 'opacity-30 pointer-events-none'}`}>
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter flex justify-between">
                <span>Full Intelligence Briefing Pack</span>
                <button 
                  onClick={() => copyToClipboard(briefing)}
                  className="text-accent underline text-[8px] font-black"
                >
                  COPY PACK
                </button>
              </p>
              <div className="briefing-box text-foreground">
                {briefing || 'Waiting for confirmation...'}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">
                Assign BY Staff
              </p>
              <select
                value={selectedAE}
                onChange={(e) => setSelectedAE(e.target.value)}
                className="w-full p-2 bg-muted/20 border border-border rounded text-[10px] font-black focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="Sarah">Sarah - CIS / Europe</option>
                <option value="Kevin">Kevin - Americas / Global</option>
                <option value="Leo">Leo - APAC / MEA</option>
                <option value="Director">Sales Director (Exclusive/Key-Acct)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                onClick={() => shareBriefing('WA')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-[9px] font-black py-2.5 rounded-lg uppercase tracking-tighter shadow-md active:scale-95 transition-all"
              >
                Send BY WA
              </button>
              <button 
                onClick={() => shareBriefing('Email')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-[9px] font-black py-2.5 rounded-lg uppercase tracking-tighter shadow-md active:scale-95 transition-all"
              >
                Send BY Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligencePanel;
