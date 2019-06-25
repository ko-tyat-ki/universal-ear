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
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB
#define LEDS_GROUPING 5
CRGB leds[NUM_LEDS];

#define UPDATES_PER_SECOND 100

CRGBPalette16 currentPalette;
TBlendType    currentBlending;

extern CRGBPalette16 myRedWhiteBluePalette;
extern const TProgmemPalette16 myRedWhiteBluePalette_p PROGMEM;
 
int sensorPin = A0;    // select the input pin for the potentiometer
int sensorPin1 = A1;    // select the input pin for the potentiometer
int sensorPin2 = A2;    // select the input pin for the potentiometer
int sensorPowerPin = 9; // select the sensor power pin
int sensorValue, sensorValue1, sensorValue2 = 0;  // variable to store the value coming from the sensor
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

uint8_t leds_united[numberOfLeds][3];

boolean receivedBytes = false;
byte startByte = 0x10;
byte endByte = 0x12;
byte inBuffer[payloadInSize];
byte sleep = true;

// Serial output
float diffFast, diffFast1, diffFast2;
float diffSlow;
float lerpAvgFast, lerpAvgFast1 , lerpAvgFast2;
float lerpAvgSlow, lerpAvgSlow1, lerpAvgSlow2;


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
    //readSensorData();
    readSensorDataNew();
    // Serial: Receive Data script:
    receiveBytes();
    // Serial: Put data into "Signal" struct & send data back to server
    parseData();
}

void readSensorData() {
  // read the value from the sensor:
    digitalWrite(sensorPowerPin,HIGH); 
    sensorValue = analogRead(sensorPin);
    digitalWrite(sensorPowerPin,LOW);
    // Calculate the averages
    sensorAvg = runningAverage(sensorValue);
    
    lerpingAverageFast = lerp(lerpingAverageFast, sensorValue, 0.05);
    lerpingAverageSlow = lerp(lerpingAverageSlow, sensorValue, 0.0005); //0.001
    lerpingAverageVerySlow = lerp(lerpingAverageVerySlow, sensorAvg, 0.00005); //0.0005
    
    // Calculate the difference between the sensor value and averaged value:
    diffFast = (lerpingAverageFast - lerpingAverageVerySlow);  // fast. aka Derivative (for fast plucking)
    diffSlow = (lerpingAverageSlow - lerpingAverageVerySlow);  // slow. aka pressure (for slow pushing)
}

void readSensorDataNew() {
    digitalWrite(sensorPowerPin,HIGH); 
    sensorValue = analogRead(sensorPin);
    sensorValue1 = analogRead(sensorPin1);
    sensorValue2 = analogRead(sensorPin2);
    digitalWrite(sensorPowerPin,LOW);

    lerpAvgFast = lerp(lerpAvgFast, sensorValue, 0.05);
    lerpingAverageSlow = lerp(lerpingAverageSlow, sensorValue, 0.001);
    lerpAvgSlow = lerp(lerpAvgSlow, sensorValue, 0.00005);
    diffFast = (lerpAvgFast - lerpingAverageSlow);
    diffFast1 = (lerpingAverageSlow - lerpAvgSlow);

    if (diffFast1 < 0) {
      lerpAvgSlow = lerpingAverageSlow;
    }
    
    lerpAvgFast1 = lerp(lerpAvgFast1, sensorValue1, 0.05);
    lerpAvgSlow1 = lerp(lerpAvgSlow1, sensorValue1, 0.0005);
    //diffFast1 = (lerpAvgFast1 - lerpAvgSlow1);
    
    lerpAvgFast2 = lerp(lerpAvgFast2, sensorValue2, 0.05);
    lerpAvgSlow2 = lerp(lerpAvgSlow2, sensorValue2, 0.0005);
    diffFast2 = (lerpAvgFast2 - lerpAvgSlow2);

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
    if (testEvery(50) && !recvInProgress) {
      sleep = true;
      Serial.print("Waiting for transmission, ");
      sendSensorData();
    }
  }
}

void sendSensorData() {
  // TODO: Calibrate diffFast and diffSlow!
    Serial.println(String(diffFast) + "\t" + String(diffFast1) + "\t" + String(diffFast2));
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
        leds[i*5 + j] = CRGB (leds_united[i][0], leds_united[i][1], leds_united[i][2]);
      }
    }
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
