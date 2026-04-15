#include <Servo.h>
#include <SoftwareSerial.h>

// Servo objects banaye kyunki hume horizontal aur vertical movement control karna hai
Servo servoH;
Servo servoV;

// Bluetooth communication ke liye SoftwareSerial use kiya (hardware serial busy ho sakta hai)
SoftwareSerial BT(2, 3); // RX, TX

// Initial positions 90 rakhe kyunki yeh center position hoti hai (neutral start)
int posH = 90;
int posV = 90;

// Default auto mode true rakha taki system khud light track kare start se hi
bool autoMode = true;


// LDR pins define kiye kyunki 4 direction se light measure karni hai
const int LDR_TL = A0; // Top Left
const int LDR_TR = A1; // Top Right
const int LDR_BL = A2; // Bottom Left
const int LDR_BR = A3; // Bottom Right

// Minimum light threshold rakha taki andhere me unnecessary movement na ho
const int lightThreshold = 80;

// Difference threshold rakha taki choti fluctuations pe servo move na kare (noise avoid)
const int diffThreshold  = 8;

// Max step limit kiya taki servo smooth move kare, sudden jump na ho
const int maxStep        = 4;

// Loop delay rakha taki system stable rahe aur servo ko time mile move hone ka
const int loopDelay      = 60;

void setup() {
  // Servos attach kiye specific pins pe
  servoH.attach(11);
  servoV.attach(8);

  // Starting me servo ko center pe set kiya
  servoH.write(posH);
  servoV.write(posV);

  // Serial start kiya debugging ke liye
  Serial.begin(9600);

  // Bluetooth communication start kiya same baud rate pe
  BT.begin(9600);

  Serial.println("Start in AUTO mode");
}

void loop() {

  // ===== BLUETOOTH INPUT =====
  // Check kiya kyunki user manual commands bhej sakta hai
  if (BT.available()) {
    char cmd = BT.read();

    // Newline ignore kiya taki unwanted commands process na ho
    if (cmd == '\n' || cmd == '\r') return;

    Serial.print("CMD: ");
    Serial.println(cmd);

    // Mode toggle isliye rakha taki user auto aur manual mode switch kar sake
    if (cmd == 'T') {
      autoMode = !autoMode;

      if (autoMode) Serial.println("AUTO MODE");
      else Serial.println("MANUAL MODE");
    }

    // Manual control sirf tab allow kiya jab auto mode off ho
    if (!autoMode) {
      switch (cmd) {

        // Har command servo position change karta hai specific direction me
        case 'F': posV -= 5; break; // up
        case 'B': posV += 5; break; // down
        case 'L': posH -= 5; break; // left
        case 'R': posH += 5; break; // right
        case 'S': break; // stop (no movement)
      }

      // Limit lagayi taki servo physical limits cross na kare (damage avoid)
      posH = constrain(posH, 20, 160);
      posV = constrain(posV, 20, 160);

      // Servo ko new position pe move karaya
      servoH.write(posH);
      servoV.write(posV);
    }
  }

  // ===== AUTO TRACKING =====
  // Auto mode me system khud light follow kare
  if (autoMode) {

    // 4 LDR se light intensity read ki
    int TL = analogRead(LDR_TL);
    int TR = analogRead(LDR_TR);
    int BL = analogRead(LDR_BL);
    int BR = analogRead(LDR_BR);

    // Average calculate kiya taki direction ka idea mile
    int topAvg    = (TL + TR) / 2;
    int bottomAvg = (BL + BR) / 2;
    int leftAvg   = (TL + BL) / 2;
    int rightAvg  = (TR + BR) / 2;

    // Overall brightness check kiya taki low light me system idle rahe
    int overall   = (TL + TR + BL + BR) / 4;

    // Agar light bahut kam hai to movement skip kiya (energy + stability)
    if (overall < lightThreshold) return;

    // Vertical difference nikala (upar vs niche)
    int diffV = topAvg - bottomAvg;

    // Sirf tab move kiya jab difference significant ho (noise avoid)
    if (abs(diffV) > diffThreshold) {

      // Difference ke hisaab se step size adjust kiya (adaptive speed)
      int step = map(abs(diffV), diffThreshold, 500, 1, maxStep);

      // Direction decide kiya aur servo move kiya
      posV += (diffV > 0) ? -step : step;

      // Safety limits apply ki
      posV = constrain(posV, 20, 160);

      servoV.write(posV);
    }

    // Horizontal difference nikala (left vs right)
    int diffH = leftAvg - rightAvg;

    if (abs(diffH) > diffThreshold) {

      // Step dynamic rakha smooth tracking ke liye
      int step = map(abs(diffH), diffThreshold, 500, 1, maxStep);

      // Direction ke hisaab se move kiya
      posH += (diffH > 0) ? -step : step;

      // Limits apply ki taki servo safe rahe
      posH = constrain(posH, 20, 160);

      servoH.write(posH);
    }

    // Delay diya taki system stable rahe aur jitter na ho
    delay(loopDelay);
  }
}
