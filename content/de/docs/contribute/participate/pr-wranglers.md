---
title: PR Wranglers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs [approvers](/docs/contribute/participate/roles-and-responsibilities/#approvers) übernehmen einwöchige Schichten um die [Pull Requests](https://github.com/kubernetes/website/wiki/PR-Wranglers) des Repositories zu verwalten.

Dieser Abschnitt behandelt die Aufgaben eines PR-Wranglers. Weitere Informationen über gute Reviews findest du unter [Überprüfen von Änderungen](/docs/contribute/review/).
<!-- body -->

## Aufgaben

Tägliche Aufgaben in einer einwöchigen Schicht als PR Wrangler:

- Sortiere und kennzeichne täglich eingehende Probleme. Siehe [Einstufung und Kategorisierung von Problemen](/docs/contribute/review/for-approvers/#triage-and-categorize-issues) für Richtlinien, wie SIG Docs Metadaten verwendet.
- Überprüfe [offene Pull Requests](https://github.com/kubernetes/website/pulls) auf Qualität und Einhaltung der [Style](/docs/contribute/style/style-guide/) und [Content](/docs/contribute/style/content-guide/) Leitfäden.
    - Beginne mit den kleinsten PRs (`size/XS`) und ende mit den größten (`size/XXL`). Überprüfe so viele PRs, wie du kannst.
- Achte darauf, dass die PR-Autoren den [CLA](https://github.com/kubernetes/community/blob/master/CLA.md) unterschreiben.
    - Verwende [dieses](https://github.com/zparnold/k8s-docs-pr-botherer) Skript, um diejenigen, die den CLA noch nicht unterschrieben haben, daran zu erinnern, dies zu tun.
- Gib Feedback zu den Änderungen und bitte die Mitglieder anderer SIGs um technische Überprüfung.
    - Gib inline Vorschläge für die vorgeschlagenen inhaltlichen Änderungen in den PR ein.
    - Wenn du den Inhalt überprüfen musst, kommentiere den PR und bitte um weitere Details.
    - Vergebe das/die entsprechende(n) `sig/`-Label.
    - Falls nötig, weise die Reviever aus dem Block `revievers:` im Vorspann der Datei zu.
- Benutze den Kommentar `/approve`, um einen PR zum Zusammenführen zu genehmigen. Führe den PR zusammen, wenn er inhaltlich und technisch einwandfrei ist.
    - PRs sollten einen `/lgtm`-Kommentar von einem anderen Mitglied haben, bevor sie zusammengeführt werden.
    - Erwäge, technisch korrekte Inhalte zu akzeptieren, die nicht den [Stilrichtlinien](/docs/contribute/style/style-guide/) entsprechen. Eröffne ein neues Thema mit dem Label `good first issue`, um Stilprobleme anzusprechen.

### Hilfreiche GitHub-Anfragen für Wranglers

Die folgenden Anfragen sind beim Wrangling hilfreich.
Wenn du diese Anfragen abgearbeitet hast, ist die verbleibende Liste der zu prüfenden PRs meist klein.
Diese Anfragen schließen Lokalisierungs-PRs aus. Alle Anfragen beziehen sich auf den `main`-Branch, außer der letzten.

- [Kein CLA, nicht zusammenfürbar](https://github.com/kubernetes/website/pulls?q=is%3Aopen+ist%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3Alanguage%2Fen):
  Erinnere den Beitragenden daran, den CLA zu unterschreiben. Wenn sowohl der Bot als auch ein Mensch sie daran erinnert haben, schließe
  den PR und erinnere die Autoren daran, dass sie ihn erneut öffnen können, nachdem sie den CLA unterschrieben haben.
  **Überprüfe keine PRs, deren Autoren den CLA nicht unterschrieben haben!**
- [Benötigt LGTM](https://github.com/kubernetes/website/pulls?q=is%3Aopen+ist%3Apr+-label%3A%22cncf-cla%3A+kein%22+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+-label%3Algtm):
  Listet PRs auf, die ein LGTM von einem Mitglied benötigen. Wenn der PR eine technische Überprüfung benötigt, schalte einen der vom Bot vorgeschlagenen Reviewer ein. Wenn der Inhalt überarbeitet werden muss, füge Vorschläge und Feedback in-line hinzu.
- [Hat LGTM, braucht die Zustimmung von Docs](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge%2Fwork-in-progress+-label%3Ado-not-merge%2Fhold+label%3Alanguage%2Fen+label%3Algtm+):
  Listet PRs auf, die einen `/approve`-Kommentar benötigen, um zusammengeführt zu werden.
- [Quick Wins](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amain+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22): Listet PRs gegen den Hauptzweig auf, die nicht eindeutig blockiert sind. (ändere "XS" in der Größenbezeichnung, wenn du dich durch die PRs arbeitest [XS, S, M, L, XL, XXL]).
- [Nicht gegen den `main`-Branch](https://github.com/kubernetes/website/pulls?q=is%3Aopen+ist%3Apr+label%3Alanguage%2Fen+-base%3Amain): Wenn der PR gegen einen `dev-`Ast gerichtet ist, ist er für eine kommende Veröffentlichung. Weise diesen dem [Docs Release Manager](https://github.com/kubernetes/sig-release/tree/master/release-team#kubernetes-release-team-roles) zu: `/assign @<manager's_github-username>`. Wenn der PR gegen einen alten Ast gerichtet ist, hilf dem Autor herauszufinden, ob er auf den richtigen Ast gerichtet ist.

### Hilfreiche Prow-Befehle für Wranglers

```
# Englisches Label hinzufügen
/language en

# füge dem PR ein Squash-Label hinzu, wenn es mehr als einen Commit gibt
/label tide/merge-method-squash

# einen PR ueber Prow neu betiteln (z.B. als Work-in-Progress [WIP])
/retitle [WIP] <TITLE>
```

### Wann sind Pull Requests zu schließen

Reviews und Genehmigungen sind ein Mittel, um unsere PR-Warteschlange kurz und aktuell zu halten. Ein weiteres Mittel ist das Schließen.

PRs werden geschlossen, wenn:
- Der Autor den CLA seit zwei Wochen nicht unterschrieben hat.

    Die Autoren können den PR wieder öffnen, nachdem sie den CLA unterschrieben haben. Dies ist ein risikoarmer Weg, um sicherzustellen, dass nichts zusammengeführt wird, ohne dass ein CLA unterzeichnet wurde.

- Der Autor hat seit Zwei oder mehr Wochen nicht auf Kommentare oder Feedback geantwortet.

Hab keine Angst, Pull Requests zu schließen. Mitwirkende können sie leicht wieder öffnen und die laufenden Arbeiten fortsetzen. Oft ist es die Nachricht über die Schließung, die einen Autor dazu anspornt, seinen Beitrag wieder aufzunehmen und zu beenden.

Um eine Pull-Anfrage zu schließen, hinterlasse einen `/close`-Kommentar zu dem PR.

{{< note >}}

Der [`k8s-ci-robot`](https://github.com/k8s-ci-robot) Bot markiert Themen nach 90 Tagen Inaktivität als veraltet. Nach weiteren 30 Tagen markiert er Issues als faul und schließt sie.  PR-Beauftragte sollten Themen nach 14-30 Tagen Inaktivität schließen.

{{< /note >}}
