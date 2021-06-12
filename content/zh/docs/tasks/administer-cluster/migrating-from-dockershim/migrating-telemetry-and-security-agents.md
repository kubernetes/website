---
title: 从 dockershim 迁移遥测和安全代理
content_type: task 
weight: 70
---
<!-- 
title: Migrating telemetry and security agents from dockershim
content_type: task 
reviewers:
- SergeyKanzhelev
weight: 70
-->

<!-- overview -->

<!-- 
With Kubernetes 1.20 dockershim was deprecated. From the
[Dockershim Deprecation FAQ](/blog/2020/12/02/dockershim-faq/)
you might already know that most apps do not have a direct dependency on runtime hosting
containers. However, there are still a lot of telemetry and security agents
that has a dependency on docker to collect containers metadata, logs and
metrics. This document aggregates information on how to detect tese
dependencies and links on how to migrate these agents to use generic tools or
alternative runtimes.
-->
在 Kubernetes 1.20 版本中，dockershim 被弃用。
在博文[弃用 Dockershim 常见问题](/zh/blog/2020/12/02/dockershim-faq/)中，
你大概已经了解到，大多数应用并没有直接通过运行时来托管容器。
但是，仍然有大量的遥测和安全代理依赖 docker 来收集容器元数据、日志和指标。
本文汇总了一些信息和链接：信息用于阐述如何探查这些依赖，链接用于解释如何迁移这些代理去使用通用的工具或其他容器运行。

<!-- 
## Telemetry and security agents 
-->
## 遥测和安全代理 {#telemetry-and-security-agents}

<!-- 
There are a few ways agents may run on Kubernetes cluster. Agents may run on
nodes directly or as DaemonSets.
-->
为了让代理运行在 Kubernetes 集群中，我们有几种办法。
代理既可以直接在节点上运行，也可以作为守护进程运行。

<!-- 
### Why do telemetry agents rely on Docker?
-->
### 为什么遥测代理依赖于 Docker？ {#why-do-telemetry-agents-relyon-docker}

<!-- 
Historically, Kubernetes was built on top of Docker. Kubernetes is managing
networking and scheduling, Docker was placing and operating containers on a
node. So you can get scheduling-related metadata like a pod name from Kubernetes
and containers state information from Docker. Over time more runtimes were
created to manage containers. Also there are projects and Kubernetes features
that generalize container status information extraction across many runtimes.
-->
因为历史原因，Kubernetes 建立在 Docker 之上。
Kubernetes 管理网络和调度，Docker 则在具体的节点上定位并操作容器。
所以，你可以从 Kubernetes 取得调度相关的元数据，比如 Pod 名称；从 Docker 取得容器状态信息。
后来，人们开发了更多的运行时来管理容器。
同时一些项目和 Kubernetes 特性也不断涌现，支持跨多个运行时收集容器状态信息。

<!-- 
Some agents are tied specifically to the Docker tool. The agents may run
commands like [`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
or [`docker top`](https://docs.docker.com/engine/reference/commandline/top/) to list
containers and processes or [docker logs](https://docs.docker.com/engine/reference/commandline/logs/)
to subscribe on docker logs. With the deprecating of Docker as a container runtime,
these commands will not work any longer.
-->
一些代理和 Docker 工具紧密绑定。此类代理可以这样运行命令，比如用
[`docker ps`](https://docs.docker.com/engine/reference/commandline/ps/)
或 [`docker top`](https://docs.docker.com/engine/reference/commandline/top/)
这类命令来列出容器和进程，用
[docker logs](https://docs.docker.com/engine/reference/commandline/logs/)
订阅 Docker 的日志。
但随着 Docker 作为容器运行时被弃用，这些命令将不再工作。

<!-- 
### Identify DaemonSets that depend on Docker {#identify-docker-dependency }
-->
### 识别依赖于 Docker 的 DaemonSet {#identify-docker-dependency}

<!-- 
If a pod wants to make calls to the `dockerd` running on the node, the pod must either:

- mount the filesystem containing the Docker daemon's privileged socket, as a
  {{< glossary_tooltip text="volume" term_id="volume" >}}; or
- mount the specific path of the Docker daemon's privileged socket directly, also as a volume.
-->
如果某 Pod 想调用运行在节点上的 `dockerd`，该 Pod 必须满足以下两个条件之一：

- 将包含 Docker 守护进程特权套接字的文件系统挂载为一个{{< glossary_tooltip text="卷" term_id="volume" >}}；或
- 直接以卷的形式挂载 Docker 守护进程特权套接字的特定路径。

<!-- 
For example: on COS images, Docker exposes its Unix domain socket at
`/var/run/docker.sock` This means that the pod spec will include a
`hostPath` volume mount of `/var/run/docker.sock`.
-->
举例来说：在 COS 镜像中，Docker 通过 `/var/run/docker.sock` 开放其 Unix 域套接字。
这意味着 Pod 的规约中需要包含 `hostPath` 卷以挂载 `/var/run/docker.sock`。

<!-- 
Here's a sample shell script to find Pods that have a mount directly mapping the
Docker socket. This script outputs the namespace and name of the pod. You can
remove the grep `/var/run/docker.sock` to review other mounts.
-->
下面是一个 shell 示例脚本，用于查找包含直接映射 Docker 套接字的挂载点的 Pod。
你也可以删掉 grep `/var/run/docker.sock` 这一代码片段以查看其它挂载信息。

```bash
kubectl get pods --all-namespaces \
-o=jsonpath='{range .items[*]}{"\n"}{.metadata.namespace}{":\t"}{.metadata.name}{":\t"}{range .spec.volumes[*]}{.hostPath.path}{", "}{end}{end}' \
| sort \
| grep '/var/run/docker.sock'
```

<!-- 
There are alternative ways for a pod to access Docker on the host. For instance, the parent
directory `/var/run` may be mounted instead of the full path (like in [this
example](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)).
The script above only detects the most common uses.
-->
{{< note >}}
对于 Pod 来说，访问宿主机上的 Docker 还有其他方式。
例如，可以挂载 `/var/run` 的父目录而非其完整路径
（就像[这个例子](https://gist.github.com/itaysk/7bc3e56d69c4d72a549286d98fd557dd)）。
上述脚本只检测最常见的使用方式。
{{< /note >}}

<!-- 
### Detecting Docker dependency from node agents
-->
### 检测节点代理对 Docker 的依赖性 {#detecting-docker-dependency-from-node-agents}

<!-- 
In case your cluster nodes are customized and install additional security and
telemetry agents on the node, make sure to check with the vendor of the agent whether it has dependency on Docker.
-->
在你的集群节点被定制、且在各个节点上均安装了额外的安全和遥测代理的场景下，
一定要和代理的供应商确认：该代理是否依赖于 Docker。

<!-- 
### Telemetry and security agent vendors
-->
### 遥测和安全代理的供应商 {#telemetry-and-security-agent-vendors}

<!-- 
We keep the work in progress version of migration instructions for various telemetry and security agent vendors
in [Google doc](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#).
Please contact the vendor to get up to date instructions for migrating from dockershim.
-->
我们通过
[谷歌文档](https://docs.google.com/document/d/1ZFi4uKit63ga5sxEiZblfb-c23lFhvy6RXVPikS8wf0/edit#)
提供了为各类遥测和安全代理供应商准备的持续更新的迁移指导。
请与供应商联系，获取从 dockershim 迁移的最新说明。
