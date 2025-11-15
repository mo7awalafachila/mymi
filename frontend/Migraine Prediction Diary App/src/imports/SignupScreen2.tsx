interface KnobElevationProps {
  onClick: () => void;
}

function KnobElevation({ onClick }: KnobElevationProps) {
  return (
    <button 
      onClick={onClick}
      className="absolute bg-[#e6cac4] box-border content-stretch flex gap-[8px] h-[54px] items-center justify-center left-[74px] p-[24px] rounded-[18px] top-[671px] w-[245px] cursor-pointer hover:opacity-90 transition-opacity" 
      data-name="knob-elevation"
    >
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(78,69,67,0.6)] border-solid inset-0 pointer-events-none rounded-[18px] shadow-[4px_4px_16px_0px_rgba(33,35,37,0.5),-4px_-4px_16px_0px_rgba(44,42,42,0.5)]" />
      <div className="capitalize flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold h-[59px] justify-center leading-[0] relative shrink-0 text-[#716868] text-[20px] text-center w-[182px]">
        <p className="leading-[1.2]">Continue</p>
      </div>
    </button>
  );
}

interface SignupScreen2Props {
  onContinue: () => void;
  name: string;
  setName: (name: string) => void;
}

export default function SignupScreen({ onContinue, name, setName }: SignupScreen2Props) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="signup screen 2">
      <div className="absolute flex flex-col font-['Jost:Medium',sans-serif] font-medium justify-center leading-[0] left-[196px] text-[20px] text-black text-center text-nowrap top-[265px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Enter name:</p>
      </div>
      <KnobElevation onClick={onContinue} />
      <div className="absolute h-[43px] left-[74px] rounded-[29px] top-[340px] w-[245px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="absolute inset-0 bg-[#eee0dd] border-[#4e4543] border-[1.5px] border-solid rounded-[29px] px-[20px] font-['Jost:Medium',sans-serif] text-black text-[18px] outline-none focus:border-[#716868]"
          placeholder=""
        />
      </div>
    </div>
  );
}