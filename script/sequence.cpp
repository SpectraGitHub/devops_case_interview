#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>

using namespace std;

// funksjon for å sjekke om en serie er gyldig
bool gyldigSerie(const vector<int>& serie) {
    bool okende = true;
    bool synkende = true;

    // gå gjennom serien og sjekk forskjellen mellom tallene
    for (size_t i = 0; i < serie.size() - 1; ++i) {
        // regn ut forskjellen mellom to påfølgende tall
        int diff = serie[i + 1] - serie[i];

        // hvis forskjellen er mindre enn 1 eller større enn 3, er den ikke økende
        if (diff < 1 || diff > 3) {
            okende = false;
        }
        // hvis forskjellen er større enn -1 eller mindre enn -3, er den ikke synkende
        if (diff > -1 || diff < -3) {
            synkende = false;
        }
    }

    // returner true hvis serien er enten økende eller synkende
    return okende || synkende;
}

// funksjon for å telle antall gyldige serier i en fil
int antallGyldigeSerier(const string& filnavn) {
    ifstream fil(filnavn);
    if (!fil.is_open()) {
        cerr << "feil ved åpning av fil: " << filnavn << endl;
        return 0;
    }

    int gyldigAntall = 0;
    string linje;

    // les filen linje for linje
    while (getline(fil, linje)) {
        istringstream iss(linje);
        vector<int> serie;
        int num;

        // del opp linjen i tall og legg dem i en vektor
        while (iss >> num) {
            serie.push_back(num);
        }

        // sjekk om serien er gyldig og øk telleren hvis den er det
        if (gyldigSerie(serie)) {
            ++gyldigAntall;
        }
    }

    fil.close();
    return gyldigAntall;
}


void testSerie() {
    vector<vector<int>> serier = {
        {7, 6, 4, 2, 1},
        {1, 2, 7, 8, 9},
        {9, 7, 6, 2, 1},
        {1, 3, 2, 4, 5},
        {8, 6, 4, 4, 1},
        {1, 3, 6, 7, 9}
    };

    for (const auto& serie : serier) {
        cout << "sjekker serie: ";
        for (int n : serie) {
            cout << n << " ";
        }
        cout << endl;

        bool gyldig = gyldigSerie(serie);
        cout << "serien er " << (gyldig ? "gyldig" : "ugyldig") << "\n\n";
    }
}

int main() {
    // kjør test eksempelte
    cout << "Tester eksempelet fra README.md:" << endl;
    testSerie();

    // kjør den vanlige koden
    string inputFil = "input.txt";
    int gyldigeSerierAntall = antallGyldigeSerier(inputFil);
    cout << "antall gyldige serier i filen: " << gyldigeSerierAntall << endl;

    return 0;
}