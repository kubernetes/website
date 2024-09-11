---
title: Kubectl installieren und konfigurieren auf Linux
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Kubectl auf Linux installieren
---

## {{% heading "prerequisites" %}}

Um kubectl zu verwenden darf die kubectl-Version nicht mehr als eine Minor-Version Unterschied zu dem Cluster aufweisen. Zum Beispiel: eine Client-Version v{{< skew currentVersion >}} kann mit folgenden Versionen kommunizieren v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, und v{{< skew currentVersionAddMinor 1 >}}.
Die Verwendung der neuesten kompatiblen Version von kubectl hilft, unvorhergesehene Probleme zu vermeiden.

## Kubectl auf Linux installieren

Um kubectl auf Linux zu installieren, gibt es die folgenden Möglichkeiten:

- [{{% heading "prerequisites" %}}](#-heading-prerequisites-)
- [Kubectl auf Linux installieren](#kubectl-auf-linux-installieren)
  - [Kubectl Binary mit curl auf Linux installieren](#kubectl-binary-mit-curl-auf-linux-installieren)
  - [Installieren mit Hilfe des Linux eigenen Paketmanagers](#installieren-mit-hilfe-des-linux-eigenen-paketmanagers)
  - [Installation mit anderen Paketmanagern](#installation-mit-anderen-paketmanagern)
- [Kubectl Konfiguration verifizieren](#kubectl-konfiguration-verifizieren)
- [Optionale kubectl Konfigurationen und Plugins](#optionale-kubectl-konfigurationen-und-plugins)
  - [Shell Autovervollständigung einbinden](#shell-autovervollständigung-einbinden)
  - [`kubectl-convert` Plugin installieren](#kubectl-convert-plugin-installieren)
- [{{% heading "whatsnext" %}}](#-heading-whatsnext-)

### Kubectl Binary mit curl auf Linux installieren

1. Das aktuellste Release downloaden:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
   Um eine spezifische Version herunterzuladen, ersetze `$(curl -L -s https://dl.k8s.io/release/stable.txt)` mit der spezifischen Version.

   Um zum Beispiel Version {{< skew currentPatchVersion >}} auf Linux herunterzuladen:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

2. Binary validieren (optional)

   Download der kubectl Checksum-Datei:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   Kubectl Binary mit der Checksum-Datei validieren:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   Wenn Valide, dann sieht die Ausgabe wie folgt aus:

   ```console
   kubectl: OK
   ```

   Falls die Validierung fehlschlägt, beendet sich `sha256` mit einem "nonzero"-Status und gibt einen Fehler aus, welcher so aussehen könnte:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Lade von der kubectl Binary und Checksum-Datei immer die selben Versionen herunter.
   {{< /note >}}

3. kubectl installieren

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   Wenn kein root Zugriff auf das Zielsystem möglich ist, kann kubectl in das Verzeichnis `~/.local/bin` installiert werden:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # und ~/.local/bin zur Umgebungsvariable $PATH hinzufügen
   ```

   {{< /note >}}

4. Prüfen ob die installierte Version die aktuellste Version ist:

   ```bash
   kubectl version --client
   ```

   {{< note >}}
   Der oben stehende Befehl wirft folgende Warnung:

   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```

   Diese Warnung kann ignoriert werden. Prüfe lediglich die `kubectl` Version, eelche installiert wurde.
   
   {{< /note >}}
   
   Oder benutzte diesen Befehl für eine detailliertere Ansicht:

   ```cmd
   kubectl version --client --output=yaml    
   ```

### Installieren mit Hilfe des Linux eigenen Paketmanagers

{{< tabs name="kubectl_install" >}}
{{% tab name="Debian-basierte Distributionen" %}}

1. Update des `apt` Paketindex und Installation der benötigten Pakete um das Kubernetes `apt` Repository zu nutzen:

   ```shell
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl
   ```

   Falls Debian 9 (stretch) oder älter genutzt wird, müssen zusätzlich das Paket `apt-transport-https` installiert werden:

   ```shell
   sudo apt-get install -y apt-transport-https
   ```

2. Den öffentlichen Google Cloud Signaturschlüssel herunterladen:

   ```shell
   curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
   ```

3. Kubernetes zum `apt` Repository:

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Den `apt` Paketindex mit dem neuen Repository updaten und kubectl installieren:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{< note >}}
In Releases älter als Debian 12 und Ubuntu 22.04, existiert `/etc/apt/keyrings` nicht per default.
Falls es benötigt wird, kann es angelegt werden. Hierzu sollte es danach von jedermann lesbar, aber nur von Admins schreibar gemacht werden.
{{< /note >}}

{{% /tab %}}

{{% tab name="Red Hat-basierte Distributionen" %}}

1. Hinzufügen des Kubernetes `yum` Repository. Wenn eine andere Kubernetes Version als {{< param "version" >}} installiert werden soll, muss {{< param "version" >}} im unteren Block durch die gewünschte Version ersetzt werden.

   ```bash
   # Bestehende Inhalte in /etc/yum.repos.d/kubernetes.repo werden überschrieben
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```
{{< note >}}
Wenn eine andere minor Version von kubectl installiert werden soll muss `/etc/yum.repos.d/kubernetes.repo` angepasst werden
bevor `yum install` ausgeführt wird. Eine genauere Beschreibung findet sich hier
[Wechseln des Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

2. Installieren von kubectl mit Hilfe von `yum`:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="SUSE-basierte Distributionen" %}}
1. Hinzufügen des Kubernetes `zypper` Repository. Wenn eine andere Kubernetes Version als {{< param "version" >}} installiert werden soll, muss {{< param "version" >}} im unteren Block durch die gewünschte Version ersetzt werden.

   ```bash
   # Bestehende Inhalte in /etc/zypp/repos.d/kubernetes.repo werden überschrieben
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
Wenn eine andere minor Version von kubectl installiert werden soll muss `/etc/zypp/repos.d/kubernetes.repo` angepasst werden
bevor `zypper update` ausgeführt wird. Eine genauere Beschreibung findet sich hier
[Wechseln des Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/).
{{< /note >}}

   2. Install kubectl using `zypper`:

      ```bash
      sudo zypper install -y kubectl
      ```

{{% /tab %}}
{{< /tabs >}}

### Installation mit anderen Paketmanagern

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Falls Ubuntu oder andere Linux Distributionen verwendet wird, und diese den [snap](https://snapcraft.io/docs/core/install) Paketmanager unterstützen, kann kubectl als [snap](https://snapcraft.io/) Anwendung installiert werden.

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Falls in Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) als
Paketmanager genutzt wird, kann kubectl über diesen [installiert](https://docs.brew.sh/Homebrew-on-Linux#install) werden.

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Kubectl Konfiguration verifizieren

{{< include "included/verify-kubectl.md" >}}

## Optionale kubectl Konfigurationen und Plugins

### Shell Autovervollständigung einbinden

kubectl stellt Autovervollständigungen für Bash, Zsh, Fish und Powershell zur Verfügung, mit welchem sich Kommandozeilen Befehle beschleunigen lassen.

Untenstehend ist beschrieben, wie die Autovervollständigungen für Fish und Zsh eingebunden werden.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl-convert` Plugin installieren

{{< include "included/kubectl-convert-overview.md" >}}

1. Neueste Version des Kommandozeilenbefehls herunterladen:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   ```

2. Binär-Datei validieren (optional)

   Download der kubectl-convert Checksum-Datei:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   ```

   Kubectl-convert Binary mit der Checksum-Datei validieren:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   Wenn Valide, dann sieht die Ausgabe wie folgt aus:

   ```console
   kubectl-convert: OK
   ```

   Falls die Validierung fehlschlägt, beendet sich `sha256` mit einem "nonzero"-Status und gibt einen Fehler aus, welcher so aussehen könnte:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Lade von der kubectl Binary und Checksum-Datei immer die selben Versionen herunter.
   {{< /note >}}

3. kubectl-convert installieren

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

4. Verifizieren, dass das Pluign erfolgreich installiert wurde:

   ```shell
   kubectl convert --help
   ```

  Wenn kein Fehler ausgegeben wird, ist das Plugin erfolgreich installiert worden.

1. Nach Installation des Plugins, die Installationsdateien aufräumen:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
