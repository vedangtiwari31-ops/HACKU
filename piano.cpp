#include <Servo.h>

// Servo objects (motor control ke liye)
Servo servoH;  // horizontal movement
Servo servoV;  // vertical movement

// Initial positions (center se start karega)
int posH = 90;
int posV = 90;

// LDR sensor pins (4 directions)
const int LDR_TL = A0; // Top Left
const int LDR_TR = A1; // Top Right
const int LDR_BL = A2; // Bottom Left
const int LDR_BR = A3; // Bottom Right

// Threshold values
const int lightThreshold = 400; // itna light hona chahiye system chalne ke liye
const int diffThreshold  = 15;  // minimum difference jisme movement hoga
const int maxStep        = 15;  // ek baar me max kitna move karega

// Smoothing (noise kam karne ke liye multiple readings ka average)
const int smoothing = 5;

// Yeh function ek sensor ka average value deta hai
int readAverage(int pin) {
  int sum = 0;
  for (int i = 0; i < smoothing; i++) {
    sum += analogRead(pin); // baar-baar read karke sum karega
  }
  return sum / smoothing; // average nikal ke return karega
}

void setup() {

  // Servo pins attach kiye
  servoH.attach(9);
  servoV.attach(10);

  // Initial position set
  servoH.write(posH);
  servoV.write(posV);

  // Serial monitor start (debug ke liye)
  Serial.begin(9600);
}

void loop() {

  // 🔹 Smooth sensor readings
  int TL = readAverage(LDR_TL);
  int TR = readAverage(LDR_TR);
  int BL = readAverage(LDR_BL);
  int BR = readAverage(LDR_BR);

  // Average values nikal rahe hai
  int topAvg    = (TL + TR) / 2;
  int bottomAvg = (BL + BR) / 2;
  int leftAvg   = (TL + BL) / 2;
  int rightAvg  = (TR + BR) / 2;
  int overall   = (TL + TR + BL + BR) / 4;

  // 🔹 Low light check (raat ya cloudy condition)
  if (overall < lightThreshold) {
    Serial.println("Low light - system ruk gaya");
    delay(1000);
    return; // aage ka code skip
  }

  // -------- Vertical Movement --------
  int diffV = topAvg - bottomAvg;

  if (abs(diffV) > diffThreshold) {

    // difference ke hisaab se step calculate
    int step = map(abs(diffV), diffThreshold, 1023, 2, maxStep);

    // agar upar zyada light hai toh upar move
    // agar neeche zyada hai toh neeche move
    posV += (diffV > 0) ? -step : step;

    // servo limits ke andar rakho
    posV = constrain(posV, 10, 170);

    // servo ko new position bhejo
    servoV.write(posV);
  }

  // -------- Horizontal Movement --------
  int diffH = leftAvg - rightAvg;

  if (abs(diffH) > diffThreshold) {

    int step = map(abs(diffH), diffThreshold, 1023, 2, maxStep);

    // agar left me light zyada hai toh left move
    // agar right me zyada hai toh right move
    posH += (diffH > 0) ? step : -step;

    posH = constrain(posH, 10, 170);

    servoH.write(posH);
  }

  // 🔹 Debug output (current position aur light show karega)
  Serial.print("H: "); Serial.print(posH);
  Serial.print(" | V: "); Serial.print(posV);
  Serial.print(" | Light: "); Serial.println(overall);

  delay(20); // thoda delay for smooth movement
}
