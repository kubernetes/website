---
title: Kubectl installieren und konfigurieren auf Windows
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Kubectl installieren und konfigurieren auf Windows
---

## {{% heading "prerequisites" %}}

Um `kubectl` zu verwenden darf die kubectl-Version nicht mehr als eine Minor-Version Unterschied zu deinem Cluster aufweisen.
Zum Beispiel: eine Client-Version v{{< skew currentVersion >}} kann mit folgenden Versionen kommunizieren:
v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, und v{{< skew currentVersionAddMinor 1 >}}.
Die Verwendung der neuesten kompatiblen Version von `kubectl` hilft, unvorhergesehene Probleme zu vermeiden.

## kubectl auf Windows installieren

`kubectl` kann auf folgende Weisen installiert werden:

- [kubectl mit curl auf Windows installieren](#kubectl-mit-curl-auf-Windows-installieren)
- [kubectl mit Chocolatey, Scoop oder winget auf Windows installieren](#install-nonstandard-package-tools)

### kubectl mit curl auf Windows installieren

1. Lade den aktuellsten Release {{< skew currentVersion >}} herunter:
   [kubectl {{< skew currentPatchVersion >}}](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe).

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
   ```

   {{< note >}}
   Die aktuellste stabile Version (um z.B Skripte zu schreiben) finden Sie unter
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

1. Überprüfe die Binärdatei (optional):

   Lade die Prüfsumme von `kubectl` herunter:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   Validiere die `kubectl`-Binärdatei mit der heruntergeladenen Prüfsumme:

   - Vergleiche das Ergebnis von `CertUtil` manuell mit der heruntergeladenen Prüfsumme:
     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Verwende den `-eq`-Operator von PowerShell, um den Hash der Binärdatei mit der Prüfsumme zu vergleichen:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. Füge den Ordner mit der `kubectl` Binärdatei zur Umgebungsvariable `PATH` hinzu.

1. Stelle sicher, dass die Version von `kubectl` im `PATH` mit der heruntergeladenen Version übereinstimmt: 

   ```cmd
   kubectl version --client
   ```

   {{< note >}}
   Das obere Kommando wird eine Warnung ausgeben:

   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```

   Du kannst diese Warnung ignorieren, da du lediglich die `kubectl`-Version, die du installiert hast, überprüfst.
   {{< /note >}}
   
   Eine detailliertere Ausgabe erhältst du mit:

   ```cmd
   kubectl version --client --output=yaml
   ```

{{< note >}}
[Docker Desktop für Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
fügt seine eigene Version von `kubectl` zu `PATH` hinzu. Falls du Docker Desktop bereits
installiert hast, musst du gegebenenfalls:
- den `PATH`-Eintrag des heruntergeladenen `kubectl` vor den Eintrag des Docker Desktop-`kubectl` setzen
- das `kubectl` von Docker Desktop entfernen
{{< /note>}}

### Installation auf Windows mithilfe von Chocolatey, Scoop oder winget {#install-nonstandard-package-tools}
1. Um `kubectl` auf Windows zu installieren kann entweder [Chocolatey](https://chocolatey.org),
   [Scoop](https://scoop.sh) oder [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) verwendet werden.

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. Stelle sicher, dass die aktuellste Version installiert wurde:

   ```powershell
   kubectl version --client
   ```

1. Wechsle in dein Benutzerverzeichnis:

   ```powershell
   # Falls Sie cmd.exe verwenden, führen Sie folgendes aus: cd %USERPROFILE%
   cd ~
   ```

1. Erstelle ein Verzeichnis namens `.kube`:

   ```powershell
   mkdir .kube
   ```

1. Wechsle in das das `.kube` Verzeichnis, das du soeben erstellt hast:

   ```powershell
   cd .kube
   ```

1. Konfiguriere `kubectl`, um ein externes Kubernetes Cluster zu verwenden:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Du kannst die Konfigurationsdatei mit dem Editor Ihrer Wahl, z.B. Notepad anpassen.
{{< /note >}}

## Konfiguration von kubectl überprüfen

{{< include "included/verify-kubectl.md" >}}

## Optionale Konfigurationen und Plugins für kubectl

## Auto-Vervollständigung aktivieren
`kubectl` unterstützt Auto-Vervollständigung in Bash, Zsh, Fish und PowerShell.
Somit kannst du dir viel Schreibarbeit sparen.

Im Folgenden findest du eine Anleitung, um die Auto-Vervollständigung für PowerShell einzurichten.

### Das `kubectl convert`-Plugin installieren
1. Lade die aktuellste Version mit folgendem Kommando herunter:
   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. Überprüfe die Binärdatei (optional):

   Lade die Prüfsumme von `kubectl-convert` herunter:
   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   Validiere die `kubectl-convert`-Binärdatei mit der heruntergeladenen Prüfsumme:

   - Vergleiche das Ergebnis von `CertUtil` manuell mit der heruntergeladenen Prüfsumme:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Verwende den `-eq`-Operator von PowerShell, um den Hash der Binärdatei mit der Prüfsumme zu vergleichen:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. Füge den Ordner mit der `kubectl-convert` Binärdatei zur Umgebungsvariable `PATH` hinzu.

1. Stelle sicher, dass das Plugin korrekt installiert wurde:

   ```shell
   kubectl convert --help
   ```

   Wenn kein Fehler ausgegeben wurde, wurde das Plugin erfolgreich installiert.

1. Entferne die Installationsdateien nach der Installation des Plugins:
   ```powershell
   del kubectl-convert.exe kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
