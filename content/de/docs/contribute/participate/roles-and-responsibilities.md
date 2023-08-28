---
title: Rollen und Verantwortlichkeiten
content_type: concept
weight: 10
---

<!-- overview -->

Jeder kann zu Kubernetes beitragen. Wenn deine Beiträge zu SIG Docs wachsen, kannst du dich für verschiedene Stufen der Mitgliedschaft in der Community bewerben.
Diese Rollen ermöglichen es dir, mehr Verantwortung innerhalb der Gemeinschaft zu übernehmen.
Jede Rolle erfordert mehr Zeit und Engagement. Die Rollen sind:

- Jeder: kann regelmäßig zur Kubernetes-Dokumentation beitragen
- Member: können Issues zuweisen und einstufen und Pull Requests unverbindlich prüfen
- Reviewer: können die Überprüfung von Dokumentations-Pull-Requests leiten und für die Qualität einer Änderung bürgen
- Approver: können die Überprüfung von Dokumentations- und Merge-Änderungen leiten

<!-- body -->

## Jeder

Jeder mit einem GitHub-Konto kann zu Kubernetes beitragen. SIG Docs heißt alle neuen Mitwirkenden willkommen!

Jeder kann:

- Ein Problem in einem beliebigen [Kubernetes](https://github.com/kubernetes/)
  Repository, einschließlich
  [`kubernetes/website`](https://github.com/kubernetes/website) melden
- Unverbindliches Feedback zu einem Pull Request geben
- Zu einer Lokalisierung beitragen
- Verbesserungen auf [Slack](https://slack.k8s.io/) oder der
  [SIG docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) vorschlagen.

Nach dem [Signieren des CLA](/docs/contribute/new-content/overview/#sign-the-cla) kann jeder auch:

- eine Pull-Anfrage öffnen, um bestehende Inhalte zu verbessern, neue Inhalte hinzuzufügen oder einen Blogbeitrag oder eine Fallstudie zu schreiben
- Diagramme, Grafiken und einbettbare Screencasts und Videos erstellen

Weitere Informationen findest du unter [neue Inhalte beisteuern](/docs/contribute/new-content/).

## Member

Ein Member (Mitglied) ist jemand, der bereits mehrere Pull Requests an
`kubernetes/website` eingereicht hat. Mitglieder sind ein Teil der
[Kubernetes GitHub Organisation](https://github.com/kubernetes).

Member können:

- Alles tun, was unter [Jeder](#jeder) aufgeführt ist
- Den Kommentar `/lgtm` verwenden, um einem Pull Request das Label LGTM (looks good to me) hinzuzufügen

  {{< note >}}
  Die Verwendung von `/lgtm` löst eine Automatisierung aus. Wenn du eine unverbindliche
  Zustimmung geben willst, funktioniert der Kommentar "LGTM" auch!
  {{< /note >}}

- Verwende den Kommentar `/hold`, um das Zusammenführen eines Pull Requests zu blockieren.
- Benutze den Kommentar `/assign`, um einem Pull Request einen Reviewer zuzuweisen.
- Unverbindliche Überprüfung von Pull Requests
- Nutze die Automatisierung, um Issues zu sortieren und zu kategorisieren
- Neue Funktionen dokumentieren

### Mitglied werden

Du kannst ein Mitglied werden, nachdem du mindestens 5 substantielle Pull Requests eingereicht hast und die anderen
[Anforderungen](https://github.com/kubernetes/community/blob/master/community-membership.md#member) erforderst: 

1. Finde zwei [Reviewer](#reviewers) oder [Approver](#approvers), die deine Mitgliedschaft [sponsern](/docs/contribute/advanced#sponsor-a-new-contributor).

   Bitte um Sponsoring im [#sig-docs channel on Slack](https://kubernetes.slack.com) oder auf der
   [SIG Docs Mailingliste](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

   {{< note >}}
   Schicke keine direkte E-Mail oder Slack-Direktnachricht an ein einzelnes
   SIG Docs-Mitglied. Du musst das Sponsoring beantragen, bevor du deine Bewerbung einreichst.
   {{< /note >}}

1. Eröffne ein GitHub-Issue im
   [`kubernetes/org`](https://github.com/kubernetes/org/) Repository. Verwende dabei das
   **Organization Membership Request** issue template.

1. Informiere deine Sponsoren über das GitHub-Issue. Du kannst entweder:
   - Ihren GitHub-Benutzernamen in deinem Issue (`@<GitHub-Benutzername>`) erwähnen
   - Ihnen den Issue-Link über Slack oder per E-Mail senden.

     Die Sponsoren werden deine Anfrage mit einer "+1"-Stimme genehmigen. Sobald deine Sponsoren
     genehmigen, fügt dich ein Kubernetes-GitHub-Admin als Mitglied hinzu.
     Herzlichen Glückwunsch!

     Wenn dein Antrag auf Mitgliedschaft nicht angenommen wird, erhältst du eine Rückmeldung.
     Nachdem du dich mit dem Feedback auseinandergesetzt hast, kannst du dich erneut bewerben.

1. Nimm die Einladung zur Kubernetes GitHub Organisation in deinem E-Mail-Konto an.

   {{< note >}}
   GitHub sendet die Einladung an die Standard-E-Mail-Adresse in deinem Konto.
   {{< /note >}}

## Reviewer

Reviewer (Gutachteren) sind dafür verantwortlich, offene Pull Requests zu überprüfen. Anders als bei den Mitgliedern
musst du auf das Feedback der Prüfer eingehen. Reviewer sind Mitglieder des
[@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs)
GitHub-Teams.

Gutachteren können:

- Alles tun, was unter [Jeder](#jeder) und [Member](#member) aufgeführt ist
- Pull Requests überprüfen und verbindliches Feedback geben

  {{< note >}}
  Um unverbindliches Feedback zu geben, stellst du deinen Kommentaren eine Formulierung wie "Optional:" voran.
  {{< /note >}}

- Bearbeite benutzerseitige Zeichenfolgen im Code
- Verbessere Code-Kommentare

### Zuweisung von Reviewern zu Pull Requests

Die Automatisierung weist allen Pull Requests Reviewer zu. Du kannst eine
Review von einer bestimmten Person anfordern, indem du einen Kommentar schreibst: `/assign
[@_github_handle]`.

Wenn der zugewiesene Prüfer den PR nicht kommentiert hat, kann ein anderer Prüfer
einspringen. Du kannst bei Bedarf auch technische Prüfer zuweisen.

### Verwendung von `/lgtm`

LGTM steht für "Looks good to me" und zeigt an, dass ein Pull Request
technisch korrekt und bereit zum Zusammenführen ist. Alle PRs brauchen einen `/lgtm` Kommentar von einem
Reviewer und einen `/approve` Kommentar von einem Approver, um zusammengeführt zu werden.

Ein `/lgtm`-Kommentar vom Reviewer ist verbindlich und löst eine Automatisierung aus, die das `lgtm`-Label hinzufügt.

### Reviewer werden

Wenn du die
[Anforderungen](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer) erfüllst,
kannst du ein SIG Docs-Reviewer werden. Reviewer in anderen SIGs müssen sich gesondert für den Reviewer-Status in SIG Docs bewerben.

So bewirbst du dich:

1. Eröffne einen Pull Request, in dem du deinen GitHub-Benutzernamen in einen Abschnitt der
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS) Datei
   im `kubernetes/website` Repository hinzufügt.

   {{< note >}}
   Wenn du dir nicht sicher bist, wo du dich hinzufügen sollst, füge dich zu `sig-docs-de-reviews` hinzu.
   {{< /note >}}

1. Weise den PR einem oder mehreren SIG-Docs-Genehmigern zu (Benutzernamen, die unter
   `sig-docs-{language}-owners` aufgelisted sind).
   Wenn der PR genehmigt wurde, fügt dich ein SIG Docs-Lead dem entsprechenden GitHub-Team hinzu. Sobald du hinzugefügt bist,
   wird [@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
   dich als Reviewer für neue Pull Requests vorschlagen und zuweisen.


## Approver


Approver (Genehmiger) prüfen und genehmigen Pull Requests zum Zusammenführen. Genehmigende sind Mitglieder des
[@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs)
GitHub-Teams.

Genehmigende können Folgendes tun:

- Alles, was unter [Jeder](#jeder), [Member](#member) und [Reviewer](#reviewes) aufgeführt ist
- Inhalte von Mitwirkenden veröffentlichen, indem sie Pull Requests mit dem Kommentar `/approve` genehmigen und zusammenführen
- Verbesserungen für den Style Guide vorschlagen
- Verbesserungsvorschläge für Docs-Tests einbringen
- Verbesserungsvorschläge für die Kubernetes-Website oder andere Tools machen

Wenn der PR bereits einen `/lgtm` hat, oder wenn der Genehmigende ebenfalls mit
`/lgtm` kommentiert, wird der PR automatisch zusammengeführt. Ein SIG Docs-Genehmiger sollte nur ein
`/lgtm` für eine Änderung hinterlassen, die keine weitere technische Überprüfung erfordert.

### Pull Requests genehmigen

Genehmiger und SIG Docs-Leads sind die Einzigen, die Pull Requests
in das Website-Repository aufnehmen. Damit sind bestimmte Verantwortlichkeiten verbunden.

- Genehmigende können den Befehl `/approve` verwenden, der PRs in das Repository einfügt.

  {{< warning >}}
  Ein unvorsichtiges Zusammenführen kann die Website lahmlegen, also sei dir sicher, dass du es auch so meinst, wenn du etwas zusammenführst.
  {{< /warning >}}

- Vergewissere dich, dass die vorgeschlagenen Änderungen den
  [Beitragsrichtlinien](/docs/contribute/style/content-guide/#contributing-content) entsprechen.

  Wenn du jemals eine Frage hast oder dir bei etwas nicht sicher bist, fordere einfach Hilfe an, um eine zusätzliche Überprüfung zu erhalten.

- Vergewissere dich, dass die Netlify-Tests erfolgreich sind, bevor du einen PR mittels `/approve` genehmigst.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Netlify-Tests müssen vor der Freigabe bestanden werden" />

- Besuche die Netlify-Seitenvorschau für den PR, um sicherzustellen, dass alles gut aussieht, bevor du es genehmigst.

- Nimm am [PR Wrangler Rotationsplan](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  für wöchentliche Rotationen teil. SIG Docs erwartet von allen Genehmigern, dass sie an dieser
  Rotation teilnehmen. Siehe [PR-Wranglers](/docs/contribute/participate/pr-wranglers/).
  für weitere Details.

### Approver werden

Wenn du die [Anforderungen](https://github.com/kubernetes/community/blob/master/community-membership.md#approver) erfüllst,
kannst du ein SIG Docs Approver werden. Genehmigende in anderen SIGs müssen sich separat für den Approver-Status in SIG Docs bewerben.

So bewirbst du dich:

1. Eröffne eine Pull-Anfrage, in der du dich in einem Abschnitt der
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS)
   Datei im `kubernetes/website` Repository hinzuzufügen.

    {{< note >}}
    Wenn du dir nicht sicher bist, wo du dich hinzufügen sollst, füge dich zu `sig-docs-de-owners` hinzu.
    {{< /note >}}

2. Weise den PR einem oder mehreren aktuellen SIG Docs Genehmigern zu.

Wenn der PR genehmigt wurde, fügt dich ein SIG Docs-Lead dem entsprechenden GitHub-Team hinzu. Sobald du hinzugefügt bist,
wird [@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
dich als Reviewer für neue Pull Requests vorschlagen und zuweisen.

## {{% heading "whatsnext" %}}

-  Erfahre mehr über [PR-Wrangling](/de/docs/contribute/participate/pr-wranglers/), eine Rolle, die alle Genehmiger im Wechsel übernehmen.
