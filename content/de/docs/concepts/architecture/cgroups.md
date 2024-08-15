---
title: Über cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

Auf Linux beschränken {{< glossary_tooltip text="control groups" term_id="cgroup" >}} die Ressourcen, die einem Prozess zugeteilt werden.

Das {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} und die zugrundeliegende Container Runtime müssen mit cgroups interagieren um
[Ressourcen-Verwaltung für Pods und Container](/docs/concepts/configuration/manage-resources-containers/) durchzusetzen. Das schließt CPU/Speicher Anfragen und Limits für containerisierte Arbeitslasten ein.

Es gibt zwei Versionen cgroups in Linux: cgroup v1 und cgroup v2. cgroup v2 ist die neue Generation der `cgroup` API.

<!-- body -->


## Was ist cgroup v2? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2 ist die nächste Version der Linux `cgroup` API. cgroup v2 stellt ein einheitliches Kontrollsystem mit erweiterten Ressourcenmanagement Fähigkeiten bereit.

cgroup v2 bietet einige Verbesserungen gegenüber cgroup v1, zum Beispiel folgende:

- Einzelnes vereinheitlichtes Hierarchiendesign in der API
- Erhöhte Sicherheit bei sub-tree Delegierung zu Container
- Neuere Features, wie [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Erweitertes Ressourcen Zuteilungsmanagement und Isolierung über mehrfache Ressourcen
  - Einheitliche Erfassung für verschiedene Arten der Speicherzuteilung (Netzwerkspeicher, Kernelspeicher, usw.)
  - Erfassung nicht-unmittelbarer Ressourcenänderungen wie "page cache write backs"

Manche Kubernetes Funktionen verwenden ausschließlich cgroup v2 für erweitertes Ressourcenmanagement und Isolierung. Die [MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) Funktion, zum Beispiel, verbessert Speicher QoS und setzt dabei auf cgroup v2 Primitives.


## cgroup v2 verwenden {#cgroupv2-verwenden}

Die empfohlene Methode um cgroup v2 zu verwenden, ist eine Linux Distribution zu verwenden, die cgroup v2 standardmäßig aktiviert und verwendet.

Um zu Kontrollieren ob ihre Distribution cgroup v2 verwendet, siehe [Identifizieren der cgroup Version auf Linux Knoten](#cgroup-version-identifizieren).

### Voraussetzungen {#Voraussetzungen}

cgroup v2 hat folgende Voraussetzungen:

* Betriebssystem Distribution ermöglicht cgroup v2
* Linux Kernel Version ist 5.8 oder neuer
* Container Runtime unterstützt cgroup v2. Zum Besipiel:
  * [containerd](https://containerd.io/) v1.4 und neuer
  * [cri-o](https://cri-o.io/) v1.20 und neuer
* Das kubelet und die Container Runtime sind konfiguriert, um den [systemd cgroup Treiber](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver) zu verwenden

### Linux Distribution cgroup v2 Support

Für eine Liste der Linux Distributionen, die cgroup v2 verwenden, siehe die [cgroup v2 Dokumentation](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (seit M97)
* Ubuntu (seit 21.10, 22.04+ empfohlen)
* Debian GNU/Linux (seit Debian 11 bullseye)
* Fedora (seit 31)
* Arch Linux (seit April 2021)
* RHEL und RHEL-basierte Distributionen (seit 9)

Zum Überprüfen ob Ihre Distribution cgroup v2 verwendet, siehe die Dokumentation Ihrer Distribution, oder folge den Anweisungen in [Identifizieren der cgroup Version auf Linux Knoten](#cgroup-version-identifizieren).

Man kann auch manuell cgroup v2 aktivieren, indem man die Kernel Boot Argumente anpasst. Wenn Ihre Distribution GRUB verwendet, muss `systemd.unified_cgroup_hierarchy=1` in `GRUB_CMDLINE_LINUX` unter `/etc/default/grub` hinzugefügt werden. Danach muss man `sudo update-grub` ausführen. Die empfohlene Methode ist aber das Verwenden einer Distribution, die schon standardmäßig cgroup v2 aktiviert.

### Migrieren zu cgroup v2 {#cgroupv2-migrieren}

Um zu cgroup v2 zu migrieren, müssen Sie erst sicherstellen, dass die [Voraussetzungen](#Voraussetzungen) erfüllt sind. Dann müssen Sie auf eine Kernel Version aktualisieren, die cgroup v2 standardmäßig aktiviert.

Das kubelet erkennt automatisch, dass das Betriebssystem auf cgroup v2 läuft, und verhält sich entsprechend, ohne weitere Konfiguration. 

Nach dem Umschalten auf cgroup v2 sollte es keinen erkennbaren Unterschied in der Benutzererfahrung geben, es sei denn, die Benutzer greifen auf das cgroup Dateisystem direkt zu, entweder auf dem Knoten oder in den Containern. 

cgroup v2 verwendet eine andere API als cgroup v1. Wenn es also Anwendungen gibt, die direkt auf das cgroup Dateisystem zugreifen, müssen sie aktualisiert werden, um cgroup v2 zu unterstützen. Zum Beispiel:

* Manche Überwachungs- und Sicherheitsagenten von Drittanbietern können vom cgroup Dateisystem abhängig sein. 
  Diese müssen aktualisiert werden um cgroup v2 zu unterstützen.
* Wenn Sie [cAdvisor](https://github.com/google/cadvisor) als eigenständigen DaemonSet verwenden, zum Überwachen von Pods und Container, muss es auf v0.43.0 oder neuer aktualisiert werden.
* Wenn Sie Java Applikationen bereitstellen, sollten Sie bevorzugt Versionen verwenden, die cgroup v2 vollständig unterstützen:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 und neuer
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0, und neuer
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 und neuer
* Wenn Sie das [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) Paket verwenden, vergewissern Sie sich, dass Sie v1.5.1 oder höher verwenden.

## Identifizieren der cgroup Version auf Linux Knoten {#cgroup-version-identifizieren}

Die cgroup Version hängt von der verwendeten Linux Distribution und der standardmäßig auf dem Betriebssystem konfigurierten cgroup Version ab. Zum Überprüfen der cgroup Version, die ihre Distribution verwendet, führen Sie den Befehl `stat -fc %T /sys/fs/cgroup/` auf dem Knoten aus:

```shell
stat -fc %T /sys/fs/cgroup/
```

Für cgroup v2, ist das Ergebnis `cgroup2fs`.

Für cgroup v1, ist das Ergebnis `tmpfs.`

## {{% heading "whatsnext" %}}

- Erfahre mehr über [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Erfahre mehr über [container runtime](/docs/concepts/architecture/cri)
- Erfahre mehr über [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)

