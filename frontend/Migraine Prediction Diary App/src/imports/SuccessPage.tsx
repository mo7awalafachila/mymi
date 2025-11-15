import svgPaths from "./svg-rr2824hr6h";
import imgImage3 from "figma:asset/368dd57de8c2f6bf3dc2a42e7aa34922728c6dee.png";

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

function FiRrComments({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-[147px] size-[24px] top-[11px] cursor-pointer hover:opacity-70 transition-opacity"
      data-name="fi-rr-comments"
    >
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
    </button>
  );
}

function Frame1({ onNavigateToHome, onNavigateToForum, onNavigateToChecklist }: { onNavigateToHome?: () => void; onNavigateToForum?: () => void; onNavigateToChecklist?: () => void }) {
  return (
    <div className="absolute bg-[#d6b7b1] h-[45px] left-[35px] overflow-clip rounded-[18px] top-[628px] w-[323px]">
      <FiRrListCheck onClick={onNavigateToChecklist} />
      <FiRrHome onClick={onNavigateToHome} />
      <FiRrComments onClick={onNavigateToForum} />
    </div>
  );
}

function Frame({ onNavigateToHome, onNavigateToForum, onNavigateToChecklist }: { onNavigateToHome?: () => void; onNavigateToForum?: () => void; onNavigateToChecklist?: () => void }) {
  return (
    <div className="absolute bg-[#e6cac4] h-[707px] left-0 overflow-clip rounded-tl-[60px] rounded-tr-[60px] top-[145px] w-[393px]">
      <Frame1 onNavigateToHome={onNavigateToHome} onNavigateToForum={onNavigateToForum} onNavigateToChecklist={onNavigateToChecklist} />
      <div className="absolute flex flex-col font-['Jost:Light',sans-serif] font-light justify-center leading-[1.2] left-[206px] text-[#4e4543] text-[40px] text-center text-nowrap top-[232px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">{`You are doing `}</p>
        <p>
          GREAT!!
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Keep going:3
        </p>
      </div>
      <div className="absolute left-[53px] size-[287px] top-[318px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
    </div>
  );
}

interface SuccessPageProps {
  onNavigateToHome?: () => void;
  onNavigateToForum?: () => void;
  onNavigateToChecklist?: () => void;
}

export default function SuccessPage({ onNavigateToHome, onNavigateToForum, onNavigateToChecklist }: SuccessPageProps) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="checklist">
      <Frame onNavigateToHome={onNavigateToHome} onNavigateToForum={onNavigateToForum} onNavigateToChecklist={onNavigateToChecklist} />
      <div className="absolute flex flex-col font-['Jost:Regular',sans-serif] font-normal justify-center leading-[0] left-[116.5px] text-[36px] text-black text-center text-nowrap top-[81.5px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Check-in</p>
      </div>
    </div>
  );
}
