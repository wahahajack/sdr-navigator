import { PuzzleKey, PUZZLE_META } from '@/lib/sdrData';
import { Checkbox } from '@/components/ui/checkbox';

interface PuzzleAuditProps {
  puzzles: Record<PuzzleKey, boolean>;
  selectedPuzzle: PuzzleKey | null;
  onToggle: (key: PuzzleKey, value: boolean) => void;
  onSelect: (key: PuzzleKey | null) => void;
  puzzleCount: number;
}

const PUZZLE_KEYS: PuzzleKey[] = ['L', 'I', 'E', 'C', 'S'];

const PuzzleAudit = ({ 
  puzzles, 
  selectedPuzzle, 
  onToggle, 
  onSelect,
  puzzleCount 
}: PuzzleAuditProps) => {
  const selectedMeta = selectedPuzzle ? PUZZLE_META[selectedPuzzle] : null;

  return (
    <div className="sdr-panel flex-none">
      <div className="flex justify-between items-center mb-1.5">
        <h2 className="sdr-label-accent">03. LIECS Intelligence Audit</h2>
        <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase border border-primary/20">
          Progress: {puzzleCount}/5
        </span>
      </div>
      
      <div className="grid grid-cols-5 gap-1.5">
        {PUZZLE_KEYS.map((key) => (
          <div
            key={key}
            onClick={() => onSelect(selectedPuzzle === key ? null : key)}
            className={`puzzle-node ${puzzles[key] ? 'active' : ''} ${selectedPuzzle === key ? 'selected' : ''}`}
          >
            <Checkbox
              checked={puzzles[key]}
              onCheckedChange={(checked) => {
                onToggle(key, checked as boolean);
              }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0.5 left-0.5 w-3 h-3"
            />
            <div className="text-[11px] font-black text-foreground uppercase">{key}</div>
            <div className="text-[6px] text-muted-foreground uppercase leading-none mt-0.5 italic font-bold">
              {PUZZLE_META[key].title}
            </div>
          </div>
        ))}
      </div>

      {selectedMeta && (
        <div className="mt-2 p-2 bg-accent/10 border border-accent/20 rounded-lg">
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

export default PuzzleAudit;
