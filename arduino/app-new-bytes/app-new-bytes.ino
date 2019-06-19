/* UPD. 15/05/2019 Ivan:
 *  String tokenisation
 *  Incoming message should start with "<", end with ">", delimiters ","
*/

#include <FastLED.h>
#define ORDER       0
#define LED_COUNT   150 //40
#define LED_PIN     8
#define NUM_LEDS    150 //60
#define BRIGHTNESS  64
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];

#define UPDATES_PER_SECOND 100

CRGBPalette16 currentPalette;
TBlendType    currentBlending;

extern CRGBPalette16 myRedWhiteBluePalette;
extern const TProgmemPalette16 myRedWhiteBluePalette_p PROGMEM;

int sensorPin = A0;    // select the input pin for the potentiometer
int sensorPowerPin = 9; // select the sensor power pin
int sensorValue = 0;  // variable to store the value coming from the sensor
int sensorAvg, sensorMed, longAverage; // moving average of the sensor values
const int AverageN = 10; // for first fast integration
const int AverageN2 = 50; // for slower integration
float lerpingAverageFast, lerpingAverageSlow, lerpingAverageVerySlow; // Alternative to averages
String input = "";

// Serial helper variables

const byte numChars = 64;
char receivedChars[numChars];
boolean newData = false;
boolean received = true;
boolean recvInProgress = false;

// LEDs in Bytes:
// TODO - check if it's possible to make the size dependent on the incoming data.
const byte numberOfLeds = 40;
const byte payloadInSize = numberOfLeds * 3;

struct PayloadIn
{
  uint8_t ledno[numberOfLeds][3];
}payloadIn;

boolean receivedBytes = false;
byte startByte = 0x10;
byte endByte = 0x12;
byte inBuffer[payloadInSize];
byte sleep = true;

// Serial output
float diffFast;
float diffSlow;

void setup() {
    delay( 1000 ); // power-up safety delay
    pinMode(sensorPowerPin, OUTPUT); // declare sensor power pin as output
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );
    Serial.begin(115200);

    currentPalette = RainbowColors_p;
    currentBlending = LINEARBLEND;

    FastLED.clear();
}

void charToStringL(const char S[], String &D)
{
    byte at = 0;
    const char *p = S;
    D = "";

    while (*p++) {
      D.concat(S[at++]);
    }
}

void loop()
{
    readSensorData();
    
    // Serial: Receive Data script:
    receiveBytes();
    // Serial: Put data into "Signal" struct & send data back to server
    parseData();
    //sendCallforData();   
}

void readSensorData() {
  // read the value from the sensor:
    digitalWrite(sensorPowerPin,HIGH); 
    sensorValue = analogRead(sensorPin);
    digitalWrite(sensorPowerPin,LOW);
    // Calculate the averages
    sensorAvg = runningAverage(sensorValue);
    lerpingAverageSlow = lerp(lerpingAverageSlow, sensorValue, 0.001);
    lerpingAverageFast = lerp(lerpingAverageFast, sensorValue, 0.05);
    lerpingAverageVerySlow = lerp(lerpingAverageVerySlow, sensorAvg, 0.0005);
    // Calculate the difference between the sensor value and averaged value:
    diffFast = (lerpingAverageFast - lerpingAverageVerySlow);  // fast. aka Derivative (for fast plucking)
    diffSlow = (lerpingAverageSlow - lerpingAverageVerySlow);  // slow. aka pressure (for slow pushing)
}

// When finished getting a full message, run this function.
void parseData() {
  if (newData == true) {
    writeToLeds();
    Serial.print("Received! ");
    sendSensorData();
    newData = false;
  } else {
    // TODO make something so that the following code wouldn't execute when receiving data.
    if (testEvery(500) && !recvInProgress) {
      sleep = true;
      Serial.print("Waiting for transmission, ");
      sendSensorData();
    }
  }
}

void sendCallforData() {
  if (testEvery(500) && sleep) {
    Serial.print("Received! ");
    sendSensorData();
  }
}

void sendSensorData() {
  // TODO: Calibrate diffFast and diffSlow!
    Serial.println(String(diffSlow * 5) + "\t" + String(diffFast * 5) + "\t" + String(sensorValue));
    // Leave for debugging
    //Serial.println(String(lerpingAverageSlow) + "\t" + String(lerpingAverageFast) + "\t" + String(lerpingAverageVerySlow) + "\t" + String(sensorValue));
    Serial.println("eat me");
}

boolean testEvery(long millisecondsPeriod) {
  static long firstSeconds;
  static boolean timeOut = false;
  if (millis() - firstSeconds > millisecondsPeriod) {
    timeOut = true;
  }
  if (timeOut) {
    firstSeconds = millis();  
    timeOut = false;
    return true;
  }
  return timeOut;
}

// Functions for direct averaging the sensor value
int runningAverage(int NewSensorValue) {
  static int index = 0;
  static int LMvar[AverageN];
  static long sum = 0;
  static byte count = 0;
  sum -= LMvar[index];
  LMvar[index] = NewSensorValue;
  sum += LMvar[index];
  index++;
  index = index % AverageN;
  if (count < AverageN) count++;
  return sum/count;
}

float lerp(float from, float to, float fraction) {
  return from + (to - from) * fraction;
}

void writeToLeds() {
  FastLED.clear();
  for (int i = 0; i < payloadInSize/4; i++) {
    //leds[Signal[4*i]] = CRGB(Signal[1 + 4*i], Signal[2 + 4*i], Signal[3 + 4*i]);
    leds[i*5] = leds[i*5+1] = leds[i*5+2] = leds[i*5+3] = leds[i*5+4] = CRGB(payloadIn.ledno[i][0],payloadIn.ledno[i][1],payloadIn.ledno[i][2]);
    // TODO: Blend with the next LED
  }
  FastLED.show();
}

// Serial communication:

void receiveBytes() {
  static byte ndx = 0;
  byte rc;
  static byte sum;
  byte payloadLength;

  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();
//    Serial.println(rc);
    if (recvInProgress == true) {
      if (ndx == 0) {
        payloadLength = rc;
        //byte inBuffer[payloadLength];
        ndx++;
      } else if (ndx != payloadInSize + 1) {
        inBuffer[ndx - 1] = rc;
        sum += rc;
        ndx++;
      } else {
        // Check for checksum
        if (rc == endByte) {
          //Serial.println(rc);
          // Collect incoming data into a payload struct
          memcpy(&payloadIn, inBuffer, payloadInSize);
          // For first contact or contact after turning off the LEDs
          sleep = false;
        }
        recvInProgress = false;
        ndx = 0;
        newData = true;
        received = true;
        sum = 0;
      }
    }
    else if (rc == startByte) {
      recvInProgress = true;
      received = false;
    }
  }
}
