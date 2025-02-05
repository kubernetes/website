---
title: Wranglerzy pull requestów
content_type: concept
weight: 20
---

<!-- overview -->

[Zatwierdzający](/docs/contribute/participate/roles-and-responsibilities/#approvers)
SIG Docs pełnią tygodniowe dyżury
[zarządzając pull requestami](https://github.com/kubernetes/website/wiki/PR-Wranglers) dla repozytorium.

Ta sekcja dotyczy obowiązków wranglera pull requestów (ang. PR wrangler). Aby uzyskać więcej
informacji na temat przeprowadzania dobrych recenzji, zobacz [Przeglądanie zmian](/docs/contribute/review/).

<!-- body -->

## Obowiązki {#duties}

Każdego dnia w tygodniowej zmianie jako Wrangler PR:

- Przejrzyj [otwarte pull requesty](https://github.com/kubernetes/website/pulls)
  pod kątem jakości i zgodności z [Przewodnikiem stylu](/docs/contribute/style/style-guide/)
  oraz [Przewodnikiem treści](/docs/contribute/style/content-guide/).
  - Zacznij od najmniejszych PR-ów (`size/XS`) i kończ na największych
    (`size/XXL`). Zrecenzuj jak najwięcej PR-ów.
- Upewnij się, że współautorzy PR podpisali [CLA](https://github.com/kubernetes/community/blob/master/CLA.md).
  - Użyj [tego](https://github.com/zparnold/k8s-docs-pr-botherer)
    skryptu, aby przypomnieć współtwórcom, którzy nie podpisali CLA, aby to zrobili.
- Przekaż informacje zwrotne na temat zmian i poproś o recenzje techniczne od członków innych SIG.
  - Podaj sugestie w linii dotyczące propozycji zmian treści w PR.
  - Jeśli musisz zweryfikować zawartość, skomentuj PR i poproś o więcej szczegółów.
  - Przypisz odpowiednią etykietę `sig/`.
  - W razie potrzeby przypisz recenzentów z bloku `reviewers:` w przedniej (ang. front matter) części pliku.
  - Możesz również oznaczyć [SIG](https://github.com/kubernetes/community/blob/master/sig-list.md)
    do przeprowadzenia recenzji, dodając komentarz `@kubernetes/<sig>-pr-reviews` do PR.
- Użyj komentarza `/approve`, aby zatwierdzić PR do scalenia. Scal PR, gdy będzie gotowy.
  - PR powinny mieć komentarz `/lgtm` od innego członka przed scaleniem.
  - Rozważ zaakceptowanie technicznie poprawnej treści, która nie spełnia
    [wytycznych dotyczących stylu](/docs/contribute/style/style-guide/). Zatwierdzając zmianę, otwórz nowe
    zgłoszenie, aby rozwiązać kwestię stylu. Zwykle możesz uznać te poprawki stylu jako zgłoszenie
    typu [dobre na pierwsze zadanie](https://kubernetes.dev/docs/guide/help-wanted/#good-first-issue).
  - Użycie poprawek stylu jako dobrych pierwszych problemów to dobry sposób
    na zapewnienie łatwiejszych zadań, które pomogą nowym współtwórcom wdrożyć się.
- Sprawdź również pull requesty dotyczące kodu
  [generatora dokumentacji referencyjnej](https://github.com/kubernetes-sigs/reference-docs) i dokonaj ich przeglądu (lub poproś o pomoc).
- Wspieraj [wranglera zgłoszeń](/docs/contribute/participate/issue-wrangler/) w
  codziennym porządkowaniu i tagowaniu zgłoszeń. Zobacz
  [Porządkowanie i kategoryzowanie zgłoszeń](/docs/contribute/review/for-approvers/#triage-and-categorize-issues) aby
  zapoznać się z wytycznymi dotyczącymi korzystania z metadanych przez SIG Docs.

{{< note >}}
Obowiązki wranglera pull requestów nie mają zastosowania do PR dotyczących lokalizacji (PR
w językach innych niż angielski). Zespoły ds. lokalizacji mają własne procesy i
zespoły do przeglądania PR w swoim języku. Jednak często pomocne jest, aby upewnić się, że
PR w języku są prawidłowo oznaczone, przejrzeć małe PR niezależne od języka (jak
aktualizacja linku), lub oznaczyć recenzentów lub współpracowników w długotrwałych PR
(te, które zostały otwarte ponad 6 miesięcy temu i nie były aktualizowane od miesiąca lub dłużej).
{{< /note >}}

### Przydatne zapytania GitHub dla wranglerów {#helpful-github-queries-for-wranglers}

Poniższe zapytania są pomocne podczas pracy z danymi. Po przeanalizowaniu tych
zapytań, pozostała lista PR-ów do przeglądu jest zazwyczaj mała. Te zapytania
wykluczają PR-y lokalizacyjne. Wszystkie zapytania dotyczą głównej gałęzi z wyjątkiem ostatniego.

- [Brak CLA, nie kwalifikuje się do scalenia](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen):
  Przypomnij
  współtwórcy o konieczności podpisania CLA. Jeśli zarówno bot jak i człowiek przypomnieli im, zamknij PR
  i przypomnij im, że mogą go ponownie otworzyć po podpisaniu CLA. **Nie przeglądaj PR-ów, których autorzy nie podpisali CLA!**
- [Needs LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm):
  Lista
  PR, które potrzebują LGTM od członka zespołu. Jeśli PR wymaga przeglądu technicznego, dodaj
  jednego z recenzentów zasugerowanych przez bota. Jeśli zawartość wymaga poprawek, dodaj sugestie i opinie w treści.
- [Ma LGTM, wymaga zatwierdzenia dokumentacji](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+):
  Wyświetla listę PRów, które wymagają komentarza `/approve`, aby scalić.
- [Szybkie zwycięstwa](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22):
  Lista
  PR-ów dla głównej gałęzi bez wyraźnych blokad. (zmień "XS" w etykiecie rozmiaru, przechodząc przez PR-y [XS, S, M, L, XL, XXL]).
- [Nie dotyczy głównej gałęzi](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3Alanguage%2Fen+-base%3Amain):
  Jeśli PR dotyczy gałęzi `dev-`, oznacza to, że jest związany z
  nadchodzącym wydaniem. Przydziel [menedżera wydania dokumentacji](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles)
  używając:
  `/assign @<manager's_github-username>`. Jeśli PR dotyczy starszej gałęzi, pomóż autorowi ustalić, czy jest skierowany do odpowiedniej gałęzi.

### Przydatne komendy Prow dla wranglerów {#helpful-prow-commands-for-wranglers}

```
# dodaj etykietę dla języka angielskiego
/language en

# dodaj etykietę squash do PR, jeśli zawiera więcej niż jeden commit
/label tide/merge-method-squash

# zmień tytuł PR za pomocą Prow (np. oznacz jako "w toku" (ang. work in progress) [WIP] lub dodaj lepszy opis PR)
/retitle [WIP] <TITLE>
```

### Kiedy zamykać Pull Requests {#when-to-close-pull-requests}

Recenzje i zatwierdzenia są jednym z narzędzi do utrzymywania naszej kolejki PR krótkiej i aktualnej. Innym narzędziem jest zamknięcie.

Zamknij PR-y, gdzie:

- Autor nie podpisał CLA od dwóch tygodni.

  Autorzy mogą ponownie otworzyć PR po podpisaniu CLA. Jest to sposób o
  niskim ryzyku, aby upewnić się, że nic nie zostanie scalone bez podpisanego CLA.

- Autor nie odpowiedział na komentarze lub opinie przez 2 lub więcej tygodni.

Nie bój się zamykać pull requestów. Współtwórcy mogą łatwo je ponownie otworzyć i wznowić prace w toku. Często
to właśnie zawiadomienie o zamknięciu motywuje autora do wznowienia i dokończenia swojego wkładu.

Aby zamknąć pull request, zostaw komentarz `/close` na żądaniu PR.

{{< note >}}
Bot [`k8s-triage-robot`](https://github.com/k8s-triage-robot) oznacza problemy
jako nieaktywne po 90 dniach bezczynności. Po kolejnych 30 dniach oznacza je jako
zepsute i zamyka je. Wranglerzy PR powinny zamykać problemy po 14-30 dniach bezczynności.
{{< /note >}}

## Program cienia wranglera PR {#pr-wrangler-shadow-program}

Pod koniec 2021 roku, SIG Docs wprowadziło program cienia wranglera pull requestów (ang. PR Wrangler Shadow Program).
Program został wprowadzony, aby pomóc nowym współtwórcom zrozumieć proces zarządzania wranglera PR.

### Zostań cieniem {#become-a-shadow}

- Jeśli jesteś zainteresowany wzięciem udziału w tym programie, odwiedź
  [stronę Wiki PR Wranglers](https://github.com/kubernetes/website/wiki/PR-Wranglers),
  aby zobaczyć harmonogram zarządzania wranglerów PR na ten rok i zapisać się.

- Inni mogą skontaktować się na [kanale Slack #sig-docs](https://kubernetes.slack.com/messages/sig-docs)
  w celu zgłoszenia chęci asystowania przydzielonemu wranglerowi PR w
  konkretnym tygodniu. Zachęcamy do kontaktu z Bradem Topolem (`@bradtopol`) lub jednym z
  [przewodniczących/liderów SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs#leadership).

- Po zapisaniu się na program cienia wranglera PR, przedstaw
  się wranglerowi PR na [Kubernetes Slack](https://slack.k8s.io).
