---
title: 在本地开发和调试服务
content_type: task
---

<!--
title: Developing and debugging services locally
content_type: task
-->

<!-- overview -->

<!--
Kubernetes applications usually consist of multiple, separate services, each running in its own container. Developing and debugging these services on a remote Kubernetes cluster can be cumbersome, requiring you to [get a shell on a running container](/docs/tasks/debug-application-cluster/get-shell-running-container/) and running your tools inside the remote shell.
-->
Kubernetes 应用程序通常由多个独立的服务组成，每个服务都在自己的容器中运行。
在远端的 Kubernetes 集群上开发和调试这些服务可能很麻烦，需要
[在运行的容器上打开 Shell](/zh/docs/tasks/debug-application-cluster/get-shell-running-container/)，
然后在远端 Shell 中运行你所需的工具。

<!--
`telepresence` is a tool to ease the process of developing and debugging services locally, while proxying the service to a remote Kubernetes cluster. Using `telepresence` allows you to use custom tools, such as a debugger and IDE, for a local service and provides the service full access to ConfigMap, secrets, and the services running on the remote cluster.
-->
`telepresence` 是一种工具，用于在本地轻松开发和调试服务，同时将服务代理到远程 Kubernetes 集群。
使用 `telepresence` 可以为本地服务使用自定义工具（如调试器和 IDE），
并提供对 Configmap、Secret 和远程集群上运行的服务的完全访问。

<!--
This document describes using `telepresence` to develop and debug services running on a remote cluster locally.
-->
本文档描述如何在本地使用 `telepresence` 开发和调试远程集群上运行的服务。

## {{% heading "prerequisites" %}}

<!--
* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [Telepresence](https://www.telepresence.io/reference/install) is installed
-->

* Kubernetes 集群安装完毕
* 配置好 `kubectl` 与集群交互
* [Telepresence](https://www.telepresence.io/reference/install) 安装完毕

<!-- steps -->

<!--
## Getting a shell on a remote cluster

Open a terminal and run `telepresence` with no arguments to get a `telepresence` shell. This shell runs locally, giving you full access to your local filesystem.
-->
打开终端，不带参数运行 `telepresence`，以打开 `telepresence` Shell。
这个 Shell 在本地运行，使你可以完全访问本地文件系统。

<!--
The `telepresence` shell can be used in a variety of ways. For example, write a shell script on your laptop, and run it directly from the shell in real time. You can do this on a remote shell as well, but you might not be able to use your preferred code editor, and the script is deleted when the container is terminated.

Enter `exit` to quit and close the shell.
-->
`telepresence` Shell 的使用方式多种多样。
例如，在你的笔记本电脑上写一个 Shell 脚本，然后直接在 Shell 中实时运行它。
你也可以在远端 Shell 上执行此操作，但这样可能无法使用首选的代码编辑器，并且在容器终止时脚本将被删除。

<!--
## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program or debug a single service. The service might require access to other services for testing and debugging. One option is to use the continuous deployment pipeline, but even the fastest deployment pipeline introduces a delay in the program or debug cycle.
-->
## 开发和调试现有的服务

在 Kubernetes 上开发应用程序时，通常对单个服务进行编程或调试。
服务可能需要访问其他服务以进行测试和调试。
一种选择是使用连续部署流水线，但即使最快的部署流水线也会在程序或调试周期中引入延迟。

<!--
Use the `--swap-deployment` option to swap an existing deployment with the Telepresence proxy. Swapping allows you to run a service locally and connect to the remote Kubernetes cluster. The services in the remote cluster can now access the locally running instance.

To run telepresence with `--swap-deployment`, enter:
-->
使用 `--swap-deployment` 选项将现有部署与 Telepresence 代理交换。
交换允许你在本地运行服务并能够连接到远端的 Kubernetes 集群。
远端集群中的服务现在就可以访问本地运行的实例。

要运行 telepresence 并带有 `--swap-deployment` 选项，请输入：

`telepresence --swap-deployment $DEPLOYMENT_NAME`

<!--
where $DEPLOYMENT_NAME is the name of your existing deployment.

Running this command spawns a shell. In the shell, start your service. You can then make edits to the source code locally, save, and see the changes take effect immediately. You can also run your service in a debugger, or any other local development tool.
-->
这里的 `$DEPLOYMENT_NAME` 是你现有的部署名称。

运行此命令将生成 Shell。在该 Shell 中，启动你的服务。
然后，你就可以在本地对源代码进行编辑、保存并能看到更改立即生效。
你还可以在调试器或任何其他本地开发工具中运行服务。

## {{% heading "whatsnext" %}}

<!--
If you're interested in a hands-on tutorial, check out [this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s) that walks through locally developing the Guestbook application on Google Kubernetes Engine.
-->
如果你对实践教程感兴趣，请查看[本教程](https://cloud.google.com/community/tutorials/developing-services-with-k8s)，其中介绍了在 Google Kubernetes Engine 上本地开发 Guestbook 应用程序。

<!--
Telepresence has [numerous proxying options](https://www.telepresence.io/reference/methods), depending on your situation.

For further reading, visit the [Telepresence website](https://www.telepresence.io).
-->
Telepresence 有[多种代理选项](https://www.telepresence.io/reference/methods)，以满足你的各种情况。

要了解更多信息，请访问 [Telepresence 网站](https://www.telepresence.io)。

