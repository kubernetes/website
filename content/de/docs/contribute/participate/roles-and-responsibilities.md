---
title: Rollen und Verantwortlichkeiten
content_type: concept
weight: 10
---

<!-- overview -->

Jeder kann zu Kubernetes beitragen. Wenn deine Beitr&auml;ge zu SIG Docs wachsen, kannst du dich f&uuml;r verschiedene Stufen der Mitgliedschaft in der Community bewerben.
Diese Rollen erm&ouml;glichen es dir, mehr Verantwortung innerhalb der Gemeinschaft zu &uuml;bernehmen.
Jede Rolle erfordert mehr Zeit und Engagement. Die Rollen sind:

- Jeder: tr&auml;gt regelm&auml;ßig zur Kubernetes-Dokumentation bei
- Member: k&ouml;nnen Probleme zuweisen und einstufen und Pull Requests unverbindlich pr&uuml;fen
- Reviewer: k&ouml;nnen die &Uuml;berpr&uuml;fung von Dokumentations-Pull-Requests leiten und f&uuml;r die Qualit&auml;t einer &Auml;nderung b&uuml;rgen
- Approver: k&ouml;nnen die &Uuml;berpr&uuml;fung von Dokumentations- und Merge-&Auml;nderungen leiten

<!-- body -->

## Jeder

Jeder mit einem GitHub-Konto kann zu Kubernetes beitragen. SIG Docs heißt alle neuen Mitwirkenden willkommen!

Jeder kann:

- Ein Problem in einem beliebigen [Kubernetes](https://github.com/kubernetes/)
  Repository, einschließlich
  [`kubernetes/website`](https://github.com/kubernetes/website)
- Unverbindliches Feedback zu einem Pull Request geben
- Zu einer Lokalisierung beitragen
- Schlage Verbesserungen auf [Slack](https://slack.k8s.io/) oder der
  [SIG docs mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

Nach dem [Signieren des CLA](/docs/contribute/new-content/overview/#sign-the-cla) kann jeder auch:

- eine Pull-Anfrage &ouml;ffnen, um bestehende Inhalte zu verbessern, neue Inhalte hinzuzuf&uuml;gen oder einen Blogbeitrag oder eine Fallstudie zu schreiben
- Diagramme, Grafiken und einbettbare Screencasts und Videos erstellen

Weitere Informationen findest du unter [neue Inhalte beisteuern](/docs/contribute/new-content/).

## Member

Ein Member (Mitglied) ist jemand, der bereits mehrere Pull Requests an
`kubernetes/website` eingereicht hat. Mitglieder sind ein Teil der
[Kubernetes GitHub Organisation](https://github.com/kubernetes).

Member k&ouml;nnen:

- Alles tun, was unter [Jeder](#jeder) aufgef&uuml;hrt ist
- Den Kommentar `/lgtm` verwenden, um einem Pull Request das Label LGTM (looks good to me) hinzuzuf&uuml;gen

  {{< note >}}
  Die Verwendung von `/lgtm` l&ouml;st eine Automatisierung aus. Wenn du eine unverbindliche
  Zustimmung geben willst, funktioniert der Kommentar "LGTM" auch!
  {{< /note >}}

- Verwende den Kommentar `/hold`, um das Zusammenf&uuml;hren eines Pull Requests zu blockieren.
- Benutze den Kommentar `/assign`, um einem Pull Request einen Reviewer zuzuweisen.
- Unverbindliche &Uuml;berpr&uuml;fung von Pull Requests
- Nutze die Automatisierung, um Probleme zu sortieren und zu kategorisieren
- Neue Funktionen dokumentieren

### Mitglied werden

Nachdem du mindestens 5 substantielle Pull Requests eingereicht hast und die anderen
[Anforderungen](https://github.com/kubernetes/community/blob/master/community-membership.md#member):

1. Finde zwei [Reviewer](#reviewers) oder [Approver](#approvers), die deine Mitgliedschaft [sponsern](/docs/contribute/advanced#sponsor-a-new-contributor).

   Bitte um Sponsoring im [#sig-docs channel on Slack](https://kubernetes.slack.com) oder auf der
   [SIG Docs Mailingliste](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

   {{< note >}}
   Schicke keine direkte E-Mail oder Slack-Direktnachricht an ein einzelnes
   SIG Docs-Mitglied. Du musst das Sponsoring beantragen, bevor du deine Bewerbung einreichst.
   {{< /note >}}

1. Er&ouml;ffne ein GitHub-Issue im
   [`kubernetes/org`](https://github.com/kubernetes/org/) Repository. Verwende dabei das
   **Organization Membership Request** issue template.

1. Informiere deine Sponsoren &uuml;ber das GitHub-Issue. Du kannst entweder:
   - Ihren GitHub-Benutzernamen in deinem Issue (`@<GitHub-Benutzername>`) erw&auml;hnen
   - Ihnen den Issue-Link &uuml;ber Slack oder per E-Mail senden.

     Die Sponsoren werden deine Anfrage mit einer "+1"-Stimme genehmigen. Sobald deine Sponsoren
     genehmigen, f&uuml;gt dich ein Kubernetes-GitHub-Admin als Mitglied hinzu.
     Herzlichen Gl&uuml;ckwunsch!

     Wenn dein Antrag auf Mitgliedschaft nicht angenommen wird, erh&auml;ltst du eine R&uuml;ckmeldung.
     Nachdem du dich mit dem Feedback auseinandergesetzt hast, kannst du dich erneut bewerben.

1. Nimm die Einladung zur Kubernetes GitHub Organisation in deinem E-Mail-Konto an.

   {{< note >}}
   GitHub sendet die Einladung an die Standard-E-Mail-Adresse in deinem Konto.
   {{< /note >}}

## Reviewer

Reviewer (Rezensenten) sind daf&uuml;r verantwortlich, offene Pull Requests zu &uuml;berpr&uuml;fen. Anders als bei den Mitgliedern
musst du auf das Feedback der Pr&uuml;fer eingehen. Reviewer sind Mitglieder des
[@kubernetes/sig-docs-{language}-reviews](https://github.com/orgs/kubernetes/teams?query=sig-docs)
GitHub-Teams.

Rezensenten k&ouml;nnen:

- Alles tun, was unter [Jeder](#jeder) und [Member](#member) aufgef&uuml;hrt ist
- Pull Requests &uuml;berpr&uuml;fen und verbindliches Feedback geben

  {{< note >}}
  Um unverbindliches Feedback zu geben, stellst du deinen Kommentaren eine Formulierung wie "Optional:" voran.
  {{< /note >}}

- Bearbeite benutzerseitige Zeichenfolgen im Code
- Verbessere Code-Kommentare

### Zuweisung von Reviewern zu Pull Requests

Die Automatisierung weist allen Pull Requests Reviewer zu. Du kannst eine
Review von einer bestimmten Person anfordern, indem du einen Kommentar schreibst: `/assign
[@_github_handle]`.

Wenn der zugewiesene Pr&uuml;fer den PR nicht kommentiert hat, kann ein anderer Pr&uuml;fer
einspringen. Du kannst bei Bedarf auch technische Pr&uuml;fer zuweisen.

### Verwendung von `/lgtm`

LGTM steht f&uuml;r "Looks good to me" und zeigt an, dass ein Pull Request
technisch korrekt und bereit zum Zusammenf&uuml;hren ist. Alle PRs brauchen einen `/lgtm` Kommentar von einem
Reviewer und einen `/approve` Kommentar von einem Approver, um zusammengef&uuml;hrt zu werden.

Ein `/lgtm`-Kommentar vom Reviewer ist verbindlich und l&ouml;st eine Automatisierung aus, die das `lgtm`-Label hinzuf&uuml;gt.

### Reviewer werden

Wenn du die
[Anforderungen](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer) erf&uuml;llst,
kannst du ein SIG Docs-Reviewer werden. Reviewer in anderen SIGs m&uuml;ssen sich gesondert f&uuml;r den Reviewer-Status in SIG Docs bewerben.

So bewirbst du dich:

1. Er&ouml;ffne einen Pull Request, in dem du deinen GitHub-Benutzernamen in einen Abschnitt der
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS) Datei
   im `kubernetes/website` Repository hinzuf&uuml;gt.

   {{< note >}}
   Wenn du dir nicht sicher bist, wo du dich hinzuf&uuml;gen sollst, f&uuml;ge dich zu `sig-docs-de-reviews` hinzu.
   {{< /note >}}

1. Weise den PR einem oder mehreren SIG-Docs-Genehmigern zu (Benutzernamen, die unter
   `sig-docs-{language}-owners` aufgelisted sind).
   Wenn der PR genehmigt wurde, f&uuml;gt dich ein SIG Docs-Lead dem entsprechenden GitHub-Team hinzu. Sobald du hinzugef&uuml;gt bist,
   wird [@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
   dich als Reviewer f&uuml;r neue Pull Requests vorschlagen und zuweisen.


## Approver


Approver (Genehmiger) pr&uuml;fen und genehmigen Pull Requests zum Zusammenf&uuml;hren. Genehmigende sind Mitglieder des
[@kubernetes/sig-docs-{language}-owners](https://github.com/orgs/kubernetes/teams/?query=sig-docs)
GitHub-Teams.

Genehmigende k&ouml;nnen Folgendes tun:

- Alles, was unter [Jeder](#jeder), [Member](#member) und [Reviewer](#reviewes) aufgef&uuml;hrt ist
- Inhalte von Mitwirkenden ver&ouml;ffentlichen, indem sie Pull Requests mit dem Kommentar `/approve` genehmigen und zusammenf&uuml;hren
- Verbesserungen f&uuml;r den Style Guide vorschlagen
- Verbesserungsvorschl&auml;ge f&uuml;r Docs-Tests einbringen
- Verbesserungsvorschl&auml;ge f&uuml;r die Kubernetes-Website oder andere Tools machen

Wenn der PR bereits einen `/lgtm` hat, oder wenn der Genehmigende ebenfalls mit
`/lgtm` kommentiert, wird der PR automatisch zusammengef&uuml;hrt. Ein SIG Docs-Genehmiger sollte nur ein
`/lgtm` f&uuml;r eine &Auml;nderung hinterlassen, die keine weitere technische &Uuml;berpr&uuml;fung erfordert.

### Pull Requests genehmigen

Genehmiger und SIG Docs-Leads sind die Einzigen, die Pull Requests
in das Website-Repository aufnehmen. Damit sind bestimmte Verantwortlichkeiten verbunden.

- Genehmigende k&ouml;nnen den Befehl `/approve` verwenden, der PRs in das Repository einf&uuml;gt.

  {{< warning >}}
  Ein unvorsichtiges Zusammenf&uuml;hren kann die Website lahmlegen, also sei dir sicher, dass du es auch so meinst, wenn du etwas zusammenf&uuml;hrst.
  {{< /warning >}}

- Vergewissere dich, dass die vorgeschlagenen &Auml;nderungen den
  [Beitragsrichtlinien](/docs/contribute/style/content-guide/#contributing-content) entsprechen.

  Wenn du jemals eine Frage hast oder dir bei etwas nicht sicher bist, fordere einfach Hilfe an, um eine zus&auml;tzliche &Uuml;berpr&uuml;fung zu erhalten.

- Vergewissere dich, dass die Netlify-Tests erfolgreich sind, bevor du einen PR mittels `/approve` genehmigst.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="Netlify-Tests m&uuml;ssen vor der Freigabe bestanden werden" />

- Besuche die Netlify-Seitenvorschau f&uuml;r den PR, um sicherzustellen, dass alles gut aussieht, bevor du es genehmigst.

- Nimm am [PR Wrangler Rotationsplan](https://github.com/kubernetes/website/wiki/PR-Wranglers)
  f&uuml;r w&ouml;chentliche Rotationen teil. SIG Docs erwartet von allen Genehmigern, dass sie an dieser
  Rotation teilnehmen. Siehe [PR-Wranglers](/docs/contribute/participate/pr-wranglers/).
  f&uuml;r weitere Details.

### Ein Approver werden

Wenn du die [Anforderungen](https://github.com/kubernetes/community/blob/master/community-membership.md#approver) erf&uuml;llst,
kannst du ein SIG Docs Approver werden. Genehmigende in anderen SIGs m&uuml;ssen sich separat f&uuml;r den Approver-Status in SIG Docs bewerben.

So bewirbst du dich:

1. Er&ouml;ffne eine Pull-Anfrage, in der du dich in einem Abschnitt der
   [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS)
   Datei im `kubernetes/website` Repository hinzuzuf&uuml;gen.

    {{< note >}}
    Wenn du dir nicht sicher bist, wo du dich hinzuf&uuml;gen sollst, f&uuml;ge dich zu `sig-docs-de-owners` hinzu.
    {{< /note >}}

2. Weise den PR einem oder mehreren aktuellen SIG Docs Genehmigern zu.

Wenn der PR genehmigt wurde, f&uuml;gt dich ein SIG Docs-Lead dem entsprechenden GitHub-Team hinzu. Sobald du hinzugef&uuml;gt bist,
wird [@k8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)
dich als Reviewer f&uuml;r neue Pull Requests vorschlagen und zuweisen.

## {{% heading "whatsnext" %}}

-  Erfahre mehr &uuml;ber [PR-Wrangling](/docs/contribute/participate/pr-wranglers/), eine Rolle, die alle Genehmiger im Wechsel &uuml;bernehmen.
