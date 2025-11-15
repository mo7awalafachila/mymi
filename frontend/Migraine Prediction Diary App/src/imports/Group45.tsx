function KnobBase() {
  return <div className="h-[95px] shrink-0 w-[191px]" data-name="knob-base" />;
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
    <div className="absolute box-border content-stretch flex gap-[8px] h-[95px] items-start left-0 pb-[24px] pl-[22px] pr-[24px] pt-[22px] top-0 w-[191px]" data-name="Neumorphism-Button">
      <KnobBase />
      <KnobElevation />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <NeumorphismButton />
    </div>
  );
}