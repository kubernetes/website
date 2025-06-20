---
title: Zaawansowana współpraca
slug: advanced
content_type: concept
weight: 100
---

<!-- overview -->

Ta strona zakłada, że rozumiesz, jak
[tworzyć nowe treści](/docs/contribute/new-content/) i [recenzować pracę innych](/docs/contribute/review/reviewing-prs/),
i jesteś gotów nauczyć się więcej
sposobów, jak wnosić wkład. Musisz umieć używać klienta wiersza
poleceń Git jak rownież inne narzędzia do wykonania niektórych z tych zadań.

<!-- body -->

## Zaproponuj ulepszenia {#propose-improvements}

[Członkowie](/docs/contribute/participate/roles-and-responsibilities/#members)
SIG Docs mogą proponować usprawnienia.

Po tym, jak przez jakiś czas będziesz wnosić wkład do dokumentacji Kubernetesa,
możesz mieć pomysły na ulepszenie [Przewodnika Stylu](/docs/contribute/style/style-guide/),
[Przewodnika Treści](/docs/contribute/style/content-guide/),
narzędzi wykorzystywanych do tworzenia dokumentacji, stylu strony internetowej,
procesów przeglądania i scalania pull requestów, lub innych aspektów dokumentacji. Dla
maksymalnej przejrzystości, tego rodzaju propozycje muszą być omówione podczas
spotkania SIG Docs lub na [liście mailingowej kubernetes-sig-docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
Dodatkowo, może pomóc posiadanie kontekstu
dotyczącego obecnego sposobu działania i przyczyn podejmowania
wcześniejszych decyzji, zanim zaproponujesz radykalne zmiany. Najszybszym sposobem
uzyskania odpowiedzi na pytania dotyczące obecnego działania dokumentacji jest
zadanie ich na kanale `#sig-docs` na Slacku [kubernetes.slack.com](https://kubernetes.slack.com)

Po odbyciu dyskusji i osiągnięciu porozumienia przez SIG w sprawie
pożądanego wyniku, możesz pracować nad proponowanymi zmianami w sposób
najbardziej odpowiedni. Na przykład, aktualizacja wytycznych stylu lub
funkcjonalności strony internetowej może wymagać otwarcia pull requesta, podczas gdy
zmiana związana z testowaniem dokumentacji może wymagać współpracy z sig-testing.

## Koordynowanie dokumentacji do wydania Kubernetes {#coordinate-docs-for-a-kubernetes-release}

[Zatwierdzający](/docs/contribute/participate/roles-and-responsibilities/#approvers)
SIG Docs mogą koordynować dokumentację dla wydania Kubernetesa.

Każde wydanie Kubernetesa jest koordynowane przez zespół osób
uczestniczących w sig-release (ang. Special Interest Group - SIG).
Inni członkowie zespołu wydania dla danego wydania to ogólny lider
wydania, a także przedstawiciele sig-testing i innych. Aby
dowiedzieć się więcej o procesach wydania Kubernetesa, odwiedź
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release).

Przedstawiciel SIG Docs dla danego wydania koordynuje następujące zadania:

- Monitoruje arkusz śledzący funkcje w poszukiwaniu nowych lub zmienionych
  funkcji mających wpływ na dokumentację. Jeśli dokumentacja dla danej
  funkcji nie będzie gotowa na wydanie, funkcja może nie zostać dopuszczona do wydania.
- Uczestniczy regularnie w spotkaniach sig-release i
  przekazuje aktualizacje dotyczące statusu dokumentacji dla wydania.
- Przegląda i poprawia dokumentację funkcji
  napisaną przez SIG odpowiedzialny za wdrożenie tej funkcji.
- Scala pull requesty związane z wydaniem i
  utrzymuje gałąź Git na potrzeby wydania.
- Mentoruje innych współtwórców SIG Docs, którzy chcą nauczyć
  się, jak pełnić tę rolę w przyszłości. Jest to znane jako "shadowing".
- Publikuje zmiany w dokumentacji związane z
  wydaniem, gdy artefakty wydania zostaną opublikowane.

Koordynowanie wydania to zazwyczaj zobowiązanie na 3-4 miesiące, a
obowiązek ten jest rotacyjnie przejmowany przez zatwierdzających SIG Docs.

## Pomoganie jako Ambasador Nowego Współtwórcy {#serve-as-a-new-contributor-ambassador}

[Zatwierdzający](/docs/contribute/participate/roles-and-responsibilities/#approvers)
SIG Docs mogą pełnić rolę Ambasadorów dla Nowych Współtwórców.

Ambasadorzy Nowych Współtwórców witają nowych współtwórców w
SIG-Docs, proponują PR-y nowym współtwórcom i mentoruują nowych współtwórców
podczas składania przez nich pierwszych kilku PR-ów.

Obowiązki Ambasadorów Nowych Współtwórców obejmują:

- Monitorowanie [kanału Slack #sig-docs](https://kubernetes.slack.com) w poszukiwaniu pytań od nowych współtwórców.
- Współprace z osobami zajmującymi się obsługą PR w celu zidentyfikowania [dobrych pierwszych problemów](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue) dla nowych współtwórców.
- Mentoring nowych współtwórców w trakcie ich pierwszych kilku PR-ów do repozytorium dokumentacji.
- Pomoc nowym współtwórcom w tworzeniu bardziej złożonych PR, które są im potrzebne, aby stać się członkami Kubernetesa.
- [Sponsorowanie współtwórców](/docs/contribute/advanced/#sponsor-a-new-contributor) w ich drodze do zostania członkami Kubernetes.
- Prowadzenie comiesięcznego spotkania w celu pomocy i mentorowania nowych współtwórców.

Obecni Ambasadorzy Nowych Współtwórców są ogłaszani na każdym spotkaniu SIG-Docs oraz w [kanale Kubernetes #sig-docs](https://kubernetes.slack.com).

## Sponsoruj nowego współtwórcę {#sponsor-a-new-contributor}

[Recenzenci](/docs/contribute/participate/roles-and-responsibilities/#reviewers)
SIG Docs mogą sponsorować nowych współtwórców.

Po pomyślnym przesłaniu 5 merytorycznych pull requestów do jednego lub
więcej repozytoriów Kubernetesa, nowy współtwórca może
ubiegać się o [członkostwo](/docs/contribute/participate/roles-and-responsibilities/#members)
w organizacji Kubernetes. Członkostwo
współtwórcy musi być poparte przez dwóch sponsorów, którzy są już recenzentami.

Nowi współtwórcy dokumentacji mogą ubiegać się o sponsorów, pytając na
kanale #sig-docs w [instancji Kubernetes na Slacku](https://kubernetes.slack.com)
lub na [liście mailingowej SIG Docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
Jeśli jesteś pewny pracy
wnioskodawcy, możesz dobrowolnie go sponsorować. Gdy złożą swoje podanie o
członkostwo, odpowiedz na aplikację z "+1" i dołącz szczegóły, dlaczego uważasz, że
wnioskodawca jest odpowiednią osobą do członkostwa w organizacji Kubernetes.

## Pełnij rolę współprzewodniczącego SIG {#serve-as-a-sig-co-chair}

Członkowie [SIG Docs](/docs/contribute/participate/roles-and-responsibilities/#members)
mogą pełnić funkcję współprzewodniczącego SIG Docs.

### Wymagania wstępne {#prerequisites}

Członek zespołu Kubernetesa musi spełniać następujące wymagania, aby zostać współprzewodniczącym:

- Rozumieć przepływy pracy i narzędzi SIG Docs: git, Hugo, lokalizacja, podprojekt bloga
- Rozumieć, w jaki sposób inne Kubernetes SIG i repozytoria wpływają na przepływ
  pracy SIG Docs, w tym: [zespoły w k/org](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml),
  [proces w k/community](https://github.com/kubernetes/community/tree/master/sig-docs),
  wtyczki w
  [k/test-infra](https://github.com/kubernetes/test-infra/), oraz rolę [SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture).
  Ponadto, rozumieć, jak działa
  [proces wydawania dokumentacji Kubernetes](/docs/contribute/advanced/#coordinate-docs-for-a-kubernetes-release).
- Być zatwierdzonym przez społeczność SIG Docs bezpośrednio lub poprzez konsensus bierny.
- Poświać co najmniej 5 godzin tygodniowo (a często więcej) na pełnienie roli przez minimum 6 miesięcy

### Odpowiedzialności {#responsibilities}

Rola współprzewodniczącego jest rolą usługową: współprzewodniczący buduje potencjał współpracowników, zajmuje się procesami i polityką, organizuje i prowadzi spotkania, planuje "PR wranglers", promuje dokumentację w społeczności Kubernetesa, dba o to, aby dokumentacja odnosiła sukcesy w cyklach wydawniczych Kubernetes oraz utrzymuje SIG Docs skupione na efektywnych priorytetach.

Obowiązki obejmują:

- Koncentrowanie działań SIG Docs na tym, by dzięki świetnej dokumentacji zwiększać komfort i satysfakcję programistów.
- Bycie przykładem w przestrzeganiu [kodeksu postępowania społeczności](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) i dbanie, by inni członkowie SIG również się do niego stosowali.
- Douczanie się i ustalanie najlepszych praktyk dla SIG, aktualizując wytyczne dotyczące wkładu
- Planowanie i prowadzenie spotkań SIG: cotygodniowe aktualizacje statusu, kwartalne sesje retrospekcyjne/planistyczne oraz inne według potrzeby
- Planowanie i realizacja sprintów dokumentacyjnych podczas wydarzeń KubeCon i innych konferencji
- Rekrutowanie i działanie jako rzecznik SIG Docs w imieniu {{< glossary_tooltip text="CNCF" term_id="cncf" >}} i jego platynowych partnerów, w tym Google, Oracle, Azure, IBM i Huawei.
- Utrzymywanie płynnego działania SIG

### Prowadzenie efektywnych spotkań {#running-effective-meetings}

Aby zaplanować i przeprowadzać efektywne spotkania, te wytyczne pokazują, co robić, jak to robić i dlaczego.

**Przestrzegaj [kodeksu postępowania społeczności](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)**:

- Zapewnij, że dyskusje są pełne szacunku i otwartości, z użyciem odpowiedniego, włączającego języka.

**Ustaw klarowną agendę**:

- Ustal jasny harmonogram tematów
- Opublikuj agendę z wyprzedzeniem

W przypadku cotygodniowych spotkań, skopiuj i wklej notatki z poprzedniego tygodnia do sekcji "Past meetings" w notatkach.

**Współpracuj nad dokładnymi notatkami**:

- Zapisz dyskusję z zebrania
- Rozważ delegowanie roli osoby prowadzącej notatki

**Przypisz zadania jasno i precyzyjnie**:

- Zarejestruj zadanie do wykonania, osobę do niego przypisaną oraz przewidywaną datę ukończenia.

**Moderuj w razie potrzeby**:

- Jeśli dyskusja odbiega od agendy, skieruj uczestników z powrotem na bieżący temat
- Zrób miejsce na różne style dyskusji, jednocześnie skupiając się na temacie rozmowy i szanując czas uczestników.

**Szanuj czas ludzi**:

Rozpoczynaj i kończ spotkania o czasie.

**Używaj Zoom efektywnie**:

- Zapoznaj się z [wytycznymi Zoom dla Kubernetes](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)
- Zgłoś rolę hosta po zalogowaniu się, wprowadzając klucz hosta

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="Przejmowanie roli gospodarza w Zoom" />

### Nagrywanie spotkań na Zoomie {#recording-meetings-on-zoom}

Kiedy będziesz gotowy do rozpoczęcia nagrywania, kliknij Zapisz w chmurze.

Gdy będziesz gotowy, aby zatrzymać nagrywanie, kliknij Stop.

Film przesyła się automatycznie na YouTube.

### Zakończenie roli współprzewodniczącego SIG (Emeritus) {#offboarding-a-sig-co-chair-emeritus}

Zobacz: [k/community/sig-docs/offboarding.md](https://github.com/kubernetes/community/blob/master/sig-docs/offboarding.md)