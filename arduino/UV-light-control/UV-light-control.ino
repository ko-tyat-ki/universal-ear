/*
  AnalogReadSerial
  Reads an analog input on pin 0, prints the result to the serial monitor.
  Graphical representation is available using serial plotter (Tools > Serial Plotter menu)
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.

  This example code is in the public domain.
*/
int sensorPowerPin = 5;
int ledPowerPin = 7;
int sensorPin = A4;
int sensorValue;
uint16_t index = 0;
int state = 0;
float valueOut = 0;

// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  pinMode(sensorPowerPin, OUTPUT);
  pinMode(ledPowerPin, OUTPUT);
  digitalWrite(sensorPowerPin,HIGH);
}

// the loop routine runs over and over again forever:
void loop() {
  if (index % 100 == 0) {
    digitalWrite(sensorPowerPin,HIGH); 
    sensorValue = analogRead(sensorPin);
    digitalWrite(sensorPowerPin,LOW);
    //Serial.println(sensorValue);
    state = chooseState(sensorValue);
  }

  switch (state) {
    case 0:
      valueOut = 0;
      break;
    case 1:
      valueOut = 126;
      break;
    case 2: 
      valueOut += (1024 - sensorValue) * 0.05;
      if (valueOut > 125) valueOut = 0;
      break;
  }
  analogWrite(ledPowerPin, valueOut);
  Serial.print(sensorValue);
  Serial.print(",");
  Serial.print(state);
  Serial.print(",");
  Serial.println(valueOut);
  // read the input on analog pin 0:
  // print out the value you read:
  
  index ++;
  delay(1);        // delay in between reads for stability
}

int chooseState(int _sensorValue) {
  int _state = 0;
  if (_sensorValue < 100) {
    _state = 0;
  } else if (_sensorValue < 500) {
    _state = 1;  
  } else {
    _state = 2;
  }
  return _state;
}

