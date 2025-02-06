---
title: Role i obowiązki
content_type: concept
weight: 10
---

<!-- overview -->

Każdy może przyczynić się do rozwoju Kubernetes. W miarę jak Twoje wkłady w
SIG Docs będą się zwiększać, możesz ubiegać się o różne poziomy członkostwa
w społeczności. Te role pozwalają Ci na przyjęcie większej odpowiedzialności w
ramach społeczności. Każda rola wymaga więcej czasu i zaangażowania. Role te to:

- Każdy (ang. Anyone): regularni współpracownicy dokumentacji Kubernetes
- Członkowie (ang. Members): mogą przypisywać i oceniać problemy oraz zapewniać niewiążącą recenzję w pull requestach.
- Recenzenci (ang. Reviewers): mogą prowadzić przeglądy pull requestów zgłoszonych dla dokumentacji i mogą ręczyć za jakość zmiany
- Zatwierdzający (ang. Approvers): mogą prowadzić przeglądy dokumentacji i scalać zmiany

<!-- body -->

## Każdy {#anyone}

Każda osoba posiadająca konto na GitHub może przyczynić się do rozwoju Kubernetes. SIG Docs serdecznie zaprasza wszystkich nowych współtwórców!

Każdy może:

- Otwórz zgłoszenie w dowolnym repozytorium
  [Kubernetes](https://github.com/kubernetes/), w tym
  [`kubernetes/website`](https://github.com/kubernetes/website)
- Udziel nieobowiązującej opinii na temat pull requesta
- Wnieś wkład do tłumaczenia
- Zasugeruj ulepszenia na [Slacku](https://slack.k8s.io/) lub na
  [liście mailingowej SIG docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

Po [podpisaniu CLA](https://github.com/kubernetes/community/blob/master/CLA.md), każdy może również:

- Otworzyć pull requesta, aby ulepszyć istniejącą treść, dodać nową treść lub zrobić wpis na blogu lub studium przypadku
- Tworzyć diagramy, zasoby graficzne oraz osadzane screencasty i filmy

Więcej informacji można znaleźć w [wprowadzaniu nowej treści](/docs/contribute/new-content/).

## Członkowie {#members}

Członek to osoba, która złożyła wiele pull requestów do `kubernetes/website`.
Członkowie są częścią
[organizacji Kubernetes na GitHubie](https://github.com/kubernetes).

Członkowie mogą:

- Wykonać wszystko wymienione w sekcji [Każdy](#anyone)
- Użyć komentarza `/lgtm`, aby dodać etykietę LGTM (wygląda dobrze dla mnie) do pull requesta

  {{< note >}}
  Użycie `/lgtm` uruchamia automatyzację. Jeśli chcesz
  udzielić niewiążącej aprobaty, komentarz "LGTM" również działa!
  {{< /note >}}

- Użyć komentarza `/hold`, aby zablokować scalanie dla pull requesta
- Użyć komentarza `/assign`, aby przypisać recenzenta do pull requesta
- Zapewnić niewiążącą ocenę pull requestów
- Użyć automatyzacji do triage'u i kategoryzacji problemów
- Dokumentować nowe funkcje

### Zostanie członkiem {#becoming-a-member}

Po przesłaniu co najmniej 5 znaczących pull requestów i spełnieniu pozostałych
[wymagań](https://github.com/kubernetes/community/blob/master/community-membership.md#member):

1. Znajdź dwóch [recenzentów](#reviewers) lub
   [zatwierdzających](#approvers), aby
   [sponsorować](/docs/contribute/advanced#sponsor-a-new-contributor) twoje członkostwo.

   Poproś o sponsorowanie na kanale [#sig-docs na Slacku](https://kubernetes.slack.com) lub
   na [liście mailingowej SIG Docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

   {{< note >}}
   Nie wysyłaj bezpośredniego e-maila ani bezpośredniej wiadomości Slack do
   poszczególnego członka SIG Docs. Musisz poprosić o sponsorowanie przed złożeniem swojej aplikacji.
   {{< /note >}}

1. Otwórz zgłoszenie GitHub w
   [repozytorium `kubernetes/org`](https://github.com/kubernetes/org/). Użyj
   szablonu zgłoszenia **Organization Membership Request**.

1. Poinformuj swoich sponsorów o zgłoszeniu na GitHubie. Możesz:
   - Wspomnieć ich nazwę użytkownika GitHub w zgłoszeniu (`@<GitHub-username>`)
   - Wysłać im link do zgłoszenia za pomocą Slacka lub e-maila.

     Sponsorzy zatwierdzą Twoją prośbę poprzez głosowanie `+1`.
     Gdy sponsorzy zatwierdzą prośbę,
     administrator GitHub Kubernetes dodaje Cię jako członka. Gratulacje!

     Jeśli Twoja prośba o członkostwo nie zostanie zaakceptowana, otrzymasz
     informację zwrotną. Po uwzględnieniu informacji zwrotnej, złóż wniosek ponownie.

1. Zaakceptuj zaproszenie do organizacji Kubernetes na GitHubie w swojej skrzynce e-mail.

   {{< note >}}
   GitHub wysyła zaproszenie na domyślny adres e-mail w Twoim koncie.
   {{< /note >}}

## Recenzenci {#reviewers}

Recenzenci są odpowiedzialni za przeglądanie otwartych pull requestów.
W przeciwieństwie do opinii członków, autor PR musi uwzględnić uwagi
recenzenta. Recenzenci są członkami zespołu GitHub
[@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs).

Recenzenci mogą:

- Wykonać wszystko, co znajduje się w sekcjach [Każdy](#anyone) i [Członkowie](#members)
- Przeglądać pull requesty i dostarczać wiążące opinie

  {{< note >}}
  Aby udzielić niewiążącej opinii, poprzedź swoje komentarze frazą "Optionally: ".
  {{< /note >}}

- Edytować teksty widoczne dla użytkowników w kodzie
- Poprawiać uwagi do kodu

Możesz być recenzentem SIG Docs lub recenzentem dokumentacji w konkretnej dziedzinie tematycznej.

### Przypisywanie recenzentów do pull requestów {#assigning-reviewers-to-pull-requests}

Automatyzacja przypisuje recenzentów do wszystkich pull
requestów. Możesz poprosić o recenzję od
konkretnej osoby, komentując: `/assign [@_github_handle]`.

Jeśli przydzielony recenzent nie skomentował PR, inny recenzent może przejąć zadanie.
Możesz również przydzielić technicznych recenzentów w razie potrzeby.

### Używanie `/lgtm` {#using-lgtm}

LGTM oznacza "Wygląda dobrze dla mnie" i wskazuje, że pull request jest
technicznie poprawny i gotowy do połączenia. Wszystkie PR-y wymagają komentarza `/lgtm` od
recenzenta i komentarza `/approve` od osoby zatwierdzającej, aby można je było połączyć.

Komentarz `/lgtm` od recenzenta jest wiążący i uruchamia automatyzację, która dodaje etykietę `lgtm`.

### Zostanie recenzentem {#becoming-a-reviewer}

Kiedy spełnisz [wymagania](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer),
możesz
zostać recenzentem SIG Docs. Recenzenci w
innych SIG muszą ubiegać się osobno o status recenzenta w SIG Docs.

Aby złozyć wniosek:

1. Otwórz pull request, który dodaje Twoją nazwę użytkownika
   GitHub do sekcji pliku [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
   w repozytorium `kubernetes/website`.

   {{< note >}}
   Jeśli nie jesteś pewien, gdzie się dodać, dodaj się do `sig-docs-en-reviews`.
   {{< /note >}}

1. Przypisz PR do jednego lub więcej zatwierdzających SIG-Docs
   (nazwy użytkowników wymienione pod `sig-docs-{language}-owners`).

Jeśli zgłoszenie zostanie zatwierdzone, lider SIG Docs dodaje Cię do odpowiedniego
zespołu na GitHubie. Po dodaniu, [K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
przypisuje i sugeruje Cię jako recenzenta nowych pull requestów.

## Zatwierdzający {#approvers}

Osoby zatwierdzające przeglądają i zatwierdzają wnioski o scalenie.
Zatwierdzający są członkami zespołów GitHub
[@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs).

Zatwierdzający mogą wykonać następujące czynności:

- Wszystko wymienione w sekcjach [Każdy](#anyone), [Członkowie](#members) i [Recenzenci](#reviewers)
- Publikować treści autorów, zatwierdzając i scalając pull requesty za pomocą komentarza `/approve`
- Zaproponować ulepszenia do przewodnika stylu
- Zaproponować usprawnienia testów dokumentacji
- Zaproponować usprawnienia dla strony internetowej Kubernetes lub innych narzędzi

Jeśli PR już ma `/lgtm`, lub jeśli zatwierdzający również skomentuje `/lgtm`,
PR zostaje automatycznie scalony. Zatwierdzający SIG Docs powinien zostawić
`/lgtm` tylko w przypadku zmiany, która nie wymaga dodatkowej recenzji technicznej.


### Zatwierdzanie pull requestów {#approving-pull-requests}

Akceptujący i liderzy SIG Docs są jedynymi, którzy mogą scalać pull requesty
do repozytorium witryny. Wiąże się to z pewnymi obowiązkami.

- Osoby zatwierdzające mogą używać polecenia `/approve`, które scala PR-y do repozytorium.

  {{< warning >}}
  Nieuważne scalenie może zepsuć witrynę, więc upewnij się, że kiedy coś scalasz, naprawdę chcesz to zrobić.
  {{< /warning >}}

- Upewnij się, że proponowane zmiany spełniają
  [przewodnik dotyczący treści dokumentacji](/docs/contribute/style/content-guide/).

  Jeśli masz jakieś pytanie lub nie jesteś pewien
  czegoś, nie krępuj się poprosić o dodatkową recenzję.

- Zweryfikuj, czy testy Netlify przechodzą pomyślnie przed zatwierdzeniem PR za pomocą `/approve`.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Testy Netlify muszą przejść pomyślnie przed zatwierdzeniem" />

- Odwiedź stronę podglądu Netlify dla PR, aby upewnić się, że wszystko wygląda dobrze przed zatwierdzeniem.

- Weź udział w [harmonogramie rotacji PR Wrangler](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  dla
  cotygodniowych rotacji. SIG Docs oczekuje, że wszyscy
  zatwierdzający będą uczestniczyć w tej rotacji. Zobacz
  [PR wranglers](/docs/contribute/participate/pr-wranglers/) po więcej szczegółów.

### Zostanie zatwierdzającym {#becoming-an-approver}

Kiedy spełnisz [wymagania](https://github.com/kubernetes/community/blob/master/community-membership.md#approver),
możesz zostać
zatwierdzającym SIG Docs. Zatwierdzający w innych
SIGs muszą osobno ubiegać się o status zatwierdzającego w SIG Docs.

Aby złozyć wniosek:

1. Otwórz pull requesta, dodając siebie do sekcji pliku
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) w
   repozytorium `kubernetes/website`.

    {{< note >}}
    Jeśli nie jesteś pewien, gdzie się dodać, dodaj się do `sig-docs-en-owners`.
    {{< /note >}}

2. Przypisz PR do jednego lub więcej obecnych zatwierdzających SIG Docs.

Jeśli wniosek zostanie zatwierdzony, lider SIG Docs dodaje Cię do odpowiedniego
zespołu w GitHub. Po dodaniu, [@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
przypisuje Cię i sugeruje jako recenzenta nowych pull requestów.

## {{% heading "whatsnext" %}}

- Przeczytaj o [zarządzaniu PR](/docs/contribute/participate/pr-wranglers/), roli, którą wszyscy zatwierdzający przyjmują rotacyjnie.
