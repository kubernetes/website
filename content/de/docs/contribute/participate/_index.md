---
title: An SIG Docs teilnehmen
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
no_list: true
---

<!-- overview -->

SIG Docs ist eine der
[Sonderinteressengruppen](https://github.com/kubernetes/community/blob/main/sig-list.md)
im Kubernetes-Projekt, die sich auf das Schreiben, Aktualisieren und Pflegen
der Kubernetes-Dokumentation insgesamt konzentriert. Weitere Informationen zur SIG findest du unter
[SIG Docs im Community-GitHub-Repository](https://github.com/kubernetes/community/tree/main/sig-docs).

SIG Docs begrüßt Inhalte und Reviews von allen Mitwirkenden. Jeder kann einen
Pull Request (PR) öffnen, und jeder kann Issues zu Inhalten einreichen oder
Kommentare zu laufenden Pull Requests hinterlassen.

Du kannst auch [Mitglied](/docs/contribute/participate/roles-and-responsibilities/#members),
[Reviewer](/docs/contribute/participate/roles-and-responsibilities/#reviewers) oder
[Approver](/docs/contribute/participate/roles-and-responsibilities/#approvers) werden.
Diese Rollen erfordern erweiterten Zugriff und bestimmte Verantwortlichkeiten für
das Genehmigen und Zusammenführen von Änderungen. Weitere Informationen zur Mitgliedschaft
in der Kubernetes-Community findest du unter
[community-membership](https://github.com/kubernetes/community/blob/main/community-membership.md).

<!-- body -->

## SIG Docs Vorsitzende

Jede SIG, einschließlich SIG Docs, wählt ein oder mehrere SIG-Mitglieder als Vorsitzende.
Diese sind Ansprechpersonen zwischen SIG Docs und anderen Teilen der Kubernetes-Organisation.
Sie benötigen umfangreiche Kenntnisse über die Struktur des Kubernetes-Projekts insgesamt
und wie SIG Docs darin funktioniert. Die aktuelle Liste der Vorsitzenden findest du unter
[Leadership](https://github.com/kubernetes/community/tree/main/sig-docs#leadership).

## SIG Docs Teams und Automatisierung

Die Automatisierung in SIG Docs stützt sich auf zwei verschiedene Mechanismen:
GitHub-Teams und OWNERS-Dateien.

### GitHub-Teams

Auf GitHub gibt es zwei Kategorien von SIG Docs
[Teams](https://github.com/orgs/kubernetes/teams?query=sig-docs):

- `@sig-docs-{language}-owners` sind Approver und Leads
- `@sig-docs-{language}-reviews` sind Reviewer

Jedes Team kann in GitHub-Kommentaren mit seinem `@name` referenziert werden,
um mit allen Mitgliedern der Gruppe zu kommunizieren.

### OWNERS-Dateien und Frontmatter

Das Kubernetes-Projekt verwendet ein Automatisierungswerkzeug namens prow für
die Automatisierung im Zusammenhang mit GitHub-Issues und Pull Requests. Das
[Kubernetes-Website-Repository](https://github.com/kubernetes/website) verwendet
zwei [prow-Plugins](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):
blunderbuss und approve.

Diese Plugins nutzen die
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS)- und
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)-Dateien
im Hauptverzeichnis des `kubernetes/website`-Repositories.

## Wie das Zusammenführen funktioniert

Wenn ein Pull Request in den Branch zusammengeführt wird, der zum Veröffentlichen
von Inhalten verwendet wird, werden diese Inhalte auf https://kubernetes.io veröffentlicht.
Um die Qualität unserer veröffentlichten Inhalte sicherzustellen, beschränken wir
das Zusammenführen von Pull Requests auf SIG Docs Approver.

- Wenn ein PR sowohl das `lgtm`- als auch das `approve`-Label hat, keine `hold`-Labels
  vorhanden sind und alle Tests bestehen, wird der PR automatisch zusammengeführt.
- Kubernetes-Organisationsmitglieder und SIG Docs Approver können Kommentare hinzufügen,
  um das automatische Zusammenführen zu verhindern.
- Jedes Kubernetes-Mitglied kann das `lgtm`-Label hinzufügen.
- Nur SIG Docs Approver können einen PR durch einen `/approve`-Kommentar zusammenführen.

## {{% heading "whatsnext" %}}

Weitere Informationen zur Teilnahme an SIG Docs:

- [Rollen und Verantwortlichkeiten](/docs/contribute/participate/roles-and-responsibilities/)
- [Issue Wrangler](/docs/contribute/participate/issue-wrangler/)
- [PR Wrangler](/docs/contribute/participate/pr-wranglers/)
