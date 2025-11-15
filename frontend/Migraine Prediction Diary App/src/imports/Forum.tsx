import svgPaths from "./svg-2cfirqb7r9";

function FiRrListCheck({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="absolute left-[239px] size-[24px] top-[11px] cursor-pointer hover:opacity-70 transition-opacity" 
      data-name="fi-rr-list-check"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_489)" id="fi-rr-list-check">
          <path d={svgPaths.p2208f780} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_489">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

function FiRrHome({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="absolute left-[55px] size-[24px] top-[11px] cursor-pointer hover:opacity-70 transition-opacity" 
      data-name="fi-rr-home"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_486)" id="fi-rr-home">
          <path d={svgPaths.p32b3d1f0} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_486">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

function FiRrComments() {
  return (
    <div className="absolute left-[147px] size-[24px] top-[11px]" data-name="fi-rr-comments">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_483)" id="fi-rr-comments">
          <path d={svgPaths.p27d50500} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_483">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame1({ onNavigateToHome, onNavigateToChecklist }: { onNavigateToHome?: () => void; onNavigateToChecklist?: () => void }) {
  return (
    <div className="absolute bg-[#d6b7b1] h-[45px] left-[35px] overflow-clip rounded-[18px] top-[632px] w-[323px]">
      <FiRrListCheck onClick={onNavigateToChecklist} />
      <FiRrHome onClick={onNavigateToHome} />
      <FiRrComments />
    </div>
  );
}

function FiRrUndoAlt() {
  return (
    <div className="absolute left-[295px] size-[12px] top-[106px]" data-name="fi-rr-undo-alt">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_604)" id="fi-rr-undo-alt">
          <path d={svgPaths.p754bd00} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_604">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="[grid-area:1_/_1] bg-[#eee0dd] h-[127px] ml-0 mt-0 overflow-clip relative rounded-[18px] w-[323px]">
      <div className="absolute flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold h-[19px] justify-center leading-[0] left-[11px] text-[14px] text-black top-[18.5px] translate-y-[-50%] w-[302px]">
        <p className="leading-[1.2]">Anyone else get visual auras before migraines?</p>
      </div>
      <div className="absolute flex flex-col font-['Jost:Light',sans-serif] font-light h-[93px] justify-center leading-[0] left-[11px] text-[12px] text-black top-[69.5px] translate-y-[-50%] w-[295px]">
        <p className="leading-[1.2]">
          Hey everyone,
          <br aria-hidden="true" />
          For the past few weeks I’ve been getting these weird shimmering lights in my vision about 20–30 minutes before a migraine hits. Does anyone else experience this? How do you deal with the aura phase or prevent the headache from getting worse?
        </p>
      </div>
      <FiRrUndoAlt />
    </div>
  );
}

function Group31() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Frame2 />
    </div>
  );
}

function Group18() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group31 />
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group18 />
    </div>
  );
}

function Group1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group />
    </div>
  );
}

function Group2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group2 />
    </div>
  );
}

function Group4() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group3 />
    </div>
  );
}

function Group5() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group4 />
    </div>
  );
}

function Group6() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group8 />
    </div>
  );
}

function Group10() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group10 />
    </div>
  );
}

function Group12() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group11 />
    </div>
  );
}

function Group13() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group12 />
    </div>
  );
}

function Group14() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group13 />
    </div>
  );
}

function Group15() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group14 />
    </div>
  );
}

function Group16() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group15 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col gap-[55px] items-start ml-0 mt-0 relative w-[323px]">
      <Group16 />
    </div>
  );
}

function Group21() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Frame5 />
    </div>
  );
}

function Group22() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group21 />
    </div>
  );
}

function Group23() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group22 />
    </div>
  );
}

function Group24() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group23 />
    </div>
  );
}

function Group25() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group24 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col gap-[10px] items-start ml-0 mt-0 relative w-[323px]">
      <Group25 />
    </div>
  );
}

function Group26() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Frame6 />
    </div>
  );
}

function FiRrUndoAlt1() {
  return (
    <div className="absolute left-[295px] size-[12px] top-[101px]" data-name="fi-rr-undo-alt">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_604)" id="fi-rr-undo-alt">
          <path d={svgPaths.p754bd00} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_604">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="[grid-area:1_/_1] bg-[#eee0dd] h-[127px] ml-0 mt-0 overflow-clip relative rounded-[18px] w-[323px]">
      <div className="absolute flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold justify-center leading-[0] left-[8px] text-[14px] text-black text-nowrap top-[17.5px] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Small change that helped reduce my migraine fo..</p>
      </div>
      <div className="absolute flex flex-col font-['Jost:Light',sans-serif] font-light h-[81px] justify-center leading-[0] left-[8px] text-[12px] text-black top-[66.5px] translate-y-[-50%] w-[299px]">
        <p className="leading-[1.2]">Just wanted to share something that made a difference for me: staying super consistent with sleep. Going to bed and waking up at the same time every day (even weekends) cut my migraine days by almost half. Not a cure, but it helped more than I expected!</p>
      </div>
      <FiRrUndoAlt1 />
    </div>
  );
}

function Group30() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Frame3 />
    </div>
  );
}

function Group29() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group30 />
    </div>
  );
}

function Group27() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group29 />
    </div>
  );
}

function Group19() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-0 place-items-start relative">
      <Group27 />
    </div>
  );
}

function Group17() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group19 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="[grid-area:1_/_1] bg-[#eee0dd] h-[127px] ml-0 mt-0 overflow-clip relative rounded-[18px] text-black w-[323px]">
      <div className="absolute flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold justify-center left-[10px] text-[14px] text-nowrap top-[15.5px] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">{` Triggers you didn’t expect?`}</p>
      </div>
      <div className="absolute flex flex-col font-['Jost:Light',sans-serif] font-light h-[91px] justify-center left-[15px] text-[12px] top-[70.5px] translate-y-[-50%] w-[296px]">
        <p className="leading-[1.2]">
          Hi all,
          <br aria-hidden="true" />
          {` I feel like I’ve identified the obvious triggers (stress, dehydration), but recently I think strong perfumes and certain LED lights are setting me off. What surprising triggers have you discovered, and how did you confirm them?`}
        </p>
      </div>
    </div>
  );
}

function Group28() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-0 place-items-start relative">
      <Frame4 />
    </div>
  );
}

function Group20() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <Group28 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[45px] items-start leading-[0] left-[32px] top-[56px] w-[326px]">
      <Group26 />
      <Group17 />
      <Group20 />
    </div>
  );
}

function FiRrUndoAlt2() {
  return (
    <div className="absolute left-[326px] size-[12px] top-[504px]" data-name="fi-rr-undo-alt">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_604)" id="fi-rr-undo-alt">
          <path d={svgPaths.p754bd00} fill="var(--fill-0, #374957)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_604">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame({ onNavigateToHome, onNavigateToChecklist }: { onNavigateToHome?: () => void; onNavigateToChecklist?: () => void }) {
  return (
    <div className="absolute bg-[#e6cac4] h-[707px] left-0 overflow-clip rounded-tl-[60px] rounded-tr-[60px] top-[145px] w-[392px]">
      <Frame1 onNavigateToHome={onNavigateToHome} onNavigateToChecklist={onNavigateToChecklist} />
      <Frame7 />
      <FiRrUndoAlt2 />
    </div>
  );
}

interface ForumProps {
  onNavigateToHome?: () => void;
  onNavigateToChecklist?: () => void;
}

export default function Forum({ onNavigateToHome, onNavigateToChecklist }: ForumProps) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="forum">
      <div className="absolute h-[50px] left-[32px] rounded-[25px] top-[74px] w-[323px]" />
      <Frame onNavigateToHome={onNavigateToHome} onNavigateToChecklist={onNavigateToChecklist} />
      <div className="absolute bg-[#eee0dd] h-[45px] left-[38px] rounded-[29px] top-[74px] w-[320px]">
        <div aria-hidden="true" className="absolute border-[#4e4543] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[29px]" />
      </div>
      <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal justify-center leading-[0] left-[115.5px] text-[#4e4543] text-[16px] text-center text-nowrap top-[96.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Ask anything...</p>
      </div>
    </div>
  );
}