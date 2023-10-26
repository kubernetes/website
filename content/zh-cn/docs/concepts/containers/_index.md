---
title: "容器"
weight: 40
description: 打包应用及其运行依赖环境的技术。
content_type: concept
card:
  name: concepts
  weight: 50
---
<!--
title: Containers
weight: 40
description: Technology for packaging an application along with its runtime dependencies.
reviewers:
- erictune
- thockin
content_type: concept
card:
  name: concepts
  weight: 50
-->

<!-- overview -->
<!--
Each container that you run is repeatable; the standardization from having
dependencies included means that you get the same behavior wherever you
run it.

Containers decouple applications from the underlying host infrastructure.
This makes deployment easier in different cloud or OS environments.

Each {{< glossary_tooltip text="node" term_id="node" >}} in a Kubernetes
cluster runs the containers that form the
[Pods](/docs/concepts/workloads/pods/) assigned to that node.
Containers in a Pod are co-located and co-scheduled to run on the same node.
-->
每个运行的容器都是可重复的；
包含依赖环境在内的标准，意味着无论你在哪里运行它都会得到相同的行为。

容器将应用程序从底层的主机设施中解耦。
这使得在不同的云或 OS 环境中部署更加容易。

Kubernetes 集群中的每个{{< glossary_tooltip text="节点" term_id="node" >}}都会运行容器，
这些容器构成分配给该节点的 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
单个 Pod 中的容器会在共同调度下，于同一位置运行在相同的节点上。

<!-- body -->
<!--
## Container images
A [container image](/docs/concepts/containers/images/) is a ready-to-run
software package containing everything needed to run an application:
the code and any runtime it requires, application and system libraries,
and default values for any essential settings.

Containers are intended to be stateless and
[immutable](https://glossary.cncf.io/immutable-infrastructure/):
you should not change
the code of a container that is already running. If you have a containerized
application and want to make changes, the correct process is to build a new
image that includes the change, then recreate the container to start from the
updated image.
-->

## 容器镜像 {#container-images}
[容器镜像](/zh-cn/docs/concepts/containers/images/)是一个随时可以运行的软件包，
包含运行应用程序所需的一切：代码和它需要的所有运行时、应用程序和系统库，以及一些基本设置的默认值。

容器旨在设计成无状态且[不可变的](https://glossary.cncf.io/immutable-infrastructure/)：
你不应更改已经运行的容器的代码。如果有一个容器化的应用程序需要修改，
正确的流程是：先构建包含更改的新镜像，再基于新构建的镜像重新运行容器。

<!-- ## Container runtimes -->
## 容器运行时  {#container-runtimes}

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
Usually, you can allow your cluster to pick the default container runtime
for a Pod. If you need to use more than one container runtime in your cluster,
you can specify the [RuntimeClass](/docs/concepts/containers/runtime-class/)
for a Pod to make sure that Kubernetes runs those containers using a
particular container runtime.

You can also use RuntimeClass to run different Pods with the same container
runtime but with different settings.
-->
通常，你可以允许集群为一个 Pod 选择其默认的容器运行时。如果你需要在集群中使用多个容器运行时，
你可以为一个 Pod 指定 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)，
以确保 Kubernetes 会使用特定的容器运行时来运行这些容器。

你还可以通过 RuntimeClass，使用相同的容器运行时，但使用不同设定的配置来运行不同的 Pod。
