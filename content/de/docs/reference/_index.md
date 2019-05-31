---
title: Referenzen
approvers:
- chenopis
linkTitle: "Referenzen"
main_menu: true
weight: 70
content_template: templates/concept
---

{{% capture overview %}}

Dieser Abschnitt der Kubernetes-Dokumentation enthält Referenzinformationen.

{{% /capture %}}

{{% capture body %}}

## API-Referenz

* [Kubernetes API Überblick](/docs/reference/using-api/api-overview/) - Übersicht über die API für Kubernetes.
* Kubernetes API Versionen
  * [1.14](/docs/reference/generated/kubernetes-api/v1.14/)
  * [1.13](/docs/reference/generated/kubernetes-api/v1.13/)
  * [1.12](/docs/reference/generated/kubernetes-api/v1.12/)
  * [1.11](/docs/reference/generated/kubernetes-api/v1.11/)
  * [1.10](/docs/reference/generated/kubernetes-api/v1.10/)

## API-Clientbibliotheken

Um die Kubernetes-API aus einer Programmiersprache aufzurufen, können Sie
[Clientbibliotheken](/docs/reference/using-api/client-libraries/) verwenden. 
Offiziell unterstützte Clientbibliotheken:

- [Kubernetes Go Clientbibliothek](https://github.com/kubernetes/client-go/)
- [Kubernetes Python Clientbibliothek](https://github.com/kubernetes-client/python)
- [Kubernetes Java Clientbibliothek](https://github.com/kubernetes-client/java)
- [Kubernetes JavaScript Clientbibliothek](https://github.com/kubernetes-client/javascript)

## CLI-Referenz

* [kubectl](/docs/user-guide/kubectl-overview) - Haupt-CLI-Tool zum Ausführen von Befehlen und zum Verwalten von Kubernetes-Clustern.
    * [JSONPath](/docs/user-guide/jsonpath/) - Syntax-Anleitung zur Verwendung von [JSONPath expressionen](http://goessner.net/articles/JsonPath/) mit kubectl.
* [kubeadm](/docs/admin/kubeadm/) - CLI-Tool zur einfachen Bereitstellung eines sicheren Kubernetes-Clusters.
* [kubefed](/docs/admin/kubefed/) - CLI-Tool zur Verwaltung Ihres Clusterverbunds.

## Konfigurationsreferenz

* [kubelet](/docs/admin/kubelet/) - Der primäre *Node-Agent*, der auf jedem Node ausgeführt wird. Das Kubelet betrachtet eine Reihe von PodSpecs und stellt sicher, dass die beschriebenen Container ordnungsgemäß ausgeführt werden.
* [kube-apiserver](/docs/admin/kube-apiserver/) - REST-API zur Überprüfung und Konfiguration von Daten für API-Objekte wie Pods, Services und Replikationscontroller.
* [kube-controller-manager](/docs/admin/kube-controller-manager/) - Daemon, der die mit Kubernetes gelieferten zentralen Regelkreise einbettet.
* [kube-proxy](/docs/admin/kube-proxy/) - Kann einfache TCP/UDP-Stream-Weiterleitung oder Round-Robin-TCP/UDP-Weiterleitung über eine Reihe von Back-Ends durchführen.
* [kube-scheduler](/docs/admin/kube-scheduler/) - Scheduler, der Verfügbarkeit, Leistung und Kapazität verwaltet.
* [federation-apiserver](/docs/admin/federation-apiserver/) - API-Server für Cluster Föderationen.
* [federation-controller-manager](/docs/admin/federation-controller-manager/) - Daemon, der die zentralen Regelkreise einbindet, die mit der Kubernetes-Föderation ausgeliefert werden.

## Design Dokumentation

Ein Archiv der Designdokumente für Kubernetes-Funktionalität. Gute Ansatzpunkte sind [Kubernetes Architektur](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) und [Kubernetes Design Übersicht](https://git.k8s.io/community/contributors/design-proposals).

{{% /capture %}}
