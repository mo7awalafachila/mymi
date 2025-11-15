import svgPaths from "./svg-vqwn5hpo9d";

function Frame1() {
  return (
    <div className="absolute bg-[#eee0dd] h-[346px] left-[43px] rounded-[18px] top-[93px] w-[307px]">
      <div className="h-[346px] overflow-clip relative rounded-[inherit] w-[307px]">
        <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal h-[212px] justify-center leading-[0] left-[153.5px] text-[36px] text-black text-center top-[160px] translate-x-[-50%] translate-y-[-50%] w-[211px]">
          <p className="leading-[1.2]">Do you feel well rested?</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#4e4543] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[43px] top-[93px]">
      <Frame1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[43px] top-[93px]">
      <Group1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-[66px] size-[50px] top-[483px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
        <g id="Group 50">
          <circle cx="25" cy="25" fill="var(--fill-0, #EEE0DD)" id="Ellipse 5" r="24.5" stroke="var(--stroke-0, #9E9290)" />
        </g>
      </svg>
    </div>
  );
}

function FiRrCross() {
  return (
    <div className="absolute left-[79px] size-[24px] top-[496px]" data-name="fi-rr-cross">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_894)" id="fi-rr-cross">
          <path d={svgPaths.p25710570} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_894">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function FiRrCheck() {
  return (
    <div className="absolute left-[290px] size-[24px] top-[496px]" data-name="fi-rr-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_803)" id="fi-rr-check">
          <path d={svgPaths.p35adc100} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_803">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute left-[71px] size-[40px] top-[630px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Group 53">
          <circle cx="20" cy="20" fill="var(--fill-0, #D6B7B1)" id="Ellipse 8" r="20" />
        </g>
      </svg>
    </div>
  );
}

function FiRrHome() {
  return (
    <div className="absolute left-[79px] size-[24px] top-[638px]" data-name="fi-rr-home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_793)" id="fi-rr-home">
          <path d={svgPaths.p32b3d1f0} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_793">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#e6cac4] h-[707px] left-0 overflow-clip rounded-tl-[60px] rounded-tr-[60px] top-[145px] w-[393px]">
      <Group />
      <Group2 />
      <FiRrCross />
      <div className="absolute left-[277px] size-[50px] top-[483px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="var(--fill-0, #EEE0DD)" id="Ellipse 5" r="24.5" stroke="var(--stroke-0, #9E9290)" />
        </svg>
      </div>
      <FiRrCheck />
      <Group3 />
      <FiRrHome />
    </div>
  );
}

export default function Checklist() {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="checklist">
      <Frame />
      <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal justify-center leading-[0] left-[116.5px] text-[36px] text-black text-center text-nowrap top-[81.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Check-in</p>
      </div>
    </div>
  );
}