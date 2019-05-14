#include <FastLED.h>

// TODO: string tokenization http://forum.arduino.cc/index.php?topic=396450.0

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
    // read the value from the sensor:
    sensorValue = analogRead(sensorPin);
    // Calculate the averages
    sensorAvg = runningAverage(sensorValue);
    // Calculate the difference between the sensor value and averaged value:
    int diffFast = (sensorValue - sensorAvg);  // fast. aka Derivative (for fast plucking)
    int diffSlow = (sensorAvg - longAverage);  // slow. aka pressure (for slow pushing)

    Serial.println("r|" +String(LED_COUNT) + "|" + ORDER + "|"+sensorValue+"|"+String(diffFast) + "|" + String(diffSlow));

    if (Serial.available() == 0) {
        // Serial port is not ready yet
        return;
    }

    String input = Serial.readString();

    if (input != "-1" && input[0] == 'c') {
      FastLED.clear();
      FastLED.show();
    }

    if (input != "-1" && input[0] == 'l') {
      char inputChars[255];
      input.substring(1).toCharArray(inputChars, sizeof(inputChars));

      uint8_t brightness = 100;

      static uint8_t colorIndex = 0;
      colorIndex = colorIndex + 1; /* motion speed */

      char * ledConf;
      ledConf = strtok (inputChars, ";");
      while (ledConf != NULL)
      {
        int ledNum = String(ledConf).toInt();

        ledConf    = strtok(NULL, ";");
        int red    = String(ledConf).toInt();

        ledConf    = strtok(NULL, ";");
        int green  = String(ledConf).toInt();

        ledConf    = strtok(NULL, ";");
        int blue   = String(ledConf).toInt();

        leds[ledNum] = CRGB(red, green, blue);

        ledConf = strtok (NULL, ";");
      }

      FastLED.show();
      FastLED.delay(1000 / UPDATES_PER_SECOND);
    } 
}

// Two functions for averaging the sensor value
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
  if (index % AverageN == 0) {
    longAverage = runningAverage2(sum/count);
  }
  return sum/count;
}

int runningAverage2(int NewSensorValue2) {
  static int index2 = 0;
  static int LMvar2[AverageN2];
  static long sum2 = 0;
  static byte count2 = 0;
  sum2 -= LMvar2[index2];
  LMvar2[index2] = NewSensorValue2;
  sum2 += LMvar2[index2];
  index2++;
  index2 = index2 % AverageN2;
  if (count2 < AverageN2) count2++;
  return sum2/count2;
}
