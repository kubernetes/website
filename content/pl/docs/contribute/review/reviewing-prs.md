---
title: Przeglądanie pull requestów
content_type: concept
main_menu: true
weight: 10
---

<!-- overview -->

Każdy może przejrzeć pull requesty zgłoszone do dokumentacji. Odwiedź sekcję
[pull requests](https://github.com/kubernetes/website/pulls) w repozytorium strony internetowej Kubernetes, aby zobaczyć otwarte pull requesty.

Przeglądanie pull requestów do dokumentacji jest doskonałym sposobem na zapoznanie się ze
społecznością Kubernetes. Pomaga to w poznaniu bazy kodu i budowaniu zaufania z innymi współtwórcami.

Przed przystąpieniem do przeglądu:

- Przeczytaj [przewodnik treści](/docs/contribute/style/content-guide/) oraz
  [przewodnik stylu](/docs/contribute/style/style-guide/), aby móc zostawiać merytoryczne komentarze.
- Zrozum różne [role i obowiązki](/docs/contribute/participate/roles-and-responsibilities/)
  w
  społeczności dokumentacji Kubernetes.

<!-- body -->

## Zanim zaczniesz {#before-you-begin}

Zanim rozpoczniesz przegląd:

- Przeczytaj [Kodeks postępowania CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
  i upewnij się, że zawsze go przestrzegasz.
- Bądź uprzejmy, wyrozumiały i pomocny.
- Komentuj pozytywne aspekty PR-ów, jak również wprowadzone zmiany.
- Bądź empatyczny i świadomy, jak Twoja recenzja może być odebrana.
- Przyjmuj, że intencje są dobre, i zadawaj pytania wyjaśniające.
- Doświadczeni współtwórcy, rozważcie współpracę z nowymi współtwórcami, których praca wymaga obszernych zmian.

## Proces przeglądu {#review-process}

Przeglądaj pull requesty pod kątem treści i stylu, używając języka angielskiego.
Rysunek 1 przedstawia kroki procesu przeglądu. Szczegóły dla każdego kroku znajdują się poniżej.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[Rozpocznij przegląd]
    direction TB
    S[ ] -.-
    M[dodaj komentarze] --> N[przejrzyj zmiany]
    N --> O[nowi współtwórcy<br>powinni wybrać komentarz]
    end
    subgraph third[Wybierz PR]
    direction TB
    T[ ] -.-
    J[przeczytaj opis<br>i komentarze]--> K[podgląd zmian<br>w Netlify preview build]
    end

  A[Przeglądaj listę otwartych PR]--> B[Filtruj otwarte PR<br>według etykiety]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

Rysunek 1. Kroki procesu przeglądu.


1. Przejdź do [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
   Zobaczysz listę wszystkich pull requestów dotyczących strony internetowej i dokumentacji Kubernetes.

2. Przefiltruj otwarte PR-y używając jednej lub wszystkich z poniższych etykiet:

   - `cncf-cla: yes` (Zalecane): PR-y (pull requesty) przesłane przez
     współtwórców, którzy nie podpisali CLA, nie mogą być scalane. Zobacz
     [Podpisz CLA](/docs/contribute/new-content/#sign-the-cla) po więcej informacji.
   - `language/en` (Zalecane): Filtruje tylko PR-y w języku angielskim.
   - `size/<size>`: filtruje PR-y o określonym rozmiarze. Jeśli jesteś nowy, zacznij od mniejszych PR-ów.

   Dodatkowo upewnij się, że PR nie jest oznaczony jako praca w toku.
   PR-y z etykietą `work in progress` nie są jeszcze gotowe do przeglądu.

3. Gdy wybierzesz PR do przeglądu, zrozum zmianę poprzez:

   - Czytanie opisu pull requesta, aby zrozumieć wprowadzone zmiany, oraz zapoznanie się z powiązanymi zgłoszeniami
   - Czytanie wszelkich komentarzy innych recenzentów
   - Kliknięcie na kartę **Files changed**, aby zobaczyć zmienione pliki i linie
   - Podgląd zmian w podglądzie Netlify poprzez przewinięcie do sekcji
     sprawdzania builda PR na dole karty **Conversation**. Oto zrzut ekranu
     (to pokazuje wersję desktopową GitHub; jeśli przeglądasz na tablecie
     lub smartfonie, interfejs webowy GitHub jest nieco inny):
     {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="Szczegóły pull request GitHub, w tym link do podglądu Netlify" >}} Aby
     otworzyć podgląd, kliknij
     na link **Details** w wierszu **deploy/netlify** na liście sprawdzeń.

4. Przejdź do karty **Files changed**, aby rozpocząć przegląd.

   1. Kliknij symbol `+` obok linii, na której chcesz dodać komentarz.
   1. Wypełnij wszelkie uwagi dotyczące linii i kliknij **Add single comment** (jeśli masz
      tylko jeden komentarz do dodania) lub **Start a review** (jeśli masz wiele komentarzy do dodania).
   1. Po zakończeniu, kliknij **Review changes** na górze strony. Tutaj możesz
      dodać podsumowanie swojej recenzji (i zostawić kilka
      pozytywnych komentarzy dla współtwórcy!). Zawsze prosimy o używanie **Comment**

     - Unikaj klikania przycisku **Request changes** podczas kończenia swojej
       recenzji. Jeśli chcesz zablokować scalanie PR przed
       wprowadzeniem dalszych zmian, możesz zostawić komentarz "/hold".
       Wspomnij, dlaczego ustawiasz blokadę i opcjonalnie określ warunki, pod którymi
       blokada może zostać usunięta przez Ciebie lub innych recenzentów.

     - Unikaj klikania przycisku **Approve** po zakończeniu swojej
       recenzji. Najczęściej zaleca się pozostawienie komentarza "/approve".

## Przeglądanie listy kontrolnej {#reviewing-checklist}

Podczas przeglądania kieruj się następującymi wskazówkami jako punkt wyjścia.

### Język i gramatyka {#language-and-grammar}

- Czy w tekście występują oczywiste błędy językowe lub gramatyczne? Czy istnieje lepszy sposób na sformułowanie czegoś?
  - Skoncentruj się na języku i gramatyce części strony, które
    autor zmienia. Jeśli autor wyraźnie nie dąży do zaktualizowania
    całej strony, nie ma obowiązku naprawiać każdego problemu na stronie.
  - Gdy PR aktualizuje istniejącą stronę, powinieneś skupić się na
    przeglądzie części strony, które są aktualizowane. Ta zmieniona treść powinna
    być sprawdzona pod kątem poprawności technicznej i redakcyjnej. Jeśli
    znajdziesz błędy na stronie, które nie są bezpośrednio związane z tym, co
    autor PR próbuje rozwiązać, powinno być to traktowane jako oddzielna
    kwestia (najpierw sprawdź, czy nie ma już istniejącego zgłoszenia dotyczącego tego).
  - Uważaj na pull requesty, które _przenoszą_ treść. Jeśli autor zmienia nazwę strony lub łączy
    dwie strony, my (Kubernetes SIG Docs) zazwyczaj unikamy proszenia tego autora o poprawienie każdego
    drobnego błędu gramatycznego lub ortograficznego, którą moglibyśmy zauważyć w tej przeniesionej treści.
- Czy istnieją jakieś skomplikowane lub archaiczne słowa, które można by zastąpić prostszym słowem?
- Czy istnieją jakieś słowa, terminy lub zwroty, które można by zastąpić niedyskryminacyjną alternatywą?
- Czy wybór słów i ich pisownia z użyciem wielkich liter są zgodne z [przewodnikiem stylu](/docs/contribute/style/style-guide/)?
- Czy są długie zdania, które mogłyby być krótsze lub mniej złożone?
- Czy istnieją jakieś długie akapity, które mogą lepiej działać jako lista lub tabela?

### Treść {#content}

- Czy podobna treść istnieje w innym miejscu na stronie Kubernetes?
- Czy treść nadmiernie zawiera linki do dokumentacji spoza witryny, dokumentacji poszczególnych dostawców lub dokumentacji niebędącej otwartym źródłem?

### Strona internetowa {#website}

- Czy ten PR zmienił lub usunął tytuł strony, slug/alias lub link kotwicy?
  Jeśli tak, czy są uszkodzone linki w wyniku tego PR?
  Czy istnieje inna opcja, jak zmiana tytułu strony bez zmieniania sluga?

- Czy PR wprowadza nową stronę? Jeśli tak:

  - Czy strona używa odpowiedniego [typu zawartości strony](/docs/contribute/style/page-content-types/)
    i powiązanych shortcode'ów Hugo?
  - Czy strona pojawia się poprawnie w nawigacji bocznej sekcji (lub w ogóle)?
  - Czy strona powinna pojawić się na liście [Strona główna dokumentacji](/docs/home/)?

- Czy zmiany pojawiają się w podglądzie Netlify? Bądź szczególnie
  czujny w odniesieniu do list, bloków kodu, tabel, notatek i obrazów.

### Blog {#blog}

- Wczesne opinie na temat postów na blogu są mile widziane za pośrednictwem Google Doc lub HackMD. Prosimy o wczesne zwrócenie się o opinię na [kanale Slack #sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J).
- Przed przeglądaniem PR-ów dotyczących bloga, zapoznaj się z [Przesyłanie postów na blogu i studiów przypadków](/docs/contribute/new-content/blogs-case-studies/).
- Jesteśmy skłonni zamieścić dowolny artykuł blogowy opublikowany na https://kubernetes.dev/blog/ (blog dla współtwórców) pod warunkiem, że:
- zmirorowany artykuł ma tę samą datę publikacji co oryginał (powinien mieć również tę samą godzinę publikacji, ale w specjalnych przypadkach można ustawić znacznik czasu do 12 godzin później)
  - dla pull requestów, w których oryginalny artykuł został scalony z https://kubernetes.dev/,
    nie było (i nie będzie) żadnych artykułów publikowanych na głównym blogu w okresie pomiędzy
    publikacją oryginalnego i zmirrorywanego artykułu. Dzieje się tak, ponieważ nie chcemy, aby
    artykuły pojawiały się w kanałach użytkowników (np. RSS) w innym miejscu niż na końcu ich strumienia.
  - oryginalny artykuł nie narusza żadnych zalecanych wytycznych dotyczących przeglądu ani norm społeczności.
  - Powinieneś ustawić kanoniczny URL dla zmirorowanego artykułu, na URL oryginalnego artykułu
    (możesz użyć podglądu, aby przewidzieć URL i wypełnić to przed faktyczną publikacją). Użyj pola `canonicalUrl`
    w [front matter](https://gohugo.io/content-management/front-matter/) do tego celu.
- Rozważ docelowych odbiorców i sprawdź czy wpis na blogu jest odpowiedni dla
  kubernetes.io . Na przykład, jeśli docelowymi odbiorcami są wyłącznie współtwórcy
  Kubernetes, to bardziej odpowiednie może być kubernetes.dev, lub jeśli wpis na blogu
  dotyczy ogólnej inżynierii platformy, to może być bardziej odpowiedni na innej stronie.

  Ta zasada dotyczy również lustrzanych artykułów; choć jesteśmy otwarci na rozważenie wszystkich
  poprawnych artykułów zgłoszonych przez współautorów do mirroringu, nie wszystkie z nich zostają zmirrorywane.

- Oznaczamy artykuły na blogu jako utrzymywane (`evergreen: true` w nagłówku), tylko jeśli
  projekt Kubernetes zobowiązuje się do ich utrzymywania na czas nieokreślony. Niektóre artykuły
  na blogu zdecydowanie na to zasługują, i zawsze oznaczamy nasze ogłoszenia o wydaniu jako
  evergreen. Skonsultuj się z innymi współtwórcami, jeśli nie jesteś pewny jak to ocenić w tym punkcie.
- [Przewodnik po treści](/docs/contribute/style/content-guide/) ma bezwarunkowe zastosowanie do artykułów na blogu oraz PR-ów, które je dodają.
  Pamiętaj, że niektóre ograniczenia w przewodniku stwierdzają, że są one istotne tylko dla dokumentacji; te ograniczenia nie dotyczą artykułów na blogu.
- [Przewodnik stylu](/docs/contribute/style/style-guide/) w dużej mierze odnosi się również do PR-ów na blogu, ale robimy pewne wyjątki.
  
  - można używać "my" w artykule na blogu, który ma wielu autorów lub w przypadku, gdy wprowadzenie do artykułu wyraźnie wskazuje, że autor pisze w imieniu określonej grupy.
  - unikamy używania shortcodów Kubernetes do wyróżnień (takich jak `{{</* caution */>}}`)
  - stwierdzenia dotyczące przyszłości są w porządku, choć
    używamy ich ostrożnie w oficjalnych ogłoszeniach w imieniu Kubernetes
  - przykłady kodu nie muszą używać skrótu `{{</* code_sample */>}}` i często lepiej jest, jeśli tego nie robią
  - jest w porządku, aby autorzy pisali artykuł w swoim własnym stylu,
    o ile większość czytelników zrozumie przekazywany punkt
- [Przewodnik po diagramach](/docs/contribute/style/diagram-guide/) jest skierowany do
  dokumentacji Kubernetes, a nie do artykułów na blogu. Nadal dobrze jest być z nim zgodnym, ale:
  - preferujemy SVG zamiast rastrowych formatów diagramów, a także zamiast Mermaid (możesz nadal umieścić źródło Mermaid w komentarzu)
  - nie ma potrzeby podpisywania diagramów jako Rysunek 1, Rysunek 2 itd.

### Inne {#other}

- Zwróć uwagę na [drobne edycje](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)
  ; jeśli uznasz, że dana zmiana jest jedynie kosmetyczna, zwróć uwagę na
  obowiązującą politykę (jeśli jednak realnie poprawia treść, jej akceptacja jest w porządku).
- Zachęcaj autorów dokonujących poprawek białych znaków, aby robili to w
  pierwszym commicie swojego PR, a następnie dodawali inne zmiany na tej podstawie.
  To ułatwia zarówno scalanie, jak i przeglądanie. Szczególnie zwracaj uwagę na
  trywialną zmianę, która występuje w pojedynczym commicie wraz z dużą ilością
  czyszczenia białych znaków (a jeśli to zauważysz, zachęć autora do naprawienia tego).

Jako recenzent, jeśli zauważysz drobne problemy z PR, które nie są istotne dla
znaczenia, takie jak literówki lub nieprawidłowe odstępy, poprzedź swoje komentarze prefiksem `nit:`.
Dzięki temu autor będzie wiedział, że ta część Twojej opinii nie jest krytyczna.

Jeśli rozważasz zatwierdzenie pull requesta i wszystkie pozostałe uwagi są oznaczone jako nit, możesz mimo to
scalić PR. W takim przypadku często warto otworzyć problem dotyczący pozostałych nitów. Zastanów się, czy
jesteś w stanie spełnić wymagania, aby oznaczyć ten nowy problem jako
[dobre na pierwsze zgłoszenie (ang. Good First Issue)](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue); jeśli tak, są one dobrym źródłem.
