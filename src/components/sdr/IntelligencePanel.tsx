import { useState, useEffect } from 'react';
import { AE_DATA, getRegionConfig } from '@/lib/sdrData';
import { toast } from 'sonner';
import { MapPin, Languages, Wrench } from 'lucide-react';

interface IntelligencePanelProps {
  confirmed: boolean;
  puzzleCount: number;
  grade: { grade: string; label: string; color: string };
  generateBriefing: (aeName: string) => string;
  recommendedAE?: string;
  customerLocation?: string;
}

const IntelligencePanel = ({
  confirmed,
  puzzleCount,
  grade,
  generateBriefing,
  recommendedAE = 'Leo',
  customerLocation = ''
}: IntelligencePanelProps) => {
  const [selectedAE, setSelectedAE] = useState(recommendedAE);
  const [briefing, setBriefing] = useState('');

  useEffect(() => {
    if (confirmed) {
      setBriefing(generateBriefing(selectedAE));
    }
  }, [confirmed, selectedAE, generateBriefing]);

  useEffect(() => {
    setSelectedAE(recommendedAE);
  }, [recommendedAE]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const sendToAE = () => {
    copyToClipboard(briefing);
    const aeInfo = AE_DATA[selectedAE];
    toast.success(`Intel sent to ${aeInfo.name} via WhatsApp & Email`, {
      description: `WA: ${aeInfo.wa} | Email: ${aeInfo.email}`
    });
  };

  const score = (puzzleCount / 7) * 100;
  
  const getGaugeColor = () => {
    if (puzzleCount >= 5) return 'stroke-primary';
    if (puzzleCount >= 3) return 'stroke-warning';
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

  const aeInfo = AE_DATA[selectedAE];
  const regionConfig = customerLocation ? getRegionConfig(customerLocation) : null;

  return (
    <section className="col-span-12 lg:col-span-3 flex flex-col space-y-3">
      <div className={`sdr-panel flex flex-col transition-all duration-500 relative ${confirmed ? 'confirmed-panel' : ''}`}>
        <h2 className="sdr-label-accent mb-3 border-b border-border pb-2">
          03. Intelligence & Execution
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
              {puzzleCount}/7
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
              Potential Grade (A/B/C/S)
            </p>
            <div className={`p-2.5 rounded-lg text-center font-black tracking-widest text-[10px] uppercase ${gradeStyles[grade.color as keyof typeof gradeStyles]}`}>
              {grade.label}
            </div>
          </div>

          {/* Recommended AE Card */}
          {customerLocation && (
            <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg space-y-1.5">
              <p className="text-[8px] font-black text-accent uppercase tracking-tighter flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Region Match: {customerLocation}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-black text-primary">
                  {AE_DATA[recommendedAE]?.name?.charAt(0) || 'L'}
                </div>
                <div>
                  <p className="text-[9px] font-bold text-foreground">{AE_DATA[recommendedAE]?.name}</p>
                  <p className="text-[7px] text-muted-foreground">{AE_DATA[recommendedAE]?.region}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {AE_DATA[recommendedAE]?.languages.map(lang => (
                  <span key={lang} className="text-[7px] px-1 py-0.5 bg-accent/20 text-accent rounded font-bold">
                    <Languages className="w-2 h-2 inline mr-0.5" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

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
                <option value="Sarah">Sarah - CIS / Eastern Europe / Turkey / MEA</option>
                <option value="Kevin">Kevin - Latin America / Iberia / Americas</option>
                <option value="Leo">Leo - APAC / Southeast Asia / Africa / Global English</option>
                <option value="Director">Michael Wang - Global Key Accounts / OEM Tier-1</option>
              </select>
              
              {aeInfo && (
                <div className="mt-1 p-1.5 bg-muted/10 rounded text-[7px] text-muted-foreground space-y-0.5">
                  <p className="flex items-center gap-1"><Wrench className="w-2 h-2" /> Specialties: {aeInfo.specialties.join(', ')}</p>
                  <p>WA: {aeInfo.wa}</p>
                  <p>Email: {aeInfo.email}</p>
                </div>
              )}
            </div>

            <div className="pt-1">
              <button 
                onClick={sendToAE}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black py-3 rounded-lg uppercase tracking-widest shadow-md active:scale-95 transition-all"
              >
                Send to AE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntelligencePanel;
