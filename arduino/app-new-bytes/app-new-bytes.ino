/* UPD. Sep 2022 Katya:
 *  String tokenisation
 *  Incoming message should start with "<", end with ">", delimiters ","
*/

#include <FastLED.h>
#define ORDER       0
#define LED_PIN     8
#define LED_PIN_BALL 5
#define NUM_LEDS_BALL    50
#define NUM_LEDS    120
#define BRIGHTNESS  64
#define BRIGHTNESS_BALLS  125
#define COLOR_ORDER GRB
#define LEDS_GROUPING 5
CRGB leds_ball[NUM_LEDS];
CRGB leds[NUM_LEDS];

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
uint8_t newBrightness;

// Serial helper variables

const byte numChars = 64;
char receivedChars[numChars];
boolean newData = false;
boolean received = true;
boolean recvInProgress = false;
boolean firstMeasurement = true;

bool gReverseDirection = false;

float diffFast;
float diffSlow;
float lerpAvgFast;
float lerpAvgSlow;
float lerpAvgVerySlow;

// LEDs in Bytes:
// TODO - check if it's possible to make the size dependent on the incoming data.
const byte numberOfLeds = 40;
const byte payloadInSize = numberOfLeds * 3;

struct PayloadIn
{
  uint8_t ledno[numberOfLeds][3];
}payloadIn;

uint8_t leds_united[numberOfLeds][3];

boolean receivedBytes = false;
byte startByte = 0x10;
byte endByte = 0x12;
byte inBuffer[payloadInSize];
byte sleep = true;


void setup() {
    delay( 1000 ); // power-up safety delay
    pinMode(sensorPowerPin, OUTPUT); // declare sensor power pin as output
    FastLED.addLeds<WS2811, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.addLeds<WS2812B, LED_PIN_BALL, COLOR_ORDER>(leds_ball, NUM_LEDS_BALL).setCorrection( TypicalLEDStrip );
    Serial.begin(57600); //115200
    currentPalette = RainbowColors_p;
    currentBlending = LINEARBLEND;
}


void loop()
{
    readSensorData();
    // Serial: Receive Data script:
    receiveBytes();
    // Serial: Put data into "Signal" struct & send data back to server
    parseData();
}

void readSensorData() {
    digitalWrite(sensorPowerPin,HIGH); 
    sensorValue = analogRead(sensorPin);
    digitalWrite(sensorPowerPin,LOW);

    // Protect everyone's eyes from an exhausting settle-down period
    if (firstMeasurement) {
      lerpAvgFast = sensorValue;
      lerpAvgSlow = sensorValue;
      lerpAvgVerySlow = sensorValue;
      firstMeasurement = false;
    }

    lerpAvgFast = lerp(lerpAvgFast, sensorValue, 0.05);
    lerpAvgSlow = lerp(lerpAvgSlow, sensorValue, 0.001);
    lerpAvgVerySlow = lerp(lerpAvgVerySlow, sensorValue, 0.00005);
    diffFast = (lerpAvgFast - lerpAvgSlow);
    diffSlow = (lerpAvgSlow - lerpAvgVerySlow);
    if (diffSlow < 0) {
      lerpAvgVerySlow = lerpAvgSlow;
    }
}

// When finished getting a full message, run this function.
void parseData() {
  if (newData == true) {
    FastLED.clear();
    writeToLeds();
    Fire2012();
    Serial.print("Received! ");
    sendSensorData();
    newData = false;
  } else {
    if (testEvery(500) && !recvInProgress) {
      sleep = true;
      Serial.print("Waiting for transmission, ");
      sendSensorData();
    }
  }
}

void sendSensorData() {
    Serial.print(String(diffFast) + "\t" + String(diffSlow) + "\t");
    Serial.println("");
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
//  FastLED[0].clear();
  int ledArraySize = NUM_LEDS / LEDS_GROUPING;
  for (int i = 0; i < ledArraySize; i++) {
    // Smooth with the previous frame:
    for (int j = 0; j < 3; j++) {
      leds_united[i][j] = lerp(leds_united[i][j], payloadIn.ledno[i][j], 0.2);
    }
    // Smooth with the next led:
    for (int j = 0; j < 5; j++) {
      if (i < ledArraySize - 1) {
        leds[i*5 + j] =  CRGB(lerp (leds_united[i][0], leds_united[i + 1][0], 0.2 * j),
                              lerp (leds_united[i][1], leds_united[i + 1][1], 0.2 * j),
                              lerp (leds_united[i][2], leds_united[i + 1][2], 0.2 * j)) ;      
      } else {
        leds[i*5 + j] = CRGB(leds_united[i][0], leds_united[i][1], leds_united[i][2]);
      }
    }
  }
  FastLED[0].showLeds(BRIGHTNESS);
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

#define COOLING  55
#define SPARKING 120

void Fire2012()
{
// Array of temperature readings at each simulation cell
  static uint8_t heat[NUM_LEDS_BALL];

  // Step 1.  Cool down every cell a little
    for( int i = 0; i < NUM_LEDS_BALL; i++) {
      heat[i] = qsub8( heat[i],  random8(0, ((COOLING * 10) / NUM_LEDS_BALL) + 2));
    }
  
    // Step 2.  Heat from each cell drifts 'up' and diffuses a little
    for( int k= NUM_LEDS_BALL - 1; k >= 2; k--) {
      heat[k] = (heat[k - 1] + heat[k - 2] + heat[k - 2] ) / 3;
    }
    
    // Step 3.  Randomly ignite new 'sparks' of heat near the bottom
    if( random8() < SPARKING ) {
      int y = random8(7);
      heat[y] = qadd8( heat[y], random8(160,255) );
    }

    // Step 4.  Map from heat cells to LED colors
    for( int j = 0; j < NUM_LEDS_BALL; j++) {
      CRGB color = HeatColor( heat[j]);
      int pixelnumber;
      if( gReverseDirection ) {
        pixelnumber = (NUM_LEDS_BALL-1) - j;
      } else {
        pixelnumber = j;
      }
      leds_ball[pixelnumber] = color;
    }

    newBrightness = BRIGHTNESS_BALLS * abs(diffSlow) / 50;
    

      FastLED[1].showLeds(newBrightness); // display this frame
//      FastLED[1].delay(1000 / FRAMES_PER_SECOND);
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
