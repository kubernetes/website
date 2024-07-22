---
title: Downward API
content_type: concept
weight: 170
description: >
  有两种方法可以将 Pod 和容器字段暴露给运行中的容器：环境变量和由特殊卷类型承载的文件。
  这两种暴露 Pod 和容器字段的方法统称为 Downward API。
---
<!--
title: Downward API
content_type: concept
weight: 170
description: >
  There are two ways to expose Pod and container fields to a running container:
  environment variables, and as files that are populated by a special volume type.
  Together, these two ways of exposing Pod and container fields are called the downward API.
-->

<!-- overview -->

<!--
It is sometimes useful for a container to have information about itself, without
being overly coupled to Kubernetes. The _downward API_ allows containers to consume
information about themselves or the cluster without using the Kubernetes client
or API server.
-->
对于容器来说，在不与 Kubernetes 过度耦合的情况下，拥有关于自身的信息有时是很有用的。
**Downward API** 允许容器在不使用 Kubernetes 客户端或 API 服务器的情况下获得自己或集群的信息。

<!--
An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error-prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.
-->
例如，现有应用程序假设某特定的周知的环境变量是存在的，其中包含唯一标识符。
一种方法是对应用程序进行封装，但这很繁琐且容易出错，并且违背了低耦合的目标。
更好的选择是使用 Pod 名称作为标识符，并将 Pod 名称注入到周知的环境变量中。

<!--
In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* as [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* as [files in a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
-->
在 Kubernetes 中，有两种方法可以将 Pod 和容器字段暴露给运行中的容器：

* 作为[环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 作为 [`downwardAPI` 卷中的文件](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

<!--
Together, these two ways of exposing Pod and container fields are called the
_downward API_.
-->
这两种暴露 Pod 和容器字段的方式统称为 **Downward API**。

<!-- body -->

<!--
## Available fields

Only some Kubernetes API fields are available through the downward API. This
section lists which fields you can make available.
-->
## 可用字段  {#available-fields}

只有部分 Kubernetes API 字段可以通过 Downward API 使用。本节列出了你可以使用的字段。

<!--
You can pass information from available Pod-level fields using `fieldRef`.
At the API level, the `spec` for a Pod always defines at least one
[Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container).
You can pass information from available Container-level fields using
`resourceFieldRef`.
-->
你可以使用 `fieldRef` 传递来自可用的 Pod 级字段的信息。在 API 层面，一个 Pod 的
`spec` 总是定义了至少一个 [Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)。
你可以使用 `resourceFieldRef` 传递来自可用的 Container 级字段的信息。

<!--
### Information available via `fieldRef` {#downwardapi-fieldRef}

For some Pod-level fields, you can provide them to a container either as
an environment variable or using a `downwardAPI` volume. The fields available
via either mechanism are:
-->
### 可通过 `fieldRef` 获得的信息  {#downwardapi-fieldRef}

对于某些 Pod 级别的字段，你可以将它们作为环境变量或使用 `downwardAPI` 卷提供给容器。
通过这两种机制可用的字段有：

<!--
`metadata.name`
: the pod's name
-->
`metadata.name`
: Pod 的名称

<!--
`metadata.namespace`
: the pod's {{< glossary_tooltip text="namespace" term_id="namespace" >}}
-->
`metadata.namespace`
: Pod 的{{< glossary_tooltip text="命名空间" term_id="namespace" >}}

<!--
`metadata.uid`
: the pod's unique ID
-->
`metadata.uid`
: Pod 的唯一 ID

<!--
`metadata.annotations['<KEY>']`
: the value of the pod's {{< glossary_tooltip text="annotation" term_id="annotation" >}} named `<KEY>` (for example, `metadata.annotations['myannotation']`)
-->
`metadata.annotations['<KEY>']`
: Pod 的{{< glossary_tooltip text="注解" term_id="annotation" >}} `<KEY>` 的值（例如：`metadata.annotations['myannotation']`）

<!--
`metadata.labels['<KEY>']`
: the text value of the pod's {{< glossary_tooltip text="label" term_id="label" >}} named `<KEY>` (for example, `metadata.labels['mylabel']`)
-->
`metadata.labels['<KEY>']`
: Pod 的{{< glossary_tooltip text="标签" term_id="label" >}} `<KEY>` 的值（例如：`metadata.labels['mylabel']`）

<!--
The following information is available through environment variables
**but not as a downwardAPI volume fieldRef**:
-->
以下信息可以通过环境变量获得，但**不能作为 `downwardAPI` 卷 `fieldRef`** 获得：

<!--
`spec.serviceAccountName`
: the name of the pod's {{< glossary_tooltip text="service account" term_id="service-account" >}}
-->
`spec.serviceAccountName`
: Pod 的{{< glossary_tooltip text="服务账号" term_id="service-account" >}}名称

<!--
`spec.nodeName`
: the name of the {{< glossary_tooltip term_id="node" text="node">}} where the Pod is executing
-->
`spec.nodeName`
: Pod 运行时所处的{{< glossary_tooltip term_id="node" text="节点">}}名称

<!--
`status.hostIP`
: the primary IP address of the node to which the Pod is assigned
-->
`status.hostIP`
: Pod 所在节点的主 IP 地址

<!--
`status.hostIPs`
: the IP addresses is a dual-stack version of `status.hostIP`, the first is always the same as `status.hostIP`.
-->
`status.hostIPs`
: 这组 IP 地址是 `status.hostIP` 的双协议栈版本，第一个 IP 始终与 `status.hostIP` 相同。

<!--
`status.podIP`
: the pod's primary IP address (usually, its IPv4 address)
-->
`status.podIP`
: Pod 的主 IP 地址（通常是其 IPv4 地址）

<!--
`status.podIPs`
: the IP addresses is a dual-stack version of `status.podIP`, the first is always the same as `status.podIP`
-->
`status.podIPs`
: 这组 IP 地址是 `status.podIP` 的双协议栈版本, 第一个 IP 始终与 `status.podIP` 相同。

<!--
The following information is available through a `downwardAPI` volume 
`fieldRef`, **but not as environment variables**:
-->
以下信息可以通过 `downwardAPI` 卷 `fieldRef` 获得，但**不能作为环境变量**获得：

<!--
`metadata.labels`
: all of the pod's labels, formatted as `label-key="escaped-label-value"` with one label per line
-->
`metadata.labels`
: Pod 的所有标签，格式为 `标签键名="转义后的标签值"`，每行一个标签

<!--
`metadata.annotations`
: all of the pod's annotations, formatted as `annotation-key="escaped-annotation-value"` with one annotation per line  
-->
`metadata.annotations`
: Pod 的全部注解，格式为 `注解键名="转义后的注解值"`，每行一个注解

<!--
### Information available via `resourceFieldRef` {#downwardapi-resourceFieldRef}

These container-level fields allow you to provide information about
[requests and limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
for resources such as CPU and memory.
-->
### 可通过 `resourceFieldRef` 获得的信息  {#downwardapi-resourceFieldRef}

<!--
`resource: limits.cpu`
: A container's CPU limit
-->
`resource: limits.cpu`
: 容器的 CPU 限制值

<!--
`resource: requests.cpu`
: A container's CPU request
-->
`resource: requests.cpu`
: 容器的 CPU 请求值

<!--
`resource: limits.memory`
: A container's memory limit
-->
`resource: limits.memory`
: 容器的内存限制值

<!--
`resource: requests.memory`
: A container's memory request
-->
`resource: requests.memory`
: 容器的内存请求值

<!--
`resource: limits.hugepages-*`
: A container's hugepages limit
-->
`resource: limits.hugepages-*`
: 容器的巨页限制值

<!--
`resource: requests.hugepages-*`
: A container's hugepages request
-->
`resource: requests.hugepages-*`
: 容器的巨页请求值

<!--
`resource: limits.ephemeral-storage`
: A container's ephemeral-storage limit
-->
`resource: limits.ephemeral-storage`
: 容器的临时存储的限制值

<!--
`resource: requests.ephemeral-storage`
: A container's ephemeral-storage request
-->
`resource: requests.ephemeral-storage`
: 容器的临时存储的请求值

<!--
#### Fallback information for resource limits

If CPU and memory limits are not specified for a container, and you use the
downward API to try to expose that information, then the
kubelet defaults to exposing the maximum allocatable value for CPU and memory
based on the [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
calculation.
-->
#### 资源限制的后备信息  {#fallback-information-for-resource-limits}

如果没有为容器指定 CPU 和内存限制时尝试使用 Downward API 暴露该信息，那么 kubelet 默认会根据
[节点可分配资源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
计算并暴露 CPU 和内存的最大可分配值。


## {{% heading "whatsnext" %}}

<!--
You can read about [`downwardAPI` volumes](/docs/concepts/storage/volumes/#downwardapi).

You can try using the downward API to expose container- or Pod-level information:
* as [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* as [files in `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
-->
你可以阅读有关 [`downwardAPI` 卷](/zh-cn/docs/concepts/storage/volumes/#downwardapi)的内容。

你可以尝试使用 Downward API 暴露容器或 Pod 级别的信息：
* 作为[环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 作为 [`downwardAPI` 卷中的文件](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
