/* UPD. 15/05/2019 Ivan:
 *  String tokenisation
 *  Incoming message should start with "<", end with ">", delimiters ","
*/

#include <FastLED.h>
#define ORDER       0
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
 
int sensorPin[3];    // select the input pin for the potentiometer
int sensorPowerPin = 9; // select the sensor power pin
int sensorValue[3] = {0};  // variable to store the value coming from the sensor
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
boolean firstMeasurement = true;

// Serial output for three sensors
float diffFast[3];
float diffSlow[3];
float lerpAvgFast[3];
float lerpAvgSlow[3];
float lerpAvgVerySlow[3];

void setup() {
    // Initialise sensor pins:
    sensorPin[0] = A0;    // select the input pin for the potentiometer
    sensorPin[1] = A1;    // select the input pin for the potentiometer
    sensorPin[2] = A2;
    
    delay( 1000 ); // power-up safety delay
    pinMode(sensorPowerPin, OUTPUT); // declare sensor power pin as output
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );
    Serial.begin(115200);
    FastLED.clear();
}

void loop()
{
    readSensorDataNew();
    // Serial: Receive Data script:
    receiveBytes();
    // Serial: Put data into "Signal" struct & send data back to server
    parseData();
}

void readSensorDataNew() {
    digitalWrite(sensorPowerPin,HIGH); 
    for (int i = 0; i < 3; i++) {
      sensorValue[i] = analogRead(sensorPin[i]);
    }
    digitalWrite(sensorPowerPin,LOW);

    // Protect everyone's eyes from an exhausting settle-down period
    if (firstMeasurement) {
      for (int i = 0; i < 3; i++) {
        lerpAvgFast[i] = sensorValue[i];
        lerpAvgSlow[i] = sensorValue[i];
        lerpAvgVerySlow[i] = sensorValue[i];
      }
      firstMeasurement = false;
    }

    // Calculate averages:
    for (int i = 0; i < 3; i++) {
      lerpAvgFast[i] = lerp(lerpAvgFast[i], sensorValue[i], 0.05);
      lerpAvgSlow[i] = lerp(lerpAvgSlow[i], sensorValue[i], 0.001);
      lerpAvgVerySlow[i] = lerp(lerpAvgVerySlow[i], sensorValue[i], 0.00005);
      diffFast[i] = (lerpAvgFast[i] - lerpAvgSlow[i]);
      diffSlow[i] = (lerpAvgSlow[i] - lerpAvgVerySlow[i]);
      if (diffSlow[i] < 0) {
        lerpAvgVerySlow[i] = lerpAvgSlow[i];
      }
    }
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

void sendSensorData() {
    //for (int i = 0; i < 3; i++) {
    //  Serial.print(String(diffFast[i]) + "\t" + String(diffSlow[i]) + "\t");
    //}
    float diffFastMax = max(diffFast[0], max(diffFast[1], diffFast[2]));
    float diffSlowMax = max(diffSlow[0], max(diffSlow[1], diffSlow[2]));
    Serial.print(String(diffFastMax) + "\t" + String(diffSlowMax) + "\t");
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


void charToStringL(const char S[], String &D)
{
    byte at = 0;
    const char *p = S;
    D = "";

    while (*p++) {
      D.concat(S[at++]);
    }
}
