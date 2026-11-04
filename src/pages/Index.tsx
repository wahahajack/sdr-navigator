import Header from '@/components/sdr/Header';
import IntelligenceAudit from '@/components/sdr/IntelligenceAudit';
import ChatSimulation from '@/components/sdr/ChatSimulation';
import IntelligencePanel from '@/components/sdr/IntelligencePanel';
import { useSDRState } from '@/hooks/useSDRState';

const Index = () => {
  const {
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
    generateBriefing
  } = useSDRState();

  const dialogue = getCurrentDialogue();
  const script = getScript(dialogue);
  const puzzleCount = getPuzzleCount();
  const grade = getGrade();
  const recommendedAE = getRecommendedAE();

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans text-[13px]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-3 grid grid-cols-12 gap-4">
        {/* Main Panel - Intelligence Audit + Chat */}
        <section className="col-span-12 lg:col-span-9 flex flex-col space-y-3">
          <IntelligenceAudit
            nature={state.nature}
            customerInfo={state.customerInfo}
            liecsmgData={state.liecsmgData}
            selectedPuzzle={state.selectedPuzzle}
            puzzleCount={puzzleCount}
            onNatureChange={updateNature}
            onCustomerInfoChange={updateCustomerInfo}
            onLIECSChange={updateLIECSField}
            onSelectPuzzle={selectPuzzle}
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
          recommendedAE={recommendedAE}
          customerLocation={state.liecsmgData.L}
        />
      </main>
    </div>
  );
};

export default Index;
