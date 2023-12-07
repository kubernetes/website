---
title: "Werkzeuge installieren"
weight: 10
---

## kubectl

Das Kubernetes Befehlszeilenprogramm [kubectl](/docs/user-guide/kubectl/) ermöglicht es Ihnen, Befehle auf einem Kubernetes-Cluster auszuführen. Sie können mit kubectl Anwendungen bereitstellen, Cluster-Ressourcen überwachen und verwalten sowie Logs einsehen.
Weitere Informationen über alle verfügbaren `kubectl`-Befehle finden Sie in der [Kommandoreferenz von kubectl](/docs/reference/kubectl/).

`kubectl` kann unter Linux, macOS und Windows installiert werden. [Hier](install-kubectl) finden Sie Anleitungen zur Installation von `kubectl`.

## kind
Mit [`kind`](https://kind.sigs.k8s.io/) können Sie Kubernetes lokal auf Ihrem Computer ausführen. Voraussetzung hierfür ist eine konfigurierte und funktionierende [Docker](https://docs.docker.com/get-docker/)-Installation.

Die `kind` [Schnellstart](https://kind.sigs.k8s.io/docs/user/quick-start/)-Seite gibt Informationen darüber, was für den schnellen Einstieg mit `kind` benötigt wird.

## minikube
Ähnlich wie `kind` ist [`minikube`](https://minikube.sigs.k8s.io/) ein Tool, mit dem man Kubernetes lokal auf dem Computer ausführen kann. Minikube erstellt Cluster mit einer Node oder mehreren Nodes. Somit ist es ein praktisches Tool für tägliche Entwicklungsaktivitäten mit Kubernetes, oder um Kubernetes einfach einmal lokal auszuprobieren. 

[Hier](/install-minikube) erfahren Sie, wie Sie `minikube` auf Ihrem Computer installieren können.
Falls Sie `minikube` bereits installiert haben, können Sie es verwenden, um eine [Beispiel-Anwendung zu bereitzustellen.](/docs/tutorials/hello-minikube/).

## kubeadm
Mit `kubeadm` können Sie Kubernetes-Cluster erstellen und verwalten. `kubeadm` führt alle notwendigen Schritte aus, um ein minimales aber sicheres Cluster in einer benutzerfreundlichen Art und Weise aufzusetzen.
[Auf dieser Seite](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) finden Sie Anleitungen zur Installation von `kubeadm`.
Sobald Sie `kubeadm` installiert haben, erfahren Sie [hier](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) wie man ein Cluster mit `kubeadm` erstellt.