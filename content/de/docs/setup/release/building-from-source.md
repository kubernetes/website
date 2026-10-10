---
title: Release erstellen
content_type: concept
card:
  name: download
  weight: 20
  title: Release erstellen
---
<!-- overview -->
Sie können entweder eine Version aus dem Quellcode erstellen oder eine bereits kompilierte Version herunterladen.
Wenn Sie nicht vorhaben, Kubernetes selbst zu entwickeln, empfehlen wir die Verwendung eines vorkompilierten Builds der aktuellen Version, die Sie in den [Versionshinweisen](/docs/setup/release/notes/) finden.

Der Kubernetes-Quellcode kann aus dem [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repo der heruntergeladen werden.


<!-- body -->

## Aus dem Quellcode kompilieren

Wenn Sie einfach ein Release aus dem Quellcode erstellen, müssen Sie keine vollständige Golang-Umgebung einrichten, da alle Aktionen in einem Docker-Container stattfinden.

Das Kompilieren einer Version ist einfach:

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

Mehr Informationen zum Release-Prozess finden Sie im kubernetes/kubernetes [`build`](http://releases.k8s.io/master/build/) Verzeichnis.


