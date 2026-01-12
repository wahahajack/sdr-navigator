import Header from '@/components/sdr/Header';
import LeadNaturePanel from '@/components/sdr/LeadNaturePanel';
import PuzzleAudit from '@/components/sdr/PuzzleAudit';
import ChatSimulation from '@/components/sdr/ChatSimulation';
import IntelligencePanel from '@/components/sdr/IntelligencePanel';
import { useSDRState } from '@/hooks/useSDRState';

const Index = () => {
  const {
    state,
    updateNature,
    togglePuzzle,
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
  } = useSDRState();

  const dialogue = getCurrentDialogue();
  const script = getScript(dialogue);
  const puzzleCount = getPuzzleCount();
  const grade = getGrade();

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans text-[13px]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-3 grid grid-cols-12 gap-4">
        {/* Left Panel - Lead Nature */}
        <LeadNaturePanel
          nature={state.nature}
          customerInfo={state.customerInfo}
          onNatureChange={updateNature}
          onCustomerInfoChange={updateCustomerInfo}
        />

        {/* Center Panel - Puzzle & Chat */}
        <section className="col-span-12 md:col-span-9 lg:col-span-7 flex flex-col space-y-3 overflow-hidden">
          <PuzzleAudit
            puzzles={state.puzzles}
            selectedPuzzle={state.selectedPuzzle}
            onToggle={togglePuzzle}
            onSelect={selectPuzzle}
            puzzleCount={puzzleCount}
          />
          
          <ChatSimulation
            round={state.round}
            dialogue={dialogue}
            script={script}
            onReply={handleReply}
            onAddHistory={addToHistory}
            onReset={resetFlow}
            onConfirm={confirmFlow}
          />
        </section>

        {/* Right Panel - Intelligence */}
        <IntelligencePanel
          confirmed={state.confirmed}
          puzzleCount={puzzleCount}
          grade={grade}
          generateBriefing={generateBriefing}
        />
      </main>
    </div>
  );
};

export default Index;
