---
title: "安装工具"
weight: 10
description: 在你的计算机上设置 Kubernetes 工具。
no_list: true
---

<!--
title: "Install Tools"
description: Set up Kubernetes tools on your computer.
weight: 10
no_list: true
-->

<!--
## kubectl

The Kubernetes command-line tool, `kubectl`, allows you to run commands against
Kubernetes clusters. You can use `kubectl` to deploy applications, inspect and
manage cluster resources, and view logs.

See [Install and Set Up `kubectl`](/docs/tasks/tools/install-kubectl/) for
information about how to download and install `kubectl` and set it up for
accessing your cluster.
-->
## kubectl

Kubernetes 命令行工具，`kubectl`，使得你可以对 Kubernetes 集群运行命令。
你可以使用 `kubectl` 来部署应用、监测和管理集群资源以及查看日志。

关于如何下载和安装 `kubectl` 并配置其访问你的集群，可参阅
[安装和配置 `kubectl`](/zh/docs/tasks/tools/install-kubectl/)。

<!--
a class="btn btn-primary" href="/docs/tasks/tools/install-kubectl/" role="button" aria-label="View kubectl Install and Set Up Guide">View kubectl Install and Set Up Guide</a>

You can also read the
[`kubectl` reference documentation](/docs/reference/kubectl/).
-->
<a class="btn btn-primary" href="/zh/docs/tasks/tools/install-kubectl/"
  role="button" aria-label="查看 kubectl 安装和配置指南">
查看 kubectl 安装和配置指南
</a>

你也可以阅读 [`kubectl` 参考文档](/zh/docs/reference/kubectl/).

<!--
## minikube

[`minikube`](https://minikube.sigs.k8s.io/) is a tool that lets you run Kubernetes
locally. `minikube` runs a single-node Kubernetes cluster on your personal
computer (including Windows, macOS and Linux PCs) so that you can try out
Kubernetes, or for daily development work.

You can follow the official
[Get Started!](https://minikube.sigs.k8s.io/docs/start/) guide if your focus is
on getting the tool installed.
-->
## minikube

[`minikube`](https://minikube.sigs.k8s.io/) 是一个工具，能让你在本地运行 Kubernetes。
`minikube` 在你本地的个人计算机（包括 Windows、macOS 和 Linux PC）运行一个单节点的
Kubernetes 集群，以便你来尝试 Kubernetes 或者开展每天的开发工作。

如果你关注如何安装此工具，可以按官方的
[Get Started!](https://minikube.sigs.k8s.io/docs/start/)指南操作。

<!--
a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">View minikube Get Started! Guide</a>

Once you have `minikube` working, you can use it to
[run a sample application](/docs/tutorials/hello-minikube/).
-->
<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/"
  role="button" aria-label="查看 minikube 快速入门指南">
查看 minikube 快速入门指南
</a>

当你拥有了可工作的 `minikube` 时，就可以用它来
[运行示例应用](/zh/docs/tutorials/hello-minikube/)了。

<!--
## kind

Like `minikube`, [`kind`](https://kind.sigs.k8s.io/docs/) lets you run Kubernetes on
your local computer. Unlike `minikube`, `kind` only works with a single container
runtime: it requires that you have [Docker](https://docs.docker.com/get-docker/)
installed and configured.

[Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) shows you what
you need to do to get up and running with `kind`.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">View kind Quick Start Guide</a>
-->
## kind

与 `minikube` 类似，[`kind`](https://kind.sigs.k8s.io/docs/) 让你能够在本地计算机上
运行 Kubernetes。与`minikube` 不同的是，`kind` 只能使用一种容器运行时：
它要求你安装并配置好 [Docker](https://docs.docker.com/get-docker/)。

[快速入门](https://kind.sigs.k8s.io/docs/user/quick-start/)页面提供了开始使用
`kind` 所需要完成的操作。

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/"
  role="button" aria-label="查看 kind 的快速入门指南">
查看 kind 的快速入门指南
</a>

