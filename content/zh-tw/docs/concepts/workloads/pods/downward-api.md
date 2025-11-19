---
title: Downward API
content_type: concept
weight: 170
description: >
  有兩種方法可以將 Pod 和容器字段暴露給運行中的容器：環境變量和由特殊卷類型承載的文件。
  這兩種暴露 Pod 和容器字段的方法統稱爲 Downward API。
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
對於容器來說，在不與 Kubernetes 過度耦合的情況下，擁有關於自身的信息有時是很有用的。
**Downward API** 允許容器在不使用 Kubernetes 客戶端或 API 服務器的情況下獲得自己或集羣的信息。

<!--
An example is an existing application that assumes a particular well-known
environment variable holds a unique identifier. One possibility is to wrap the
application, but that is tedious and error-prone, and it violates the goal of low
coupling. A better option would be to use the Pod's name as an identifier, and
inject the Pod's name into the well-known environment variable.
-->
例如，現有應用程序假設某特定的周知的環境變量是存在的，其中包含唯一標識符。
一種方法是對應用程序進行封裝，但這很繁瑣且容易出錯，並且違背了低耦合的目標。
更好的選擇是使用 Pod 名稱作爲標識符，並將 Pod 名稱注入到周知的環境變量中。

<!--
In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* as [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* as [files in a `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
-->
在 Kubernetes 中，有兩種方法可以將 Pod 和容器字段暴露給運行中的容器：

* 作爲[環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 作爲 [`downwardAPI` 卷中的文件](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

<!--
Together, these two ways of exposing Pod and container fields are called the
_downward API_.
-->
這兩種暴露 Pod 和容器字段的方式統稱爲 **Downward API**。

<!-- body -->

<!--
## Available fields

Only some Kubernetes API fields are available through the downward API. This
section lists which fields you can make available.
-->
## 可用字段  {#available-fields}

只有部分 Kubernetes API 字段可以通過 Downward API 使用。本節列出了你可以使用的字段。

<!--
You can pass information from available Pod-level fields using `fieldRef`.
At the API level, the `spec` for a Pod always defines at least one
[Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container).
You can pass information from available Container-level fields using
`resourceFieldRef`.
-->
你可以使用 `fieldRef` 傳遞來自可用的 Pod 級字段的信息。在 API 層面，一個 Pod 的
`spec` 總是定義了至少一個 [Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)。
你可以使用 `resourceFieldRef` 傳遞來自可用的 Container 級字段的信息。

<!--
### Information available via `fieldRef` {#downwardapi-fieldRef}

For some Pod-level fields, you can provide them to a container either as
an environment variable or using a `downwardAPI` volume. The fields available
via either mechanism are:
-->
### 可通過 `fieldRef` 獲得的信息  {#downwardapi-fieldRef}

對於某些 Pod 級別的字段，你可以將它們作爲環境變量或使用 `downwardAPI` 卷提供給容器。
通過這兩種機制可用的字段有：

<!--
`metadata.name`
: the pod's name
-->
`metadata.name`
: Pod 的名稱

<!--
`metadata.namespace`
: the pod's {{< glossary_tooltip text="namespace" term_id="namespace" >}}
-->
`metadata.namespace`
: Pod 的{{< glossary_tooltip text="命名空間" term_id="namespace" >}}

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
: Pod 的{{< glossary_tooltip text="註解" term_id="annotation" >}} `<KEY>` 的值（例如：`metadata.annotations['myannotation']`）

<!--
`metadata.labels['<KEY>']`
: the text value of the pod's {{< glossary_tooltip text="label" term_id="label" >}} named `<KEY>` (for example, `metadata.labels['mylabel']`)
-->
`metadata.labels['<KEY>']`
: Pod 的{{< glossary_tooltip text="標籤" term_id="label" >}} `<KEY>` 的值（例如：`metadata.labels['mylabel']`）

<!--
The following information is available through environment variables
**but not as a downwardAPI volume fieldRef**:
-->
以下信息可以通過環境變量獲得，但**不能作爲 `downwardAPI` 卷 `fieldRef`** 獲得：

<!--
`spec.serviceAccountName`
: the name of the pod's {{< glossary_tooltip text="service account" term_id="service-account" >}}
-->
`spec.serviceAccountName`
: Pod 的{{< glossary_tooltip text="服務賬號" term_id="service-account" >}}名稱

<!--
`spec.nodeName`
: the name of the {{< glossary_tooltip term_id="node" text="node">}} where the Pod is executing
-->
`spec.nodeName`
: Pod 運行時所處的{{< glossary_tooltip term_id="node" text="節點">}}名稱

<!--
`status.hostIP`
: the primary IP address of the node to which the Pod is assigned
-->
`status.hostIP`
: Pod 所在節點的主 IP 地址

<!--
`status.hostIPs`
: the IP addresses is a dual-stack version of `status.hostIP`, the first is always the same as `status.hostIP`.
-->
`status.hostIPs`
: 這組 IP 地址是 `status.hostIP` 的雙協議棧版本，第一個 IP 始終與 `status.hostIP` 相同。

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
: 這組 IP 地址是 `status.podIP` 的雙協議棧版本, 第一個 IP 始終與 `status.podIP` 相同。

<!--
The following information is available through a `downwardAPI` volume 
`fieldRef`, **but not as environment variables**:
-->
以下信息可以通過 `downwardAPI` 卷 `fieldRef` 獲得，但**不能作爲環境變量**獲得：

<!--
`metadata.labels`
: all of the pod's labels, formatted as `label-key="escaped-label-value"` with one label per line
-->
`metadata.labels`
: Pod 的所有標籤，格式爲 `標籤鍵名="轉義後的標籤值"`，每行一個標籤

<!--
`metadata.annotations`
: all of the pod's annotations, formatted as `annotation-key="escaped-annotation-value"` with one annotation per line  
-->
`metadata.annotations`
: Pod 的全部註解，格式爲 `註解鍵名="轉義後的註解值"`，每行一個註解

<!--
### Information available via `resourceFieldRef` {#downwardapi-resourceFieldRef}

These container-level fields allow you to provide information about
[requests and limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
for resources such as CPU and memory.
-->
### 可通過 `resourceFieldRef` 獲得的信息  {#downwardapi-resourceFieldRef}

這些容器級別的字段允許你提供關於
[請求和限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)
的資源（如 CPU 和內存）信息。

{{< note >}}
{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}
<!--
Container CPU and memory resources can be resized while the container is running.
If this happens, a downward API volume will be updated,
but environment variables will not be updated unless the container restarts.
See [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
for more details.
-->
容器的 CPU 和內存資源可以在容器運行時調整大小。
如果發生這種情況，Downward API 卷將會被更新，
但是環境變量不會被更新，除非容器重啓。
更多詳情請參見[調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)。
{{< /note >}}

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
: 容器的 CPU 請求值

<!--
`resource: limits.memory`
: A container's memory limit
-->
`resource: limits.memory`
: 容器的內存限制值

<!--
`resource: requests.memory`
: A container's memory request
-->
`resource: requests.memory`
: 容器的內存請求值

<!--
`resource: limits.hugepages-*`
: A container's hugepages limit
-->
`resource: limits.hugepages-*`
: 容器的巨頁限制值

<!--
`resource: requests.hugepages-*`
: A container's hugepages request
-->
`resource: requests.hugepages-*`
: 容器的巨頁請求值

<!--
`resource: limits.ephemeral-storage`
: A container's ephemeral-storage limit
-->
`resource: limits.ephemeral-storage`
: 容器的臨時存儲的限制值

<!--
`resource: requests.ephemeral-storage`
: A container's ephemeral-storage request
-->
`resource: requests.ephemeral-storage`
: 容器的臨時存儲的請求值

<!--
#### Fallback information for resource limits

If CPU and memory limits are not specified for a container, and you use the
downward API to try to expose that information, then the
kubelet defaults to exposing the maximum allocatable value for CPU and memory
based on the [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
calculation.
-->
#### 資源限制的後備信息  {#fallback-information-for-resource-limits}

如果沒有爲容器指定 CPU 和內存限制時嘗試使用 Downward API 暴露該信息，那麼 kubelet 默認會根據
[節點可分配資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
計算並暴露 CPU 和內存的最大可分配值。

## {{% heading "whatsnext" %}}

<!--
You can read about [`downwardAPI` volumes](/docs/concepts/storage/volumes/#downwardapi).

You can try using the downward API to expose container- or Pod-level information:
* as [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* as [files in `downwardAPI` volume](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
-->
你可以閱讀有關 [`downwardAPI` 卷](/zh-cn/docs/concepts/storage/volumes/#downwardapi)的內容。

你可以嘗試使用 Downward API 暴露容器或 Pod 級別的信息：
* 作爲[環境變量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 作爲 [`downwardAPI` 卷中的文件](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
