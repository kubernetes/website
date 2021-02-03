---
title: Pods
content_type: concept
weight: 10
no_list: true
card:
 name: concepts
 weight: 60
---

<!-- overview -->

_Pods_ sind die kleinsten einsetzbaren Einheiten, die in Kubernetes
erstellt und verwaltet werden können.

Ein _Pod_ (übersetzt Gruppe/Schote, wie z. B. eine Gruppe von Walen oder eine 
Erbsenschote) ist eine Gruppe von einem oder mehreren 
{{< glossary_tooltip text="Containern" term_id="container" >}} mit gemeinsam 
genutzten Speicher- und Netzwerkressourcen und einer Spezifikation für die 
Ausführung der Container. Die Ressourcen eines Pods befinden sich immer auf dem 
gleichen (virtuellen) Server, werden gemeinsam geplant und in einem
gemeinsamen Kontext ausgeführt. Ein Pod modelliert einen anwendungsspezifischen 
"logischen Server": Er enthält eine oder mehrere containerisierte Anwendungen, 
die relativ stark voneinander abhängen. 
In Nicht-Cloud-Kontexten sind Anwendungen, die auf
demselben physischen oder virtuellen Server ausgeführt werden, vergleichbar zu 
Cloud-Anwendungen, die auf demselben logischen Server ausgeführt werden.

Ein Pod kann neben Anwendungs-Containern auch sogenannte 
[Initialisierungs-Container](/docs/concepts/workloads/pods/init-containers/)
enthalten, die beim Starten des Pods ausgeführt werden.
Es können auch 
kurzlebige/[ephemere Container](/docs/concepts/workloads/pods/ephemeral-containers/)
zum Debuggen gestartet werden, wenn dies der Cluster anbietet.

<!-- body -->

## Was ist ein Pod?

{{< note >}}
Obwohl Kubernetes abgesehen von [Docker](https://www.docker.com/) auch andere
{{<glossary_tooltip text="Container-Laufzeitumgebungen" 
term_id="container-runtime">}} unterstützt, ist Docker am bekanntesten und
 es ist hilfreich, Pods mit der Terminologie von Docker zu beschreiben.
{{< /note >}}

Der gemeinsame Kontext eines Pods besteht aus einer Reihe von Linux-Namespaces, 
Cgroups und möglicherweise anderen Aspekten der Isolation, also die gleichen
Dinge, die einen Dockercontainer isolieren. Innerhalb des Kontexts eines Pods 
können die einzelnen Anwendungen weitere Unterisolierungen haben. 

Im Sinne von Docker-Konzepten ähnelt ein Pod einer Gruppe von Docker-Containern, 
die gemeinsame Namespaces und Dateisystem-Volumes nutzen.

## Pods verwenden

Normalerweise müssen keine Pods erzeugt werden, auch keine Singleton-Pods. 
Stattdessen werden sie mit Workload-Ressourcen wie {{<glossary_tooltip 
text="Deployment" term_id="deployment">}} oder {{<glossary_tooltip 
text="Job" term_id="job">}} erzeugt. Für Pods, die von einem Systemzustand 
abhängen, erwägen Sie die Nutzung von {{<glossary_tooltip 
text="StatefulSet" term_id="statefulset">}}-Ressourcen.

Pods in einem Kubernetes-Cluster werden hauptsächlich auf zwei Arten verwendet:

* **Pods, die einen einzelnen Container ausführen**. Das 
"Ein-Container-per-Pod"-Modell ist der häufigste Kubernetes-Anwendungsfall. In 
diesem Fall können Sie sich einen Pod als einen Behälter vorstellen, der  einen 
einzelnen Container enthält; Kubernetes verwaltet die Pods anstatt die 
Container direkt zu verwalten.
* **Pods, in denen mehrere Container ausgeführt werden, die zusammenarbeiten
müssen**. Wenn eine Softwareanwendung aus co-lokaliserten Containern besteht, 
die sich gemeinsame Ressourcen teilen und stark voneinander abhängen, kann ein 
Pod die Container verkapseln. 
Diese Container bilden eine einzelne zusammenhängende 
Serviceeinheit, z. B. ein Container, der Daten in einem gemeinsam genutzten 
Volume öffentlich verfügbar macht, während ein separater _Sidecar_-Container 
die Daten aktualisiert. Der Pod fasst die Container, die Speicherressourcen
und eine kurzlebiges Netzwerk-Identität als eine Einheit zusammen.

{{< note >}}
Das Gruppieren mehrerer gemeinsam lokalisierter und gemeinsam verwalteter
Container in einem einzigen Pod ist ein relativ fortgeschrittener 
Anwendungsfall. Sie sollten diese Architektur nur in bestimmten  Fällen 
verwenden, wenn Ihre Container stark voneinander abhängen.
{{< /note >}}

Jeder Pod sollte eine einzelne Instanz einer gegebenen Anwendung ausführen. Wenn 
Sie Ihre Anwendung horizontal skalieren wollen (um mehr Instanzen auszuführen
und  dadurch mehr Gesamtressourcen bereitstellen), sollten Sie mehrere Pods 
verwenden, 
einen für jede Instanz. In Kubernetes wird dies typischerweise als Replikation
bezeichnet.
Replizierte Pods werden normalerweise als eine Gruppe durch eine 
Workload-Ressource und deren 
{{<glossary_tooltip text="Controller" term_id="controller">}} erstellt 
und verwaltet.

Der Abschnitt [Pods und Controller](#pods-und-controller) beschreibt, wie 
Kubernetes Workload-Ressourcen und deren Controller verwendet, um Anwendungen 
zu skalieren und zu heilen.

### Wie Pods mehrere Container verwalten

Pods unterstützen mehrere kooperierende Prozesse (als Container), die eine 
zusammenhängende Serviceeinheit bilden. Kubernetes plant und stellt automatisch 
sicher, dass sich die Container in einem Pod  auf demselben physischen oder 
virtuellen Server im Cluster befinden. Die Container können Ressourcen und
Abhängigkeiten gemeinsam nutzen, miteinander kommunizieren und
ferner koordinieren wann und wie sie beendet werden.

Zum Beispiel könnten Sie einen Container haben, der als Webserver für Dateien in
einem gemeinsamen Volume arbeitet. Und ein separater "Sidecar" -Container 
aktualisiert die Daten von einer externen Datenquelle, siehe folgenden 
Abbildung:

{{< figure src="/images/docs/pod.svg" alt="Pod-Beispieldiagramm" width="50%" >}}

Einige Pods haben sowohl {{<glossary_tooltip text="Initialisierungs-Container" 
term_id="init-container">}} als auch {{<glossary_tooltip 
text="Anwendungs-Container" term_id="app-container">}}. 
Initialisierungs-Container werden gestartet und beendet bevor die 
Anwendungs-Container gestartet werden.

Pods stellen standardmäßig zwei Arten von gemeinsam Ressourcen für die 
enthaltenen Container bereit:
[Netzwerk](#pod-netzwerk) und [Speicher](#datenspeicherung-in-pods).


## Mit Pods arbeiten

Sie werden selten einzelne Pods direkt in Kubernetes erstellen, selbst 
Singleton-Pods. Das liegt daran, dass Pods als relativ kurzlebige 
Einweg-Einheiten konzipiert sind. Wann Ein Pod erstellt wird (entweder direkt 
von Ihnen oder indirekt von einem
{{<glossary_tooltip text="Controller" term_id="controller">}}), wird die 
Ausführung auf einem {{<glossary_tooltip term_id="node">}} in Ihrem Cluster 
geplant. Der Pod bleibt auf diesem (virtuellen) Server, bis entweder der Pod die
Ausführung beendet hat, das Pod-Objekt gelöscht wird, der Pod aufgrund 
mangelnder Ressourcen *evakuiert* wird oder oder der Node ausfällt. 

{{< note >}}
Das Neustarten eines Containers in einem Pod sollte nicht mit dem Neustarten 
eines Pods verwechselt werden. Ein Pod ist kein Prozess, sondern eine Umgebung 
zur Ausführung von Containern. Ein Pod bleibt bestehen bis er gelöscht wird.
{{< /note >}}

Stellen Sie beim Erstellen des Manifests für ein Pod-Objekt sicher, dass der 
angegebene Name ein gültiger
[DNS-Subdomain-Name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
ist.

### Pods und Controller

Mit Workload-Ressourcen können Sie mehrere Pods erstellen und verwalten. Ein 
Controller für die Ressource kümmert sich um Replikation, Roll-Out sowie 
automatische Heilung im Fall von Podfehlern. Wenn beispielsweise ein Node 
ausfällt, bemerkt ein Controller, dass die Pods auf dem Node nicht mehr laufen 
und plant die Ausführung eines Ersatzpods auf einem funktionierenden Node.
Hier sind einige Beispiele für Workload-Ressourcen, die einen oder mehrere Pods 
verwalten:

* {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
* {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
* {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}

### Podvorlagen

Controller für 
{{<glossary_tooltip text="Workload" term_id="workload">}}-Ressourcen 
erstellen Pods von einer _Podvorlage_ und verwalten diese Pods für sie.

Podvorlagen sind Spezifikationen zum Erstellen von Pods und sind in 
Workload-Ressourcen enthalten wie z. B.
[Deployments](/docs/concepts/workloads/controllers/deployment/),
[Jobs](/docs/concepts/workloads/controllers/job/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).

Jeder Controller für eine Workload-Ressource verwendet die Podvorlage innerhalb 
des Workload-Objektes, um Pods zu erzeugen. Die Podvorlage ist Teil des 
gewünschten Zustands der Workload-Ressource, mit der Sie Ihre Anwendung 
ausgeführt haben.

Das folgende Beispiel ist ein Manifest für einen einfachen Job mit einer 
`Vorlage`, die einen Container startet. Der Container in diesem Pod druckt 
eine Nachricht und pausiert dann.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
 name: hello
spec:
 template:
 # This is the pod template
 spec:
 containers:
 - name: hello
 image: busybox
 command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
 restartPolicy: OnFailure
 # The pod template ends here
```
Das Ändern der Podvorlage oder der Wechsel zu einer neuen Podvorlage hat keine 
direkten Auswirkungen auf bereits existierende Pods. Wenn Sie die Podvorlage für
eine Workload-Ressource ändern, dann muss diese Ressource die Ersatz-Pods
erstellen, welche die aktualisierte Vorlage verwenden. 

Beispielsweise stellt der StatefulSet-Controller sicher, dass für jedes
StatefulSet-Objekt die ausgeführten Pods mit der aktueller Podvorlage 
übereinstimmen. Wenn Sie das StatefulSet bearbeiten und die Vorlage ändern, 
beginnt das StatefulSet mit der Erstellung neuer Pods basierend auf der 
aktualisierten Vorlage. Schließlich werden alle alten Pods durch neue Pods 
ersetzt, und das Update ist abgeschlossen.

Jede Workload-Ressource implementiert eigenen Regeln für die Umsetzung von 
Änderungen der Podvorlage. Wenn Sie mehr über StatefulSet erfahren möchten, 
lesen Sie die Seite
[Update-Strategien](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) 
im Tutorial StatefulSet Basics.


Auf Nodes beobachtet oder verwaltet das 
{{< glossary_tooltip term_id="kubelet" text="Kubelet" >}}
nicht direkt die Details zu Podvorlagen und Updates. Diese Details sind 
abstrahiert. Die Abstraktion und Trennung von Aufgaben vereinfacht die 
Systemsemantik und ermöglicht so das Verhalten des Clusters zu ändern ohne 
vorhandenen Code zu ändern.

## Pod Update und Austausch

Wie im vorherigen Abschnitt erwähnt, erstellt der Controller neue Pods basierend
auf der aktualisierten Vorlage, wenn die Podvorlage für eine Workload-Ressource
geändert wird anstatt die vorhandenen Pods zu aktualisieren oder zu patchen.

Kubernetes hindert Sie nicht daran, Pods direkt zu verwalten. Es ist möglich, 
einige Felder eines laufenden Pods zu aktualisieren. Allerdings haben 
Pod-Aktualisierungsvorgänge wie zum Beispiel
[`patch`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core), 
und
[`replace`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)
einige Einschränkungen:

- Die meisten Metadaten zu einem Pod können nicht verändert werden. Zum Beispiel können 
  Sie nicht die Felder `namespace`, `name`, `uid`, oder `creationTimestamp` 
  ändern. Das `generation`-Feld muss eindeutig sein. Es werden nur Aktualisierungen 
  akzeptiert, die den Wert des Feldes inkrementieren.
- Wenn das Feld `metadata.deletionTimestamp` gesetzt ist, kann kein neuer 
  Eintrag zur Liste `metadata.finalizers` hinzugefügt werden.
- Pod-Updates dürfen keine Felder ändern, die Ausnahmen sind 
  `spec.containers [*].image`,
 `spec.initContainers [*].image`,` spec.activeDeadlineSeconds` oder
 `spec.tolerations`. Für `spec.tolerations` können Sie nur neue Einträge 
  hinzufügen.
- Für `spec.activeDeadlineSeconds` sind nur zwei Änderungen erlaubt:

  1. ungesetztes Feld in eine positive Zahl
  1. positive Zahl in eine kleinere positive Zahl, die nicht negativ ist
  
## Gemeinsame Nutzung von Ressourcen und Kommunikation 

Pods ermöglichen den Datenaustausch und die Kommunikation zwischen den 
Containern, die im Pod enthalten sind.

### Datenspeicherung in Pods

Ein Pod kann eine Reihe von gemeinsam genutzten Speicher-
{{<glossary_tooltip text="Volumes" term_id="volume">}} spezifizieren. Alle 
Container im Pod können auf die gemeinsamen Volumes zugreifen und dadurch Daten 
austauschen. Volumes ermöglichen auch, dass Daten ohne Verlust gespeichert 
werden, falls einer der Container neu gestartet werden muss. 
Im Kapitel [Datenspeicherung](/docs/concepts/storage/) finden Sie weitere 
Informationen, wie Kubernetes gemeinsam genutzten Speicher implementiert und 
Pods zur Verfügung stellt.

### Pod-Netzwerk

Jedem Pod wird für jede Adressenfamilie eine eindeutige IP-Adresse zugewiesen. 
Jeder Container in einem Pod nutzt den gemeinsamen Netzwerk-Namespace, 
einschließlich der IP-Adresse und der Ports. In einem Pod (und **nur** dann) 
können die Container, die zum Pod gehören, über `localhost` miteinander 
kommunizieren. Wenn Container in einem Pod mit Entitäten *außerhalb des Pods* 
kommunizieren, müssen sie koordinieren, wie die gemeinsam genutzten 
Netzwerkressourcen (z. B. Ports) verwenden werden. Innerhalb eines Pods teilen 
sich Container eine IP-Adresse und eine Reihe von Ports und können sich 
gegenseitig über `localhost` finden. Die Container in einem Pod können auch die 
üblichen Kommunikationsverfahren zwischen Prozessen nutzen, wie z. B. 
SystemV-Semaphoren oder "POSIX Shared Memory". Container in verschiedenen Pods 
haben unterschiedliche IP-Adressen und können nicht per IPC ohne 
[spezielle Konfiguration](/docs/concepts/policy/pod-security-policy/) 
kommunizieren. Container, die mit einem Container in einem anderen Pod 
interagieren möchten, müssen IP Netzwerke verwenden.

Für die Container innerhalb eines Pods stimmt der "hostname" mit dem 
konfigurierten `Namen` des Pods überein. Mehr dazu im Kapitel 
[Netzwerke](/docs/concepts/cluster-administration/networking/).

## Privilegierter Modus für Container

Jeder Container in einem Pod kann den privilegierten Modus aktivieren, indem 
das Flag `privileged` im 
[Sicherheitskontext](/docs/tasks/configure-pod-container/security-context/)
der Container-Spezifikation verwendet wird.
Dies ist nützlich für Container, die Verwaltungsfunktionen des Betriebssystems 
verwenden möchten, z. B. das Manipulieren des Netzwerk-Stacks oder den Zugriff 
auf Hardware. Prozesse innerhalb eines privilegierten Containers erhalten fast 
die gleichen Rechte wie sie Prozessen außerhalb eines Containers zur Verfügung 
stehen.

{{< note >}}
Ihre 
{{<glossary_tooltip text="Container-Umgebung" term_id="container-runtime">}} 
muss das Konzept eines privilegierten Containers unterstützen, damit diese 
Einstellung relevant ist.
{{< /note >}}


## Statische Pods

_Statische Pods_ werden direkt vom Kubelet-Daemon auf einem bestimmten Node 
verwaltet ohne dass sie vom 
{{<glossary_tooltip text="API Server" term_id="kube-apiserver">}} überwacht 
werden.
.
Die meisten Pods werden von der Kontrollebene verwaltet (z. B.
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}). Aber für 
statische Pods überwacht das Kubelet jeden statischen Pod direkt (und startet 
ihn neu, wenn er ausfällt).

Statische Pods sind immer an ein {{<glossary_tooltip term_id="kubelet">}} auf 
einem bestimmten Node gebunden. Der Hauptanwendungsfall für statische Pods 
besteht darin, eine selbst gehostete Steuerebene auszuführen. Mit anderen 
Worten: Das Kubelet dient zur Überwachung der einzelnen 
[Komponenten der Kontrollebene](/docs/concepts/overview/components/#control-plane-components).

Das Kubelet versucht automatisch auf dem Kubernetes API-Server für jeden 
statischen Pod einen spiegelbildlichen Pod 
(im Englischen: {{<glossary_tooltip text="mirror pod" term_id="mirror-pod">}}) 
zu erstellen.
Das bedeutet, dass die auf einem Node ausgeführten Pods auf dem API-Server 
sichtbar sind jedoch von dort nicht gesteuert werden können.

## {{% heading "whatsnext" %}}

* Erfahren Sie mehr über den 
  [Lebenszyklus eines Pods](/docs/concepts/workloads/pods/pod-lifecycle/).
* Erfahren Sie mehr über [RuntimeClass](/docs/concepts/containers/runtime-class/) 
  und wie Sie damit verschiedene Pods mit unterschiedlichen 
  Container-Laufzeitumgebungen konfigurieren können.
* Lesen sie mehr über 
  [Restriktionen für die Verteilung von Pods](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
* Lesen sie mehr über sogenannte 
  [Pod-Disruption-Budgets](/docs/concepts/workloads/pods/disruptions/) 
  und wie Sie diese verwenden können, um die Verfügbarkeit von Anwendungen bei 
  Störungen zu verwalten. Die 
  [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
  -Objektdefinition beschreibt das Objekt im Detail.
* [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns) 
  erläutert allgemeine Layouts für Pods mit mehr als einem Container.

Um den Hintergrund zu verstehen, warum Kubernetes eine gemeinsame Pod-API in 
andere Ressourcen, wie z. B. 
{{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} 
oder {{< glossary_tooltip text="Deployments" term_id="deployment" >}} einbindet, 
können sie Artikel zu früheren Technologien lesen, unter anderem: 
 * [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
 * [Borg](https://research.google.com/pubs/pub43438.html)
 * [Marathon](https://mesosphere.github.io/marathon/docs/rest-api.html)
 * [Omega](https://research.google/pubs/pub41684/)
 * [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).