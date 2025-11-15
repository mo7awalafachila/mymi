import svgPaths from "./svg-8efhnoxsek";

function Group1() {
  return (
    <div className="absolute contents font-['Jost:Regular',sans-serif] font-normal leading-[0] left-[35px] text-black text-center top-[122px]">
      <div className="absolute flex flex-col h-[226px] justify-center left-[167.5px] opacity-[0.66] text-[285.079px] top-[235px] tracking-[-28.5079px] translate-x-[-50%] translate-y-[-50%] w-[265px]">
        <p className="leading-[1.2]">16</p>
      </div>
      <div className="absolute flex flex-col justify-center left-[329.29px] opacity-[0.66] text-[77.11px] text-nowrap top-[307.98px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">%</p>
      </div>
    </div>
  );
}

function Frame2() {
  return <div className="absolute bg-[#eee0dd] h-[127px] left-[35px] rounded-[18px] top-[429px] w-[323px]" />;
}

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

function FiRrHome() {
  return (
    <div className="absolute left-[55px] size-[24px] top-[11px]" data-name="fi-rr-home">
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
    </div>
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

function Frame3({ onNavigateToForum, onNavigateToChecklist }: { onNavigateToForum?: () => void; onNavigateToChecklist?: () => void }) {
  return (
    <div className="absolute bg-[#d6b7b1] h-[45px] left-[35px] overflow-clip rounded-[18px] top-[632px] w-[323px]">
      <FiRrListCheck onClick={onNavigateToChecklist} />
      <FiRrHome />
      <FiRrComments onClick={onNavigateToForum} />
    </div>
  );
}

function Frame1({ onNavigateToForum, onNavigateToChecklist }: { onNavigateToForum?: () => void; onNavigateToChecklist?: () => void }) {
  return (
    <div className="absolute bg-[#e6cac4] h-[707px] left-0 overflow-clip rounded-tl-[60px] rounded-tr-[60px] top-[145px] w-[393px]">
      <div className="absolute flex flex-col font-['Jost:Light',sans-serif] font-light justify-center leading-[0] left-[196.5px] opacity-70 text-[30px] text-black text-center text-nowrap top-[74px] tracking-[-0.6px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">Migraine Probability</p>
      </div>
      <Group1 />
      <Frame2 />
      <Frame3 onNavigateToForum={onNavigateToForum} onNavigateToChecklist={onNavigateToChecklist} />
    </div>
  );
}

interface DayItemProps {
  dayName: string;
  dayNumber: number;
  isToday: boolean;
}

function DayItem({ dayName, dayNumber, isToday }: DayItemProps) {
  return (
    <div className={`grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 text-[16px] text-black text-center text-nowrap ${isToday ? 'opacity-100' : ''}`}>
      <div className={`[grid-area:1_/_1] flex flex-col font-['Jost:Regular',sans-serif] font-normal justify-center ml-[15px] mt-[9.5px] relative translate-x-[-50%] translate-y-[-50%] ${isToday ? 'opacity-100' : ''}`}>
        <p className="leading-[1.2] text-nowrap whitespace-pre">{dayName}</p>
      </div>
      <div className={`[grid-area:1_/_1] flex flex-col font-['Jost:SemiBold',sans-serif] font-semibold justify-center ml-[15px] mt-[28.5px] relative translate-x-[-50%] translate-y-[-50%] ${isToday ? 'opacity-100' : ''}`}>
        <p className="leading-[1.2] text-nowrap whitespace-pre">{dayNumber}</p>
      </div>
      {isToday && (
        <div className="[grid-area:1_/_1] absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
      )}
    </div>
  );
}

function Frame() {
  // Get current week dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to get Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    
    const weekDays = [];
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const isToday = date.toDateString() === today.toDateString();
      weekDays.push({
        dayName: dayNames[i],
        dayNumber: date.getDate(),
        isToday
      });
    }
    
    return weekDays;
  };

  const weekDates = getWeekDates();

  return (
    <div className="absolute content-stretch flex gap-[18px] items-center leading-[0] left-[38px] opacity-50 top-[75px]">
      {weekDates.map((day, i) => (
        <DayItem 
          key={i} 
          dayName={day.dayName} 
          dayNumber={day.dayNumber} 
          isToday={day.isToday}
        />
      ))}
    </div>
  );
}

interface MainPageProps {
  onNavigateToForum?: () => void;
  onNavigateToChecklist?: () => void;
}

export default function MainPage({ onNavigateToForum, onNavigateToChecklist }: MainPageProps) {
  return (
    <div className="bg-[#eee0dd] relative size-full" data-name="main page">
      <Frame1 onNavigateToForum={onNavigateToForum} onNavigateToChecklist={onNavigateToChecklist} />
      <Frame />
    </div>
  );
}
