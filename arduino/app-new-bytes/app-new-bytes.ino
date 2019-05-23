/* UPD. 15/05/2019 Ivan:
 *  String tokenisation
 *  Incoming message should start with "<", end with ">", delimiters ","
*/

#include <FastLED.h>
#define ORDER       0
#define LED_COUNT   40
#define LED_PIN     8
#define NUM_LEDS    60
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
// TODO - change into correct number of bytes.
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
int diffFast;
int diffSlow;

void setup() {
    delay( 1000 ); // power-up safety delay
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );
    Serial.begin(9600);

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
    sensorValue = analogRead(sensorPin);
    // Calculate the averages
    sensorAvg = runningAverage(sensorValue);
    lerpingAverageSlow = lerp(lerpingAverageSlow, sensorValue, 0.01);
    lerpingAverageFast = lerp(lerpingAverageFast, sensorValue, 0.2);
    lerpingAverageVerySlow = lerp(lerpingAverageVerySlow, sensorAvg, 0.005);

    // Calculate the difference between the sensor value and averaged value:
    diffFast = (lerpingAverageFast - lerpingAverageVerySlow);  // fast. aka Derivative (for fast plucking)
    diffSlow = (lerpingAverageSlow - lerpingAverageVerySlow);  // slow. aka pressure (for slow pushing)
  //Serial.println("r|" +String(LED_COUNT) + "|" + ORDER + "|"+sensorValue+"|"+String(diffFast) + "|" + String(diffSlow));
    //Serial.println("r|" +String(Signal[0]) + "|" + String(Signal[0]) + "|"+ String(Signal[1]) + "|"+String(Signal[2]) + "|" + String(Signal[3]) + '\n');
    
}

// When finished getting a full message, run this function.
void parseData() {
  if (newData == true) {
    writeToLeds();
    Serial.print("Received! ");
    sendDraftResponse();
    newData = false;
  } else {
    // TODO make something so that the following code wouldn't execute when receiving data.
    if (testEvery(500) && !recvInProgress) {
      sleep = true;
      Serial.print("Waiting for transmission, ");
      sendDraftResponse();
    }
  }
}

void sendCallforData() {
  if (testEvery(500) && sleep) {
    Serial.print("Received! ");
    sendDraftResponse();
  }
}

void sendDraftResponse() {
    Serial.println(String(payloadIn.ledno[0][0]) + ", " + String(payloadIn.ledno[0][1]) + ", " + String(payloadIn.ledno[0][2]));
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
    leds[i] = CRGB(payloadIn.ledno[i][0],payloadIn.ledno[i][1],payloadIn.ledno[i][2]);
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
