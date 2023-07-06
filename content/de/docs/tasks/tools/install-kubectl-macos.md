---
title: Kubectl installieren und konfigurieren auf macOS
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Kubectl auf macOS installieren
---

## {{% heading "prerequisites" %}}

Um kubectl zu verwenden darf die kubectl-Version nicht mehr als eine Minor-Version Unterschied zu deinem Cluster aufweisen. Zum Beispiel: eine Client-Version v{{< skew currentVersion >}} kann mit folgenden Versionen kommunizieren v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, und v{{< skew currentVersionAddMinor 1 >}}.
Die Verwendung der neuesten kompatiblen Version von kubectl hilft, unvorhergesehene Probleme zu vermeiden.

## Kubectl auf macOS installieren

Um kubectl auf macOS zu installieren, gibt es die folgenden Möglichkeiten:

- [{{% heading "prerequisites" %}}](#-heading-prerequisites-)
- [Kubectl auf macOS installieren](#kubectl-auf-macos-installieren)
  - [Kubectl Binary mit curl auf macOS installieren](#kubectl-binary-mit-curl-auf-macos-installieren)
  - [Mit Homebrew auf macOS installieren](#mit-homebrew-auf-macos-installieren)
  - [Mit Macports auf macOS installieren](#mit-macports-auf-macos-installieren)
- [Kubectl Konfiguration verifizieren](#kubectl-konfiguration-verifizieren)
- [Optionale kubectl Konfigurationen und Plugins](#optionale-kubectl-konfigurationen-und-plugins)
  - [Shell Autovervollständigung einbinden](#shell-autovervollständigung-einbinden)
  - [`kubectl-convert` Plugin installieren](#kubectl-convert-plugin-installieren)
- [{{% heading "whatsnext" %}}](#-heading-whatsnext-)

### Kubectl Binary mit curl auf macOS installieren

1. Das aktuellste Release downloaden:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Um eine spezifische Version herunterzuladen, ersetze `$(curl -L -s https://dl.k8s.io/release/stable.txt)` mit der spezifischen Version

   Um zum Beispiel Version {{< skew currentPatchVersion >}} auf Intel macOS herunterzuladen:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   Für macOS auf Apple Silicon (z.B. M1/M2):

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

2. Binary validieren (optional)

   Download der kubectl Checksum-Datei:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   Kubectl Binary mit der Checksum-Datei validieren:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   Wenn Valide, dann sieht die Ausgabe wie folgt aus:

   ```console
   kubectl: OK
   ```

   Falls die Validierung fehlschlägt, beendet sich `shasum` mit einem "nonzero"-Status und gibt einen Fehler aus, welcher so aussehen könnte:

   ```bash
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Lade von der kubectl Binary und Checksum-Datei immer die selben Versionen herunter.
   {{< /note >}}

3. Kubectl Binary ausführbar machen.

   ```bash
   chmod +x ./kubectl
   ```

4. Kubectl Binary zu einem Ordner in Ihrem `PATH` verschieben.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   Stelle sicher, dass `/usr/local/bin` in deiner PATH Umgebungsvariable gesetzt ist.
   {{< /note >}}

5. Prüfen ob die installierte Version die aktuellste Version ist:

   ```bash
   kubectl version --client
   ```
   
   {{< note >}}
   Der oben stehende Befehl wirft folgende Warnung:

   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```

   Diese Warnung kann ignoriert werden. Prüfe lediglich die `kubectl` Version, welche installiert wurde.
   
   {{< /note >}}
   
   Oder benutzte diesen Befehl für eine detailliertere Ansicht:

   ```cmd
   kubectl version --client --output=yaml
   ```

6. Nach Installation des Plugins, die Installationsdateien aufräumen:

   ```bash
   rm kubectl kubectl.sha256
   ```

### Mit Homebrew auf macOS installieren

Wenn macOS und [Homebrew](https://brew.sh/) als Paketmanager benutzt wird,
kann kubectl über diesen installiert werden.

1. Führe den Installationsbefehl aus:

   ```bash
   brew install kubectl
   ```

   oder

   ```bash
   brew install kubernetes-cli
   ```

2. Prüfen ob die installierte Version die aktuellste Version ist:

   ```bash
   kubectl version --client
   ```

### Mit Macports auf macOS installieren

Wenn macOS und  [Macports](https://macports.org/) als Paketmanager benutzt wird, kann kubectl über diesen installiert werden.

1. Führe den Installationsbefehl aus:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

2. Prüfen ob die installierte Version die aktuellste Version ist:

   ```bash
   kubectl version --client
   ```

## Kubectl Konfiguration verifizieren

{{< include "included/verify-kubectl.md" >}}

## Optionale kubectl Konfigurationen und Plugins

### Shell Autovervollständigung einbinden

kubectl stellt Autovervollständigungen für Bash, Zsh, Fish und Powershell zur Verfügung, mit welchem Kommandozeilenbefehle beschleunigt werden können.

Untenstehend ist beschrieben, wie die Autovervollständigungen für Fish und Zsh eingebunden werden.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl-convert` Plugin installieren

{{< include "included/kubectl-convert-overview.md" >}}

1. Neueste Version des Kommandozeilenbefehls herunterladen:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

2. Binär-Datei validieren (optional)

   Download der kubectl-convert Checksum-Datei:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Validierung der kubectl-convert Binary mit der Checksum-Datei:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   Wenn Valide, dann sieht die Ausgabe wie folgt aus:

   ```console
   kubectl-convert: OK
   ```

   Falls die Validierung fehlschlägt, beendet sich `shasum` mit einem "nonzero"-Status und gibt einen Fehler aus, welcher so aussehen könnte:

   ```bash
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
      Lade von der kubectl Binary und Checksum-Datei immer die selben Versionen herunter.
   {{< /note >}}

3. Kubectl-convert Binary ausführbar machen

   ```bash
   chmod +x ./kubectl-convert
   ```

4. Kubectl-convert Binary zu einem Ordner in `PATH` Umgebungsvariable verschieben.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
    Stelle sicher, dass `/usr/local/bin` in der PATH Umgebungsvariable gesetzt ist.
   {{< /note >}}

5. Verifizieren, dass das Pluign erfolgreich installiert wurde:

   ```shell
   kubectl convert --help
   ```

   Wenn kein Fehler ausgegeben wird, ist das Plugin erfolgreich installiert worden.

6. Nach Installation des Plugins, die Installationsdateien aufräumen:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
