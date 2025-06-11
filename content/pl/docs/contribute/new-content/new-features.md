---
title: Dokumentowanie funkcji nowego wydania
linktitle: Dokumentowanie nowego wydania
content_type: concept
main_menu: true
weight: 20
card:
  name: contribute
  weight: 45
  title: Dokumentowanie funkcji nowego wydania
---
<!-- overview -->

Każda główna wersja Kubernetesa wprowadza nowe funkcje, które wymagają
dokumentacji. Nowe wersje przynoszą również aktualizacje do istniejących
funkcji i dokumentacji (na przykład awansowanie funkcji z wersji alpha do beta).

Zazwyczaj SIG odpowiedzialny za funkcję przesyła szkic dokumentacji
funkcji jako pull request do odpowiedniego gałęzi rozwojowej w repozytorium
`kubernetes/website`, a ktoś z zespołu SIG Docs dostarcza uwagi redakcyjne
lub edytuje szkic bezpośrednio. Ta sekcja opisuje konwencje dotyczące
rozgałęzień (ang. branching) oraz proces stosowany podczas wydania przez obie grupy.

Więcej o publikowaniu nowych funkcji na blogu przeczytasz w
sekcji [komunikaty po wydaniu](/docs/contribute/blog/release-comms/).

<!-- body -->

## Dla współtwórców dokumentacji {#for-documentation-contributors}

Ogólnie rzecz biorąc, współtwórcy dokumentacji nie piszą treści od
podstaw na potrzeby wydania. Zamiast tego współpracują z SIG tworzącym
nową funkcję, aby dopracować szkic dokumentacji i przygotować go do wydania.

Po wybraniu fukncji do udokumentowania lub wsparcia, zapytaj o nią na kanale
Slack `#sig-docs`, podczas cotygodniowego spotkania SIG Docs lub bezpośrednio w
zgłoszeniu PR wystawionym przez SIG odpowiedzialny za funkcje. Jeśli otrzymasz
zgodę, możesz edytować PR za pomocą jednej z technik opisanych w
[Wprowadź zmiany do PR innej osoby](/docs/contribute/review/for-approvers/#commit-into-another-person-s-pr).

### Dowiedz się o nadchodzących funkcjach {#find-out-about-upcoming-features}

Aby dowiedzieć się o nadchodzących funkcjach, weź udział w
cotygodniowym spotkaniu SIG Release (zobacz stronę [społeczności](/community/) w
celu uzyskania informacji o nadchodzących spotkaniach) i monitoruj
dokumentację dotyczącą wydania w repozytorium
[kubernetes/sig-release](https://github.com/kubernetes/sig-release/). Każde wydanie ma podkatalog w
katalogu [/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases).
Podkatalog zawiera harmonogram
wydania, szkic notatek do wydania oraz dokument z listą każdej osoby w zespole wydania.

Harmonogram wersji zawiera linki do wszystkich innych dokumentów, spotkań,
protokołów spotkań i kamieni milowych związanych z
wydaniem. Zawiera również informacje o celach i harmonogramie wydania oraz
wszelkich specjalnych procesach wdrożonych dla tego
wydania. Pod koniec dokumentu zdefiniowano kilka terminów związanych z wydaniem.

Ten dokument zawiera również link do
**Arkusza śledzenia funkcji**, który jest oficjalnym sposobem na poznanie
wszystkich nowych funkcji planowanych do wprowadzenia w wydaniu.

Dokumentacja zespołu odpowiadającego za kolejne wydanie zawiera listę osób do przypisanych do
różnych ról. Jeśli nie jest jasne, do kogo się zwrócić w sprawie konkretnej funkcji lub
pytania, które masz, możesz skorzystać z jednego z dwóch rozwiązań: weź udział w spotkaniu zespołu,
aby zadać swoje pytanie, lub skontaktuj się z liderem wydania, aby mógł Cię odpowiednio skierować.

Szkic notatek z wydania to dobre miejsce, aby dowiedzieć się o specyficznych
funkcjach, zmianach, przestarzałych elementach i innych kwestiach dotyczących
wydania. Ponieważ treść nie jest ostateczna aż do późnego etapu, warto zachować ostrożność.

### Arkusz śledzenia funkcji {#feature-tracking-sheet}

Arkusz śledzenia funkcji [dla danej wersji Kubernetesa](https://github.com/kubernetes/sig-release/tree/master/releases)
wymienia
każdą funkcję, która jest planowana do wydania. Każdy element zawiera nazwę
funkcji, link do głównego problemu na GitHubie, poziom
stabilności (Alpha, Beta lub Stable), SIG i osobę odpowiedzialną za
jej wdrożenie, czy wymaga dokumentacji, projekt notatki o wydaniu
dla funkcji oraz czy została zintegrowana. Pamiętaj o następujących zasadach:

- Funkcje w wersji Beta i Stable są zazwyczaj
  priorytetowane wyżej w dokumentacji niż funkcje w wersji Alfa.
- Trudno jest przetestować (a tym samym udokumentować) funkcję, która nie została
  zmergowana, lub przynajmniej jest uważana za kompletną w swoim PR.
- Określenie, czy funkcja wymaga dokumentacji, jest procesem manualnym. Nawet jeśli
  funkcja nie jest oznaczona jako wymagająca dokumentacji, może być konieczne jej udokumentowanie.

## Dla developerów lub innych członków SIG {#for-developers-or-other-sig-members}

Ta sekcja zawiera informacje dla członków innych SIG
Kubernetesów dokumentujących nowe funkcje na potrzeby wydania.

Jeśli jesteś członkiem SIG, który rozwija nową funkcję dla
Kubernetesa, musisz współpracować z SIG Docs, aby mieć pewność, że
Twoja funkcja zostanie udokumentowana na czas przed wydaniem.
Sprawdź [arkusz śledzenia funkcji](https://github.com/kubernetes/sig-release/tree/master/releases)
lub sprawdź kanał Slack
Kubernetes `#sig-release`, aby zweryfikować szczegóły harmonogramu i terminy.

### Otwórz tymczasowy PR {#open-a-placeholder-pr}

1. Otwórz **szkic** pull requestu do gałęzi
   `dev-{{< skew nextMinorVersion >}}` w repozytorium `kubernetes/website`, z małym
   commitem, który później zmienisz. Aby utworzyć szkic pull
   requestu, użyj rozwijanego menu **Create Pull Request** i wybierz
   **Create Draft Pull Request**, następnie kliknij **Draft Pull Request**.
1. Edytuj opis pull requesta, aby zawierał linki do PR-ów w
   [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) oraz zgłoszeń w [kubernetes/enhancements](https://github.com/kubernetes/enhancements).
1. Zostaw komentarz w powiązanym zgłoszeniu w tym repozytorium
   [kubernetes/enhancements](https://github.com/kubernetes/enhancements) z linkiem do PR, aby powiadomić osobę zajmującą się dokumentacją
   tej wersji, że dokumentacja dotycząca funkcji jest w przygotowaniu i powinna być śledzona w tym wydaniu.

Jeśli Twoja funkcjonalność nie wymaga żadnych zmian w dokumentacji, upewnij się, że zespół
sig-release o tym wie, wspominając o tym na kanale Slack `#sig-release`. Jeśli funkcjonalność wymaga
dokumentacji, ale PR nie został utworzony, funkcjonalność może zostać usunięta z kamienia milowego.

### PR gotowy do przeglądu {#pr-ready-for-review}

Kiedy będziesz gotowy, wypełnij swój tymczasowy PR dokumentacją funkcji i zmień
stan PR z roboczego na **ready for review**. Aby oznaczyć pull request jako gotowy
do przeglądu, przejdź do pola scalania (ang. merge box) i kliknij **Ready for review**.

Najlepiej jak potrafisz opisz swoją funkcję i sposób jej użycia. Jeśli
potrzebujesz pomocy w strukturyzacji swojej dokumentacji, zapytaj na kanale Slack `#sig-docs`.

Gdy ukończysz swój materiał, osoba odpowiedzialna za dokumentację przypisana do Twojej funkcji go
przegląda. Aby zapewnić dokładność techniczną, treść może również wymagać przeglądu technicznego
przez odpowiednie SIG-i. Skorzystaj z ich sugestii, aby dopracować treść do stanu gotowego do wydania.

Jeśli twoja funkcja wymaga dokumentacji, a pierwsza wersja treści nie zostanie
dostarczona, funkcja może zostać usunięta z kamienia milowego.

#### Bramki funkcji (ang. feature gates) {#ready-for-review-feature-gates}

Jeśli Twoja funkcja jest funkcją Alfa lub Beta i jest włączana warunkowo
bramką funkcji (ang. feature gate), potrzebujesz dla niej pliku bramki
funkcji wewnątrz `content/en/docs/reference/command-line-tools-reference/feature-gates/`.
Nazwa pliku powinna być nazwą bramki funkcji z sufiksem `.md`.
Możesz spojrzeć na inne pliki już znajdujące się w tym samym katalogu, aby
uzyskać wskazówkę, jak powinien wyglądać Twój plik. Zwykle wystarczy jeden
akapit; dla dłuższych wyjaśnień dodaj dokumentację w innym miejscu i dodaj do niej link.

Aby upewnić się, że twój feature gate pojawi się w tabeli
[Alpha/Beta Feature gates](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features),
dodaj następujące
informacje do sekcji
[front matter](https://gohugo.io/content-management/front-matter/) w pliku Markdown z opisem:

```yaml
stages:
  - stage: <alpha/beta/stable/deprecated>  # Specify the development stage of the feature gate
    defaultValue: <true or false>     # Set to true if enabled by default, false otherwise
    fromVersion: <Version>            # Version from which the feature gate is available
    toVersion: <Version>              # (Optional) The version until which the feature gate is available
```

W przypadku nowych bramek funkcji wymagany jest również osobny opis
bramki funkcji; utwórz nowy plik Markdown w
`content/en/docs/reference/command-line-tools-reference/feature-gates/` (użyj innych plików jako szablonu).

Gdy zmieniasz bramkę funkcji z domyślnie wyłączonej na domyślnie włączoną,
może być konieczne zmienienie również innej
dokumentacji (nie tylko listy bramek funkcji). Uważaj na zwroty takie jak „Pole
`exampleSetting` jest polem beta i jest domyślnie
wyłączone. Możesz je włączyć, włączając bramkę funkcji `ProcessExampleThings`.”

Jeśli Twoja funkcja osiągnęła status GA lub została oznaczona jako
przestarzała, dodaj dodatkowy wpis `stage` w ramach bloku `stages` w pliku opisu. Upewnij się,
że etapy Alpha i Beta pozostają nienaruszone. Ten krok przenosi bramkę
funkcji z [Feature gates for Alpha/Beta](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
do
[Feature gates for graduated or deprecated features](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features).
Na przykład:

{{< highlight yaml "linenos=false,hl_lines=10-17" >}}
stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
  # Added a `toVersion` to the previous stage.
    toVersion: "1.18"
  # Added 'stable' stage block to existing stages.
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.27"
{{< / highlight >}}

Ostatecznie Kubernetes przestanie w ogóle uwzględniać bramę funkcji.
Aby zasygnalizować usunięcie bramy funkcji, uwzględnij `removed: true` w
przedniej części odpowiedniego pliku opisu. Wprowadzenie tej zmiany
oznacza, że informacje o bramie funkcji przenoszą się z
[Skróty funkcji dla ukończonych lub przestarzałych funkcji](/docs/reference/command-line-tools-reference/feature-gates-removed/#feature-gates-that-are-removed) do dedykowanej
strony
zatytułowanej [Skróty funkcji (usunięte)](/docs/reference/command-line-tools-reference/feature-gates-removed/),
łącznie z jej opisem.

### Wszystkie PR-y zostały zrecenzowane i są gotowe do scalenia {#all-prs-reviewed-and-ready-to-merge}

Jeśli Twój PR nie został jeszcze scalony z gałęzią `dev-{{< skew nextMinorVersion >}}`
przed terminem wydania, współpracuj z osobą odpowiedzialną za dokumentację i zarządzającą wydaniem,
aby dodać go przed terminem. Jeśli Twoja funkcja potrzebuje dokumentacji, a
dokumentacja nie jest gotowa, funkcja może zostać usunięta z bieżącego planu (**milestone**).
