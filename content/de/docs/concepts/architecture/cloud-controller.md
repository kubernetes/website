---
title: Zugrunde liegende Konzepte des Cloud Controller Manager
content_type: concept
weight: 30
---

<!-- overview -->
Das Konzept des Cloud Controller Managers (CCM) (nicht zu verwechseln mit der Binärdatei) wurde ursprünglich entwickelt, um Cloud-spezifischen Anbieter Code und den Kubernetes Kern unabhängig voneinander entwickeln zu können. Der Cloud Controller Manager läuft zusammen mit anderen Master Komponenten wie dem Kubernetes Controller Manager, dem API-Server und dem Scheduler auf dem Host. Es kann auch als Kubernetes Addon gestartet werden, in diesem Fall läuft er auf Kubernetes.

Das Design des Cloud Controller Managers basiert auf einem Plugin Mechanismus, der es neuen Cloud Anbietern ermöglicht, sich mit Kubernetes einfach über Plugins zu integrieren. Es gibt Pläne für die Einbindung neuer Cloud Anbieter auf Kubernetes und für die Migration von Cloud Anbietern vom alten Modell auf das neue CCM-Modell.

Dieses Dokument beschreibt die Konzepte hinter dem Cloud Controller Manager und gibt Details zu den damit verbundenen Funktionen.

Die Architektur eines Kubernetes Clusters ohne den Cloud Controller Manager sieht wie folgt aus:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)




<!-- body -->

## Design

Im vorhergehenden Diagramm sind Kubernetes und der Cloud-Provider über mehrere verschiedene Komponenten integriert:

* Kubelet
* Kubernetes Controller Manager
* Kubernetes API Server

CCM konsolidiert die gesamte Abhängigkeit der Cloud Logik von den drei vorhergehenden Komponenten zu einem einzigen Integrationspunkt mit der Cloud. So sieht die neue Architektur mit dem CCM aus:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Komponenten des CCM

Der CCM löst einen Teil der Funktionalität des Kubernetes Controller Managers (KCM) ab und führt ihn als separaten Prozess aus. Konkret trennt es die Cloud abhängigen Controller im KCM. Der KCM verfügt über die folgenden Cloud abhängigen Steuerungsschleifen:

 * Node Controller
 * Volume Controller
 * Route Controller
 * Service Controller

In der Version 1.9 führt der CCM die folgenden Controller aus der vorhergehenden Liste aus:

* Node Controller
* Route Controller
* Service Controller

{{< note >}}
Der Volume Controller wurde bewusst nicht als Teil des CCM gewählt. Aufgrund der Komplexität und der bestehenden Bemühungen, herstellerspezifische Volume Logik zu abstrahieren, wurde entschieden, dass der Volume Controller nicht zum CCM verschoben wird.
{{< /note >}}

Der ursprüngliche Plan, Volumes mit CCM zu integrieren, sah die Verwendung von Flex-Volumes vor welche austauschbare Volumes unterstützt. Allerdings ist eine konkurrierende Initiative namens CSI geplant, um Flex zu ersetzen.

In Anbetracht dieser Dynamik haben wir uns entschieden, eine Zwischenstopp durchzuführen um die Unterschiede zu beobachten , bis das CSI bereit ist.

## Funktionen des CCM

Der CCM erbt seine Funktionen von Komponenten des Kubernetes, die von einem Cloud Provider abhängig sind. Dieser Abschnitt ist auf der Grundlage dieser Komponenten strukturiert.

### 1. Kubernetes Controller Manager

Die meisten Funktionen des CCM stammen aus dem KCM. Wie im vorherigen Abschnitt erwähnt, führt das CCM die folgenden Steuerschleifen durch:

* Node Controller
* Route Controller
* Service Controller

#### Node Controller

Der Node Controller ist für die Initialisierung eines Knotens verantwortlich, indem er Informationen über die im Cluster laufenden Knoten vom Cloud Provider erhält. Der Node Controller führt die folgenden Funktionen aus:

1. Initialisierung eines Knoten mit Cloud-spezifischen Zonen-/Regionen Labels.
2. Initialisieren von Knoten mit Cloud-spezifischen Instanzdetails, z.B. Typ und Größe.
3. Ermitteln der Netzwerkadressen und des Hostnamen des Knotens.
4. Falls ein Knoten nicht mehr reagiert, überprüft der Controller die Cloud, um festzustellen, ob der Knoten aus der Cloud gelöscht wurde.
Wenn der Knoten aus der Cloud gelöscht wurde, löscht der Controller das Kubernetes Node Objekt.

#### Route Controller

Der Route Controller ist dafür verantwortlich, Routen in der Cloud so zu konfigurieren, dass Container auf verschiedenen Knoten im Kubernetes Cluster miteinander kommunizieren können. Der Route Controller ist nur auf einem Google Compute Engine Cluster anwendbar.

#### Service Controller

Der Service Controller ist verantwortlich für das Abhören von Ereignissen zum Erstellen, Aktualisieren und Löschen von Diensten. Basierend auf dem aktuellen Stand der Services in Kubernetes konfiguriert es Cloud Load Balancer (wie ELB, Google LB oder Oracle Cloud Infrastructure LB), um den Zustand der Services in Kubernetes abzubilden. Darüber hinaus wird sichergestellt, dass die Service Backends für Cloud Loadbalancer auf dem neuesten Stand sind.

### 2. Kubelet

Der Node Controller enthält die Cloud-abhängige Funktionalität des Kubelets. Vor der Einführung des CCM war das Kubelet für die Initialisierung eines Knotens mit cloudspezifischen Details wie IP-Adressen, Regions-/Zonenbezeichnungen und Instanztypinformationen verantwortlich. Mit der Einführung des CCM wurde diese Initialisierungsoperation aus dem Kubelet in das CCM verschoben.

In diesem neuen Modell initialisiert das Kubelet einen Knoten ohne cloudspezifische Informationen. Es fügt jedoch dem neu angelegten Knoten einen Taint hinzu, der den Knoten nicht verplanbar macht, bis der CCM den Knoten mit cloudspezifischen Informationen initialisiert. Dann wird der Taint entfernt.

## Plugin Mechanismus

Der Cloud Controller Manager verwendet die Go Schnittstellen, um Implementierungen aus jeder Cloud einzubinden. Konkret verwendet dieser das CloudProvider Interface, das [hier](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62) definiert ist.

Die Implementierung der vier oben genannten geteiltent Controllern und einigen Scaffolding sowie die gemeinsame CloudProvider Schnittstelle bleiben im Kubernetes Kern. Cloud Provider spezifische Implementierungen werden außerhalb des Kerns aufgebaut und implementieren im Kern definierte Schnittstellen.

Weitere Informationen zur Entwicklung von Plugins findest du im Bereich [Entwickeln von Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Autorisierung

Dieser Abschnitt beschreibt den Zugriff, den der CCM für die Ausführung seiner Operationen auf verschiedene API Objekte benötigt.

### Node Controller

Der Node Controller funktioniert nur mit Node Objekten. Es benötigt vollen Zugang zu get, list, create, update, patch, watch, und delete Node Objekten.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Route Controller

Der Route Controller horcht auf die Erstellung von Node Objekten und konfiguriert die Routen entsprechend. Es erfordert get Zugriff auf die Node Objekte.

v1/Node:

- Get

### Service Controller

Der Service Controller hört auf die Service Objekt Events create, update und delete und konfiguriert dann die Endpunkte für diese Services entsprechend.

Um auf Services zuzugreifen, benötigt man list und watch Berechtigung. Um die Services zu aktualisieren, sind patch und update Zugriffsrechte erforderlich.

Um die Endpunkte für die Dienste einzurichten, benötigt der Controller Zugriff auf create, list, get, watch und update.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Sonstiges

Die Implementierung des Kerns des CCM erfordert den Zugriff auf die Erstellung von Ereignissen und zur Gewährleistung eines sicheren Betriebs den Zugriff auf die Erstellung von ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

Die RBAC ClusterRole für CCM sieht wie folgt aus:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## Anbieter Implementierung

Die folgenden Cloud Anbieter haben CCMs implementiert:

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)

## Cluster Administration

Eine vollständige Anleitung zur Konfiguration und zum Betrieb des CCM findest du [hier](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).


