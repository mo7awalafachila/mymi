import imgImage2 from "figma:asset/368dd57de8c2f6bf3dc2a42e7aa34922728c6dee.png";

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

interface SignupScreen1Props {
  onContinue: () => void;
}

export default function SignupScreen({ onContinue }: SignupScreen1Props) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="signup screen 1">
      <div className="absolute flex flex-col font-['Jost:Medium',sans-serif] font-medium justify-center leading-[0] left-[196.5px] text-[20px] text-black text-center text-nowrap top-[265px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Welcome to</p>
      </div>
      <div className="absolute flex flex-col font-['Jost:Bold',sans-serif] font-bold justify-center leading-[0] left-[197px] text-[64px] text-black text-center text-nowrap top-[343.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">MyMi</p>
      </div>
      <KnobElevation onClick={onContinue} />
      <div className="absolute left-[44px] size-[306px] top-[365px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}