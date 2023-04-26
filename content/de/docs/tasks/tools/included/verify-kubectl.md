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
welche automatisch angelegt wird, wenn Sie ein Cluster erstellen mit Hilfe der
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)
oder erfolgreich ein Cluster mit Minicube erstellt haben.
Standardmäßig liegt die kubectl Konfigurationsdatei unter folgendem Pfad `~/.kube/config`.

Um zu überprüfen ob kubectl korrekt konfiguriert ist, können Sie den Cluster-Status abfragen:

```shell
kubectl cluster-info
```

Wenn Sie als Antwort eine URL sehen, ist kubectl korrekt konfiguriert und kann auf das Cluster zugreifen.

Falls Sie eine Nachricht ähnlich wie die Folgende sehen, ist kubectl nicht korrekt konfiguriert oder nicht in der Lage das Cluster zu erreichen.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Wenn Sie zum Beispiel versuchen ein Kubernetes Cluster lokal auf ihrem Laptop zu starten, muss ein Tool wie zum Beispiel Minikube zuerst installiert werden. Danach können Sie die oben erwähnten Befehle erneut ausführen.

Falls kubectl cluster-info eine URL zurück gibt, aber nicht auf das Cluster zugreifen kann, prüfen Sie ob kubectl korrekt konfiguriert wurde:

```shell
kubectl cluster-info dump
```