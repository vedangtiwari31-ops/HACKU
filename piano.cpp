#include <iostream>
#include <windows.h>

int main() {
    char key;

    std::cout << "Indian Keyboard Piano \n";
    std::cout << "Lower Swara : a s d f g h j  -> Sa Re Ga Ma Pa Dha Ni\n";
    std::cout << "Upper Swara  : A S D F G H J  -> SA RE GA MA PA DHA NI\n";
    std::cout << "q = Quit\n\n";

    while (true) {
        std::cout << "Press a key: ";
        std::cin >> key;

        if (key == 'q') {
            std::cout << "Exiting piano...\n";
            break;
        }

      int duration = 400;

// Middle octave (lowercase)
if (key == 'a') { std::cout << "Sa\n";  Beep(261, duration); }
else if (key == 's') { std::cout << "Re\n";  Beep(293, duration); }
else if (key == 'd') { std::cout << "Ga\n";  Beep(329, duration); }
else if (key == 'f') { std::cout << "Ma\n";  Beep(349, duration); }
else if (key == 'g') { std::cout << "Pa\n";  Beep(392, duration); }
else if (key == 'h') { std::cout << "Dha\n"; Beep(440, duration); }
else if (key == 'j') { std::cout << "Ni\n";  Beep(493, duration); }

// Upper octave (uppercase = ×2)
else if (key == 'A') { std::cout << "SA (Upper)\n";  Beep(261 * 2, duration); }
else if (key == 'S') { std::cout << "RE (Upper)\n";  Beep(293 * 2, duration); }
else if (key == 'D') { std::cout << "GA (Upper)\n";  Beep(329 * 2, duration); }
else if (key == 'F') { std::cout << "MA (Upper)\n";  Beep(349 * 2, duration); }
else if (key == 'G') { std::cout << "PA (Upper)\n";  Beep(392 * 2, duration); }
else if (key == 'H') { std::cout << "DHA (Upper)\n"; Beep(440 * 2, duration); }
else if (key == 'J') { std::cout << "NI (Upper)\n";  Beep(493 * 2, duration); }
        else {
            std::cout << "Invalid key\n";
        }
    }

    return 0;
}
