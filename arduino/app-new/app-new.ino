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
// Start and End markers;
char startMarker = '<';
char endMarker = '>';
unsigned long counter = 0;
const int numberOfVariables = 4; // How many variables do I send?
// Array holding the incoming data
int Signal[numberOfVariables]; 
// Debugging variable:
int incomingData = 0;



void setup() {
    delay( 3000 ); // power-up safety delay
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
    // Serial: Receive Data script:
    recvWithStartEndMarkers();
    // Serial: Put data into "Signal" struct:
    showNewData();
    
    // read the value from the sensor:
    sensorValue = analogRead(sensorPin);
    // Calculate the averages
    sensorAvg = runningAverage(sensorValue);
    lerpingAverageSlow = lerp(lerpingAverageSlow, sensorValue, 0.01);
    lerpingAverageFast = lerp(lerpingAverageFast, sensorValue, 0.2);
    lerpingAverageVerySlow = lerp(lerpingAverageVerySlow, sensorAvg, 0.005);

    // Calculate the difference between the sensor value and averaged value:
    int diffFast = (lerpingAverageFast - lerpingAverageVerySlow);  // fast. aka Derivative (for fast plucking)
    int diffSlow = (lerpingAverageSlow - lerpingAverageVerySlow);  // slow. aka pressure (for slow pushing)

    Serial.println("r|" +String(LED_COUNT) + "|" + ORDER + "|"+sensorValue+"|"+String(diffFast) + "|" + String(diffSlow));

    // Directly write incoming data to certain LED on the strip:
    if (Signal[0] == 0) {
      FastLED.clear();
      FastLED.show();
    } else {
       leds[Signal[0]] = CRGB(Signal[1], Signal[2], Signal[3]);
       FastLED.show();
    }
    FastLED.delay(1000 / UPDATES_PER_SECOND);
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


// Serial communication:

void recvWithStartEndMarkers() {
  static boolean recvInProgress = false;
  static byte ndx = 0;
  char rc;

  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();
    if (recvInProgress == true) {
      if (rc != endMarker) {
        receivedChars[ndx] = rc;
        ndx++;
        if (ndx >= numChars) {
          ndx = numChars - 1;
        }
      }
      else {
        receivedChars[ndx] = '\0'; // terminate the string
        recvInProgress = false;
        ndx = 0;
        newData = true;
        received = true;
      }
    }
    else if (rc == startMarker) {
      recvInProgress = true;
      received = false;
    }
  }
}

// When finished getting a full message, run this function.
void showNewData() {
  if (newData == true) {
    parseData();
    newData = false;
  }
}

// Parses Data to get several consecutive characters, translates them into integer array Signal[].
void parseData() {
  // split the data into its parts
  char * strtokIndx; // this is used by strtok() as an index
  strtokIndx = strtok(receivedChars, ",");      // get the first part - the string

                          // put data into array "Signal[]"
  for (int i = 0; i < numberOfVariables; i++) {
    Signal[i] = atoi(strtokIndx);       // convert this part to an integer
                      //Serial.print(strtokIndx); 
    strtokIndx = strtok(NULL, ",");     // this continues where the previous call left off  
  }
}

