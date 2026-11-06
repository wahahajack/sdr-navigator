const Header = () => {
  return (
    <header className="sdr-header shadow-2xl z-20 shrink-0">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg shadow-inner italic text-primary-foreground">
            T
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight uppercase tracking-widest text-header-foreground">
              Google Ads <span className="text-primary font-black tracking-tighter">SDR</span> Global Command V7.0
            </h1>
            <p className="text-[8px] text-muted-foreground font-bold tracking-wider">
              LIECS-LM Framework | 7 Dimensions | Multi-Language | Model-Aware
            </p>
          </div>
        </div>
        <div className="hidden lg:flex space-x-6 text-[9px] text-muted uppercase tracking-widest font-bold items-center">
          <div className="flex items-center space-x-2 border-r border-muted/30 pr-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            <span className="text-muted">Intent Mapping</span>
          </div>
          <div className="flex items-center space-x-2 border-r border-muted/30 pr-4">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            <span className="text-muted">Language Detection</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-warning rounded-full"></span>
            <span className="text-muted">Model Routing</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
