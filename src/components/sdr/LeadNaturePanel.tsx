import { NatureType } from '@/lib/sdrData';
import { Input } from '@/components/ui/input';

interface LeadNaturePanelProps {
  nature: NatureType;
  customerInfo: {
    email: string;
    wa: string;
    loc: string;
    iden: string;
  };
  onNatureChange: (nature: NatureType) => void;
  onCustomerInfoChange: (field: 'email' | 'wa' | 'loc' | 'iden', value: string) => void;
}

const NATURE_OPTIONS: { id: NatureType; label: string; grade: string; gradeColor: string }[] = [
  { id: 'high', label: 'Distributor App', grade: 'A-Class', gradeColor: 'bg-primary' },
  { id: 'interested', label: 'Catalog DL', grade: 'B-Class', gradeColor: 'bg-accent' },
  { id: 'eval', label: 'Direct WA', grade: 'C-Class', gradeColor: 'bg-warning' },
  { id: 'grey', label: 'Fragmented', grade: 'Grey', gradeColor: 'bg-[hsl(239,84%,67%)]' }
];

const LeadNaturePanel = ({ 
  nature, 
  customerInfo, 
  onNatureChange, 
  onCustomerInfoChange 
}: LeadNaturePanelProps) => {
  return (
    <section className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col space-y-3 pr-1">
      {/* Identity & Form Data */}
      <div className="sdr-panel">
        <h2 className="sdr-label-accent mb-2 italic">01. Identity & Form Data</h2>
        <div className="space-y-1.5">
          <Input
            type="text"
            value={customerInfo.email}
            onChange={(e) => onCustomerInfoChange('email', e.target.value)}
            placeholder="Email: boss@shop.com"
            className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] focus:ring-1 focus:ring-accent outline-none h-auto"
          />
          <Input
            type="text"
            value={customerInfo.wa}
            onChange={(e) => onCustomerInfoChange('wa', e.target.value)}
            placeholder="WhatsApp: +44..."
            className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] focus:ring-1 focus:ring-accent outline-none h-auto"
          />
          <div className="border-t border-border pt-1.5 mt-1.5">
            <p className="text-[8px] font-bold text-muted uppercase mb-1">Pre-filled (From Form)</p>
            <div className="grid grid-cols-1 gap-1">
              <Input
                type="text"
                value={customerInfo.loc}
                onChange={(e) => onCustomerInfoChange('loc', e.target.value)}
                placeholder="Form Loc: e.g. Brazil"
                className="w-full px-2 py-1 bg-muted/20 border-border/50 text-[9px] outline-none h-auto"
              />
              <Input
                type="text"
                value={customerInfo.iden}
                onChange={(e) => onCustomerInfoChange('iden', e.target.value)}
                placeholder="Form Identity: e.g. Installer"
                className="w-full px-2 py-1 bg-muted/20 border-border/50 text-[9px] outline-none h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lead Nature Selection */}
      <div className="sdr-panel">
        <h2 className="sdr-label-accent mb-2">02. Lead Nature</h2>
        <div className="space-y-1.5">
          {NATURE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onNatureChange(option.id)}
              className={`nature-btn ${nature === option.id ? 'active' : ''}`}
            >
              <span className={`grade-badge ${option.gradeColor}`}>
                {option.grade}
              </span>
              <div className={`font-bold text-[10px] mb-0.5 italic leading-tight uppercase ${
                nature === option.id ? 'text-primary' : 'text-foreground'
              }`}>
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SDR Iron Rules */}
      <div className="bg-secondary text-muted rounded-xl p-3 shadow-lg flex-1">
        <h3 className="text-primary text-[9px] font-black uppercase mb-2 flex items-center tracking-tighter">
          <span className="mr-2 text-xs">⚖️</span> SDR Iron Rules
        </h3>
        <ul className="text-[9px] space-y-2 leading-tight">
          <li>
            <span className="text-secondary-foreground font-bold uppercase">● ABC Grading:</span> 不要主观臆断，拼图决定成色。
          </li>
          <li>
            <span className="text-secondary-foreground font-bold uppercase">● No会议:</span> 除非A级且拼图全满，否则只推邮件。
          </li>
          <li>
            <span className="text-secondary-foreground font-bold uppercase">● Grey Branch:</span> 来源不明的统统转零售/自动化跟进。
          </li>
        </ul>
      </div>
    </section>
  );
};

export default LeadNaturePanel;
