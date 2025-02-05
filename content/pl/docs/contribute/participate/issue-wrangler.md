---
title: Wranglerzy zgłoszeń
content_type: concept
weight: 20
---

<!-- overview -->

Wraz z [koordynatorem PR](/docs/contribute/participate/pr-wranglers), formalni
akceptujący, recenzenci oraz członkowie SIG Docs odbywają
tygodniowe dyżury [przeglądając i kategoryzując problemy](/docs/contribute/review/for-approvers/#triage-and-categorize-issues)
dla repozytorium.

<!-- body -->

## Obowiązki {#duties}

Każdego dnia w tygodniowej zmianie osoba odpowiedzialna za problemy (ang. Issue Wrangler) będzie odpowiedzialna za:

- Codzienne ocenianie i tagowanie zgłoszeń. Zobacz
  [Ocenianie i kategoryzowanie zgłoszeń](/docs/contribute/review/for-approvers/#triage-and-categorize-issues) aby
  uzyskać wskazówki dotyczące tego, jak SIG Docs korzysta z metadanych.
- Monitorowanie nieaktywnych i przeterminowanych zgłoszeń w repozytorium kubernetes/website.
- Utrzymanie [tablicy problemów](https://github.com/orgs/kubernetes/projects/72/views/1).

## Wymagania {#requirements}

- Musi być aktywnym członkiem organizacji Kubernetesa.
- Minimum 15 [nietrywialnych](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits)
  wkładów do Kubernetesa (z czego pewna ilość powinna być skierowana na kubernetes/website).
- Pełni już rolę w nieformalnym charakterze.

## Przydatne polecenia Prow dla wranglerów {#helpful-prow-commands-for-wranglers}

Poniżej znajdują się niektóre powszechnie używane polecenia przez wranglerów zgłoszeń:

```bash
# ponowne otwarcie zgłoszenia
/reopen

# przeniesienie zgłoszeń, które nie pasują do k/website, do innego repozytorium
/transfer[-issue]

# zmiana statusu zgłoszeń oznaczonych jako rotten
/remove-lifecycle rotten

# zmiana statusu zgłoszeń oznaczonych jako stale
/remove-lifecycle stale

# przypisanie SIG (Special Interest Group) do zgłoszenia
/sig <sig_name>

# dodanie konkretnego obszaru
/area <area_name>

# dla zgłoszeń przyjaznych dla początkujących
/good-first-issue

# zgłoszenia wymagające pomocy
/help wanted

# oznaczenie zgłoszenia jako związane z pomocą techniczną
/kind support

# zaakceptowanie triage dla zgłoszenia
/triage accepted

# zamknięcie zgłoszenia, nad którym nie będziemy pracować i które nie zostało naprawione
/close not-planned
```

Aby znaleźć więcej poleceń Prow, zapoznaj się z dokumentacją [pomocy kommend](https://prow.k8s.io/command-help).

## Kiedy zamykać zgłoszenia {#when-to-close-issues}

Aby projekt open source odniósł sukces, kluczowe jest dobre zarządzanie
zgłoszeniami. Jednak równie ważne jest rozwiązywanie problemów, aby
utrzymać repozytorium i jasno komunikować się z współtwórcami oraz użytkownikami.

Zamknij zgłoszenia, gdy:

- Podobny problem jest zgłaszany więcej niż raz. Najpierw musisz oznaczyć go jako `/triage duplicate`; połącz
  go z głównym problemem, a następnie zamknij. Zaleca się również skierowanie użytkowników do oryginalnego problemu.
- Dostępne informacje nie pozwalają na pełne zrozumienie ani rozwiązanie zgłoszonego problemu. Warto jednak zachęcić
  użytkownika do podania większej ilości szczegółów lub ponownego otwarcia zgłoszenia, jeśli uda mu się ponownie odtworzyć problem.
- Ta sama funkcjonalność jest zaimplementowana gdzieś indziej. Można zamknąć to zgłoszenie i skierować użytkownika do odpowiedniego miejsca.
- Zgłoszony problem nie jest obecnie planowany ani zgodny z celami projektu.
- Jeśli problem wydaje się być spamem i jest wyraźnie niepowiązany.
- Jeśli problem jest związany z zewnętrznym ograniczeniem lub zależnością i znajduje się poza kontrolą projektu.

Aby zamknąć zgłoszenie, zostaw komentarz `/close` w zgłoszeniu.
