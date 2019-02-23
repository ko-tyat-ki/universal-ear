#include <FastLED.h>

#define LED_PIN     8
#define NUM_LEDS    40
#define BRIGHTNESS  255
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

void setup() {
    delay( 3000 ); // power-up safety delay
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );

    Serial.begin(9600);
    
    currentPalette = RainbowColors_p;
    currentBlending = LINEARBLEND;
}

void loop()
{
    if (Serial.available() == 0) {
        // Serial port is not ready yet
        return;
    }

    // read the value from the sensor:
    sensorValue = analogRead(sensorPin);
    
    // write the value to the serial port
    Serial.println(sensorValue);

    // read led value from the serial port
    int valFromServer = Serial.parseInt();

    //int numLedsToLight = floor ((valFromServer / 200.0) * NUM_LEDS);
    int numLedsToLight = valFromServer;

    uint8_t brightness = 100;

    static uint8_t colorIndex = 0;
    colorIndex = colorIndex + 1; /* motion speed */

    // First, clear the existing led values
    FastLED.clear();
    for(int led = 0; led < numLedsToLight - 18; led++) { 
        currentPalette = RainbowColors_p;
        currentBlending = LINEARBLEND;
        leds[NUM_LEDS / 2 + led] = ColorFromPalette( currentPalette, colorIndex, brightness, currentBlending);
        leds[NUM_LEDS / 2 - led] = ColorFromPalette( currentPalette, colorIndex, brightness, currentBlending);
         // leds[led] = ColorFromPalette( currentPalette, colorIndex, brightness, currentBlending);
    }
    FastLED.show();
    FastLED.delay(1000 / UPDATES_PER_SECOND);
}
