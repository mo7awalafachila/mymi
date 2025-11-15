import svgPaths from "./svg-f4md662f87";

function Frame1() {
  return (
    <div className="absolute bg-[#eee0dd] h-[346px] left-[43px] rounded-[18px] top-[136px] w-[307px]">
      <div className="h-[346px] overflow-clip relative rounded-[inherit] w-[307px]">
        <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal h-[241px] justify-center leading-[0] left-[153.5px] text-[24px] text-black text-center top-[172.5px] translate-x-[-50%] translate-y-[-50%] w-[247px]">
          <p className="leading-[1.2]">Dehydration can trigger migraines by lowering blood flow and oxygen to the brain.</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#4e4543] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[43px] top-[136px]">
      <Frame1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[43px] top-[136px]">
      <Group1 />
    </div>
  );
}

function FiRsSignIn() {
  return <div className="absolute left-[61px] size-[24px] top-[632px]" data-name="fi-rs-sign-in" />;
}

function Group2() {
  return (
    <div className="absolute contents left-[48px] top-[619px]">
      <div className="absolute left-[48px] size-[50px] top-[619px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="25" cy="25" fill="var(--fill-0, #D9D9D9)" id="Ellipse 11" opacity="0" r="24.5" stroke="var(--stroke-0, black)" />
        </svg>
      </div>
      <FiRsSignIn />
    </div>
  );
}

function FiRsSignIn1() {
  return <div className="absolute left-[56px] size-[24px] top-[632px]" data-name="fi-rs-sign-in" />;
}

function Group3() {
  return (
    <div className="absolute contents left-[43px] top-[619px]">
      <div className="absolute left-[43px] size-[50px] top-[619px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="25" cy="25" fill="var(--fill-0, #D9D9D9)" id="Ellipse 11" opacity="0" r="24.5" stroke="var(--stroke-0, black)" />
        </svg>
      </div>
      <FiRsSignIn1 />
    </div>
  );
}

function Frame({ onBack }: { onBack?: () => void }) {
  return (
    <div className="absolute bg-[#e6cac4] h-[707px] left-0 overflow-clip rounded-tl-[60px] rounded-tr-[60px] top-[145px] w-[393px]">
      <Group />
      <Group2 />
      <Group3 />
    </div>
  );
}

function FiRrArrowLeft({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-[61px] size-[24px] top-[779px] cursor-pointer hover:opacity-70 transition-opacity"
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

interface MigraineRiskPageProps {
  onBack?: () => void;
}

export default function MigraineRiskPage({ onBack }: MigraineRiskPageProps) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="checklist">
      <Frame onBack={onBack} />
      <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal justify-center leading-[0] left-[163px] text-[36px] text-black text-center text-nowrap top-[76.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Risk of a migraine</p>
      </div>
      <FiRrArrowLeft onClick={onBack} />
    </div>
  );
}
