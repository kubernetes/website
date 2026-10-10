---
title: "kubectl installation verifizieren"
description: "Wie die kubectl Installation verifiziert wird."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Um mithilfe von kubectl ein Cluster zu finden und darauf zuzugreifen benötigt es eine
[kubeconfig Datei](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
welche automatisch angelegt wird, wenn ein Cluster mit Hilfe der
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
oder erfolgreich ein Cluster mit Minicube erstellt wurde.
Standardmäßig liegt die kubectl Konfigurationsdatei unter folgendem Pfad `~/.kube/config`.

Um zu überprüfen ob kubectl korrekt konfiguriert ist, kann der Cluster-Status abgefragt werden:

```shell
kubectl cluster-info
```

Wenn als Antwort eine URL ausgegeben wird, ist kubectl korrekt konfiguriert und kann auf das Cluster zugreifen.

Falls eine Nachricht ähnlich wie die Folgende zu sehen ist, ist kubectl nicht korrekt konfiguriert oder nicht in der Lage das Cluster zu erreichen.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Wenn zum Beispiel versucht wird ein Kubernetes Cluster lokal auf dem Laptop zu starten, muss ein Tool wie zum Beispiel [Minikube](https://minikube.sigs.k8s.io/docs/start/) zuerst installiert werden. Danach können die oben erwähnten Befehle erneut ausgeführt werden.

Falls `kubectl cluster-info` eine URL zurück gibt, aber nicht auf das Cluster zugreifen kann, prüfe ob kubectl korrekt konfiguriert wurde:

```shell
kubectl cluster-info dump
```