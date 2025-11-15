import { useState } from 'react';
import svgPaths from "./svg-cwr9sxa38a";

function KnobBase() {
  return <div className="h-[184px] shrink-0 w-[316px]" data-name="knob-base" />;
}

function Icon() {
  return <div className="shrink-0 size-[32px]" data-name="icon" />;
}

function KnobElevation() {
  return (
    <div className="basis-0 bg-[#e5cbcb] grow h-full min-h-px min-w-px relative rounded-[1e+11px] shadow-[8px_8px_16px_0px_#c9d9e8,-8px_-8px_16px_0px_#ffffff] shrink-0" data-name="knob-elevation">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[24px] relative size-full">
          <Icon />
        </div>
      </div>
    </div>
  );
}

function NeumorphismButton() {
  return (
    <div className="absolute box-border content-stretch flex gap-[8px] h-[184px] items-start left-[39px] pb-[24px] pl-[22px] pr-[24px] pt-[22px] top-[334px] w-[316.152px]" data-name="Neumorphism-Button">
      <KnobBase />
      <KnobElevation />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[39px] top-[334px]">
      <NeumorphismButton />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[39px] top-[334px]">
      <Group />
      <div className="absolute flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold h-[34.5px] justify-center leading-[0] left-[195.66px] text-[#716868] text-[20px] text-center top-[426px] translate-x-[-50%] translate-y-[-50%] w-[158.076px] pointer-events-none">
        <p className="leading-[1.2]">Log episode</p>
      </div>
    </div>
  );
}

function FiRrArrowRight({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="absolute h-[36px] left-[176px] top-[749px] w-[40px] cursor-pointer hover:opacity-70 transition-opacity" 
      data-name="fi-rr-arrow-right"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 36">
        <g clipPath="url(#clip0_1_492)" id="fi-rr-arrow-right">
          <path d={svgPaths.p54e65b0} fill="var(--fill-0, #716868)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_492">
            <rect fill="white" height="36" width="40" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

interface ButtonScreenProps {
  onContinue: () => void;
}

export default function ButtonScreen({ onContinue }: ButtonScreenProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      onContinue();
    }
  };

  return (
    <div 
      className="bg-[#eee0dd] relative size-full" 
      data-name="button screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Group1 />
      <div className="absolute left-[168px] size-[12px] top-[823px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #BE9E97)" id="Ellipse 3" r="6" />
        </svg>
      </div>
      <div className="absolute left-[212px] size-[12px] top-[823px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <circle cx="6" cy="6" fill="var(--fill-0, #E6CAC4)" id="Ellipse 4" r="6" />
        </svg>
      </div>
      <FiRrArrowRight onClick={onContinue} />
    </div>
  );
}