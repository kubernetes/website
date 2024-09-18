---
title: Bei SIG Docs mitmachen
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

Die SIG Docs ist eine der [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (Fachspezifischen Interessengruppen) innerhalb des Kubernetes-Projekts, die sich auf das Schreiben, Aktualisieren und Pflegen der Dokumentation für Kubernetes als Ganzes konzentriert. Weitere Informationen über die SIG findest du unter SIG Docs im [GitHub Repository der Community](https://github.com/kubernetes/community/tree/master/sig-docs).

SIG Docs begrüßt Inhalte und Bewertungen von allen Mitwirkenden. Jeder kann einen
Pull Request (PR) eröffnen, und jeder ist willkommen, Fragen zum Inhalt zu stellen oder Kommentare
zu laufenden Pull Requests abzugeben.

Du kannst dich ausserdem als [Member](/de/docs/contribute/participate/roles-and-responsibilities/#member),
[Reviewer](/de/docs/contribute/participate/roles-and-responsibilities/#reviewer), oder
[Approver](/de/docs/contribute/participate/roles-and-responsibilities/#approver) beteiligen.
Diese Rollen erfordern einen erweiterten Zugriff und bringen bestimmte Verantwortlichkeiten zur Genehmigung und Bestätigung von Änderungen mit sich.
Unter [community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md) findest du weitere Informationen darüber, wie die Mitgliedschaft in der Kubernetes-Community funktioniert.

Der Rest dieses Dokuments umreißt einige spezielle Vorgehensweisen dieser Rollen innerhalb von SIG Docs, die für die Pflege eines der öffentlichsten Aushängeschilder von Kubernetes verantwortlich ist - die Kubernetes-Website und die Dokumentation.

<!-- body -->
## SIG Docs Vorstand

Jede SIG, auch die SIG Docs, wählt ein oder mehrere SIG-Mitglieder, die als
Vorstand fungieren. Sie sind die Kontaktstellen zwischen der SIG Docs und anderen Teilen der
der Kubernetes-Organisation. Sie benötigen umfassende Kenntnisse über die Struktur
des Kubernetes-Projekts als Ganzes und wie SIG Docs darin arbeitet. Hier findest alle weiteren Informationen zu den aktuellen Vorsitzenden und der [Leitung](https://github.com/kubernetes/community/tree/master/sig-docs#leadership).

## SIG Docs-Teams und Automatisierung

Die Automatisierung in SIG Docs stützt sich auf zwei verschiedene Mechanismen:
GitHub-Teams und OWNERS-Dateien.

### GitHub Teams

Es gibt zwei Kategorien von SIG Docs [Teams](https://github.com/orgs/kubernetes/teams?query=sig-docs) auf GitHub:

- `@sig-docs-{language}-owners` sind Genehmiger und Verantwortliche
- `@sig-docs-{language}-reviews` sind Reviewer

Jede Gruppe kann in GitHub-Kommentaren mit ihrem `@name` referenziert werden, um mit allen Mitgliedern dieser Gruppe zu kommunizieren.

Manchmal überschneiden sich Prow- und GitHub-Teams, ohne eine genaue Übereinstimmung. Für die Zuordnung von Issues, Pull-Requests und zur Unterstützung von PR-Genehmigungen verwendet die
Automatisierung die Informationen aus den `OWNERS`-Dateien.

### OWNERS Dateien und Front-Matter

Das Kubernetes-Projekt verwendet ein Automatisierungstool namens prow für die Automatisierung im Zusammenhang mit GitHub-Issues und Pull-Requests. 
Das [Kubernetes-Website-Repository](https://github.com/kubernetes/website) verwendet zwei [prow-Plugins](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Diese beiden Plugins nutzen die
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) und
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
Dateien auf der obersten Ebene des GitHub-Repositorys `kubernetes/website`, um zu steuern
wie prow innerhalb des Repositorys arbeitet.

Eine OWNERS-Datei enthält eine Liste von Personen, die SIG Docs-Reviewer und
Genehmiger sind. OWNERS-Dateien können auch in Unterverzeichnissen existieren und bestimmen, wer
Dateien in diesem Unterverzeichnis und seinen Unterverzeichnissen als Gutachter oder
Genehmiger bestätigen darf. Weitere Informationen über OWNERS-Dateien im Allgemeinen findest du unter
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

Außerdem kann eine einzelne Markdown-Datei in ihrem Front-Matter (Vorspann) Reviewer und Genehmiger auflisten.
Entweder durch Auflistung einzelner GitHub-Benutzernamen oder GitHub-Gruppen.

Die Kombination aus OWNERS-Dateien und Front-Matter in Markdown-Dateien bestimmt, welche Empfehlungen PR-Eigentümer von automatisierten Systemen erhalten, und wen sie um eine technische und redaktionelle Überprüfung ihres PRs bitten sollen.
## So funktioniert das Zusammenführen

Wenn ein Pull Request mit der Branch (Ast) zusammengeführt wird, in dem der Inhalt bereitgestellt werden soll, wird dieser Inhalt auf http://kubernetes.io veröffentlicht. Um sicherzustellen, dass die Qualität der veröffentlichten Inhalte hoch ist, beschränken wir das Zusammenführen von Pull Requests auf
SIG Docs Freigabeberechtigte. So funktioniert es:

- Wenn eine Pull-Anfrage sowohl das `lgtm`- als auch das `approve`-Label hat, kein `hold`-Label hat, 
  und alle Tests bestanden sind, wird der Pull Request automatisch  zusammengeführt.
- Jedes Kubernetes-Mitglied kann das `lgtm`-Label hinzufügen, indem es einen `/lgtm`-Kommentar hinzufügt.
- Mitglieder der Kubernetes-Organisation und SIG Docs-Genehmiger können kommentieren, um das automatische Zusammenführen eines Pull Requests zu verhindern (durch Hinzufügen eines `/hold`-Kommentars
  kann ein vorheriger `/lgtm`-Kommentar zurückgehalten werden).
- Nur SIG Docs-Genehmiger können einen Pull Request zusammenführen indem sie einen `/approve` Kommentar hinzufügen. 
  Einige Genehmiger übernehmen auch weitere spezielle Rollen, wie zum Beispiel [PR Wrangler](/docs/contribute/participate/pr-wranglers/) oder [SIG Docs Vorsitzende](#sig-docs-chairperson).

## {{% heading "whatsnext" %}}

Weitere Informationen über die Mitarbeit an der Kubernetes-Dokumentation findest du unter:

- [Neue Inhalte beisteuern](/docs/contribute/new-content/overview/)
- [Inhalte überprüfen](/docs/contribute/review/reviewing-prs)
- [Styleguide für die Dokumentation](/docs/contribute/style/)
