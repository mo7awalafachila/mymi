import svgPaths from "./svg-77kg0k2pay";

function Frame1() {
  return (
    <div className="absolute bg-[#eee0dd] h-[346px] left-[43px] rounded-[18px] top-[156px] w-[307px]">
      <div className="h-[346px] overflow-clip relative rounded-[inherit] w-[307px]">
        <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal h-[212px] justify-center leading-[0] left-[153.5px] text-[24px] text-black text-center top-[173px] translate-x-[-50%] translate-y-[-50%] w-[211px]">
          <p className="leading-[1.2]">Skipping meals can trigger migraines by dropping blood sugar and stressing the brain.</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#4e4543] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[43px] top-[156px]">
      <Frame1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[43px] top-[156px]">
      <Group1 />
    </div>
  );
}

function FiRsSignIn() {
  return <div className="absolute left-[54px] size-[24px] top-[620px]" data-name="fi-rs-sign-in" />;
}

function Group2() {
  return (
    <div className="absolute contents left-[41px] top-[613px]">
      <div className="absolute left-[41px] size-[50px] top-[613px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="25" cy="25" fill="var(--fill-0, #D9D9D9)" id="Ellipse 11" opacity="0" r="24.5" stroke="var(--stroke-0, black)" />
        </svg>
      </div>
      <FiRsSignIn />
    </div>
  );
}

function FiRrArrowLeft({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-[54px] size-[24px] top-[626px] cursor-pointer hover:opacity-70 transition-opacity"
      data-name="fi-rr-arrow-left"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_810)" id="fi-rr-arrow-left">
          <path d={svgPaths.pe94aa80} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_810">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

function Frame({ onBack }: { onBack?: () => void }) {
  return (
    <div className="absolute bg-[#e6cac4] h-[707px] left-0 overflow-clip rounded-tl-[60px] rounded-tr-[60px] top-[145px] w-[393px]">
      <Group />
      <Group2 />
      <FiRrArrowLeft onClick={onBack} />
    </div>
  );
}

interface MigraineRiskPage4Props {
  onBack?: () => void;
}

export default function MigraineRiskPage4({ onBack }: MigraineRiskPage4Props) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="checklist">
      <Frame onBack={onBack} />
      <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal justify-center leading-[0] left-[163px] text-[36px] text-black text-center text-nowrap top-[74.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Risk of a migraine</p>
      </div>
    </div>
  );
}
