---
title: 容器环境
content_type: concept
weight: 20
---
<!--
reviewers:
- mikedanese
- thockin
title: Container Environment
content_type: concept
weight: 20
-->

<!-- overview -->

<!--
This page describes the resources available to Containers in the Container environment. 
-->
本页描述了在容器环境里容器可用的资源。

<!-- body -->

<!--
## Container environment

The Kubernetes Container environment provides several important resources to Containers:

* A filesystem, which is a combination of an [image](/docs/concepts/containers/images/) and one or more [volumes](/docs/concepts/storage/volumes/).
* Information about the Container itself.
* Information about other objects in the cluster.
-->
## 容器环境  {#container-environment}

Kubernetes 的容器环境给容器提供了几个重要的资源：

* 文件系统，其中包含一个[镜像](/zh/docs/concepts/containers/images/)
  和一个或多个的[卷](/zh/docs/concepts/storage/volumes/)
* 容器自身的信息
* 集群中其他对象的信息

<!--
### Container information

The *hostname* of a Container is the name of the Pod in which the Container is running.
It is available through the `hostname` command or the
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
function call in libc.

The Pod name and namespace are available as environment variables through the
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

User defined environment variables from the Pod definition are also available to the Container,
as are any environment variables specified statically in the Docker image.
-->
### 容器信息

容器的 *hostname* 是它所运行在的 pod 的名称。它可以通过 `hostname` 命令或者调用 libc 中的
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html) 函数来获取。

Pod 名称和命名空间可以通过
[下行 API](/zh/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
转换为环境变量。

Pod 定义中的用户所定义的环境变量也可在容器中使用，就像在 Docker 镜像中静态指定的任何环境变量一样。

<!--
### Cluster information

A list of all services that were running when a Container was created is available to that Container as environment variables.
This list is limited to services within the same namespace as the new Container's Pod and Kubernetes control plane services.
Those environment variables match the syntax of Docker links.

For a service named *foo* that maps to a Container named *bar*,
the following variables are defined:
-->
### 集群信息

创建容器时正在运行的所有服务都可用作该容器的环境变量。
这里的服务仅限于新容器的 Pod 所在的名字空间中的服务，以及 Kubernetes 控制面的服务。
这些环境变量与 Docker 链接的语法相同。

对于名为 *foo* 的服务，当映射到名为 *bar* 的容器时，以下变量是被定义了的：

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

<!--
Services have dedicated IP addresses and are available to the Container via DNS,
if [DNS addon](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/) is enabled. 
-->
服务具有专用的 IP 地址。如果启用了
[DNS插件](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/)，
可以在容器中通过 DNS 来访问服务。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
-->
* 学习更多有关[容器生命周期回调](/zh/docs/concepts/containers/container-lifecycle-hooks/)的知识
* 动手[为容器生命周期事件添加处理程序](/zh/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)


