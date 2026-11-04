import { useEffect } from 'react';
import { NatureType, PuzzleKey, PUZZLE_META, detectLanguage, detectModel, detectOEMIntent, detectPartnerIntent, detectSupportIntent } from '@/lib/sdrData';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomerInfo, LIECSMGData } from '@/hooks/useSDRState';
import { Mail, MessageCircle, Globe, Cpu } from 'lucide-react';

interface IntelligenceAuditProps {
  nature: NatureType;
  customerInfo: CustomerInfo;
  liecsmgData: LIECSMGData;
  selectedPuzzle: PuzzleKey | null;
  puzzleCount: number;
  onNatureChange: (nature: NatureType) => void;
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string | ('email' | 'whatsapp')[]) => void;
  onLIECSChange: (key: PuzzleKey, value: string) => void;
  onSelectPuzzle: (key: PuzzleKey | null) => void;
}

const NATURE_OPTIONS: { id: NatureType; label: string; grade: string; gradeColor: string; icon: string }[] = [
  { id: 'high', label: 'Distributor App', grade: 'A', gradeColor: 'bg-primary text-primary-foreground', icon: 'A' },
  { id: 'interested', label: 'Catalog DL', grade: 'B', gradeColor: 'bg-accent text-accent-foreground', icon: 'B' },
  { id: 'eval', label: 'Direct WA', grade: 'C', gradeColor: 'bg-warning text-warning-foreground', icon: 'C' },
  { id: 'grey', label: 'Fragmented', grade: 'G', gradeColor: 'bg-muted text-muted-foreground', icon: 'G' },
  { id: 'oem', label: 'OEM/ODM', grade: 'S', gradeColor: 'bg-destructive text-destructive-foreground', icon: 'S' },
  { id: 'partner', label: 'Regional Partner', grade: 'A+', gradeColor: 'bg-primary text-primary-foreground', icon: 'A+' },
  { id: 'support', label: 'Post-Sale', grade: 'C', gradeColor: 'bg-muted text-muted-foreground', icon: 'C' }
];

const PUZZLE_KEYS: PuzzleKey[] = ['L', 'I', 'E', 'C', 'S', 'M', 'G'];

const LIECS_PLACEHOLDERS: Record<PuzzleKey, string> = {
  L: 'e.g. Brazil, Germany, Turkey...',
  I: 'e.g. Distributor, Installer, OEM...',
  E: 'e.g. 5 years in car electronics...',
  C: 'e.g. Physical shops, Online, Both...',
  S: 'e.g. Replacing brand, Expanding...',
  M: 'e.g. CC4 Pro, CC3 2K, Car Audio...',
  G: 'e.g. EN, ES, PT, TR, RU...'
};

const IntelligenceAudit = ({
  nature,
  customerInfo,
  liecsmgData,
  selectedPuzzle,
  puzzleCount,
  onNatureChange,
  onCustomerInfoChange,
  onLIECSChange,
  onSelectPuzzle
}: IntelligenceAuditProps) => {
  const selectedMeta = selectedPuzzle ? PUZZLE_META[selectedPuzzle] : null;

  const toggleChannel = (channel: 'email' | 'whatsapp') => {
    const current = customerInfo.channels;
    if (current.includes(channel)) {
      onCustomerInfoChange('channels', current.filter(c => c !== channel));
    } else {
      onCustomerInfoChange('channels', [...current, channel]);
    }
  };

  // Enhanced auto-detect based on first message content
  useEffect(() => {
    const msg = customerInfo.firstMessage.toLowerCase();
    if (!msg) return;
    
    // Auto-detect language
    const detectedLang = detectLanguage(customerInfo.firstMessage);
    if (detectedLang !== 'en' && !liecsmgData.G) {
      onLIECSChange('G', detectedLang.toUpperCase());
    }
    
    // Auto-detect model
    const detectedModel = detectModel(customerInfo.firstMessage);
    if (detectedModel && !liecsmgData.M) {
      onLIECSChange('M', detectedModel);
    }
    
    // Auto-detect nature
    if (detectSupportIntent(customerInfo.firstMessage) && (msg.includes('bought') || msg.includes('purchased') || msg.includes('my unit') || msg.includes('firmware') || msg.includes('update') || msg.includes('install') || msg.includes('problem'))) {
      onNatureChange('support');
    } else if (detectOEMIntent(customerInfo.firstMessage)) {
      onNatureChange('oem');
    } else if (detectPartnerIntent(customerInfo.firstMessage)) {
      onNatureChange('partner');
    } else if (msg.includes('distributor') && msg.includes('application')) {
      onNatureChange('high');
    } else if (msg.includes('download') && msg.includes('catalog')) {
      onNatureChange('interested');
    } else if (msg.includes('interest') || msg.includes('price') || msg.includes('cost') || msg.includes('pantalla') || msg.includes('fiyat') || msg.includes('цена')) {
      onNatureChange('eval');
    }
  }, [customerInfo.firstMessage]);

  // Auto-extract location from message
  useEffect(() => {
    if (liecsmgData.L) return;
    const msg = customerInfo.firstMessage;
    const locationMatches = [
      'Turkey', 'Russia', 'Brazil', 'Mexico', 'Spain', 'Germany', 'France', 'Italy', 'UK', 'USA', 'Canada',
      'Colombia', 'Argentina', 'Chile', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay',
      'Portugal', 'Ukraine', 'Kazakhstan', 'Uzbekistan', 'Georgia', 'Azerbaijan', 'Belarus',
      'Saudi Arabia', 'UAE', 'Kuwait', 'Iraq', 'Jordan', 'Egypt', 'Morocco', 'Algeria', 'Tunisia',
      'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Togo', 'Indonesia', 'Malaysia', 'Thailand',
      'Philippines', 'Vietnam', 'Singapore', 'Poland', 'Netherlands', 'Belgium', 'Sweden', 'Norway',
      'Denmark', 'Finland', 'Czech Republic', 'Hungary', 'Romania', 'Greece', 'Croatia', 'Serbia',
      'Bulgaria', 'Slovenia', 'Latvia', 'Lithuania', 'Estonia', 'Ireland', 'Switzerland', 'Austria'
    ];
    
    for (const loc of locationMatches) {
      const regex = new RegExp(`\\b${loc}\\b`, 'i');
      if (regex.test(msg)) {
        onLIECSChange('L', loc);
        break;
      }
    }
  }, [customerInfo.firstMessage, liecsmgData.L]);

  return (
    <div className="sdr-panel flex-none space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="sdr-label-accent">01. Lead Intelligence Audit</h2>
        <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">
          LIECS-LM: {puzzleCount}/7
        </span>
      </div>

      {/* Auto-Detection Banner */}
      {(detectLanguage(customerInfo.firstMessage) !== 'en' || detectModel(customerInfo.firstMessage) || detectOEMIntent(customerInfo.firstMessage)) && customerInfo.firstMessage && (
        <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg space-y-1">
          <p className="text-[8px] font-black text-accent uppercase tracking-widest">Auto-Detected Signals</p>
          <div className="flex flex-wrap gap-1">
            {detectLanguage(customerInfo.firstMessage) !== 'en' && (
              <span className="text-[8px] px-1.5 py-0.5 bg-accent/20 text-accent rounded font-bold uppercase">
                <Globe className="w-3 h-3 inline mr-1" />
                Lang: {detectLanguage(customerInfo.firstMessage).toUpperCase()}
              </span>
            )}
            {detectModel(customerInfo.firstMessage) && (
              <span className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-bold uppercase">
                <Cpu className="w-3 h-3 inline mr-1" />
                Model: {detectModel(customerInfo.firstMessage)}
              </span>
            )}
            {detectOEMIntent(customerInfo.firstMessage) && (
              <span className="text-[8px] px-1.5 py-0.5 bg-destructive/20 text-destructive rounded font-bold uppercase">
                OEM Intent Detected
              </span>
            )}
            {detectPartnerIntent(customerInfo.firstMessage) && (
              <span className="text-[8px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-bold uppercase">
                Partner Intent Detected
              </span>
            )}
          </div>
        </div>
      )}

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

      {/* Communication Channel Selection */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Communication Channel</p>
        <div className="flex gap-2">
          <button
            onClick={() => toggleChannel('email')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              customerInfo.channels.includes('email')
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-accent/50 text-muted-foreground'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Email</span>
          </button>
          <button
            onClick={() => toggleChannel('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              customerInfo.channels.includes('whatsapp')
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-accent/50 text-muted-foreground'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Customer First Message */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Customer's First Message</p>
        <Textarea
          value={customerInfo.firstMessage}
          onChange={(e) => onCustomerInfoChange('firstMessage', e.target.value)}
          placeholder="Paste or type the customer's initial message here..."
          className="w-full px-2 py-1.5 bg-muted/20 border-border text-[10px] min-h-[60px] resize-none"
        />
      </div>

      {/* LIECS-LM Puzzle Tiles with Input Fields */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">LIECS-LM Qualification (7 Dimensions)</p>
        <div className="grid grid-cols-7 gap-2">
          {PUZZLE_KEYS.map((key) => {
            const isFilled = liecsmgData[key].trim() !== '';
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
                  value={liecsmgData[key]}
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

      {/* Entry Type - Horizontal (below LIECS) */}
      <div className="space-y-1.5">
        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Entry Type (Nature)</p>
        <div className="flex gap-2 flex-wrap">
          {NATURE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onNatureChange(option.id)}
              className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg border-2 transition-all text-center ${
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
    </div>
  );
};

export default IntelligenceAudit;
