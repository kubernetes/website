---
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/reference/generated/container-runtime
short_description: >
 L'environnement d'exécution de conteneurs est le logiciel responsable de l'exécution des conteneurs.

aka:
tags:
- fundamental
- workload
---
 L'environnement d'exécution de conteneurs est le logiciel responsable de l'exécution des conteneurs.

<!--more-->

Kubernetes est compatible avec plusieurs environnements d'exécution de conteneur: [Docker](http://www.docker.com),
[containerd](https://containerd.io), [cri-o](https://cri-o.io/),
[rktlet](https://github.com/kubernetes-incubator/rktlet) ainsi que toute implémentation de [Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
