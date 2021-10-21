---
title: PR Wranglers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs [approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers) &uuml;bernehmen einw&ouml;chige Schichten um die [Pull Requests](https://github.com/kubernetes/website/wiki/PR-Wranglers) des Repositories zu verwalten.

Dieser Abschnitt behandelt die Aufgaben eines PR-Wranglers. Weitere Informationen &uuml;ber gute Reviews findest du unter [Überprüfen von Änderungen](/docs/contribute/review/).
<!-- body -->

## Aufgaben

T&auml;gliche Aufgaben in einer einw&ouml;chigen Schicht als PR Wrangler:

- Sortiere und kennzeichne t&auml;glich eingehende Probleme. Siehe [Einstufung und Kategorisierung von Problemen](/docs/contribute/review/for-approvers/#triage-and-categorize-issues) f&uuml;r Richtlinien, wie SIG Docs Metadaten verwendet.
- &Uuml;berpr&uuml;fe [offene Pull Requests](https://github.com/kubernetes/website/pulls) auf Qualit&auml;t und Einhaltung der [Style](/docs/contribute/style/style-guide/) und [Content](/docs/contribute/style/content-guide/) Leitf&auml;den.
    - Beginne mit den kleinsten PRs (`size/XS`) und ende mit den gr&ouml;&szlig;ten (`size/XXL`). &Uuml;berpr&uuml;fe so viele PRs, wie du kannst.
- Achte darauf, dass die PR-Autoren den [CLA](https://github.com/kubernetes/community/blob/master/CLA.md) unterschreiben.
    - Verwende [dieses](https://github.com/zparnold/k8s-docs-pr-botherer) Skript, um diejenigen, die den CLA noch nicht unterschrieben haben, daran zu erinnern, dies zu tun.
- Gib Feedback zu den &Auml;nderungen und bitte die Mitglieder anderer SIGs um technische &Uuml;berpr&uuml;fung.
    - Gib inline Vorschl&auml;ge f&uuml;r die vorgeschlagenen inhaltlichen &Auml;nderungen in den PR ein.
    - Wenn du den Inhalt &uuml;berpr&uuml;fen musst, kommentiere den PR und bitte um weitere Details.
    - Vergebe das/die entsprechende(n) `sig/`-Label.
    - Falls n&ouml;tig, weise die Reviever aus dem Block `revievers:` im Vorspann der Datei zu.
- Benutze den Kommentar `/approve`, um einen PR zum Zusammenf&uuml;hren zu genehmigen. F&uuml;hre den PR zusammen, wenn er inhaltlich und technisch einwandfrei ist.
    - PRs sollten einen `/lgtm`-Kommentar von einem anderen Mitglied haben, bevor sie zusammengef&uuml;hrt werden.
    - Erw&auml;ge, technisch korrekte Inhalte zu akzeptieren, die nicht den [Stilrichtlinien](/docs/contribute/style/style-guide/) entsprechen. Er&ouml;ffne ein neues Thema mit dem Label `good first issue`, um Stilprobleme anzusprechen.

### Hilfreiche GitHub-Anfragen f&uuml;r Wranglers

Die folgenden Anfragen sind beim Wrangling hilfreich.
Wenn du diese Anfragen abgearbeitet hast, ist die verbleibende Liste der zu pr&uuml;fenden PRs meist klein.
Diese Anfragen schlie&szlig;en Lokalisierungs-PRs aus. Alle Anfragen beziehen sich auf den Hauptast, au&szlig;er der letzten.

- [Kein CLA, nicht zusammenf&uuml;rbar](https://github.com/kubernetes/website/pulls?q=is%3Aopen+ist%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen):
  Erinnere den Beitragenden daran, den CLA zu unterschreiben. Wenn sowohl der Bot als auch ein Mensch sie daran erinnert haben, schlie&szlig;e
  den PR und erinnere die Autoren daran, dass sie ihn erneut &ouml;ffnen k&ouml;nnen, nachdem sie den CLA unterschrieben haben.
  **&Uuml;berpr&uuml;fe keine PRs, deren Autoren den CLA nicht unterschrieben haben!**
- [Ben&ouml;tigt LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+ist%3Apr+-label%3A%22cncf-cla%3A+kein%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm):
  Listet PRs auf, die ein LGTM von einem Mitglied ben&ouml;tigen. Wenn der PR eine technische &Uuml;berpr&uuml;fung ben&ouml;tigt, schalte einen der vom Bot vorgeschlagenen Reviewer ein. Wenn der Inhalt &uuml;berarbeitet werden muss, f&uuml;ge Vorschl&auml;ge und Feedback in-line hinzu.
- [Hat LGTM, braucht die Zustimmung von Docs](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+):
  Listet PRs auf, die einen `/approve`-Kommentar ben&ouml;tigen, um zusammengef&uuml;hrt zu werden.
- [Quick Wins](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22): Listet PRs gegen den Hauptzweig auf, die nicht eindeutig blockiert sind. (&auml;ndere "XS" in der Gr&ouml;&szlig;enbezeichnung, wenn du dich durch die PRs arbeitest [XS, S, M, L, XL, XXL]).
- [Nicht gegen den Hauptast](https://github.com/kubernetes/website/pulls?q=is%3Aopen+ist%3Apr+label%3Alanguage%2Fen+-base%3Amain): Wenn der PR gegen einen `dev-`Ast gerichtet ist, ist er f&uuml;r eine kommende Ver&ouml;ffentlichung. Weise diesen dem [Docs Release Manager](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles) zu: `/assign @<manager's_github-username>`. Wenn der PR gegen einen alten Ast gerichtet ist, hilf dem Autor herauszufinden, ob er auf den richtigen Ast gerichtet ist.

### Hilfreiche Prow-Befehle f&uuml;r Wranglers

```
# Englisches Label hinzufuegen
/language en

# f&uuml;ge dem PR ein Squash-Label hinzu, wenn es mehr als einen Commit gibt
/label tide/merge-method-squash

# einen PR ueber Prow neu betiteln (z.B. als Work-in-Progress [WIP])
/retitle [WIP] <TITLE>
```

### Wann Pull Requests schlie&szlig;en

Reviews und Genehmigungen sind ein Mittel, um unsere PR-Warteschlange kurz und aktuell zu halten. Ein weiteres Mittel ist das Schlie&szlig;en.

PRs werden geschlossen, wenn:
- Der Autor den CLA seit zwei Wochen nicht unterschrieben hat.

    Die Autoren k&ouml;nnen den PR wieder &ouml;ffnen, nachdem sie den CLA unterschrieben haben. Dies ist ein risikoarmer Weg, um sicherzustellen, dass nichts zusammengef&uuml;hrt wird, ohne dass ein CLA unterzeichnet wurde.

- Der Autor hat seit Zwei oder mehr Wochen nicht auf Kommentare oder Feedback geantwortet.

Hab keine Angst, Pull Requests zu schlie&szlig;en. Mitwirkende k&ouml;nnen sie leicht wieder &ouml;ffnen und die laufenden Arbeiten fortsetzen. Oft ist es die Nachricht &uuml;ber die Schlie&szlig;ung, die einen Autor dazu anspornt, seinen Beitrag wieder aufzunehmen und zu beenden.

Um eine Pull-Anfrage zu schlie&szlig;en, hinterlasse einen `/close`-Kommentar zu dem PR.

{{< note >}}

Der [`fejta-bot`](https://github.com/fejta-bot) Bot markiert Themen nach 90 Tagen Inaktivit&auml;t als veraltet. Nach weiteren 30 Tagen markiert er Issues als faul und schlie&szlig;t sie.  PR-Beauftragte sollten Themen nach 14-30 Tagen Inaktivit&auml;t schlie&szlig;en.

{{< /note >}}
