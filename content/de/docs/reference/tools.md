---
title: Tools
content_template: templates/concept
---

{{% capture overview %}}
Kubernetes enthält mehrere integrierte Tools, die Ihnen bei der Arbeit mit dem Kubernetes System helfen.
{{% /capture %}}

{{% capture body %}}
## Kubectl

[`kubectl`](/docs/tasks/tools/install-kubectl/) ist ein Kommandozeilenprogramm für Kubernetes. Es steuert den Kubernetes Clustermanager.

## Kubeadm 

[`kubeadm`](/docs/setup/independent/install-kubeadm/)  ist ein Kommandozeilenprogramm zur einfachen Bereitstellung eines sicheren Kubernetes-Clusters auf physischen oder Cloud-Servern oder virtuellen Maschinen (derzeit in alpha).

## Kubefed

[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) ist ein Kommandozeilenprogramm um Ihnen bei der Verwaltung Ihrer Verbundcluster zu helfen.

## Minikube

[`minikube`](/docs/tasks/tools/install-minikube/) ist ein Tool, das es Ihnen einfach macht, einen Kubernetes-Cluster mit einem einzigen Knoten lokal auf Ihrer Workstation für Entwicklungs- und Testzwecke auszuführen.

## Dashboard 

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), die webbasierte Benutzeroberfläche von Kubernetes ermöglicht es Ihnen containerisierte Anwendungen in einem Kubernetes-Cluster bereitzustellen Fehler zu beheben und den Cluster und seine Ressourcen selbst zu verwalten.

## Helm

[`Kubernetes Helm`](https://github.com/kubernetes/helm) ist ein Tool zur Verwaltung von Paketen mit vorkonfigurierten Kubernetes-Ressourcen, auch bekannt als Kubernetes charts.

Verwenden Sie Helm um:

* Beliebte Software verpackt als Kubernetes charts zu finden und zu verwenden 
* Ihre eigenen Applikationen als Kubernetes charts zu teilen
* Reproduzierbare Builds Ihrer Kubernetes Anwendungen zu erstellen
* Intelligenten Verwaltung von Ihren Kubernetes manifest files 
* Verwalten von Versionen von Helm Paketen

## Kompose

[`Kompose`](https://github.com/kubernetes-incubator/kompose) ist ein Tool, das Docker Compose Benutzern hilft, nach Kubernetes zu wechseln.

Verwenden Sie Kompose um:

* Ein Docker Compose Datei in Kubernetes Objekte zu übersetzen
* Von Ihrer lokalen Docker Entwicklung auf eine Kubernetes verwaltete Entwicklung zu wechseln
* v1 oder v2 Docker Compose `yaml` Dateien oder [Distributed Application Bundles](https://docs.docker.com/compose/bundles/) zu konvertieren
{{% /capture %}}
