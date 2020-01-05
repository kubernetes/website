---
title: 容器运行环境（Container Runtime）
id: container-runtime
date: 2019-06-05
full_link: /docs/reference/generated/container-runtime
short_description: >
 容器运行环境是负责运行容器的软件。

aka:
tags:
- fundamental
- workload
---
<!--
---
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/reference/generated/container-runtime
short_description: >
 The container runtime is the software that is responsible for running containers.

aka:
tags:
- fundamental
- workload
---
-->

<!--
The container runtime is the software that is responsible for running containers.
-->
容器运行环境是负责运行容器的软件。

<!--more-->

<!--
Kubernetes supports several container runtimes: [Docker](http://www.docker.com),
[containerd](https://containerd.io), [cri-o](https://cri-o.io/),
[rktlet](https://github.com/kubernetes-incubator/rktlet) and any implementation of
the [Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
-->
Kubernetes 支持多个容器运行环境: [Docker](http://www.docker.com)、
[containerd](https://containerd.io)、[cri-o](https://cri-o.io/)、
[rktlet](https://github.com/kubernetes-incubator/rktlet) 以及任何实现 [Kubernetes CRI (容器运行环境接口)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)。
