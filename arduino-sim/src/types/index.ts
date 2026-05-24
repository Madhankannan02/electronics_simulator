export interface PinConfig {
  id: string;
  name: string;
  type: 'digital' | 'analog' | 'power' | 'special';
  voltage: number;
  hoverInfo: string;
  isPWM?: boolean;
}

export interface BoardComponent {
  id: string;
  name: string;
  description: string;
  details: string[];
}

export interface SimProgram {
  id: string;
  name: string;
  code: string;
  speed: number;
  onTick: (tick: number) => { [pinId: string]: number };
}

export const BOARD_PINS: PinConfig[] = [
  { id: 'pin_tx', name: 'TX', type: 'special', voltage: 5, hoverInfo: 'Serial Transmit (D1) - Used for serial communication. Avoid using when serial is active.' },
  { id: 'pin_rx', name: 'RX', type: 'special', voltage: 5, hoverInfo: 'Serial Receive (D0) - Used for serial communication. Avoid using when serial is active.' },
  { id: 'pin_2', name: '~2', type: 'digital', voltage: 0, hoverInfo: 'Digital I/O Pin 2 - Can be used as external interrupt (INT0). 5V logic level.', isPWM: false },
  { id: 'pin_3', name: '~3', type: 'digital', voltage: 0, hoverInfo: 'PWM Digital I/O Pin 3 - External interrupt capable (INT1). Supports analogWrite() PWM output.', isPWM: true },
  { id: 'pin_4', name: '4', type: 'digital', voltage: 0, hoverInfo: 'Digital I/O Pin 4 - Standard 5V digital pin. Can source/sink up to 40mA.' },
  { id: 'pin_5', name: '~5', type: 'digital', voltage: 0, hoverInfo: 'PWM Digital I/O Pin 5 - Supports analogWrite() for PWM output. 490Hz frequency.', isPWM: true },
  { id: 'pin_6', name: '~6', type: 'digital', voltage: 0, hoverInfo: 'PWM Digital I/O Pin 6 - Supports analogWrite() for PWM output. 980Hz frequency.', isPWM: true },
  { id: 'pin_7', name: '7', type: 'digital', voltage: 0, hoverInfo: 'Digital I/O Pin 7 - Standard 5V digital pin.' },
  { id: 'pin_8', name: '8', type: 'digital', voltage: 0, hoverInfo: 'Digital I/O Pin 8 - Standard 5V digital pin.' },
  { id: 'pin_9', name: '~9', type: 'digital', voltage: 0, hoverInfo: 'PWM Digital I/O Pin 9 - Supports analogWrite() for servo/LED dimming.', isPWM: true },
  { id: 'pin_10', name: '~10', type: 'digital', voltage: 0, hoverInfo: 'PWM Digital I/O Pin 10 - SS for SPI. Supports analogWrite() PWM.', isPWM: true },
  { id: 'pin_11', name: '~11', type: 'digital', voltage: 0, hoverInfo: 'PWM Digital I/O Pin 11 - MOSI for SPI. Supports analogWrite() PWM.', isPWM: true },
  { id: 'pin_12', name: '12', type: 'digital', voltage: 0, hoverInfo: 'Digital I/O Pin 12 - MISO for SPI.' },
  { id: 'pin_13', name: '13', type: 'digital', voltage: 5, hoverInfo: 'Digital I/O Pin 13 - Connected to the onboard L LED. Blinks during boot.' },
  { id: 'pin_gnd1', name: 'GND', type: 'power', voltage: 0, hoverInfo: 'Ground Reference - 0V common ground for the circuit.' },
  { id: 'pin_aref', name: 'AREF', type: 'special', voltage: 0, hoverInfo: 'Analog Reference Voltage - Reference for analog input comparisons. Typically 5V.' },
  { id: 'pin_sda', name: 'SDA', type: 'special', voltage: 0, hoverInfo: 'I2C Data Line (A4) - Used for I2C communication with sensors and displays.' },
  { id: 'pin_scl', name: 'SCL', type: 'special', voltage: 0, hoverInfo: 'I2C Clock Line (A5) - Used for I2C communication. Connect to SCL on peripherals.' },
  { id: 'pin_a0', name: 'A0', type: 'analog', voltage: 2.5, hoverInfo: 'Analog Input A0 - 10-bit ADC (0-1023). Reads voltages between 0V and 5V.' },
  { id: 'pin_a1', name: 'A1', type: 'analog', voltage: 0, hoverInfo: 'Analog Input A1 - 10-bit ADC. Can also be used as digital pin 15.' },
  { id: 'pin_a2', name: 'A2', type: 'analog', voltage: 0, hoverInfo: 'Analog Input A2 - 10-bit ADC. Can also be used as digital pin 16.' },
  { id: 'pin_a3', name: 'A3', type: 'analog', voltage: 0, hoverInfo: 'Analog Input A3 - 10-bit ADC. Can also be used as digital pin 17.' },
  { id: 'pin_5v', name: '5V', type: 'power', voltage: 5, hoverInfo: '5V Power Rail - Regulated 5V output from onboard LDO. Max ~500mA from USB.' },
  { id: 'pin_3v3', name: '3.3V', type: 'power', voltage: 3.3, hoverInfo: '3.3V Power Output - Generated from the USB-serial chip. Max 50mA.' },
  { id: 'pin_gnd2', name: 'GND', type: 'power', voltage: 0, hoverInfo: 'Ground Reference - 0V common ground for the circuit.' },
  { id: 'pin_vin', name: 'VIN', type: 'power', voltage: 0, hoverInfo: 'Voltage Input - 7-12V DC input when not using USB power.' },
];

export const BOARD_COMPONENTS: BoardComponent[] = [
  {
    id: 'atmega328p',
    name: 'ATmega328P Microcontroller',
    description: 'The main brain of the Arduino Uno. An 8-bit AVR RISC-based microcontroller running at 16MHz.',
    details: [
      '32KB Flash program memory',
      '2KB SRAM for variables',
      '1KB EEPROM non-volatile storage',
      '23 GPIO pins (14 digital + 6 analog)',
      'Running at 5V with 16MHz crystal',
      '6 PWM output channels',
      'SPI, I2C, UART hardware support',
    ]
  },
  {
    id: 'usb_serial',
    name: 'ATmega16U2 USB-Serial Bridge',
    description: 'Handles USB communication to the computer for programming and serial data exchange.',
    details: [
      'USB 2.0 Full-speed device',
      'Converts USB to UART serial',
      'Enables sketch upload via avrdude',
      'Virtual COM port on host PC',
      'Max 3.3V signal levels on USB side',
    ]
  },
  {
    id: 'crystal',
    name: '16MHz Crystal Oscillator',
    description: 'Provides the precise clock signal that drives the ATmega328P processor.',
    details: [
      'Frequency: 16.000 MHz',
      'Accuracy: ±20ppm',
      'Load capacitance: 18pF',
      'AT-cut quartz resonator',
      'Powers all timers and PWM modules',
    ]
  },
  {
    id: 'voltage_reg',
    name: 'NCP1117 Voltage Regulator',
    description: 'Linear LDO regulator that converts 7-12V input to stable 5V for the board.',
    details: [
      'Input: 7V - 12V DC',
      'Output: 5V regulated',
      'Max output current: 1A',
      'Dropout voltage: ~1.1V at 800mA',
      'Reverse polarity protection included',
    ]
  }
];

export const SIM_PROGRAMS: SimProgram[] = [
  {
    id: 'blink_13',
    name: 'Blink LED (Pin 13)',
    speed: 500,
    code: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH); // Turn LED on
  delay(500);             // Wait 500ms
  digitalWrite(13, LOW);  // Turn LED off
  delay(500);             // Wait 500ms
}`,
    onTick: (tick) => ({
      'pin_13': tick % 2 === 0 ? 5 : 0,
    })
  },
  {
    id: 'knight_rider',
    name: 'Knight Rider Scanner',
    speed: 120,
    code: `int pins[] = {3,4,5,6,7,8,9,10,11,12};
int dir = 1;
int pos = 0;

void setup() {
  for(int i=0; i<10; i++)
    pinMode(pins[i], OUTPUT);
}

void loop() {
  for(int i=0; i<10; i++)
    digitalWrite(pins[i], LOW);
  digitalWrite(pins[pos], HIGH);
  pos += dir;
  if(pos == 9 || pos == 0) dir = -dir;
  delay(120);
}`,
    onTick: (tick) => {
      const pinIds = ['pin_3','pin_4','pin_5','pin_6','pin_7','pin_8','pin_9','pin_10','pin_11','pin_12'];
      const totalSteps = (pinIds.length - 1) * 2;
      const step = tick % totalSteps;
      const pos = step < pinIds.length ? step : totalSteps - step;
      const out: { [key: string]: number } = {};
      pinIds.forEach((p, i) => { out[p] = i === pos ? 5 : 0; });
      return out;
    }
  },
  {
    id: 'pwm_fade',
    name: 'PWM Sine Wave Fade',
    speed: 30,
    code: `int brightness = 0;
int step = 5;

void setup() {
  pinMode(9, OUTPUT);
  pinMode(11, OUTPUT);
}

void loop() {
  analogWrite(9, brightness);
  analogWrite(11, 255 - brightness);
  brightness += step;
  if (brightness <= 0 || brightness >= 255)
    step = -step;
  delay(30);
}`,
    onTick: (tick) => {
      const v9 = (Math.sin(tick * 0.15) * 0.5 + 0.5) * 5;
      const v11 = 5 - v9;
      return { 'pin_9': v9, 'pin_11': v11 };
    }
  },
  {
    id: 'serial_monitor',
    name: 'Analog Sensor Read',
    speed: 200,
    code: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorVal = analogRead(A0);
  float voltage = sensorVal * (5.0 / 1023.0);
  Serial.print("ADC: ");
  Serial.print(sensorVal);
  Serial.print(" | Voltage: ");
  Serial.println(voltage);
  delay(200);
}`,
    onTick: (_tick) => ({})
  }
];
