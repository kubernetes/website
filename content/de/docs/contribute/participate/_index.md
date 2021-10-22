---
title: Bei SIG Docs mitmachen
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

Die SIG Docs ist eine der 
[Special Interest Groups ](https://github.com/kubernetes/community/blob/master/sig-list.md) (Fachspezifischen Interessengruppen) innerhalb des Kubernetes-Projekts, die sich auf as Schreiben, Aktualisieren und Pflegen der Dokumentation f&uuml;r Kubernetes als Ganzes konzentriert. Weitere Informationen &uuml;ber die SIG findest du unter SIG Docs im [GitHub Repository der Community](https://github.com/kubernetes/community/tree/master/sig-docs).

SIG Docs begr&uuml;&szlig;t Inhalte und Bewertungen von allen Mitwirkenden. Jeder kann einen
Pull Request (PR) er&ouml;ffnen, und jeder ist willkommen, Fragen zum Inhalt zu stellen oder Kommentare
zu laufenden Pull Requests abzugeben.

Du kannst dich ausserdem als [Member](/de/docs/contribute/participate/roles-and-responsibilities/#member),
[Reviewer](/de/docs/contribute/participate/roles-and-responsibilities/#reviewer), oder
[Approver](/de/docs/contribute/participate/roles-and-responsibilities/#approver) beteiligen.
Diese Rollen erfordern einen erweiterten Zugriff und bringen bestimmte Verantwortlichkeiten f&uuml;r
Änderungen zu genehmigen und zu best&auml;tigen.
Unter [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md) findest du weitere Informationen dar&uuml;ber, wie die Mitgliedschaft in der Kubernetes-Community funktioniert.

Der Rest dieses Dokuments umrei&szlig,t einige spezielle Vorgehensweisen dieser Rollen innerhalb von SIG Docs, die f&uuml;r die Pflege eines der &ouml;ffentlichsten Aush&auml;ngeschilder von Kubernetes verantwortlich ist - die Kubernetes-Website und die Dokumentation.

<!-- body -->
## SIG Docs Vorstand

Jede SIG, auch die SIG Docs, w&auml;hlt ein oder mehrere SIG-Mitglieder, die als
Vorstand fungieren. Sie sind die Kontaktstellen zwischen der SIG Docs und anderen Teilen der
der Kubernetes-Organisation. Sie ben&ouml;tigen umfassende Kenntnisse &uuml;ber die Struktur
des Kubernetes-Projekts als Ganzes und wie SIG Docs darin arbeitet. Informationen zur [Leitung](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) und den aktuellen Vorsitzenden.
## SIG Docs-Teams und Automatisierung

Die Automatisierung in SIG Docs st&uuml;tzt sich auf zwei verschiedene Mechanismen:
GitHub-Teams und OWNERS-Dateien.

### GitHub Teams

Es gibt zwei Kategorien von SIG Docs [Teams](https://github.com/orgs/kubernetes/teams?query=sig-docs) auf GitHub:

- `@sig-docs-{language}-owners` sind Genehmiger und Verantwortliche
- `@sig-docs-{language}-reviewers` sind Reviewer

Jede Gruppe kann in GitHub-Kommentaren mit ihrem `@name` referenziert werden, um mit
mit allen Mitgliedern dieser Gruppe zu kommunizieren.

Manchmal &uuml;berschneiden sich Prow- und GitHub-Teams, ohne genau &uuml;bereinzustimmen. F&uuml;r
Zuordnung von Issues, Pull-Requests und zur Unterst&uuml;tzung von PR-Genehmigungen verwendet die
Automatisierung die Informationen aus den `OWNERS`-Dateien.

### OWNERS Dateien und Front-Matter

Das Kubernetes-Projekt verwendet ein Automatisierungstool namens prow f&uuml;r die Automatisierung im Zusammenhang mit GitHub-Issues und Pull-Requests. 
Das [Kubernetes-Website-Repository](https://github.com/kubernetes/website) verwendet zwei [prow-Plugins](https://github.com/kubernetes/test-infra/tree/master/prow/plugins):

- blunderbuss
- approve

Diese beiden Plugins verwenden die
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) und
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
Dateien auf der obersten Ebene des GitHub-Repositorys `kubernetes/website`, um zu steuern
wie prow innerhalb des Repositorys arbeitet.

Eine OWNERS-Datei enth&auml;lt eine Liste von Personen, die SIG Docs-Reviewer und
Genehmiger sind. OWNERS-Dateien k&ouml;nnen auch in Unterverzeichnissen existieren und bestimmen, wer
Dateien in diesem Unterverzeichnis und seinen Unterverzeichnissen als Rezensent oder
Genemiger best&auml;tigen darf. Weitere Informationen &uuml;ber OWNERS-Dateien im Allgemeinen findest du unter
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

Au&szlig,erdem kann eine einzelne Markdown-Datei in ihrem Front-Matter (Vorspann) Reviewer und Genehmiger auflisten.
Entweder durch Auflistung einzelner GitHub-Benutzernamen oder GitHub-Gruppen.

Die Kombination aus OWNERS-Dateien und Front-Matter in Markdown-Dateien bestimmt, welche Ratschl&auml;ge PR-Eigent&uuml;mer von automatisierten Systemen erhalten, und wen sie um eine technische und redaktionelle Überpr&uuml;fung ihres PRs bitten sollen.
## So funktioniert das Zusammenf&uuml;hren

Wenn ein Pull Request mit der Branch (Ast) zusammengef&uuml;hrt wird, in dem der Inhalt ver&ouml;ffentlicht werden soll, wird dieser Inhalt auf http://kubernetes.io ver&ouml;ffentlicht. Um sicherzustellen, dass die Qualit&auml;t der ver&ouml;ffentlichten Inhalte hoch ist, beschr&auml;nken wir das Zusammenf&uuml;hren von Pull Requests auf
SIG Docs Freigabeberechtigte. So funktioniert es:

- Wenn eine Pull-Anfrage sowohl das `lgtm`- als auch das `approve`-Label hat, kein `hold`-Label hat, 
  und alle Tests bestanden sind, wird der Pull Request automatisch  zusammengef&uuml;hrt.
- Mitglieder der Kubernetes-Organisation und SIG Docs-Genehmiger k&ouml;nnen Kommentare hinzuf&uuml;gen, um
  Kommentare hinzuf&uuml;gen, um das automatische Zusammenf&uuml;hren eines Pull Requests zu verhindern (durch Hinzuf&uuml;gen eines `/hold`-Kommentars
  kann ein vorheriger `/lgtm`-Kommentar zur&uuml;ckgehalten werden).
- Jedes Kubernetes-Mitglied kann das `lgtm`-Label hinzuf&uuml;gen, indem es einen `/lgtm`-Kommentar hinzuf&uuml;gt.
- Nur SIG Docs-Genehmiger k&ouml;nnen einen Pull Request zusammenf&uuml;hren indem sie einen `/approve` Kommentar hinzuf&uuml;gen. 
  Einige Genehmiger &uuml;bernehmen auch weitere spezielle Rollen, wie zum Beispiel [PR Wrangler](/docs/contribute/participate/pr-wranglers/) oder [SIG Docs Vorsitzende](#sig-docs-chairperson).

## {{% heading "whatsnext" %}}

Weitere Informationen &uuml;ber die Mitarbeit an der Kubernetes-Dokumentation findest du unter:

- [Neue Inhalte beisteuern](/docs/contribute/new-content/overview/)
- [Inhalte &uuml;berpr&uuml;fen](/docs/contribute/review/reviewing-prs)
- [Styleguide f&uuml;r die Dokumentation](/docs/contribute/style/)
