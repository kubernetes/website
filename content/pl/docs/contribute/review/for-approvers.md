---
title: Przegląd dla zatwierdzających i recenzentów
linktitle: Dla zatwierdzających i recenzentów
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

[Recenzenci](/docs/contribute/participate/#reviewers) i
[Zatwierdzający](/docs/contribute/participate/#approvers) SIG Docs wykonują
kilka dodatkowych czynności podczas przeglądania zmiany.

Co tydzień określony zatwierdzający zgłasza się na ochotnika do klasyfikowania i
przeglądania pull requestów. Osoba ta nazywana jest "PR Wranglerem" tygodnia. Zapoznaj się z
[harmonogramem PR Wranglerów](https://github.com/kubernetes/website/wiki/PR-Wranglers) aby uzyskać
więcej informacji. Aby zostać PR Wranglerem, weź udział w cotygodniowym
spotkaniu SIG Docs i zgłoś się na ochotnika. Nawet jeśli nie jesteś w harmonogramie na
bieżący tydzień, nadal możesz przeglądać pull requesty (PR), które nie są już aktywnie przeglądane.

Oprócz rotacji, bot przypisuje recenzentów i
zatwierdzających dla PR na podstawie właścicieli odpowiednich plików.

<!-- body -->

## Przeglądanie PR {#reviewing-a-pr}

Dokumentacja Kubernetes podąża za [procesem przeglądu kodu Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process).


Wszystko opisane w [Przeglądaniu pull request](/docs/contribute/review/reviewing-prs)
ma zastosowanie, ale recenzenci i zatwierdzający powinni również zrobić następujące rzeczy:

- Używanie polecenia Prow `/assign` do przypisania konkretnego recenzenta do PR w razie
  potrzeby. Jest to szczególnie ważne, gdy trzeba poprosić o przegląd techniczny od współtwórców kodu.

  {{< note >}}
  Spójrz na pole `reviewers` w części front-matter na górze
  pliku Markdown, aby zobaczyć, kto może zapewnić recenzję techniczną.
  {{< /note >}}

- Upewnij się, że PR jest zgodny z [Przewodnikiem treści](/docs/contribute/style/content-guide/)
  i [Przewodnikiem stylu](/docs/contribute/style/style-guide/)
  ; jeśli nie jest, podlinkuj autora do odpowiedniej części przewodnika(ów).
- Korzystanie z opcji GitHub **Request Changes**, gdy jest to możliwe, aby zasugerować zmiany autorowi PR.
- Zmiana statusu recenzji w GitHub za pomocą poleceń Prow
  `/approve` lub `/lgtm`, jeśli Twoje sugestie zostały wprowadzone.

## Wprowadzenie zmian do PR innej osoby {#commit-into-another-persons-pr}

Pozostawianie komentarzy na PR jest pomocne, ale mogą wystąpić
sytuacje, gdy zamiast tego będziesz musiał dokonać zatwierdzenia w PR innej osoby.

Nie "przejmuj" pracy innej osoby, chyba że wyraźnie cię o to
poprosi lub chcesz wznowić dawno porzucony PR. Chociaż może to być
szybsze w krótkim terminie, pozbawia to osobę szansy na wniesienie wkładu.

Proces, którego używasz, zależy od tego, czy musisz edytować plik,
który jest już w zakresie PR, czy plik, którego PR jeszcze nie dotknął.

Nie możesz commitować do PR kogoś innego, jeśli którakolwiek
z poniższych rzeczy jest prawdziwa:

- Jeśli autor PR przesłał swoją gałąź bezpośrednio do
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/) repozytorium. Tylko recenzent
  z dostępem do zapisu może wprowadzać zmiany do PR innego użytkownika.

  {{< note >}}
  Zachęć autora do wypchnięcia swojej gałęzi do
  swojego forka przed otwarciem PR następnym razem.
  {{< /note >}}

- Autor PR wyraźnie nie zezwala na edycje przez zatwierdzających.

## Polecenia do przeglądania Prow {#prow-commands-for-reviewing}

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md) to
oparty na Kubernetes system CI/CD, który uruchamia zadania dla pull requestów (PR). Prow
umożliwia uruchamianie komendy w stylu chatbota do obsługi działań GitHub w całej
organizacji Kubernetes, takich jak
[dodawanie i usuwanie etykiet](#adding-and-removing-issue-labels), zamykanie problemów i przydzielanie zatwierdzającego. Wprowadzaj
komendy Prow jako komentarze do GitHub, używając formatu `/<command-name>`.

Najczęściej używane przez recenzentów i zatwierdzających polecenia prow to:

{{< table caption="Polecenia do przeglądania Prow" >}}
Komenda Prow | Rola | Opis
:------------|:------------------|:-----------
`/lgtm` | Członkowie organizacji | Sygnalizuje, że zakończyłeś przeglądanie PR i jesteś zadowolony ze zmian.
`/approve` | Zatwierdzający | Zatwierdza PR do scalania.
`/assign` | Każdy | Przypisuje osobę do przejrzenia lub zatwierdzenia PR
`/close` | Członkowie organizacji | Zamknięcie zgłoszenia lub PR.
`/hold` | Każdy | Dodaje etykietę `do-not-merge/hold`, wskazującą, że PR nie może być automatycznie scalony.
`/hold cancel` | Anyone | Usuwa etykietę `do-not-merge/hold`.
{{< /table >}}

Aby zobaczyć polecenia, których można używać w PR, zapoznaj się z
[Komendy Prow](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite).

## Priorytetyzacja i kategoryzacja problemów {#triage-and-categorize-issues}

Ogólnie rzecz biorąc, SIG Docs podąża za
[procesem triage zgłoszeń Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md) i
używa tych samych etykiet.

Ten [filtr](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)
w odniesieniu do GitHub Issue znajduje problemy, które mogą wymagać kategoryzowania.

### Rozwiązywanie problemu {#triaging-an-issue}

1. Zweryfikuj problem

   - Upewnij się, że zgłoszenie dotyczy dokumentacji strony internetowej. Niektóre problemy mogą zostać
     szybko zamknięte poprzez udzielenie odpowiedzi na pytanie lub skierowanie zgłaszającego do zasobu. Szczegóły
     znajdują się w sekcji [Prośby o wsparcie lub zgłoszenia błędów w kodzie](#support-requests-or-code-bug-reports).
   - Oceń, czy problem ma podstawy.
   - Dodaj etykietę `triage/needs-information`, jeśli problem nie zawiera wystarczających
     szczegółów, aby można było podjąć działania, lub jeśli szablon nie jest wypełniony odpowiednio.
   - Zamknij problem, jeśli ma zarówno etykiety `lifecycle/stale`, jak i `triage/needs-information`.

2. Dodaj etykietę priorytetu (szczegółowe informacje na temat etykiet
   priorytetowych można znaleźć w [Wytycznych dotyczących kategoryzacji](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)
   ).

  {{< table caption="Etykiety problemu" >}}
  Etykieta | Opis
  :------------|:------------------
  `priority/critical-urgent` | Zrób to od razu.
  `priority/important-soon` | Zrób to w ciągu 3 miesięcy.
  `priority/important-longterm` | Zrób to w ciągu 6 miesięcy.
  `priority/backlog` | Może być odroczone na czas nieokreślony. Wykonaj, gdy zasoby są dostępne.
  `priority/awaiting-more-evidence` | Miejsce na potencjalnie dobre zagadnienie, aby nie zostało zapomniane.
  `help` lub `good first issue` | Odpowiednie dla osób z bardzo małym doświadczeniem w Kubernetes lub SIG Docs. Po więcej informacji zobacz [Etykiety Chcemy Pomocy i Dobre na Pierwsze Zadanie](https://kubernetes.dev/docs/guide/help-wanted/).

  {{< /table >}}

  Według własnego uznania, przejmij odpowiedzialność za problem i zgłoś PR w jego
  sprawie (szczególnie jeśli jest to szybkie lub dotyczy pracy, którą już wykonujesz).

Jeśli masz pytania dotyczące klasyfikacji problemu, zapytaj na `#sig-docs` na Slacku lub na
[liście mailingowej kubernetes-sig-docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

## Dodawanie i usuwanie etykiet zagadnień {#adding-and-removing-issue-labels}

Aby dodać etykietę, zostaw komentarz w jednym z następujących formatów:

- `/<label-to-add>` (na przykład, `/good-first-issue`)
- `/<label-category> <label-to-add>` (na przykład, `/triage needs-information` lub `/language ja`)

Aby usunąć etykietę, pozostaw komentarz w jednym z następujących formatów:

- `/remove-<etykieta-do-usunięcia>` (na przykład, `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (na przykład, `/remove-triage needs-information`)

W obu przypadkach etykieta musi już istnieć. Jeśli spróbujesz
dodać etykietę, która nie istnieje, polecenie zostanie cicho zignorowane.

Dla pełnej listy wszystkich etykiet, zobacz [sekcję Etykiety w repozytorium strony internetowej](https://github.com/kubernetes/website/labels).
Nie wszystkie etykiety są używane przez SIG Docs.

### Etykiety cyklu życia zgłoszeń {#issue-lifecycle-labels}

Zagadnienia są zazwyczaj otwierane i zamykane szybko. Jednak
czasami zagadnienie jest nieaktywne po jego otwarciu. Innym
razem zagadnienie może wymagać pozostania otwartym dłużej niż 90 dni.

{{< table caption="Etykiety cyklu życia zgłoszeń" >}}
Etykieta | Opis
:------------|:------------------
`lifecycle/stale` | Po 90 dniach bez aktywności, problem jest automatycznie oznaczany jako przestarzały. Problem zostanie automatycznie zamknięty, jeśli cykl życia nie zostanie ręcznie cofnięty za pomocą polecenia `/remove-lifecycle stale`.
`lifecycle/frozen` | Zgłoszenie z tą etykietą nie stanie się nieaktywny po 90 dniach bezczynności. Użytkownik ręcznie dodaje tę etykietę do problemów, które muszą pozostać otwarte znacznie dłużej niż 90 dni, takich jak te z etykietą `priority/important-longterm`.
{{< /table >}}

## Obsługa specjalnych typów problemów {#handling-special-issue-types}

Zespół SIG Docs napotyka następujące typy problemów na
tyle często, że warto udokumentować sposób ich rozwiązywania.

### Zduplikowane zgłoszenie {#duplicate-issues}

Jeśli dla jednego problemu jest otwartych kilka zgłoszeń, połącz je w jedno
zgłoszenie. Należy zdecydować, które zgłoszenie pozostawić otwarte (lub otworzyć
nowe zgłoszenie), a następnie przenieść wszystkie istotne informacje i połączyć
powiązane zgłoszenia. Na koniec oznacz wszystkie inne zgłoszenia opisujące ten sam
problem etykietą `triage/duplicate` i zamknij je. Posiadanie tylko jednego
zgłoszenia do pracy zmniejsza zamieszanie i unika powielania pracy nad tym samym problemem.

### Problemy z martwymi linkami {#dead-link-issues}

Jeśli problem martwego linku znajduje się w dokumentacji API lub `kubectl`, przypisz im
`/priority critical-urgent`, dopóki problem nie zostanie w pełni zrozumiany. Wszystkim innym problemom z
martwymi linkami przypisz `/priority important-longterm`, ponieważ muszą być naprawione ręcznie.

### Problemy z blogiem {#blog-issues}

Zakładamy, że wpisy na [blogu Kubernetes](/blog/) z
biegiem czasu tracą swoją aktualność. Z tego powodu
utrzymujemy jedynie artykuły nie starsze niż rok. Jeśli
zgłoszenie dotyczy wpisu starszego niż rok, zamknij je bez naprawiania.

### Wnioski o wsparcie lub zgłoszenia błędów w kodzie {#support-requests-or-code-bug-reports}

Część zgłoszeń dotyczących dokumentacji tak naprawdę odnosi się do problemów z
kodem źródłowym lub stanowi prośby o wsparcie, gdy coś (np. samouczek) nie działa prawidłowo.
W przypadku problemów niezwiązanych z dokumentacją, zamknij problem z
etykietą `kind/support` i komentarzem kierującym wnioskodawcę do miejsc
wsparcia (Slack, Stack Overflow) oraz, jeśli to istotne, do repozytorium, aby zgłosić problem
z błędami w funkcjach (`kubernetes/kubernetes` to świetne miejsce na początek).

Przykładowa odpowiedź na prośbę o wsparcie:

```none
This issue sounds more like a request for support and less
like an issue specifically for docs. I encourage you to bring
your question to the `#kubernetes-users` channel in
[Kubernetes slack](https://slack.k8s.io/). You can also search
resources like
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
for answers to similar questions.

You can also open issues for Kubernetes functionality in
https://github.com/kubernetes/kubernetes.

If this is a documentation issue, please re-open this issue.
```

Przykładowa odpowiedź na zgłoszenie błędu w kodzie:

```none
This sounds more like an issue with the code than an issue with
the documentation. Please open an issue at
https://github.com/kubernetes/kubernetes/issues.

If this is a documentation issue, please re-open this issue.
```

### Scalanie (ang. squashing) {#squashing}

Jako osoba zatwierdzająca, podczas przeglądania pull requestów (PRs),
mogą wystąpić różne sytuacje, w których możesz zrobić następujące rzeczy:

- Poinstruuj współtwórcę, aby połączył swoje commity.
- Scal commity współtwórcy.
- Poradź współtwórcy, aby jeszcze nie scalał zmian.
- Zapobiegaj squaszowaniu.

**Zalecanie łączenia commitów współtwórców**: Nowy współtwórca może nie
wiedzieć, że powinien łączyć commity w swoich pull requestach (PR). W
takim przypadku należy mu to doradzić, podać linki do przydatnych
informacji i zaoferować pomoc, jeśli będzie jej potrzebował. Niektóre przydatne linki:

- [Otwieranie pull requestów i scalanie swoich commitów](/docs/contribute/new-content/open-a-pr#squashing-commits)
  dla współtwórców dokumentacji.
- [GitHub Workflow](https://www.k8s.dev/docs/guide/github-workflow/), w tym diagramy, dla deweloperów.

**Scalanie commitów współtwórców**: Jeśli współtwórca
może mieć trudności ze scaleniem commitów lub istnieje
presja czasu na połączenie PR, możesz wykonać scalanie za niego:

- Repozytorium kubernetes/website jest [skonfigurowane do pozwalania na scalanie w celu połączenia pull requestów](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests).
  Wystarczy
  wybrać przycisk *Squash commits*.
- W PR, jeśli współtwórca umożliwia opiekunom zarządzanie PR,
  możesz scalić commity i zaktualizować fork. Przed scaleniem
  doradź,  aby zapisano i wypchnęto najnowsze zmiany do PR. Po
  scaleniu doradź, aby pobrano scalony commit do swojej lokalnej kopii.
- Możesz skłonić GitHub do połączenia commitów, używając etykiety, tak aby Tide /
  GitHub wykonał scalenie, lub klikając przycisk *Squash commits* podczas scalania PR.

**Doradź współtwórcom, aby unikali scalania**

- Jeśli jakiś commit wprowadza coś błędnego lub nierozsądnego, a ostatni
  commit cofa ten błąd, nie scalaj tych commitów. Mimo że zakładka "Files
  changed" w PR na GitHubie oraz podgląd Netlify będą wyglądały OK, to
  połączenie tego PR może stworzyć konflikty scalania lub rebase dla innych
  osób. Interweniuj w miarę potrzeby, aby uniknąć tego ryzyka dla innych współtwórców.

**Nigdy nie scalaj**

- Jeśli uruchamiasz lokalizację lub wydajesz dokumentację dla nowej wersji i scalasz
  gałąź, która nie pochodzi z forka użytkownika, _nigdy nie łącz zmian w jeden commit_.
  Niezachowanie scalania jest kluczowe, ponieważ musisz zachować historię commitów dla tych plików.
