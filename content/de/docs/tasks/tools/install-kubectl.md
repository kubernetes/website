---
title: Installieren und konfigurieren von kubectl
content_template: templates/task
weight: 10
card:
  name: tasks
  weight: 20
  title: Kubectl installieren
---

{{% capture overview %}}
Verwenden Sie das Kubernetes Befehlszeilenprogramm, [kubectl](/docs/user-guide/kubectl/), um Anwendungen auf Kubernetes bereitzustellen und zu verwalten. 
Mit kubectl können Sie Clusterressourcen überprüfen, Komponenten erstellen, löschen und aktualisieren; Ihren neuen Cluster betrachten; und Beispielanwendungen aufrufen.
{{% /capture %}}

{{% capture prerequisites %}}
Sie müssen eine kubectl-Version verwenden, die innerhalb eines geringfügigen Versionsunterschieds zur Version Ihres Clusters liegt. Ein v1.2-Client sollte beispielsweise mit einem v1.1, v1.2 und v1.3-Master arbeiten. Die Verwendung der neuesten Version von kubectl verhindert unvorhergesehene Probleme.
{{% /capture %}}


{{% capture steps %}}

## Kubectl installieren

Nachfolgend finden Sie einige Methoden zur Installation von kubectl.

## Installieren der kubectl Anwendung mithilfe der systemeigenen Paketverwaltung

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian oder HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL oder Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}


## Installation mit snap auf Ubuntu

Wenn Sie Ubuntu oder eine der anderen Linux-Distributionen verwenden, die den [snap](https://snapcraft.io/docs/core/install) Paketmanager unterstützen, können Sie kubectl als [snap](https://snapcraft.io/)-Anwendung installieren.

1. Wechseln Sie zum Snap-Benutzer und führen Sie den Installationsbefehl aus:

    ```
    sudo snap install kubectl --classic
    ```

2. Testen Sie, ob die installierte Version ausreichend aktuell ist:

    ```
    kubectl version
    ```

## Installation mit Homebrew auf macOS

Wenn Sie mit macOS arbeiten und den [Homebrew](https://brew.sh/) Paketmanager verwenden, können Sie kubectl mit Homebrew installieren.

1. Führen Sie den Installationsbefehl aus:

    ```
    brew install kubernetes-cli
    ```

2. Testen Sie, ob die installierte Version ausreichend aktuell ist:

    ```
    kubectl version
    ```

## Installation mit Macports auf macOS

Wenn Sie mit macOS arbeiten und den [Macports](https://macports.org/) Paketmanager verwenden, können Sie kubectl mit Macports installieren.

1. Führen Sie den Installationsbefehl aus:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
2. Testen Sie, ob die installierte Version ausreichend aktuell ist:

    ```
    kubectl version
    ```

## Installation mit PowerShell von PSGallery

Wenn Sie mit Windows arbeiten und den [Powershell Gallery](https://www.powershellgallery.com/) Paketmanager verwenden, können Sie kubectl mit Powershell installieren und aktualisieren.

1. Führen Sie die Installationsbefehle aus (stellen Sie sicher, dass eine `DownloadLocation` angegeben wird):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}}Wenn Sie keine `DownloadLocation` angeben, wird `kubectl` im temporären Verzeichnis des Benutzers installiert.{{< /note >}}
    
    Das Installationsprogramm erstellt `$HOME/.kube` und weist es an, eine Konfigurationsdatei zu erstellen

2. Testen Sie, ob die installierte Version ausreichend aktuell ist:

    ```
    kubectl version
    ```

    {{< note >}}Die Aktualisierung der Installation erfolgt durch erneutes Ausführen der beiden in Schritt 1 aufgelisteten Befehle.{{< /note >}}

## Installation auf Windows mit Chocolatey oder scoop

Um kubectl unter Windows zu installieren, können Sie entweder den Paketmanager [Chocolatey](https://chocolatey.org) oder das Befehlszeilen-Installationsprogramm [scoop](https://scoop.sh) verwenden.

{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
2. Testen Sie, ob die installierte Version ausreichend aktuell ist:

    ```
    kubectl version
    ```

3. Navigieren Sie zu Ihrem Heimatverzeichnis:

    ```
    cd %USERPROFILE%
    ```
4. Erstellen Sie das `.kube`-Verzeichnis:

    ```
    mkdir .kube
    ```

5. Wechseln Sie in das soeben erstellte `.kube`-Verzeichnis:

    ```
    cd .kube
    ```

6. Konfigurieren Sie kubectl für die Verwendung eines Remote-Kubernetes-Clusters:

    ```
    New-Item config -type file
    ```
    
    {{< note >}}Bearbeiten Sie die Konfigurationsdatei mit einem Texteditor Ihrer Wahl, z.B. Notepad.{{< /note >}}

## Download als Teil des Google Cloud SDK herunter

Sie können kubectl als Teil des Google Cloud SDK installieren.

1. Installieren Sie das [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Führen Sie den `kubectl`-Installationsbefehl aus:

    ```
    gcloud components install kubectl
    ```
    
3. Testen Sie, ob die installierte Version ausreichend aktuell ist:

    ```
    kubectl version
    ```

## Installation der kubectl Anwendung mit curl

{{< tabs name="kubectl_install_curl" >}}
{{% tab name="macOS" %}}
1. Laden Sie die neueste Version herunter:

    ```		 
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl
    ```

    Um eine bestimmte Version herunterzuladen, ersetzen Sie den Befehlsteil `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` mit der jeweiligen Version.

    Um beispielsweise die Version {{< param "fullversion" >}} auf macOS herunterzuladen, verwenden Sie den folgenden Befehl:
		  
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

2. Machen Sie die kubectl-Binärdatei ausführbar.

    ```
    chmod +x ./kubectl
    ```

3. Verschieben Sie die Binärdatei in Ihren PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{{% /tab %}}
{{% tab name="Linux" %}}

1. Laden Sie die neueste Version mit dem Befehl herunter:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
    ```

    Um eine bestimmte Version herunterzuladen, ersetzen Sie den Befehlsteil `$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)` mit der jeweiligen Version.

    Um beispielsweise die Version {{< param "fullversion" >}} auf Linux herunterzuladen, verwenden Sie den folgenden Befehl:
    
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. Machen Sie die kubectl-Binärdatei ausführbar.

    ```
    chmod +x ./kubectl
    ```

3. Verschieben Sie die Binärdatei in Ihren PATH.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
{{% /tab %}}
{{% tab name="Windows" %}}
1. Laden Sie das aktuellste Release {{< param "fullversion" >}} von [disem link](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe) herunter.

    Oder, sofern Sie `curl` installiert haven, verwenden Sie den folgenden Befehl:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

    Informationen zur aktuellen stabilen Version (z. B. für scripting) finden Sie unter [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

2. Verschieben Sie die Binärdatei in Ihren PATH.
{{% /tab %}}
{{< /tabs >}}



## kubectl konfigurieren

Damit kubectl einen Kubernetes-Cluster finden und darauf zugreifen kann, benötigt es eine [kubeconfig Datei](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/). Diese wird automatisch erstellt, wenn Sie einen Cluster mit kube-up.sh erstellen oder einen Minikube-Cluster erfolgreich implementieren. Weitere Informationen zum Erstellen von Clustern finden Sie in den [Anleitungen für die ersten Schritte](/docs/setup/). Wenn Sie Zugriff auf einen Cluster benötigen, den Sie nicht erstellt haben, lesen Sie die [Cluster-Zugriff freigeben Dokumentation](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
Die kubectl-Konfiguration befindet sich standardmäßig unter `~/.kube/config`.

## Überprüfen der kubectl-Konfiguration
Überprüfen Sie, ob kubectl ordnungsgemäß konfiguriert ist, indem Sie den Clusterstatus abrufen:

```shell
kubectl cluster-info
```
Wenn Sie eine URL-Antwort sehen, ist kubectl korrekt für den Zugriff auf Ihren Cluster konfiguriert.

Wenn eine Meldung ähnlich der folgenden angezeigt wird, ist kubectl nicht richtig konfiguriert oder kann keine Verbindung zu einem Kubernetes-Cluster herstellen.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Wenn Sie beispielsweise vorhaben, einen Kubernetes-Cluster auf Ihrem Laptop (lokal) auszuführen, müssen Sie zunächst ein Tool wie minikube installieren und anschließend die oben genannten Befehle erneut ausführen.

Wenn kubectl cluster-info die URL-Antwort zurückgibt, Sie jedoch nicht auf Ihren Cluster zugreifen können, verwenden Sie Folgendes, um zu überprüfen, ob er ordnungsgemäß konfiguriert ist:

```shell
kubectl cluster-info dump
```

## Aktivieren der automatischen Autovervollständigung der Shell

kubectl bietet Autocompletion-Unterstützung für Bash und Zsh, was Ihnen viel Tipparbeit erspart!

Im Folgenden werden die Verfahren zum Einrichten der automatischen Vervollständigung für Bash (einschließlich der Unterschiede zwischen Linux und macOS) und Zsh beschrieben.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash on Linux" %}}

### Einführung

Das kubectl-Vervollständigungsskript für Bash kann mit dem Befehl `kubectl completion bash` generiert werden. Durch das Sourcing des Vervollständigungsskripts in Ihrer Shell wird die automatische Vervollständigung von kubectl ermöglicht.

Das Fertigstellungsskript benötigt jedoch [**bash-completion**](https://github.com/scop/bash-completion). Dies bedeutet, dass Sie diese Software zuerst installieren müssen (Sie können testen, ob Sie bereits bash-completion installiert haben, indem Sie `type _init_completion` ausführen).

### Installation von bash-completion

bash-completion wird von vielen Paketmanagern bereitgestellt (siehe [hier](https://github.com/scop/bash-completion#installation)). Sie können es mittels `apt-get install bash-completion` oder `yum install bash-completion`, usw.

Die obigen Befehle erstellen `/usr/share/bash-completion/bash_completion`,Dies ist das Hauptskript für die Bash-Vollendung. Abhängig von Ihrem Paketmanager müssen Sie diese Datei manuell in Ihre `~ / .bashrc`-Datei eingeben.

Um dies herauszufinden, laden Sie Ihre Shell erneut und führen Sie `type _init_completion` aus. Wenn der Befehl erfolgreich ist, ist bereits alles vorbereitet. Andernfalls fügen Sie der `~/.bashrc`-Datei Folgendes hinzu:

```shell
source /usr/share/bash-completion/bash_completion
```

Laden Sie Ihre Shell erneut und vergewissern Sie sich, dass bash-completion korrekt installiert ist, indem Sie folgendes eingeben: `type _init_completion`.

### Aktivieren der automatische Vervollständigung von kubectl

Sie müssen nun sicherstellen, dass das kubectl-Abschlussskript in allen Ihren Shell-Sitzungen verwendet wird. Es gibt zwei Möglichkeiten, dies zu tun:

- Fügen Sie das Vervollständigungsskript Ihrer `~ /.bashrc`-Datei hinzu:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Fügen Sie das Vervollständigungsskript zum Verzeichnis `/etc/bash_completion.d` hinzu:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

{{< note >}}
bash-completion bezieht alle Verfollständigungsskripte aus `/etc/bash_completion.d`.
{{< /note >}}

Beide Ansätze sind gleichwertig. Nach dem erneuten Laden der Shell sollte kubectl autocompletion funktionieren.

{{% /tab %}}


{{% tab name="Bash auf macOS" %}}

{{< warning>}}
macOS beinhaltet standardmäßig Bash 3.2. Das kubectl-Vervollständigunsskript erfordert Bash 4.1+ und funktioniert nicht mit Bash 3.2. Um dies zu umgehen, können Sie eine neuere Version von Bash unter macOS installieren (folgen Sie den Anweisungen [hier](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). Die folgenden Anweisungen funktionieren nur, wenn Sie Bash 4.1 oder höher verwenden.
{{< /warning >}}

### Einführung

Das kubectl-Vervollständigungsskript für Bash kann mit dem Befehl `kubectl completion bash` generiert werden. Durch das Sourcing des Vervollständigungsskripts in Ihrer Shell wird die automatische Vervollständigung von kubectl ermöglicht.

Das Fertigstellungsskript benötigt jedoch [**bash-completion**](https://github.com/scop/bash-completion). Dies bedeutet, dass Sie diese Software zuerst installieren müssen (Sie können testen, ob Sie bereits bash-completion installiert haben, indem Sie `type _init_completion` ausführen).

### Installation von bash-completion

Sie können bash-completion mit Homebrew installieren:

```shell
brew install bash-completion@2
```

{{< note >}}
`@2` steht für bash-completion 2, was vom kubectl Vervollständigungsskript benötigt wird (es funktioniert nicht mit bash-completion 1). Für bash-completion 2 ist wiederum Bash 4.1 oder höher erforderlich. Deshalb mussten Sie Bash aktualisieren.
{{< /note >}}

Wie in der Ausgabe von `brew install` (Abschnitt "Vorsichtsmaßnahmen") angegeben, fügen Sie Ihrer `~/.bashrc` oder `~/.bash_profile`-Datei die folgenden Zeilen hinzu:

```shell
export BASH_COMPLETION_COMPAT_DIR=/usr/local/etc/bash_completion.d
[[ -r /usr/local/etc/profile.d/bash_completion.sh ]] && . /usr/local/etc/profile.d/bash_completion.sh
```

Laden Sie Ihre Shell erneut und vergewissern Sie sich, dass bash-completion korrekt installiert ist, indem Sie `type _init_completion` eingeben.

### Aktivieren der automatischen Vervollständigung von kubectl

Sie müssen nun sicherstellen, dass das kubectl-Abschlussskript in allen Ihren Shell-Sitzungen verwendet wird. Es gibt mehrere Möglichkeiten, dies zu tun:

- Fügen Sie das Vervollständigungsskript Ihrer `~ /.bashrc`-Datei hinzu:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc

    ```

- Fügen Sie das Vervollständigungsskript zum Verzeichnis `/etc/bash_completion.d` hinzu:

    ```shell
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Wenn Sie kubectl mit Homebrew installiert haben (wie [hier](#install-with-homebrew-on-macos) beschrieben), dann wurde das Vervollständigungsskript automatisch in `/usr/local/etc/bash_completion.d/kubectl` installiert. In diesem Fall müssen Sie nichts tun.

{{< note >}}
bash-completion (falls mit Homebrew installiert) bezieht alle Vervollständigungsskripte aus dem Verzeichnis, das in der Umgebungsvariablen `BASH_COMPLETION_COMPAT_DIR`festgelegt ist.
{{< /note >}}

Alle Ansätze sind gleichwertig. Nach dem erneuten Laden der Shell sollte kubectl Autovervollständigung funktionieren.
{{% /tab %}}

{{% tab name="Zsh" %}}

Das kubectl Vervollständigungsskript für Zsh kann mit dem folgenden Befehl generiert werden: `kubectl completion zsh`. Durch das Sourcing des Completion-Skripts in Ihrer Shell wird die automatische Vervollständigung von kubectl ermöglicht.

Fügen Sie Ihrer `~/.zshrc`-Datei dazu Folgendes hinzu:

```shell
source <(kubectl completion zsh)
```

Nach dem erneuten Laden der Shell sollte kubectl Autovervollständigung funktionieren.

Wenn eine Fehlermeldung wie `complete: 13: command not found: compdef` angezeigt wird, fügen Sie am Anfang der Datei `~/.zshrc" folgendes hinzu:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}
[Erfahren Sie, wie Sie Ihre Anwendung starten und verfügbar machen.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
{{% /capture %}}

