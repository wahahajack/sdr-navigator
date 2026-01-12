import { NatureType, PuzzleKey, PUZZLE_META } from '@/lib/sdrData';
import { Input } from '@/components/ui/input';
import { CustomerInfo, LIECSData } from '@/hooks/useSDRState';

interface IntelligenceAuditProps {
  nature: NatureType;
  customerInfo: CustomerInfo;
  liecsData: LIECSData;
  selectedPuzzle: PuzzleKey | null;
  puzzleCount: number;
  onNatureChange: (nature: NatureType) => void;
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void;
  onLIECSChange: (key: PuzzleKey, value: string) => void;
  onSelectPuzzle: (key: PuzzleKey | null) => void;
}

const NATURE_OPTIONS: { id: NatureType; label: string; grade: string; gradeColor: string }[] = [
  { id: 'high', label: 'Distributor App', grade: 'A', gradeColor: 'bg-primary text-primary-foreground' },
  { id: 'interested', label: 'Catalog DL', grade: 'B', gradeColor: 'bg-accent text-accent-foreground' },
  { id: 'eval', label: 'Direct WA', grade: 'C', gradeColor: 'bg-warning text-warning-foreground' },
  { id: 'grey', label: 'Fragmented', grade: 'G', gradeColor: 'bg-muted text-muted-foreground' }
];

const PUZZLE_KEYS: PuzzleKey[] = ['L', 'I', 'E', 'C', 'S'];

const LIECS_PLACEHOLDERS: Record<PuzzleKey, string> = {
  L: 'e.g. Brazil, Germany, USA...',
  I: 'e.g. Distributor, Installer, Retailer...',
  E: 'e.g. 5 years in car electronics...',
  C: 'e.g. Physical shops, Online, Both...',
  S: 'e.g. Replacing brand, Expanding catalog...'
};

const IntelligenceAudit = ({
  nature,
  customerInfo,
  liecsData,
  selectedPuzzle,
  puzzleCount,
  onNatureChange,
  onCustomerInfoChange,
  onLIECSChange,
  onSelectPuzzle
}: IntelligenceAuditProps) => {
  const selectedMeta = selectedPuzzle ? PUZZLE_META[selectedPuzzle] : null;

  return (
    <div className="sdr-panel flex-none space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="sdr-label-accent">01. LIECS Intelligence Audit</h2>
        <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">
          LIECS: {puzzleCount}/5
        </span>
      </div>

      {/* Basic Contact Info - 4 columns */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Contact Information</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="space-y-1">
            <label className="text-[7px] font-bold text-muted-foreground uppercase">Name</label>
            <Input
              type="text"
              value={customerInfo.name}
              onChange={(e) => onCustomerInfoChange('name', e.target.value)}
              placeholder="John Smith"
              className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] h-auto"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[7px] font-bold text-muted-foreground uppercase">Company</label>
            <Input
              type="text"
              value={customerInfo.company}
              onChange={(e) => onCustomerInfoChange('company', e.target.value)}
              placeholder="ABC Motors Ltd"
              className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] h-auto"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[7px] font-bold text-muted-foreground uppercase">Email</label>
            <Input
              type="email"
              value={customerInfo.email}
              onChange={(e) => onCustomerInfoChange('email', e.target.value)}
              placeholder="boss@shop.com"
              className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] h-auto"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[7px] font-bold text-muted-foreground uppercase">WhatsApp</label>
            <Input
              type="text"
              value={customerInfo.wa}
              onChange={(e) => onCustomerInfoChange('wa', e.target.value)}
              placeholder="+44 7700 900000"
              className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Lead Nature - Horizontal */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Entry Type</p>
        <div className="flex gap-2">
          {NATURE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onNatureChange(option.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg border-2 transition-all text-center ${
                nature === option.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <span className={`text-[7px] font-black px-1 py-0.5 rounded ${option.gradeColor}`}>
                {option.grade}
              </span>
              <div className={`text-[9px] font-bold uppercase mt-0.5 ${
                nature === option.id ? 'text-primary' : 'text-foreground'
              }`}>
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* LIECS Puzzle Tiles with Input Fields */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">LIECS Qualification</p>
        <div className="grid grid-cols-5 gap-2">
          {PUZZLE_KEYS.map((key) => {
            const isFilled = liecsData[key].trim() !== '';
            const isSelected = selectedPuzzle === key;
            
            return (
              <div
                key={key}
                onClick={() => onSelectPuzzle(isSelected ? null : key)}
                className={`puzzle-node p-2 ${isFilled ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-black text-foreground uppercase">{key}</span>
                  {isFilled && (
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  )}
                </div>
                <div className="text-[7px] text-muted-foreground uppercase font-bold mb-1.5">
                  {PUZZLE_META[key].title}
                </div>
                <Input
                  type="text"
                  value={liecsData[key]}
                  onChange={(e) => {
                    e.stopPropagation();
                    onLIECSChange(key, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={LIECS_PLACEHOLDERS[key]}
                  className="w-full px-1.5 py-1 bg-card border-border text-[8px] h-auto placeholder:text-[7px]"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Puzzle Detail */}
      {selectedMeta && (
        <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="border-r border-accent/20 pr-2">
              <p className="text-[8px] font-black text-accent uppercase mb-0.5">
                {selectedPuzzle} - {selectedMeta.title}
              </p>
              <p className="text-[10px] text-foreground font-bold italic leading-tight">
                {selectedMeta.question}
              </p>
            </div>
            <div className="pl-2">
              <p className="text-[8px] font-black text-muted-foreground uppercase mb-0.5 tracking-tighter">
                SDR Strategy
              </p>
              <p className="text-[9px] text-muted-foreground leading-tight font-medium">
                {selectedMeta.principle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceAudit;
