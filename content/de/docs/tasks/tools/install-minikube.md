---
title: Installation von Minikube
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

Diese Seite zeigt Ihnen, wie Sie [Minikube](/docs/tutorials/hello-minikube) installieren, ein Programm, das einen Kubernetes-Cluster mit einem einzigen Node in einer virtuellen Maschine auf Ihrem Laptop ausführt.

{{% /capture %}}

{{% capture prerequisites %}}

Die VT-x- oder AMD-v-Virtualisierung muss im BIOS Ihres Computers aktiviert sein. Um dies unter Linux zu überprüfen, führen Sie Folgendes aus und vergewissern Sie sich, dass die Ausgabe nicht leer ist:
```shell
egrep --color 'vmx|svm' /proc/cpuinfo
```

{{% /capture %}}

{{% capture steps %}}

## Einen Hypervisor installieren

Wenn noch kein Hypervisor installiert ist, installieren Sie jetzt einen für Ihr Betriebssystem:

Betriebssystem | Unterstützte Hypervisoren
:----------------|:---------------------
macOS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
Linux | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
Windows | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
Minikube unterstützt auch die Option `--vm-driver=none`, mit der die Kubernetes-Komponenten auf dem Host und nicht in einer VM ausgeführt werden. Die Verwendung dieses Treibers erfordert Docker und eine Linux-Umgebung, jedoch keinen Hypervisor.
{{< /note >}}

## Kubectl installieren

* Installieren Sie kubectl gemäß den Anweisungen in [kubectl installieren und einrichten](/docs/tasks/tools/install-kubectl/).

## Minikube installieren

### macOS

Die einfachste Möglichkeit, Minikube unter macOS zu installieren, ist die Verwendung von [Homebrew](https://brew.sh):

```shell
brew cask install minikube
```

Sie können es auch auf macOS installieren, indem Sie eine statische Binärdatei herunterladen:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

So fügen Sie die Minikube-Programmdatei auf einfache Weise Ihrem Pfad hinzu:

```shell
sudo mv minikube /usr/local/bin
```

### Linux

{{< note >}}
Dieses Dokument zeigt Ihnen, wie Sie Minikube mit einer statischen Binärdatei unter Linux installieren. Für alternative Linux-Installationsmethoden siehe [Andere Installationsmethoden](https://github.com/kubernetes/minikube#other-ways-to-install) im offiziellen Minikube-GitHub-Repository.
{{< /note >}}

Sie können Minikube unter Linux installieren, indem Sie eine statische Binärdatei herunterladen:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

So fügen Sie die Minikube-Programmdatei auf einfache Weise Ihrem Pfad hinzu:

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### Windows

{{< note >}}
Um Minikube unter Windows auszuführen, müssen Sie zuerst [VirtualBox](https://www.virtualbox.org/) oder [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v) installieren. Hyper-V kann auf drei Versionen von Windows 10 ausgeführt werden: Windows 10 Enterprise, Windows 10 Professional und Windows 10 Education. Weitere Informationen zur Installation finden Sie im offiziellen [Minikube GitHub-Repository](https://github.com/kubernetes/minikube/#installation).
{{< /note >}}

Die einfachste Möglichkeit, Minikube unter Windows zu installieren, ist die Verwendung von [Chocolatey](https://chocolatey.org/) (als Administrator ausführen):

```shell
choco install minikube kubernetes-cli
```

Schließen Sie nach der Installation von Minikube die aktuelle CLI-Sitzung und starten Sie sie neu. Minikube sollte automatisch zu Ihrem Pfad hinzugefügt werden.

#### Manuelle installation unter Windows 

 Um Minikube manuell unter Windows zu installieren, laden Sie die Datei [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest) herunter, umbenennen Sie sie in `minikube.exe` und fügen Sie sie Ihrem Pfad zu.

#### Windows Installer

So installieren Sie Minikube manuell unter Windows mit [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), laden Sie die Datei [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest) und führen Sie den Installer aus.

{{% /capture %}}

{{% capture whatsnext %}}

* [Kubernetes lokal über Minikube ausführen](/docs/setup/minikube/)

{{% /capture %}}

## Eine bestehende Installation bereinigen

Wenn Sie minikube bereits installiert haben, starten Sie die Anwendung:
```shell
minikube start
```

Und der Befehl gibt einen Fehler zurück:
```shell
machine does not exist
```

Müssen Sie die Konfigurationsdateien löschen:
```shell
rm -rf ~/.minikube
```
