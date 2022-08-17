---
title: Downward API
content_type: concept
description: >
  有两种方法获取正在运行容器的字段及Pod:环境变量和由特殊卷类型填充的文件。
  这两种获取Pod和容器字段的方法统称为 downward API。
---
<!--
title: Downward API
content_type: concept
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

An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error-prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.

In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* as [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* as [files in a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the
_downward API_.
-->
有时，容器获取关于自身的信息不需要与Kubernetes过度耦合是很有用的。Downward API允许容器在不使用Kubernetes客户端或API服务器的情况下获取关于自身或集群的信息。

一个例子是现有的应用程序，它假设一个拥有唯一标识符的环境变量。一种方式是包装这个应用程序，但这既繁琐又容易出错，而且违反了低耦合的目标。更好的选择是使用Pod名称作为标识符，然后将Pod名称引入到已知的环境变量中。
在Kubernetes中，有两种方法可以获取正在运行的容器的Pod和容器字段：

* 作为环境变量(/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* 作为downwardAPI卷中的文件(/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

这两种获取Pod和容器字段的方法统称为downward API。

<!-- body -->

<!--
## Available fields

Only some Kubernetes API fields are available through the downward API. This
section lists which fields you can make available.
-->
##可用字段

只有一些Kubernetes API字段通过downward API是可用的。
本节列出了可以使用的字段。

<!--
You can pass information from available Pod-level fields using `fieldRef`.
At the API level, the `spec` for a Pod always defines at least one
[Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container).
You can pass information from available Container-level fields using
`resourceFieldRef`.
-->
您可以使用“fieldRef”从可用的Pod级别字段传递信息。
在API级别，Pod的“spec”总是至少定义一个。
[Container]（/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container）。
您可以使用以下命令从可用的容器级字段传递信息：

<!--
### Information available via `fieldRef` {#downwardapi-fieldRef}

For most Pod-level fields, you can provide them to a container either as
an environment variable or using a `downwardAPI` volume. The fields available
via either mechanism are:
-->
###可通过“fieldRef”{downwardapi fieldRef}的信息
对于大多数Pod级字段，您可以将它们作为环境变量或使用downwardAPI卷提供给容器。可以通过任一机制可用的字段为：

<!--
`metadata.name`
: the pod's name
-->
`metadata.name`
: pod的名字

<!--
`metadata.namespace`
: the pod's {{< glossary_tooltip text="namespace" term_id="namespace" >}}
-->
`metadata.namespace`
: pod的{{< glossary_tooltip text="namespace" term_id="namespace" >}}

<!--
`metadata.uid`
: the pod's unique ID
-->

`metadata.uid`
: pod的唯一ID
<!--
`metadata.annotations['<KEY>']`
: the value of the pod's {{< glossary_tooltip text="annotation" term_id="annotation" >}} named `<KEY>` (for example, `metadata.annotations['myannotation']`)
-->
`metadata.annotations['<KEY>']`
: pod的{{< glossary_tooltip text="annotation" term_id="annotation" >}} named `<KEY>` (for example, `metadata.annotations['myannotation']`)值

<!--
`metadata.labels['<KEY>']`
: the text value of the pod's {{< glossary_tooltip text="label" term_id="label" >}} named `<KEY>` (for example, `metadata.labels['mylabel']`)
-->
`metadata.labels['<KEY>']`
: pod的{{< glossary_tooltip text="label" term_id="label" >}} named `<KEY>` (for example, `metadata.labels['mylabel']`)文本值

<!--
`spec.serviceAccountName`
: the name of the pod's {{< glossary_tooltip text="service account" term_id="service-account" >}}
-->
`spec.serviceAccountName`
: pod的{{< glossary_tooltip text="service account" term_id="service-account" >}}名字

<!--
`spec.nodeName`
: the name of the {{< glossary_tooltip term_id="node" text="node">}} where the Pod is executing
-->
`spec.nodeName`
: Pod正在执行的{{< glossary_tooltip term_id="node" text="node">}}名字

<!--
`status.hostIP`
: the primary IP address of the node to which the Pod is assigned
-->
`status.hostIP`
: 分配给Pod的节点主IP地址

<!--
`status.podIP`
: the pod's primary IP address (usually, its IPv4 address)
-->
`status.podIP`
: pod的主IP地址 (通常, 它是指IPv4地址)

<!--
In addition, the following information is available through
a `downwardAPI` volume `fieldRef`, but **not as environment variables**:
-->
此外，以下信息是可以通过downward API卷，但**不作为环境变量**的`fieldRef`：

<!--
`metadata.labels`
: all of the pod's labels, formatted as `label-key="escaped-label-value"` with one label per line
-->
`metadata.labels`
: pod的所有标签，格式为'label key=“escaped label value”'，每行一个标签

<!--
`metadata.annotations`
: all of the pod's annotations, formatted as `annotation-key="escaped-annotation-value"` with one annotation per line  
-->
`metadata.annotations`
: pod的所有注释，格式为“annotation key=”escaped annotation value“，每行一个注释

<!--
### Information available via `resourceFieldRef` {#downwardapi-resourceFieldRef}

These container-level fields allow you to provide information about
[requests and limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
for resources such as CPU and memory.
-->
###可通过`resourceFieldRef`#downwardapi resourceFieldRef｝的信息

这些容器级字段允许您为CPU和内存等资源提供有关[requests and limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)的信息。

<!--

`resource: limits.cpu`
: A container's CPU limit
-->
`resource: limits.cpu`
: 容器的CPU限制

<!--
`resource: requests.cpu`
: A container's CPU request
-->
`resource: requests.cpu`
:容器的CPU请求

<!--
`resource: limits.memory`
: A container's memory limit
-->
`resource: limits.memory`
: 容器的内存限制

<!--
`resource: requests.memory`
: A container's memory request
-->
`resource: requests.memory`
: 容器的内存请求

<!--
`resource: limits.hugepages-*`
: A container's hugepages limit (provided that the `DownwardAPIHugePages` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled)
-->
`resource: limits.hugepages-*`
: 容器的hugepages限制(只要`DownwardAPIHugePages` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)被启用)

<!--
`resource: requests.hugepages-*`
: A container's hugepages request (provided that the `DownwardAPIHugePages` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled)
-->
`resource: requests.hugepages-*`
: 容器的hugepages请求(只要`DownwardAPIHugePages` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)被启用)

<!--
`resource: limits.ephemeral-storage`
: A container's ephemeral-storage limit
-->
`resource: limits.ephemeral-storage`
: 容器的临时存储限制

<!--
`resource: requests.ephemeral-storage`
: A container's ephemeral-storage request
-->
`resource: requests.ephemeral-storage`
: 容器的临时存储请求

<!--
#### Fallback information for resource limits

If CPU and memory limits are not specified for a container, and you use the
downward API to try to expose that information, then the
kubelet defaults to exposing the maximum allocatable value for CPU and memory
based on the [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
calculation.
-->
####资源限制的回退信息

如果没有为容器指定CPU和内存限制，并且您使用downward API尝试获取该信息，然后，kubelet默认获取基于[node allocatable]（/docs/tasks/administrate cluster/reserve compute resources/#node allocable）计算出的CPU和内存的最大可分配值。

<!--
## {{% heading "whatsnext" %}}

You can read about [`downwardAPI` volumes](/docs/concepts/storage/volumes/#downwardapi).

You can try using the downward API to expose container- or Pod-level information:
* as [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* as [files in `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
-->a
您可以阅读[`downwardAPI` volumes](/docs/concepts/storage/volumes/#downwardapi)。

您可以尝试使用downward API获取容器或Pod级别的信息：
* 作为环境变量(/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#the-downward-api)
* 作为downwardAPI卷中的文件(/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

