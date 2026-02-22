---
title: Lokalisierung der Kubernetes Dokumentation
content_type: concept
weight: 50
card:
  name: mitarbeiten
  weight: 50
  title: Übersetzen der Dokumentation
---

<!-- overview -->

Diese Seite zeigt dir wie die Dokumentation für verschiedene Sprachen [lokalisiert](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/) wird.



<!-- body -->

## Erste Schritte

Da Mitwirkende nicht ihren eigenen Pull Request freigeben können, brauchst du mindestens zwei Mitwirkende um mit der Lokalisierung anfangen zu können.

Alle Lokalisierungsteams müssen sich mit ihren eigenen Ressourcen selbst tragen. Die Kubernetes-Website ist gerne bereit, deine Arbeit zu beherbergen, aber es liegt an dir, sie zu übersetzen.

### Ermittlung deines Zwei-Buchstaben-Sprachcodes

Rufe den [ISO 639-1 Standard](https://www.loc.gov/standards/iso639-2/php/code_list.php) auf und finde deinen Zwei-Buchstaben-Ländercode zur Lokalisierung. Zum Beispiel ist der Zwei-Buchstaben-Code für Korea `ko`.

### Duplizieren und Klonen des Repositories

Als erstes [erstellst du dir deine eigenes Duplikat](/docs/contribute/new-content/new-content/#fork-the-repo) vom [kubernetes/website] Repository.

Dann klonst du das Duplikat und wechselst in das neu erstellte Verzeichnis:

```shell
git clone https://github.com/<username>/website
cd website
```

### Eröffnen eines Pull Requests

Als nächstes [eröffnest du einen Pull Request](/docs/contribute/new-content/open-a-pr/#open-a-pr) (PR) um eine Lokalisierung zum `kubernetes/website` Repository hinzuzufügen.

Der PR muss die [minimalen Inhaltsanforderungen](#mindestanforderungen) erfüllen, bevor dieser genehmigt werden kann.

Wie der PR für eine neue Lokalisierung aussieht, kannst du dir an dem PR für die [Französische Dokumentation](https://github.com/kubernetes/website/pull/12548) ansehen.

### Tritt der Kubernetes GitHub Organisation bei

Sobald du eine Lokalisierungs-PR eröffnet hast, kannst du Mitglied der Kubernetes GitHub Organisation werden. Jede Person im Team muss einen eigenen [Antrag auf Mitgliedschaft in der Organisation](https://github.com/kubernetes/org/issues/new/choose) im `kubernetes/org`-Repository erstellen.

### Lokalisierungs-Team in GitHub hinzufügen

Im nächsten Schritt musst du dein Kubernetes Lokalisierungs-Team in die [`sig-docs/teams.yaml`](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml) eintragen. 

Der PR des [Spanischen Lokalisierungs-Teams](https://github.com/kubernetes/org/pull/685) kann dir hierbei eine Hilfestellung sein.

Mitglieder der `@kubernetes/sig-docs-**-owners` können nur PRs freigeben die innerhalb deines Lokalisierungs-Ordners Änderungen vorgenommen haben: `/content/**/`.

Für jede Lokalisierung automatisiert das Team `@kubernetes/sig-docs-**-reviews` die Review-Zuweisung für neue PRs.

Mitglieder von `@kubernetes/website-maintainers` können neue Entwicklungszweige schaffen, um die Übersetzungsarbeiten zu koordinieren.

Mitglieder von `@kubernetes/website-milestone-maintainers` können den Befehl `/milestone` [Prow Kommando](https://prow.k8s.io/command-help) verwenden, um Themen oder PRs einen Meilenstein zuzuweisen.

### Workflow konfigurieren

Als nächstes fügst du ein GitHub-Label für deine Lokalisierung im `kubernetes/test-infra`-Repository hinzu. Mit einem Label kannst du Aufgaben filtern und Anfragen für deine spezifische Sprache abrufen.

Schau dir den PR zum Hinzufügen der Labels für die [Italienischen Sprachen-Labels](https://github.com/kubernetes/test-infra/pull/11316 an.


### Finde eine Gemeinschaft

Lasse die Kubernetes SIG Docs wissen, dass du an der Erstellung einer Lokalisierung interessiert bist! Trete dem [SIG Docs Slack-Kanal](https://kubernetes.slack.com/messages/C1J0BPD2M/) bei. Andere Lokalisierungsteams helfen dir gerne beim Einstieg und beantworten deine Fragen.

Du kannst auch einen Slack-Kanal für deine Lokalisierung im `kubernetes/community`-Repository erstellen. Ein Beispiel für das Hinzufügen eines Slack-Kanals findest du im PR für [Kanäle für Indonesisch und Portugiesisch hinzufügen](https://github.com/kubernetes/community/pull/3605).


## Mindestanforderungen

### Ändere die Website-Konfiguration

Die Kubernetes-Website  verwendet Hugo als Web-Framework. Die Hugo-Konfiguration der Website befindet sich in der Datei [`hugo.toml`](https://github.com/kubernetes/website/tree/master/hugo.toml). Um eine neue Lokalisierung zu unterstützen, musst du die Datei `hugo.toml` modifizieren.

Dazu fügst du einen neuen Block für die neue Sprache unter den bereits existierenden `[languages]` Block in das `hugo.toml` ein, wie folgendes Beispiel zeigt:

```toml
[languages.de]
title = "Kubernetes"
description = "Produktionsreife Container-Verwaltung"
languageName = "Deutsch"
contentDir = "content/de"
weight = 3
```

Wenn du deinem Block einen Parameter `weight` zuweist, suche den Sprachblock mit dem höchsten Gewicht und addiere 1 zu diesem Wert.

Weitere Informationen zu Hugos multilingualem Support findest du unter "[Multilingual Mode](https://gohugo.io/content-management/multilingual/)" auf in der Hugo Dokumentation.

### Neuen Lokalisierungsordner erstellen

Füge eine sprachspezifisches Unterverzeichnis zum Ordner [`content`](https://github.com/kubernetes/website/tree/master/content) im Repository hinzu. Der Zwei-Buchstaben-Code für Deutsch ist zum Beispiel `de`:

```shell
mkdir content/de
```

### Lokalisiere den Verhaltenscodex
Öffne einen PR gegen das [`cncf/foundation`](https://github.com/cncf/foundation/tree/master/code-of-conduct-languages) Repository, um den Verhaltenskodex in deiner Sprache hinzuzufügen.

### Lokalisierungs README Datei hinzufügen

Um andere Lokalisierungsmitwirkende anzuleiten, füge eine neue [`README-**.md`](https://help.github.com/articles/about-readmes/) auf der obersten Ebene von kubernetes/website hinzu, wobei `**` der aus zwei Buchstaben bestehende Sprachcode ist. Eine deutsche README-Datei wäre zum Beispiel `README-de.md`.

Gebe den Lokalisierungsmitwirkende in der lokalisierten `README-**.md`-Datei Anleitung zum Mitwirken. Füge dieselben Informationen ein, die auch in `README.md` enthalten sind, sowie:

- Eine Anlaufstelle für das Lokalisierungsprojekt
- Alle für die Lokalisierung spezifischen Informationen

Nachdem du das lokalisierte README erstellt hast, füge der Datei einen Link aus der englischen Hauptdatei `README.md` hinzu und gebe die Kontaktinformationen auf Englisch an. Du kannst eine GitHub-ID, eine E-Mail-Adresse, [Slack-Kanal](https://slack.com/) oder eine andere Kontaktmethode angeben. Du musst auch einen Link zu deinem lokalisierten Verhaltenskodex der Gemeinschaft angeben.

### Richte eine OWNERS Datei ein

Um die Rollen der einzelnen an der Lokalisierung beteiligten Benutzer festzulegen, erstelle eine `OWNERS`-Datei innerhalb des sprachspezifischen Unterverzeichnisses mit:

- **reviewers**: Eine Liste von kubernetes-Teams mit Gutachter-Rollen, in diesem Fall das `sig-docs-**-reviews` Team, das in [Lokalisierungsteam in GitHub hinzufügen](#lokalisierungs-team-in-github-hinzufügen) erstellt wurde.
- **approvers**: Eine Liste der Kubernetes-Teams mit der Rolle des Genehmigers, in diesem Fall das `sig-docs-**-owners` Team, das in [Lokalisierungsteam in GitHub hinzufügen](#lokalisierungs-team-in-github-hinzufügen) erstellt wurde.
- **labels**: Eine Liste von GitHub-Labels, die automatisch auf einen PR angewendet werden sollen, in diesem Fall das Sprachlabel, das unter [Workflow konfigurieren](#workflow-konfigurieren) erstellt wurde.

Weitere Informationen über die Datei `OWNERS` findest du unter [go.k8s.io/owners](https://go.k8s.io/owners).

Die Datei [Spanish OWNERS file](https://git.k8s.io/website/content/es/OWNERS), mit dem Sprachcode `es`, sieht wie folgt aus:

```yaml
# See the OWNERS docs at https://go.k8s.io/owners

# This is the localization project for Spanish.
# Teams and members are visible at https://github.com/orgs/kubernetes/teams.

reviewers:
- sig-docs-es-reviews

approvers:
- sig-docs-es-owners

labels:
- language/es
```
Nachdem du die sprachspezifische Datei `OWNERS` hinzugefügt hast, aktualisiere die root Datei [`OWNERS_ALIASES`](https://git.k8s.io/website/OWNERS_ALIASES) mit den neuen Kubernetes-Teams für die Lokalisierung, `sig-docs-**-owners` und `sig-docs-**-reviews`.

Füge für jedes Team die Liste der unter [Ihr Lokalisierungsteam in GitHub hinzufügen](#lokalisierungs-team-in-github-hinzufügen) angeforderten GitHub-Benutzer in alphabetischer Reihenfolge hinzu.

```diff
--- a/OWNERS_ALIASES
+++ b/OWNERS_ALIASES
@@ -48,6 +48,14 @@ aliases:
     - stewart-yu
     - xiangpengzhao
     - zhangxiaoyu-zidif
+  sig-docs-es-owners: # Admins for Spanish content
+    - alexbrand
+    - raelga
+  sig-docs-es-reviews: # PR reviews for Spanish content
+    - alexbrand
+    - electrocucaracha
+    - glo-pena
+    - raelga
   sig-docs-fr-owners: # Admins for French content
     - perriea
     - remyleone
```

## Inhalte übersetzen

Die Lokalisierung *aller* Dokumentationen des Kubernetes ist eine enorme Aufgabe. Es ist in Ordnung, klein anzufangen und mit der Zeit zu erweitern.

Alle Lokalisierungen müssen folgende Inhalte enthalten:

Beschreibung | URLs
-----|-----
Startseite | [Alle Überschriften und Untertitel URLs](/docs/home/)
Einrichtung | [Alle Überschriften und Untertitel URLs](/docs/setup/)
Tutorials | [Kubernetes Grundlagen](/docs/tutorials/kubernetes-basics/), [Hello Minikube](/docs/tutorials/stateless-application/hello-minikube/)
Site strings | [Alle Website-Zeichenfolgen in einer neuen lokalisierten TOML-Datei](https://github.com/kubernetes/website/tree/master/i18n)

Übersetzte Dokumente müssen sich in ihrem eigenen Unterverzeichnis `content/**/` befinden, aber ansonsten dem gleichen URL-Pfad wie die englische Quelle folgen. Um z.B. das Tutorial [Kubernetes Grundlagen](/docs/tutorials/kubernetes-basics/) für die Übersetzung ins Deutsche vorzubereiten, erstelle einen Unterordner unter dem Ordner `content/de/` und kopiere die englische Quelle:

```shell
mkdir -p content/de/docs/tutorials
cp content/en/docs/tutorials/kubernetes-basics.md content/de/docs/tutorials/kubernetes-basics.md
```

Übersetzungswerkzeuge können den Übersetzungsprozess beschleunigen. Einige Redakteure bieten beispielsweise Plugins zur schnellen Übersetzung von Text an.


{{< caution >}}
Maschinelle Übersetzung allein reicht nicht aus. Die Lokalisierung erfordert eine umfassende menschliche Überprüfung, um Mindestqualitätsstandards zu erfüllen.
{{< /caution >}}

Um die Genauigkeit in Grammatik und Bedeutung zu gewährleisten, sollten die Mitglieder deines Lokalisierungsteams alle maschinell erstellten Übersetzungen vor der Veröffentlichung sorgfältig überprüfen.

### Quelldaten

Lokalisierungen müssen auf den englischen Dateien der neuesten Version basieren, {{< latest-version >}}.

Um die Quelldatei für das neueste Release führe folgende Schritte durch:

1. Navigiere zum Repository der Website Kubernetes unter https://github.com/kubernetes/website.
2. Wähle den `release-1.X`-Zweig für die aktuellste Version.

Die neueste Version ist {{< latest-version >}}, so dass der neueste Versionszweig [`{{< release-branch >}}`](https://github.com/kubernetes/website/tree/{{< release-branch >}}) ist.

### Seitenverlinkung in der Internationalisierung

Lokalisierungen müssen den Inhalt von [`i18n/de.toml`](https://github.com/kubernetes/website/blob/main/i18n/en.toml) in einer neuen sprachspezifischen Datei enthalten. Als Beispiel: `i18n/de.toml`.

Füge eine neue Lokalisierungsdatei zu `i18n/` hinzu. Zum Beispiel mit Deutsch (`de`):

```shell
cp i18n/en.toml i18n/de.toml
```

Übersetze dann den Wert jeder Zeichenfolge:

```TOML
[docs_label_i_am]
other = "ICH BIN..."
```
Durch die Lokalisierung von Website-Zeichenfolgen kannst du Website-weiten Text und Funktionen anpassen: z. B. den gesetzlichen Copyright-Text in der Fußzeile auf jeder Seite.

## Sprachspezifischer Styleguide

Einige Sprachteams haben ihren eigenen sprachspezifischen Styleguide und ihr eigenes Glossar. Siehe zum Beispiel den [Leitfaden zur koreanischen Lokalisierung](/ko/docs/contribute/localization_ko/).

### Informale Schreibweise
Für die deutsche Übersetzungen verwenden wir eine informelle Schreibweise und der Ansprache per `Du`. Allerdings werden keine Jargon, Slang, Wortspiele, Redewendungen oder kulturspezifische Bezüge eingebracht.

### Datums und Maßeinheiten
Wenn notwendig sollten Datumsangaben in das in Deutschland übliche dd.mm.yyyy überführt werden. Alternativ können diese auch in den Textfluss eingebunden werden: "... am 24. April ....".

### Abkürzungen 
Abkürzungen sollten nach Möglichkeit nicht verwendet werden und entweder ausgeschrieben oder anderweitig umgangen werden.

### Zusammengesetzte Wörter
Durch die Übersetzung werden oft Nomen aneinandergereiht, diese Wortketten müssen durch Bindestriche verbunden werden. Dies ist auch möglich wenn ein Teil ins Deutsche übersetzt wird ein weiterer jedoch im Englischen bestehen bleibt. Als Richtlinie gilt hier der [Duden](https://www.duden.de/sprachwissen/rechtschreibregeln/bindestrich).

### Anglizismen
Die Verwendung von Anglizismen ist dann wünschenswert, wenn die Verwendung eines deutschen Wortes, vor allem für technische Begriffe, nicht eindeutig ist oder zu Unklarheiten führt. 

## Branching Strategie

Da Lokalisierungsprojekte in hohem Maße gemeinschaftliche Bemühungen sind, ermutigen wir Teams, in gemeinsamen Entwicklungszweigen zu arbeiten.

In einem Entwicklungszweig zusammenzuarbeiten:

1. Ein Teammitglied von [@kubernetes/website-maintainers](https://github.com/orgs/kubernetes/teams/website-maintainers) eröffnet einen Entwicklungszweig aus einem Quellzweig auf https://github.com/kubernetes/website.

    Deine Genehmiger sind dem `@kubernetes/website-maintainers`-Team beigetreten, als du [dein Lokalisierungsteam](#lokalisierungs-team-in-github-hinzufügen) zum Repository [`kubernetes/org`](https://github.com/kubernetes/org) hinzugefügt hast.

    Wir empfehlen das folgende Zweigbenennungsschema:

    `dev-<Quellversion>-<Sprachcode>.<Team-Meilenstein>`

    Beispielsweise öffnet ein Genehmigender in einem deutschen Lokalisierungsteam den Entwicklungszweig `dev-1.12-de.1` direkt gegen das kubernetes/website-Repository, basierend auf dem Quellzweig für Kubernetes v1.12.

2. Einzelne Mitwirkende öffnen Feature-Zweige, die auf dem Entwicklungszweig basieren.

    Zum Beispiel öffnet ein deutscher Mitwirkende eine Pull-Anfrage mit Änderungen an `kubernetes:dev-1.12-de.1` von `Benutzername:lokaler-Zweig-Name`.

3. Genehmiger Überprüfen und führen die Feature-Zweigen in den Entwicklungszweig zusammen.

4. In regelmäßigen Abständen führt ein Genehmiger den Entwicklungszweig mit seinem Ursprungszweig zusammen, indem er eine neue Pull-Anfrage eröffnet und genehmigt. Achtet darauf, die Commits zusammenzuführen (squash), bevor die Pull-Anfrage genehmigt wird.

Wiederhole die Schritte 1-4 nach Bedarf, bis die Lokalisierung abgeschlossen ist. Zum Beispiel würden nachfolgende deutsche Entwicklungszweige sein: `dev-1.12-de.2`, `dev-1.12-de.3`, usw.

Die Teams müssen den lokalisierten Inhalt in demselben Versionszweig zusammenführen, aus dem der Inhalt stammt. Beispielsweise muss ein Entwicklungszweig, der von {{< release-branch >}} ausgeht, auf {{{{< release-branch >}}} basieren.

Ein Genehmiger muss einen Entwicklungszweig aufrechterhalten, indem er seinen Quellzweig auf dem aktuellen Stand hält und Merge-Konflikte auflöst. Je länger ein Entwicklungszweig geöffnet bleibt, desto mehr Wartung erfordert er in der Regel. Ziehe in Betracht, regelmäßig Entwicklungszweige zusammenzuführen und neue zu eröffnen, anstatt einen extrem lang laufenden Entwicklungszweig zu unterhalten.

Zu Beginn jedes Team-Meilensteins ist es hilfreich, ein Problem [Vergleich der Upstream-Änderungen](https://github.com/kubernetes/website/blob/main/scripts/upstream_changes.py) zwischen dem vorherigen Entwicklungszweig und dem aktuellen Entwicklungszweig zu öffnen.

 Während nur Genehmiger einen neuen Entwicklungszweig eröffnen und Pull-Anfragen zusammenführen können, kann jeder eine Pull-Anfrage für einen neuen Entwicklungszweig eröffnen. Es sind keine besonderen Genehmigungen erforderlich.

Weitere Informationen über das Arbeiten von Forks oder direkt vom Repository aus findest du unter ["fork and clone the repo"](#duplizieren-und-klonen-des-repositories).

## Am Upstream Mitwirken

SIG Docs begrüßt Upstream Beiträge, also auf das englische Original, und Korrekturen an der englischen Quelle.

## Unterstütze bereits bestehende Lokalisierungen

Du kannst auch dazu beitragen, Inhalte zu einer bestehenden Lokalisierung hinzuzufügen oder zu verbessern. Trete dem [Slack-Kanal](https://kubernetes.slack.com/messages/C1J0BPD2M/) für die Lokalisierung bei und beginne mit der Eröffnung von PRs, um zu helfen. Bitte beschränke deine Pull-Anfragen auf eine einzige Lokalisierung, da Pull-Anfragen, die Inhalte in mehreren Lokalisierungen ändern, schwer zu überprüfen sein könnten.



## {{% heading "whatsnext" %}}


Sobald eine Lokalisierung die Anforderungen an den Arbeitsablauf und die Mindestausgabe erfüllt, wird SIG docs:

- Die Sprachauswahl auf der Website aktivieren
- Die Verfügbarkeit der Lokalisierung über die Kanäle der [Cloud Native Computing Foundation](https://www.cncf.io/about/) (CNCF), einschließlich des [Kubernetes Blogs](https://kubernetes.io/blog/) veröffentlichen.
