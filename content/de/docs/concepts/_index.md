---
title: Konzepte
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Im Abschnitt Konzepte erfahren Sie mehr über die Teile des Kubernetes-Systems und die Abstraktionen, die Kubernetes zur Darstellung Ihres Clusters verwendet, und Sie erhalten ein tieferes Verständnis der Funktionsweise von Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Überblick

Um mit Kubernetes zu arbeiten, verwenden Sie *Kubernetes-API-Objekte*, um den *gewünschten Status Ihres Clusters* zu beschreiben: 
welche Anwendungen oder anderen Workloads Sie ausführen möchten, welche Containerimages sie verwenden, die Anzahl der Replikate, welche Netzwerk- und Festplattenressourcen Sie zur Verfügung stellen möchten, und vieles mehr. Sie legen den gewünschten Status fest, indem Sie Objekte mithilfe der Kubernetes-API erstellen, normalerweise über die Befehlszeilenschnittstelle `kubectl`. Sie können die Kubernetes-API auch direkt verwenden, um mit dem Cluster zu interagieren und den gewünschten Status festzulegen oder zu ändern.

Sobald Sie den gewünschten Status eingestellt haben, wird das *Kubernetes Control Plane* dafür sorgen, dass der aktuelle Status des Clusters mit dem gewünschten Status übereinstimmt. Zu diesem Zweck führt Kubernetes verschiedene Aufgaben automatisch aus, z. B. Starten oder Neustarten von Containern, Skalieren der Anzahl der Repliken einer bestimmten Anwendung und vieles mehr. Das Kubernetes Control Plane besteht aus einer Reihe von Prozessen, die in Ihrem Cluster ausgeführt werden:

* Der **Kubernetes Master** bestehet aus drei Prozessen, die auf einem einzelnen Node in Ihrem Cluster ausgeführt werden, der als Master-Node bezeichnet wird. Diese Prozesse sind:[kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) und [kube-scheduler](/docs/admin/kube-scheduler/).
* Jeder einzelne Node in Ihrem Cluster, welcher nicht der Master ist, führt zwei Prozesse aus:
  * **[kubelet](/docs/admin/kubelet/)**, das mit dem Kubernetes Master kommuniziert.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, ein Netzwerk-Proxy, der die Netzwerkdienste von Kubernetes auf jedem Node darstellt.

## Kubernetes Objects

Kubernetes enthält eine Reihe von Abstraktionen, die den Status Ihres Systems darstellen: implementierte containerisierte Anwendungen und Workloads, die zugehörigen Netzwerk- und Festplattenressourcen sowie weitere Informationen zu den Aufgaben Ihres Clusters. Diese Abstraktionen werden durch Objekte in der Kubernetes-API dargestellt; Lesen Sie [Kubernetes Objects Überblick](/docs/concepts/abstractions/overview/) für weitere Details. 

Die grundlegenden Objekte von Kubernetes umfassen:

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

Darüber hinaus enthält Kubernetes eine Reihe von Abstraktionen auf höherer Ebene, die als Controller bezeichnet werden. Controller bauen auf den Basisobjekten auf und bieten zusätzliche Funktionen und Komfortfunktionen. Sie beinhalten:

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## Kubernetes Control Plane

Die verschiedenen Teile der Kubernetes-Steuerungsebene (Control Plane), wie der Kubernetes Master- und der Kubelet-Prozess, bestimmen, wie Kubernetes mit Ihrem Cluster kommuniziert. Das Control Plane führt ein Inventar aller Kubernetes-Objekte im System und führt fortlaufende Steuerkreise aus, um den Status dieser Objekte zu verwalten. Zu jeder Zeit reagieren die Steuerkreise des Control Plane auf Änderungen im Cluster und arbeiten daran, dass der tatsächliche Status aller Objekte im System mit dem gewünschten Status, den Sie definiert haben, übereinstimmt.

Wenn Sie beispielsweise mit der Kubernetes-API ein Deployment-Objekt erstellen, geben Sie einen neuen gewünschten Status für das System an. Das Kubernetes Control Plane zeichnet die Objekterstellung auf und führt Ihre Anweisungen aus, indem es die erforderlichen Anwendungen startet und sie für auf den Cluster-Nodes plant--Dadurch wird der tatsächliche Status des Clusters an den gewünschten Status angepasst.

### Kubernetes Master

Der Kubernetes-Master ist für die Aufrechterhaltung des gewünschten Status für Ihren Cluster verantwortlich. Wenn Sie mit Kubernetes interagieren, beispielsweise mit dem Kommanduzeilen-Tool `kubectl`, kommunizieren Sie mit dem Kubernetes-Master Ihres Clusters.

> Der "Master" bezieht sich auf eine Reihe von Prozessen, die den Clusterstatus verwalten.  Normalerweise werden diese Prozesse alle auf einem einzigen Node im Cluster ausgeführt. Dieser Node wird auch als Master bezeichnet. Der Master kann repliziert werden um Verfügbarkeit und Redundanz zu erhöhen.

### Kubernetes Nodes

Die Nodes in einem Cluster sind die Maschinen (VMs, physische Server usw.), auf denen Ihre Anwendungen und Cloud-Workflows ausgeführt werden. Der Kubernetes-Master steuert jeden Master. Sie werden selten direkt mit Nodes interagieren.

#### Objekt Metadata


* [Anmerkungen](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

Wenn Sie eine Konzeptseite schreiben möchten, lesen Sie [Seitenvorlagen verwenden](/docs/home/contribute/page-templates/)
für Informationen zum Konzeptseitentyp und zur Dokumentations Vorlage.

{{% /capture %}}
