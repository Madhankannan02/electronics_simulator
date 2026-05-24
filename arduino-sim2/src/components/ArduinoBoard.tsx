import React, { useState, useEffect } from 'react';
import { 
  PinConfig, 
  BoardComponent, 
  BOARD_PINS, 
  BOARD_COMPONENTS, 
  SIM_PROGRAMS, 
  SimProgram 
} from '../types/index';
import { Sliders, Power, Play, Square, RefreshCw } from 'lucide-react';

interface ArduinoBoardProps {
  selectedPinId?: string | null;
  onSelectPin?: (pin: PinConfig | null) => void;
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: BoardComponent | null) => void;
  pinVoltages?: { [pinId: string]: number };
  isResetting?: boolean;
  onReset?: () => void;
}

export default function ArduinoBoard({
  selectedPinId: propSelectedPinId,
  onSelectPin: propOnSelectPin,
  selectedComponentId: propSelectedComponentId,
  onSelectComponent: propOnSelectComponent,
  pinVoltages: propPinVoltages,
  isResetting: propIsResetting,
  onReset: propOnReset
}: ArduinoBoardProps) {
  const [hoveredEl, setHoveredEl] = useState<string | null>(null);

  // --- Uncontrolled / Self-contained internal states ---
  const [internalSelectedPin, setInternalSelectedPin] = useState<PinConfig | null>(null);
  const [internalSelectedComponent, setInternalSelectedComponent] = useState<BoardComponent | null>(null);
  const [internalIsResetting, setInternalIsResetting] = useState<boolean>(false);
  const [internalPinVoltages, setInternalPinVoltages] = useState<{ [pinId: string]: number }>(() => {
    const initial: { [pinId: string]: number } = {};
    BOARD_PINS.forEach(p => {
      initial[p.id] = p.voltage;
    });
    return initial;
  });

  // Simulation states for standalone mode
  const [currentProgram, setCurrentProgram] = useState<SimProgram>(SIM_PROGRAMS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [tickCounter, setTickCounter] = useState<number>(0);
  const [manualAnalog, setManualAnalog] = useState<number>(2.5);

  // Determine if using controlled or external state
  const isControlled = propPinVoltages !== undefined;

  const selectedPinId = isControlled ? propSelectedPinId : (internalSelectedPin?.id ?? null);
  const selectedComponentId = isControlled ? propSelectedComponentId : (internalSelectedComponent?.id ?? null);
  const pinVoltages = isControlled ? propPinVoltages! : internalPinVoltages;
  const isResetting = isControlled ? !!propIsResetting : internalIsResetting;

  const selectedPin = BOARD_PINS.find(p => p.id === selectedPinId) || null;
  const selectedComponent = BOARD_COMPONENTS.find(c => c.id === selectedComponentId) || null;

  // Run simulation loop internally if not controlled
  useEffect(() => {
    if (isControlled || !isRunning || isResetting) return;

    const interval = setInterval(() => {
      setTickCounter(prev => prev + 1);
      
      const outputs = currentProgram.onTick(tickCounter);
      
      setInternalPinVoltages(prev => {
        const updated = { ...prev };
        Object.entries(outputs).forEach(([pinId, voltage]) => {
          updated[pinId] = voltage;
        });
        updated['pin_a0'] = manualAnalog;
        return updated;
      });
    }, currentProgram.speed);

    return () => clearInterval(interval);
  }, [isControlled, isRunning, isResetting, tickCounter, currentProgram, manualAnalog]);

  // Handle program switches
  const handleSelectProgram = (program: SimProgram) => {
    setCurrentProgram(program);
    setTickCounter(0);
    const fresh: { [pinId: string]: number } = {};
    BOARD_PINS.forEach(p => {
      fresh[p.id] = p.voltage;
    });
    setInternalPinVoltages(fresh);
  };

  const handleResetBoard = () => {
    if (isControlled) {
      propOnReset?.();
      return;
    }

    setInternalIsResetting(true);
    setInternalSelectedPin(null);
    setInternalSelectedComponent(null);
    
    const blank: { [pinId: string]: number } = {};
    BOARD_PINS.forEach(p => {
      blank[p.id] = 0;
    });
    setInternalPinVoltages(blank);

    setTimeout(() => {
      setInternalPinVoltages(prev => ({
        ...prev,
        'pin_tx': 5,
        'pin_rx': 5,
        'pin_13': 5
      }));
      
      setTimeout(() => {
        setInternalIsResetting(false);
        setTickCounter(0);
        // restore baselines
        setInternalPinVoltages(prev => {
          const resetVoltages: { [pinId: string]: number } = {};
          BOARD_PINS.forEach(p => {
            if (p.id === 'pin_a0') {
              resetVoltages[p.id] = manualAnalog;
            } else {
              resetVoltages[p.id] = p.voltage;
            }
          });
          return resetVoltages;
        });
      }, 500);
    }, 600);
  };

  const handleSelectPin = (pin: PinConfig | null) => {
    if (isControlled) {
      propOnSelectPin?.(pin);
    } else {
      setInternalSelectedPin(pin);
      setInternalSelectedComponent(null);
    }
  };

  const handleSelectComponent = (comp: BoardComponent | null) => {
    if (isControlled) {
      propOnSelectComponent?.(comp);
    } else {
      setInternalSelectedComponent(comp);
      setInternalSelectedPin(null);
    }
  };

  // Helper to determine if a pin is currently emitting voltage (HIGH)
  const isPinHigh = (pinId: string) => {
    return (pinVoltages[pinId] ?? 0) > 2.5;
  };

  const getPinVoltageColor = (pinId: string) => {
    const v = pinVoltages[pinId] ?? 0;
    if (v === 0) return 'bg-[#1a1a1a]';
    if (v === 5) return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
    return 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'; // PWM / intermediate voltage
  };

  // Coordinates Mapping for SVG traces and aesthetic board details
  return (
    <div className="flex flex-col items-center gap-6 max-w-[850px] w-full">
      {/* Main Board Card */}
      <div className="relative w-[820px] h-[580px] bg-[#e5e7eb] p-6 rounded-3xl overflow-hidden select-none flex items-center justify-center shadow-inner border border-gray-300/40">
        {/* Outer shadow / container */}
      <div className="relative w-[780px] h-[540px]">
        
        {/* ========================================== */}
        {/*   PCB BACKGROUND LAYER                    */}
        {/* ========================================== */}
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
          viewBox="0 0 780 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main PCB shape with fillets, notches and chamfer corners */}
          <path
            d="M 12,0
               L 715,0
               L 765,50
               L 765,490
               L 745,510
               L 745,540
               L 160,540
               Q 150,540 145,530
               L 135,515
               Q 125,505 110,505
               L 12,505
               Q 0,505 0,493
               L 0,12
               Q 0,0 12,0 Z"
            fill="#1d70b8"
          />
          
          {/* Copper ground fills & custom trace aesthetics */}
          <path d="M 50 100 L 120 100 L 150 130 L 150 200" stroke="#16568c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          <path d="M 280 150 L 320 150 L 350 120 L 400 120" stroke="#16568c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          <path d="M 450 320 L 520 320 L 580 380 L 580 430" stroke="#16568c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <path d="M 200 480 L 250 480 L 280 450 L 320 450" stroke="#16568c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          <path d="M 680 250 L 710 250 L 730 270 L 730 350" stroke="#16568c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          
          {/* Fine gold lines for copper route detailing */}
          <path d="M 150 250 L 220 250 L 240 270 L 240 330" stroke="#cca43b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
          <path d="M 310 180 L 350 180 L 380 210 L 420 210" stroke="#cca43b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
          <path d="M 460 480 L 510 480 L 530 500" stroke="#cca43b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
          
          {/* Soldered contacts and vias (tiny golden circles) */}
          <circle cx="210" cy="110" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="210" cy="125" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="210" cy="140" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="225" cy="110" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="225" cy="125" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="225" cy="140" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="240" cy="110" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="240" cy="125" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          <circle cx="240" cy="140" r="3" fill="#cca43b" stroke="#333" strokeWidth="0.5" opacity="0.8" />
          
          <circle cx="682" cy="300" r="3.5" fill="#a1a1a1" stroke="#333" strokeWidth="0.5" />
          <circle cx="682" cy="315" r="3.5" fill="#a1a1a1" stroke="#333" strokeWidth="0.5" />
          <circle cx="682" cy="330" r="3.5" fill="#a1a1a1" stroke="#333" strokeWidth="0.5" />
          <circle cx="697" cy="300" r="3.5" fill="#a1a1a1" stroke="#333" strokeWidth="0.5" />
          <circle cx="697" cy="315" r="3.5" fill="#a1a1a1" stroke="#333" strokeWidth="0.5" />
          <circle cx="697" cy="330" r="3.5" fill="#a1a1a1" stroke="#333" strokeWidth="0.5" />

          <circle cx="48" cy="310" r="2.5" fill="#cca43b" opacity="0.6" />
          <circle cx="180" cy="460" r="2.5" fill="#cca43b" opacity="0.6" />
          <circle cx="280" cy="390" r="2.5" fill="#cca43b" opacity="0.6" />
          <circle cx="340" cy="310" r="2.5" fill="#cca43b" opacity="0.6" />
          <circle cx="600" cy="110" r="2.5" fill="#cca43b" opacity="0.6" />
          <circle cx="700" cy="80" r="2.5" fill="#cca43b" opacity="0.6" />
        </svg>

        {/* ========================================== */}
        {/*   SILKSCREEN LABELS / BOARD GRAPHICS      */}
        {/* ========================================== */}

        {/* Top digital header white line guide and DIGITAL (PWM ~) label */}
        <div className="absolute left-[310px] top-[93px] w-[266px] h-[2px] bg-white opacity-85" />
        <div className="absolute left-[310px] top-[99px] w-[266px] text-center text-white font-sans font-extrabold text-[10.5px] tracking-[0.1em] opacity-85 select-none uppercase">
          DIGITAL (PWM ~)
        </div>

        {/* Bottom Left: POWER white line guide and POWER label */}
        <div className="absolute left-[324px] top-[446px] h-[2px] w-[124px] bg-white opacity-85" />
        <div className="absolute left-[324px] top-[428px] w-[124px] text-right text-white font-sans font-extrabold text-[10.5px] tracking-[0.05em] opacity-85 select-none uppercase">
          POWER
        </div>

        {/* Bottom Right: ANALOG IN white line guide and ANALOG IN label */}
        <div className="absolute left-[460px] top-[446px] h-[2px] w-[116px] bg-white opacity-85" />
        <div className="absolute left-[460px] top-[428px] w-[116px] text-center text-white font-sans font-extrabold text-[11px] tracking-[0.05em] opacity-85 select-none uppercase">
          ANALOG IN
        </div>

        {/* Master ARDUINO branding and infinity loop centered */}
        <div className="absolute left-[346px] top-[146px] flex flex-col items-center select-none w-[130px]">
          {/* Logo element matches reference image */}
          <svg width="128" height="54" viewBox="0 0 128 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform scale-[0.85] origin-center">
            {/* Left Circle - Minus */}
            <circle cx="36" cy="32" r="25" stroke="white" strokeWidth="8" fill="none" />
            <rect x="24" y="28" width="24" height="8" fill="white" rx="1" />
            
            {/* Right Circle - Plus */}
            <circle cx="86" cy="32" r="25" stroke="white" strokeWidth="8" fill="none" />
            <rect x="74" y="28" width="24" height="8" fill="white" rx="1" />
            <rect x="82" y="20" width="8" height="24" fill="white" rx="1" />
          </svg>
          
          {/* ARDUINO text below infinity logo */}
          <div className="font-sans font-black text-white tracking-[0.14em] text-center text-[22px] uppercase leading-none mt-1">
            ARDUINO
          </div>
        </div>

        {/* UNO logo inside rounded dotted border */}
        <div 
          className="absolute border-[2.5px] border-dotted border-white/95 rounded-[12px] flex items-center justify-center select-none"
          style={{
            left: '522px',
            top: '146px',
            width: '138px',
            height: '56px',
          }}
        >
          <span className="text-white font-sans font-extrabold text-[32px] tracking-wider leading-none">
            UNO
          </span>
        </div>

        {/* LED Text Labels: ON next to Green Power Led, L next to pin13 led, TX/RX next to serial leds */}
        <div className="absolute left-[284px] top-[141px] text-white font-sans font-extrabold text-[10.5px] select-none opacity-85">
          L
        </div>

        <div className="absolute left-[272px] top-[198px] flex flex-col gap-[14px] text-right text-white font-sans font-extrabold text-[10.5px] select-none opacity-85 w-[25px]">
          <span>TX</span>
          <span>RX</span>
        </div>

        <div className="absolute left-[704px] top-[143px] text-white font-sans font-extrabold text-[10px] select-none opacity-85">
          ON
        </div>

        {/* ========================================== */}
        {/*   BOARD MOUNTING HOLES (SCREW HOLES)       */}
        {/* ========================================== */}
        {/* Top-Left-Middle Mount Hole */}
        <div className="absolute left-[188px] top-[22px] w-6 h-6 rounded-full bg-[#e5e7eb] border-[4px] border-[#a1a1a1] flex items-center justify-center shadow-inner" />
        {/* Bottom-Left-Middle Mount Hole (Overhanging the bottom cutout) */}
        <div className="absolute left-[132px] top-[483px] w-8 h-8 rounded-full bg-[#e5e7eb] border-[5px] border-[#a1a1a1] flex items-center justify-center shadow-inner z-20" />
        {/* Right-Middle Mount Hole */}
        <div className="absolute left-[685px] top-[192px] w-8 h-8 rounded-full bg-[#e5e7eb] border-[5px] border-[#a1a1a1] flex items-center justify-center shadow-inner" />
        {/* Bottom-Right Mount Hole */}
        <div className="absolute left-[685px] top-[442px] w-8 h-8 rounded-full bg-[#e5e7eb] border-[5px] border-[#a1a1a1] flex items-center justify-center shadow-inner" />


        {/* ========================================== */}
        {/*   PHYSICAL COMPONENTS                      */}
        {/* ========================================== */}

        {/* 1. USB TYPE-B CONNECTOR (Left edge, center-aligned) */}
        <div
          id="comp_usb"
          className={`absolute -left-[14px] top-[152px] w-[172px] h-[148px] bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 border-[1px] border-gray-500 rounded-lg flex flex-col justify-between p-1 shadow-[5px_5px_15px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-200 z-10 ${
            selectedComponentId === 'usb_port' 
              ? 'ring-4 ring-amber-400 scale-[1.02]' 
              : hoveredEl === 'usb_port' ? 'border-amber-400 opacity-95' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectComponent(BOARD_COMPONENTS.find(c => c.id === 'usb_port')!);
          }}
          onMouseEnter={() => setHoveredEl('usb_port')}
          onMouseLeave={() => setHoveredEl(null)}
        >
          {/* Inner details of USB shielding */}
          <div className="w-full h-full border-[2px] border-b-[5px] border-gray-400 bg-gradient-to-b from-gray-200 to-gray-300 rounded flex items-center justify-end relative px-2">
            {/* The vertical grey groove inside */}
            <div className="w-[10px] h-[100px] bg-gray-500 rounded-full mr-2 opacity-80" />
            
            {/* Internal black plastic guide */}
            <div className="absolute left-6 top-6 w-[80px] h-[80px] bg-neutral-800 rounded-md border-[2px] border-gray-600 flex items-center justify-center">
              {/* Gold USB connector pins inside */}
              <div className="flex gap-[4px]">
                <div className="w-[4px] h-[35px] bg-amber-500 rounded-sm" />
                <div className="w-[4px] h-[35px] bg-amber-500 rounded-sm" />
                <div className="w-[4px] h-[35px] bg-amber-500 rounded-sm" />
                <div className="w-[4px] h-[35px] bg-amber-500 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. DC BARREL POWER JACK (Bottom-left corner) */}
        <div
          id="comp_barrel"
          className={`absolute -left-[14px] top-[418px] w-[128px] h-[72px] bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-lg border-r-[3px] border-r-neutral-700 shadow-[5px_10px_20px_rgba(0,0,0,0.6)] cursor-pointer transition-all duration-200 z-10 ${
            selectedComponentId === 'barrel_jack' 
              ? 'ring-4 ring-amber-400 scale-[1.02]' 
              : hoveredEl === 'barrel_jack' ? 'brightness-110' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectComponent(BOARD_COMPONENTS.find(c => c.id === 'barrel_jack')!);
          }}
          onMouseEnter={() => setHoveredEl('barrel_jack')}
          onMouseLeave={() => setHoveredEl(null)}
        >
          {/* Barrel core hole */}
          <div className="absolute left-0 top-3 h-[46px] w-[25px] bg-black rounded-r-lg flex items-center justify-center border-y-[2px] border-r-[2px] border-neutral-700">
            {/* DC power pin */}
            <div className="w-[10px] h-[10px] rounded-full bg-amber-600 shadow-[inset_0_1px_3px_black]" />
          </div>
          {/* Top casing seams */}
          <div className="absolute top-0 right-3 w-[45px] h-[10px] bg-neutral-900 border-l-[1px] border-neutral-700" />
          <div className="absolute bottom-0 right-3 w-[45px] h-[10px] bg-neutral-900 border-l-[1px] border-neutral-800" />
        </div>

        {/* 3. RESET BUTTON (Top-left area) */}
        <div
          id="comp_reset"
          className={`absolute left-[38px] top-[48px] w-[88px] h-[72px] flex items-center justify-center transition-all duration-100 ${
            selectedComponentId === 'reset_button' ? 'ring-4 ring-amber-400 rounded-lg scale-105' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectComponent(BOARD_COMPONENTS.find(c => c.id === 'reset_button')!);
          }}
        >
          {/* Silver support bracket pads */}
          <div className="absolute top-[8px] -left-1 w-[8px] h-[15px] bg-gray-400 rounded-l border-y-[1px] border-l-[1px] border-gray-500 shadow-sm" />
          <div className="absolute bottom-[8px] -left-1 w-[8px] h-[15px] bg-gray-400 rounded-l border-y-[1px] border-l-[1px] border-gray-500 shadow-sm" />
          <div className="absolute top-[8px] -right-1 w-[8px] h-[15px] bg-gray-400 rounded-r border-y-[1px] border-r-[1px] border-gray-500 shadow-sm" />
          <div className="absolute bottom-[8px] -right-1 w-[8px] h-[15px] bg-gray-400 rounded-r border-y-[1px] border-r-[1px] border-gray-500 shadow-sm" />

          {/* Button square housing */}
          <button
            title="Press to Reset Board"
            className={`w-[66px] h-[66px] bg-gradient-to-br from-gray-200 to-gray-400 border-[2px] border-gray-500 rounded-lg flex items-center justify-center shadow-lg active:scale-90 active:shadow-sm active:translate-y-[1px] cursor-pointer transition-all duration-100 ${
              isResetting ? 'scale-90 shadow-sm translate-y-[1px]' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleResetBoard();
            }}
          >
            {/* Button inner collar */}
            <div className="w-[44px] h-[44px] rounded-full bg-gray-300 border-[2px] border-gray-400 flex items-center justify-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]">
              {/* Red actuator plunger */}
              <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-md border-[1px] border-red-800" />
            </div>
          </button>
        </div>

        {/* 4. CRYSTAL OSCILLATOR (Center-left) */}
        <div
          id="comp_crystal"
          className={`absolute left-[44px] top-[322px] w-[35px] h-[65px] bg-gradient-to-b from-gray-300 via-gray-100 to-gray-400 border-[1px] border-gray-500 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-md transition-all duration-200 ${
            selectedComponentId === 'crystal_oscillator' 
              ? 'ring-4 ring-amber-400 scale-[1.05]' 
              : hoveredEl === 'crystal_oscillator' ? 'opacity-90' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectComponent(BOARD_COMPONENTS.find(c => c.id === 'crystal_oscillator')!);
          }}
          onMouseEnter={() => setHoveredEl('crystal_oscillator')}
          onMouseLeave={() => setHoveredEl(null)}
        >
          {/* Metallized casing shape */}
          <div className="w-[28px] h-[55px] border-[2px] border-gray-300 rounded-full flex items-center justify-center text-[10px] font-mono text-gray-700 font-bold tracking-tight">
            <span className="transform rotate-90 scale-90 whitespace-nowrap">16.000</span>
          </div>
          {/* Mounting solder anchors */}
          <div className="absolute top-[1px] w-[10px] h-[3px] bg-gray-500 rounded-full opacity-65" />
          <div className="absolute bottom-[1px] w-[10px] h-[3px] bg-gray-500 rounded-full opacity-65" />
        </div>

        {/* 5. VOLTAGE REGULATORS & CAPACITORS (Scattered decor elements) */}
        {/* Large power transistor/regulator */}
        <div 
          className="absolute left-[138px] top-[365px] w-[32px] h-[45px] bg-gradient-to-b from-neutral-800 to-neutral-900 border-[1px] border-neutral-700 rounded shadow-md flex justify-around p-1 select-none"
          title="5V Linear Regulator"
        >
          <div className="w-[3px] h-[25px] bg-gray-400 rounded-b mt-[35px]" />
          <div className="w-[3px] h-[25px] bg-gray-400 rounded-b mt-[35px]" />
          <div className="w-[3px] h-[25px] bg-gray-400 rounded-b mt-[35px]" />
          <div className="absolute -top-[14px] left-[3px] w-[26px] h-[15px] bg-gradient-to-b from-gray-400 to-gray-500 rounded-t border-[1px] border-gray-600 border-b-0" />
        </div>

        {/* Small 3.3V Regulator */}
        <div className="absolute left-[145px] top-[95px] w-[18px] h-[22px] bg-neutral-800 border-[1px] border-neutral-600 rounded flex justify-between p-[2px]">
          <div className="w-[2px] h-[8px] bg-gray-400 mt-[16px]" />
          <div className="w-[2px] h-[8px] bg-gray-400 mt-[16px]" />
          <div className="w-[2px] h-[8px] bg-gray-450 mt-[16px]" />
        </div>

        {/* Barrel capacitors (aluminum cylinders code style) */}
        <div className="absolute left-[135px] top-[292px] w-[26px] h-[26px] rounded-full bg-gradient-to-b from-gray-400 via-gray-100 to-gray-400 border-[1px] border-gray-500 flex items-center justify-center shadow-md">
          <div className="w-[18px] h-[18px] rounded-full bg-neutral-700 flex flex-col items-center justify-center border-[1px] border-gray-600">
            <div className="w-full h-[5px] bg-neutral-900" />
            <div className="w-full h-[5px] bg-neutral-600" />
          </div>
        </div>
        <div className="absolute left-[135px] top-[324px] w-[26px] h-[26px] rounded-full bg-gradient-to-b from-gray-400 via-gray-100 to-gray-400 border-[1px] border-gray-500 flex items-center justify-center shadow-md">
          <div className="w-[18px] h-[18px] rounded-full bg-neutral-700 flex flex-col items-center justify-center border-[1px] border-gray-600">
            <div className="w-full h-[5px] bg-neutral-900" />
            <div className="w-full h-[5px] bg-neutral-600" />
          </div>
        </div>


        {/* ========================================== */}
        {/*   ONBOARD STATUS LEDs                      */}
        {/* ========================================== */}
        {/* Onboard LED: L (Connected to Digital 13) */}
        <div className="absolute left-[331px] top-[141px] flex flex-col items-center scale-100 z-25">
          <div className="w-[18px] h-[14px] bg-neutral-800 rounded border-[1.5px] border-neutral-500 flex items-center justify-center relative p-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
            {/* Led active state */}
            <div 
              className={`w-[13px] h-[9px] rounded-sm transition-all duration-150 ${
                isPinHigh('pin_13') && !isResetting
                  ? 'bg-amber-400 shadow-[0_0_16px_5px_rgba(251,191,36,0.95)]' 
                  : 'bg-neutral-900'
              }`} 
            />
          </div>
        </div>

        {/* Onboard LEDs: TX & RX */}
        <div className="absolute left-[331px] top-[200px] flex flex-col gap-[14px] scale-100 z-25">
          {/* TX LED */}
          <div className="w-[18px] h-[14px] bg-neutral-800 rounded border-[1.5px] border-neutral-500 flex items-center justify-center p-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] bg-slate-900">
            <div 
              className={`w-[13px] h-[9px] rounded-sm transition-all duration-75 ${
                pinVoltages['pin_tx'] > 1 && !isResetting
                  ? 'bg-yellow-450 shadow-[0_0_14px_4px_rgba(250,204,21,0.95)]' 
                  : 'bg-neutral-900'
              }`} 
            />
          </div>
          {/* RX LED */}
          <div className="w-[18px] h-[14px] bg-neutral-800 rounded border-[1.5px] border-neutral-500 flex items-center justify-center p-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] bg-slate-900">
            <div 
              className={`w-[13px] h-[9px] rounded-sm transition-all duration-75 ${
                pinVoltages['pin_rx'] > 1 && !isResetting
                  ? 'bg-yellow-450 shadow-[0_0_14px_4px_rgba(250,204,21,0.95)]' 
                  : 'bg-neutral-900'
              }`} 
            />
          </div>
        </div>

        {/* Power LED: ON (top right or bottom middle usually. Placed at top-right of ATMega in Arduino) */}
        <div className="absolute left-[681px] top-[141px] flex flex-col items-center scale-100 z-25">
          <div className="w-[18px] h-[14px] bg-neutral-800 rounded border-[1.5px] border-neutral-500 flex items-center justify-center relative p-[1px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
            {/* Power LED always ON unless resetting */}
            <div 
              className={`w-[13px] h-[9px] rounded-sm transition-all duration-200 ${
                isResetting 
                  ? 'bg-neutral-900 shadow-none' 
                  : 'bg-green-500 shadow-[0_0_16px_5px_rgba(34,197,94,0.95)]'
              }`} 
            />
          </div>
        </div>


        {/* ========================================== */}
        {/*   ATMEGA328P CORE MICROCONTROLLER          */}
        {/* ========================================== */}
        <div
          id="comp_atmega"
          className={`absolute left-[334px] top-[328px] w-[358px] h-[82px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 rounded-md border-[2px] border-neutral-700 shadow-[2px_12px_24px_rgba(0,0,0,0.6)] flex items-center justify-center relative cursor-pointer select-none transition-all duration-200 z-10 ${
            selectedComponentId === 'atmega328p' 
              ? 'ring-4 ring-amber-400 scale-[1.02]' 
              : hoveredEl === 'atmega328p' ? 'brightness-110' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectComponent(BOARD_COMPONENTS.find(c => c.id === 'atmega328p')!);
          }}
          onMouseEnter={() => setHoveredEl('atmega328p')}
          onMouseLeave={() => setHoveredEl(null)}
        >
          {/* Microcontroller chip notch on the left */}
          <div className="absolute left-0 w-[10px] h-[28px] bg-[#1d70b8] rounded-r-full border-[2px] border-neutral-700 border-l-0 shadow-inner" />
          
          {/* Pin 1 dot */}
          <div className="absolute left-4 bottom-2 w-[11px] h-[11px] rounded-full bg-neutral-900 border-[1px] border-neutral-700 shadow-[inset_0_1px_2px_black]" />

          {/* Solder Legs (Metal pins) extending on Top and Bottom edges */}
          {/* Top legs (14 pins) */}
          <div className="absolute -top-[14px] left-3 right-3 flex justify-between pointer-events-none px-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={`top-pin-${i}`} className="w-[6px] h-[16px] bg-gradient-to-r from-gray-400 to-gray-300 border-[0.5px] border-gray-600 rounded-t shadow-sm" />
            ))}
          </div>
          {/* Bottom legs (14 pins) */}
          <div className="absolute -bottom-[14px] left-3 right-3 flex justify-between pointer-events-none px-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={`bottom-pin-${i}`} className="w-[6px] h-[16px] bg-gradient-to-r from-gray-400 to-gray-300 border-[0.5px] border-gray-600 rounded-b shadow-sm" />
            ))}
          </div>

          {/* Two indentations on the ATmega328P chip face matching the reference image */}
          <div className="absolute left-[34px] top-[32px] w-[18px] h-[18px] rounded-full bg-neutral-950 border border-neutral-850 shadow-[inset_0_1.5px_3px_black] opacity-90" />
          <div className="absolute right-[34px] top-[32px] w-[18px] h-[18px] rounded-full bg-neutral-950 border border-neutral-850 shadow-[inset_0_1.5px_3px_black] opacity-90" />

          {/* Tiny copper ground thermal dots inside chip area */}
          <div className="absolute right-[65px] top-5 w-[8px] h-[8px] rounded-full bg-neutral-900 opacity-60" />
          <div className="absolute right-[65px] bottom-5 w-[8px] h-[8px] rounded-full bg-neutral-900 opacity-60" />
        </div>


        {/* ========================================== */}
        {/*   HEADER PIN SOCKETS / JUNCTIONS           */}
        {/* ========================================== */}

        {/* A. DIGITAL PIN HEADER (LEFT: 10-pin block) */}
        <div className="absolute left-[225px] top-[26px] h-[28px] w-[190px] bg-gradient-to-b from-neutral-850 to-neutral-950 rounded border-[1px] border-neutral-700 shadow-md flex items-center justify-between px-1 z-10">
          {BOARD_PINS.slice(0, 10).map((pin, i) => {
            const isSelected = selectedPinId === pin.id;
            const hasPrintedLabel = pin.name.trim() !== '';
            return (
              <div
                key={pin.id}
                className={`relative w-[18px] h-[18px] bg-neutral-900 border-[1.5px] border-neutral-700 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  isSelected ? 'border-amber-400 shadow-[0_0_8px_#fbbf24]' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPin(pin);
                }}
                title={`${pin.name.trim() || 'Unnamed Pin'}: ${pin.hoverInfo}`}
              >
                {/* Silver metal contact hole center */}
                <div className={`w-[6px] h-[6px] rounded-full transition-colors ${getPinVoltageColor(pin.id)}`} />
                
                {/* Board Label perfectly centered horizontally and rotated -90 degrees */}
                {hasPrintedLabel && (
                  <div 
                    className={`absolute top-[35px] left-1/2 -translate-x-1/2 origin-center -rotate-90 whitespace-nowrap font-sans font-extrabold text-[11.5px] text-white opacity-85 select-none pointer-events-none transition-colors ${
                      isSelected ? 'text-amber-300 font-extrabold level-glowing' : ''
                    }`}
                  >
                    {pin.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* B. DIGITAL PIN HEADER (RIGHT: 8-pin block) */}
        <div className="absolute left-[424px] top-[26px] h-[28px] w-[152px] bg-gradient-to-b from-neutral-850 to-neutral-950 rounded border-[1px] border-neutral-700 shadow-md flex items-center justify-between px-1 z-10">
          {BOARD_PINS.slice(10, 18).map((pin, i) => {
            const isSelected = selectedPinId === pin.id;
            return (
              <div
                key={pin.id}
                className={`relative w-[18px] h-[18px] bg-neutral-900 border-[1.5px] border-neutral-700 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  isSelected ? 'border-amber-400 shadow-[0_0_8px_#fbbf24]' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPin(pin);
                }}
                title={`${pin.name}: ${pin.hoverInfo}`}
              >
                {/* Silver metal contact hole center */}
                <div className={`w-[6px] h-[6px] rounded-full transition-colors ${getPinVoltageColor(pin.id)}`} />
                
                {/* Board Label perfectly centered horizontally and rotated -90 degrees */}
                <div 
                  className={`absolute top-[35px] left-1/2 -translate-x-1/2 origin-center -rotate-90 whitespace-nowrap font-sans font-extrabold text-[11.5px] text-white opacity-85 select-none pointer-events-none transition-colors ${
                    isSelected ? 'text-amber-300 font-extrabold level-glowing' : ''
                  }`}
                >
                  {pin.name}
                </div>
              </div>
            );
          })}
        </div>


        {/* C. POWER / ANALOG HEADERS (Bottom Left: Power block - 8 pins) */}
        <div className="absolute left-[296px] top-[486px] h-[28px] w-[152px] bg-gradient-to-b from-neutral-850 to-neutral-950 rounded border-[1px] border-neutral-700 shadow-md flex items-center justify-between px-1 z-10">
          {BOARD_PINS.slice(18, 26).map((pin, i) => {
            const isSelected = selectedPinId === pin.id;
            const hasPrintedLabel = pin.name.trim() !== '';
            return (
              <div
                key={pin.id}
                className={`relative w-[18px] h-[18px] bg-neutral-900 border-[1.5px] border-neutral-700 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  isSelected ? 'border-amber-400 shadow-[0_0_8px_#fbbf24]' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPin(pin);
                }}
                title={`${pin.name.trim() || 'Unnamed Pin'}: ${pin.hoverInfo}`}
              >
                {/* Core hole */}
                <div className={`w-[6px] h-[6px] rounded-full transition-colors ${getPinVoltageColor(pin.id)}`} />
                
                {/* Board Label perfectly centered horizontally above the header, rotated -90 degrees */}
                {hasPrintedLabel && (
                  <div 
                    className={`absolute -top-[24px] left-1/2 -translate-x-1/2 origin-center -rotate-90 whitespace-nowrap font-sans font-extrabold text-[11px] text-white opacity-85 select-none pointer-events-none transition-colors ${
                      isSelected ? 'text-amber-300 font-extrabold level-glowing' : ''
                    }`}
                  >
                    {pin.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* D. POWER / ANALOG HEADERS (Bottom Right: Analog In block - 6 pins) */}
        <div className="absolute left-[460px] top-[486px] h-[28px] w-[116px] bg-gradient-to-b from-neutral-850 to-neutral-950 rounded border-[1px] border-neutral-700 shadow-md flex items-center justify-between px-1 z-10">
          {BOARD_PINS.slice(26, 32).map((pin, i) => {
            const isSelected = selectedPinId === pin.id;
            return (
              <div
                key={pin.id}
                className={`relative w-[18px] h-[18px] bg-neutral-900 border-[1.5px] border-neutral-700 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                  isSelected ? 'border-amber-400 shadow-[0_0_8px_#fbbf24]' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPin(pin);
                }}
                title={`${pin.name}: ${pin.hoverInfo}`}
              >
                {/* Core hole */}
                <div className={`w-[6px] h-[6px] rounded-full transition-colors ${getPinVoltageColor(pin.id)}`} />
                
                {/* Board Label perfectly centered horizontally above the header, rotated -90 degrees */}
                <div 
                  className={`absolute -top-[24px] left-1/2 -translate-x-1/2 origin-center -rotate-90 whitespace-nowrap font-sans font-extrabold text-[11px] text-white opacity-85 select-none pointer-events-none transition-colors ${
                    isSelected ? 'text-amber-300 font-extrabold level-glowing' : ''
                  }`}
                >
                  {pin.name}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>

      {/* Interactive Inspection drawer integrated into the component itself */}
      {(selectedComponent || selectedPin) && (
        <div className="w-full mt-2 p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl relative z-20 animate-fade-in">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-405 animate-pulse" />
              <h3 className="font-bold text-slate-105 text-sm">
                {selectedComponent ? selectedComponent.name : `Inspecting Pin ${selectedPin?.name}`}
              </h3>
            </div>
            <button
              onClick={() => {
                if (isControlled) {
                  propOnSelectComponent?.(null);
                  propOnSelectPin?.(null);
                } else {
                  setInternalSelectedComponent(null);
                  setInternalSelectedPin(null);
                }
              }}
              className="text-slate-400 hover:text-white text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>

          {selectedComponent ? (
            <div>
              <p className="text-xs text-slate-400 leading-normal mb-3">{selectedComponent.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
                {selectedComponent.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-slate-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : selectedPin ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 text-left">
                <span className="text-[10px] uppercase font-bold text-sky-400">
                  {selectedPin.type} / {selectedPin.isPWM ? 'PWM SUPPORTED ~' : 'Standard PIN'}
                </span>
                <p className="text-xs text-slate-300 leading-normal mt-1">{selectedPin.hoverInfo}</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-around text-center">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Voltage</div>
                  <div className="text-lg font-mono text-amber-400 font-bold mt-1">
                    {(pinVoltages[selectedPin.id] ?? 0).toFixed(2)}V
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">State</div>
                  <div className="text-xs font-mono font-bold mt-1.5">
                    {(pinVoltages[selectedPin.id] ?? 0) > 2.5 ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">HIGH</span>
                    ) : (
                      <span className="text-slate-555 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/50">LOW</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Slider overlay for Analog input simulation */}
          {selectedPin?.id === 'pin_a0' && (
            <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Apply Simulated Sensor Input</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={pinVoltages[selectedPin.id] ?? 0}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (isControlled) {
                    // dependency controlled
                  } else {
                    setManualAnalog(v);
                    setInternalPinVoltages(prev => ({ ...prev, [selectedPin.id]: v }));
                  }
                }}
                disabled={isControlled}
                className="flex-1 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs font-bold bg-slate-900 px-2.5 py-0.5 rounded text-sky-300">
                {(pinVoltages[selectedPin.id] ?? 0).toFixed(1)}V
              </span>
            </div>
          )}
        </div>
      )}

      {/* Live Simulation Controls Deck (Only visible if not externally controlled) */}
      {!isControlled && (
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl w-full max-w-[820px] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#1d70b8] shrink-0">
              <Power className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-900">Live Hardware Firmware Simulation</h4>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Toggle live simulation code to watch onboard LEDs and pins cycle.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={currentProgram.id}
              onChange={(e) => {
                const prog = SIM_PROGRAMS.find(p => p.id === e.target.value);
                if (prog) handleSelectProgram(prog);
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-[#1d70b8] cursor-pointer transition-colors"
            >
              {SIM_PROGRAMS.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold select-none transition-colors cursor-pointer ${
                isRunning
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200/80 border border-amber-200/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  HALT SIM
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  START SIM
                </>
              )}
            </button>

            <button
              onClick={handleResetBoard}
              disabled={isResetting}
              className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              RESET BOARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
