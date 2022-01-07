---
title: 查明节点上所使用的容器运行时
content_type: task
weight: 10
---
<!--
title: Find Out What Container Runtime is Used on a Node
content_type: task
reviewers:
- SergeyKanzhelev
weight: 10
-->

<!-- overview -->

<!--
This page outlines steps to find out what [container runtime](/docs/setup/production-environment/container-runtimes/)
the nodes in your cluster use.
-->
本页面描述查明集群中节点所使用的[容器运行时](/zh/docs/setup/production-environment/container-runtimes/)
的步骤。

<!--
Depending on the way you run your cluster, the container runtime for the nodes may
have been pre-configured or you need to configure it. If you're using a managed
Kubernetes service, there might be vendor-specific ways to check what container runtime is
configured for the nodes. The method described on this page should work whenever
the execution of `kubectl` is allowed.
-->
取决于你运行集群的方式，节点所使用的容器运行时可能是事先配置好的，
也可能需要你来配置。如果你在使用托管的 Kubernetes 服务，
可能存在特定于厂商的方法来检查节点上配置的容器运行时。
本页描述的方法应该在能够执行 `kubectl` 的场合下都可以工作。

## {{% heading "prerequisites" %}}

<!--
Install and configure `kubectl`. See [Install Tools](/docs/tasks/tools/#kubectl) section for details.
-->
安装并配置 `kubectl`。参见[安装工具](/zh/docs/tasks/tools/#kubectl) 节了解详情。

<!--
## Find out the container runtime used on a Node

Use `kubectl` to fetch and show node information:
-->
## 查明节点所使用的容器运行时

使用 `kubectl` 来读取并显示节点信息：

```shell
kubectl get nodes -o wide
```

<!--
The output is similar to the following. The column `CONTAINER-RUNTIME` outputs
the runtime and its version.
-->
输出如下面所示。`CONTAINER-RUNTIME` 列给出容器运行时及其版本。

```none
# For dockershim
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```

```none
# For containerd
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

<!--
Find out more information about container runtimes
on [Container Runtimes](/docs/setup/production-environment/container-runtimes/) page.
-->
你可以在[容器运行时](/zh/docs/setup/production-environment/container-runtimes/)
页面找到与容器运行时相关的更多信息。

