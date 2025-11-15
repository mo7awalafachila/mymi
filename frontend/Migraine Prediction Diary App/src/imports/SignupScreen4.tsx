interface GenderButtonProps {
  label: string;
  onClick: () => void;
  isSelected: boolean;
  position: 'left' | 'right' | 'center';
}

function KnobBase() {
  return <div className="h-[95px] shrink-0 w-[191px]" data-name="knob-base" />;
}

function Icon() {
  return <div className="shrink-0 size-[32px]" data-name="icon" />;
}

function KnobElevation({ isSelected }: { isSelected: boolean }) {
  return (
    <div 
      className={`basis-0 ${isSelected ? 'bg-[#d4b5af]' : 'bg-[#e5cbcb]'} grow h-full min-h-px min-w-px relative rounded-[1e+11px] shadow-[8px_8px_16px_0px_#c9d9e8,-8px_-8px_16px_0px_#ffffff] shrink-0 transition-colors`} 
      data-name="knob-elevation"
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[24px] relative size-full">
          <Icon />
        </div>
      </div>
    </div>
  );
}

function NeumorphismButton({ onClick, isSelected, left, top }: { onClick: () => void; isSelected: boolean; left: string; top: string }) {
  return (
    <button
      onClick={onClick}
      className={`absolute box-border content-stretch flex gap-[8px] h-[95px] items-start ${left} pb-[24px] pl-[22px] pr-[24px] pt-[22px] ${top} w-[191px] cursor-pointer hover:opacity-90 transition-opacity`}
      data-name="Neumorphism-Button"
    >
      <KnobBase />
      <KnobElevation isSelected={isSelected} />
    </button>
  );
}

function GenderButton({ label, onClick, isSelected, position }: GenderButtonProps) {
  const positions = {
    left: { left: 'left-[20px]', top: 'top-[330px]' },
    right: { left: 'left-[192px]', top: 'top-[331px]' },
    center: { left: 'left-[101px]', top: 'top-[426px]' }
  };

  const labelPositions = {
    left: 'left-[115.75px] top-[379.91px]',
    right: 'left-[286.65px] top-[378.5px]',
    center: 'left-[195.5px] top-[472px]'
  };

  const labelHeights = {
    left: 'h-[17.813px]',
    right: 'h-[17.813px]',
    center: 'h-[16px]'
  };

  const labelWidths = {
    left: 'w-[95.5px]',
    right: 'w-[95.5px]',
    center: 'w-[95px]'
  };

  return (
    <div className={`absolute contents ${positions[position].left} ${positions[position].top}`}>
      <NeumorphismButton 
        onClick={onClick} 
        isSelected={isSelected}
        left={positions[position].left}
        top={positions[position].top}
      />
      <div 
        className={`absolute flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold ${labelHeights[position]} justify-center leading-[0] ${labelPositions[position]} text-[#716868] text-[20px] text-center translate-x-[-50%] translate-y-[-50%] ${labelWidths[position]} pointer-events-none`}
      >
        <p className="leading-[1.2]">{label}</p>
      </div>
    </div>
  );
}

interface SignupScreen4Props {
  onContinue: () => void;
  gender: string;
  setGender: (gender: string) => void;
}

export default function SignupScreen({ onContinue, gender, setGender }: SignupScreen4Props) {
  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
    // Automatically proceed to next step after a brief delay
    setTimeout(() => {
      onContinue();
    }, 300);
  };

  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="signup screen 4">
      <div className="absolute flex flex-col font-['Jost:Medium',sans-serif] font-medium justify-center leading-[0] left-[196.5px] text-[20px] text-black text-center text-nowrap top-[265px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Enter gender:</p>
      </div>
      <GenderButton 
        label="Female" 
        onClick={() => handleGenderSelect('female')}
        isSelected={gender === 'female'}
        position="left"
      />
      <GenderButton 
        label="Male" 
        onClick={() => handleGenderSelect('male')}
        isSelected={gender === 'male'}
        position="right"
      />
      <GenderButton 
        label="prefer not to say" 
        onClick={() => handleGenderSelect('prefer not to say')}
        isSelected={gender === 'prefer not to say'}
        position="center"
      />
    </div>
  );
}
