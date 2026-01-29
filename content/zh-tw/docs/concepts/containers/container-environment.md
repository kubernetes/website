---
title: 容器環境
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
本頁描述了在容器環境裏容器可用的資源。

<!-- body -->

<!--
## Container environment

The Kubernetes Container environment provides several important resources to Containers:

* A filesystem, which is a combination of an [image](/docs/concepts/containers/images/) and one or more [volumes](/docs/concepts/storage/volumes/).
* Information about the Container itself.
* Information about other objects in the cluster.
-->
## 容器環境  {#container-environment}

Kubernetes 的容器環境給容器提供了幾個重要的資源：

* 檔案系統，其中包含一個[映像檔](/zh-cn/docs/concepts/containers/images/)
  和一個或多個的[卷](/zh-cn/docs/concepts/storage/volumes/)
* 容器自身的資訊
* 叢集中其他對象的資訊

<!--
### Container information

The *hostname* of a Container is the name of the Pod in which the Container is running.
It is available through the `hostname` command or the
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html)
function call in libc.

The Pod name and namespace are available as environment variables through the
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

User defined environment variables from the Pod definition are also available to the Container,
as are any environment variables specified statically in the container image.
-->
### 容器資訊

一個容器的 **hostname** 是該容器運行所在的 Pod 的名稱。通過 `hostname` 命令或者調用 libc 中的
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html) 函數可以獲取該名稱。

Pod 名稱和命名空間可以通過
[下行 API](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
轉換爲環境變量。

Pod 定義中的使用者所定義的環境變量也可在容器中使用，就像在 container 映像檔中靜態指定的任何環境變量一樣。

<!--
### Cluster information

A list of all services that were running when a Container was created is available to that Container as environment variables.
This list is limited to services within the same namespace as the new Container's Pod and Kubernetes control plane services.

For a service named *foo* that maps to a Container named *bar*,
the following variables are defined:
-->
### 叢集資訊

創建容器時正在運行的所有服務都可用作該容器的環境變量。
這裏的服務僅限於新容器的 Pod 所在的名字空間中的服務，以及 Kubernetes 控制面的服務。

對於名爲 **foo** 的服務，當映射到名爲 **bar** 的容器時，定義了以下變量：

```shell
FOO_SERVICE_HOST=<其上服務正運行的主機>
FOO_SERVICE_PORT=<其上服務正運行的端口>
```

<!--
Services have dedicated IP addresses and are available to the Container via DNS,
if [DNS addon](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/) is enabled. 
-->
服務具有專用的 IP 地址。如果啓用了
[DNS 插件](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/)，
可以在容器中通過 DNS 來訪問服務。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
-->
* 學習更多有關[容器生命週期回調](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/)的知識。
* 動手[爲容器的生命週期事件設置處理函數](/zh-cn/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。


