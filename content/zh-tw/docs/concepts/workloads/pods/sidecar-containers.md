---
title: 邊車容器
content_type: concept
weight: 50
---
<!--
title: Sidecar Containers
content_type: concept
weight: 50
-->

<!-- overview -->
{{< feature-state feature_gate_name="SidecarContainers" >}}

<!--
Sidecar containers are the secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the primary _app
container_ by providing additional services, or functionality such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.
-->
邊車容器是與**主應用容器**在同一個 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中運行的輔助容器。
這些容器通過提供額外的服務或功能（如日誌記錄、監控、安全性或資料同步）來增強或擴展主應用容器的功能，
而無需直接修改主應用代碼。

<!--
Typically, you only have one app container in a Pod. For example, if you have a web
application that requires a local webserver, the local webserver is a sidecar and the
web application itself is the app container.
-->
通常，一個 Pod 中只有一個應用容器。
例如，如果你有一個需要本地 Web 伺服器的 Web 應用，
則本地 Web 伺服器以邊車容器形式運行，而 Web 應用本身以應用容器形式運行。

<!-- body -->

<!--
## Sidecar containers in Kubernetes {#pod-sidecar-containers}

Kubernetes implements sidecar containers as a special case of
[init containers](/docs/concepts/workloads/pods/init-containers/); sidecar containers remain
running after Pod startup. This document uses the term _regular init containers_ to clearly
refer to containers that only run during Pod startup.
-->
## Kubernetes 中的邊車容器   {#pod-sidecar-containers}

Kubernetes 將邊車容器作爲
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)的一個特例來實現，
Pod 啓動後，邊車容器仍保持運行狀態。
本文檔使用術語"常規 Init 容器"來明確指代僅在 Pod 啓動期間運行的容器。

<!--
Provided that your cluster has the `SidecarContainers`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled
(the feature is active by default since Kubernetes v1.29), you can specify a `restartPolicy`
for containers listed in a Pod's `initContainers` field.
These restartable _sidecar_ containers are independent from other init containers and from
the main application container(s) within the same pod.
These can be started, stopped, or restarted without affecting the main application container
and other init containers.
-->
如果你的叢集啓用了 `SidecarContainers`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
（該特性自 Kubernetes v1.29 起預設啓用），你可以爲 Pod 的 `initContainers`
字段中列出的容器指定 `restartPolicy`。
這些可重新啓動的**邊車（Sidecar）** 容器獨立於其他 Init 容器以及同一 Pod 內的主應用容器，
這些容器可以啓動、停止和重新啓動，而不會影響主應用容器和其他 Init 容器。

<!--
You can also run a Pod with multiple containers that are not marked as init or sidecar
containers. This is appropriate if the containers within the Pod are required for the
Pod to work overall, but you don't need to control which containers start or stop first.
You could also do this if you need to support older versions of Kubernetes that don't
support a container-level `restartPolicy` field.
-->
你還可以運行包含多個未標記爲 Init 或邊車容器的 Pod。
如果作爲一個整體而言，某個 Pod 中的所有容器都要運行，但你不需要控制哪些容器先啓動或停止，那麼這種設置是合適的。
如果你使用的是不支持容器級 `restartPolicy` 字段的舊版本 Kubernetes，你也可以這樣做。

<!--
### Example application {#sidecar-example}

Here's an example of a Deployment with two containers, one of which is a sidecar:
-->
### 應用示例   {#sidecar-example}

下面是一個包含兩個容器的 Deployment 示例，其中一個容器是邊車形式：

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

<!--
## Sidecar containers and Pod lifecycle

If an init container is created with its `restartPolicy` set to `Always`, it will
start and remain running during the entire life of the Pod. This can be helpful for
running supporting services separated from the main application containers.
-->
## 邊車容器和 Pod 生命週期   {#sidecar-containers-and-pod-lifecyle}

如果創建 Init 容器時將 `restartPolicy` 設置爲 `Always`，
則它將在整個 Pod 的生命週期內啓動並持續運行。這對於運行與主應用容器分離的支持服務非常有幫助。

<!--
If a `readinessProbe` is specified for this init container, its result will be used
to determine the `ready` state of the Pod.

Since these containers are defined as init containers, they benefit from the same
ordering and sequential guarantees as other init containers, allowing them to mix
sidecar containers with regular init containers for complex Pod initialization flows.
-->
如果爲此 Init 容器指定了 `readinessProbe`，其結果將用於確定 Pod 的 `ready` 狀態。

由於這些容器被定義爲 Init 容器，所以它們享有與其他 Init 容器相同的順序和按序執行保證，
從而允許將邊車容器與常規 Init 容器混合使用，支持複雜的 Pod 初始化流程。

<!--
Compared to regular init containers, sidecars defined within `initContainers` continue to
run after they have started. This is important when there is more than one entry inside
`.spec.initContainers` for a Pod. After a sidecar-style init container is running (the kubelet
has set the `started` status for that init container to true), the kubelet then starts the
next init container from the ordered `.spec.initContainers` list.
That status either becomes true because there is a process running in the
container and no startup probe defined, or as a result of its `startupProbe` succeeding.
-->
與常規 Init 容器相比，在 `initContainers` 中定義的邊車容器在啓動後繼續運行。
當 Pod 的 `.spec.initContainers` 中有多個條目時，這一點非常重要。
在邊車風格的 Init 容器運行後（kubelet 將該 Init 容器的 `started` 狀態設置爲 true），
kubelet 啓動 `.spec.initContainers` 這一有序列表中的下一個 Init 容器。
該狀態要麼因爲容器中有一個正在運行的進程且沒有定義啓動探針而變爲 true，
要麼是其 `startupProbe` 成功而返回的結果。

<!--
Upon Pod [termination](/docs/concepts/workloads/pods/pod-lifecycle/#termination-with-sidecars),
the kubelet postpones terminating sidecar containers until the main application container has fully stopped.
The sidecar containers are then shut down in the opposite order of their appearance in the Pod specification.
This approach ensures that the sidecars remain operational, supporting other containers within the Pod,
until their service is no longer required.
-->
在 Pod [終止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#termination-with-sidecars)時，
kubelet 會推遲終止邊車容器，直到主應用容器已完全停止。邊車容器隨後將按照它們在 Pod 規約中出現的相反順序被關閉。
這種方法確保了在不再需要邊車服務之前這些邊車繼續發揮作用，以支持 Pod 內的其他容器。

<!--
### Jobs with sidecar containers
-->
### 帶邊車容器的 Job {#jobs-with-sidecar-containers}

<!--
If you define a Job that uses sidecar using Kubernetes-style init containers,
the sidecar container in each Pod does not prevent the Job from completing after the
main container has finished.

Here's an example of a Job with two containers, one of which is a sidecar:
-->
如果你定義 Job 時使用基於 Kubernetes 風格 Init 容器的邊車容器，
各個 Pod 中的邊車容器不會阻止 Job 在主容器結束後進入完成狀態。

以下是一個具有兩個容器的 Job 示例，其中一個是邊車：

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

<!--
## Differences from application containers

Sidecar containers run alongside _app containers_ in the same pod. However, they do not
execute the primary application logic; instead, they provide supporting functionality to
the main application.
-->
## 與應用容器的區別   {#differences-from-application-containers}

邊車容器與同一 Pod 中的**應用容器**並行運行。不過邊車容器不執行主應用邏輯，而是爲主應用提供支持功能。

<!--
Sidecar containers have their own independent lifecycles. They can be started, stopped,
and restarted independently of app containers. This means you can update, scale, or
maintain sidecar containers without affecting the primary application.

Sidecar containers share the same network and storage namespaces with the primary
container. This co-location allows them to interact closely and share resources.
-->
邊車容器具有獨立的生命週期。它們可以獨立於應用容器啓動、停止和重啓。
這意味着你可以更新、擴展或維護邊車容器，而不影響主應用。

邊車容器與主容器共享相同的網路和儲存命名空間。這種共存使它們能夠緊密交互並共享資源。

<!--
From a Kubernetes perspective, the sidecar container's graceful termination is less important.
When other containers take all allotted graceful termination time, the sidecar containers
will receive the `SIGTERM` signal, followed by the `SIGKILL` signal, before they have time to terminate gracefully.
So exit codes different from `0` (`0` indicates successful exit), for sidecar containers are normal
on Pod termination and should be generally ignored by the external tooling.
-->
從 Kubernetes 的角度來看，邊車容器的體面終止（Graceful Termination）相對不那麼重要。
當其他容器耗盡了分配的體面終止時間後，邊車容器將在尚未完成體面終止時間的情況下接收到 `SIGTERM` 信號，隨後是 `SIGKILL` 信號。
因此，在 Pod 終止時，邊車容器退出碼不爲 `0`（`0` 表示成功退出）是正常的，
通常應該被外部工具忽略。

<!--
## Differences from init containers

Sidecar containers work alongside the main container, extending its functionality and
providing additional services.
-->
## 與 Init 容器的區別   {#differences-from-init-containers}

邊車容器與主容器並行工作，擴展其功能並提供附加服務。

<!--
Sidecar containers run concurrently with the main application container. They are active
throughout the lifecycle of the pod and can be started and stopped independently of the
main container. Unlike [init containers](/docs/concepts/workloads/pods/init-containers/),
sidecar containers support [probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) to control their lifecycle.
-->
邊車容器與主應用容器同時運行。它們在整個 Pod 的生命週期中都處於活動狀態，並且可以獨立於主容器啓動和停止。
與 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)不同，
邊車容器支持[探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)來控制其生命週期。

<!--
Sidecar containers can interact directly with the main application containers, because
like init containers they always share the same network, and can optionally also share
volumes (filesystems).

Init containers stop before the main containers start up, so init containers cannot
exchange messages with the app container in a Pod. Any data passing is one-way
(for example, an init container can put information inside an `emptyDir` volume).

Changing the image of a sidecar container will not cause the Pod to restart, but will
trigger a container restart.

## Resource sharing within containers
-->
邊車容器可以直接與主應用容器交互，因爲與 Init 容器一樣，
它們總是與應用容器共享相同的網路，並且還可以選擇共享卷（檔案系統）。

Init 容器在主容器啓動之前停止，因此 Init 容器無法與 Pod 中的應用容器交換消息。
所有資料傳遞都是單向的（例如，Init 容器可以將資訊放入 `emptyDir` 卷中）。

變更邊車容器的映像檔不會導致 Pod 重啓，但會觸發容器重啓。

## 容器內的資源共享   {#resource-sharing-within-containers}

{{< comment >}}
<!--
This section is also present in the [init containers](/docs/concepts/workloads/pods/init-containers/) page.
If you're editing this section, change both places.
-->
這部分內容也出現在 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)頁面上。
如果你正在編輯這部分內容，請同時修改兩處。
{{< /comment >}}

<!--
Given the order of execution for init, sidecar and app containers, the following rules
for resource usage apply:
-->
假如執行順序爲 Init 容器、邊車容器和應用容器，則關於資源用量適用以下規則：

<!--
* The highest of any particular resource request or limit defined on all init
  containers is the *effective init request/limit*. If any resource has no
  resource limit specified this is considered as the highest limit.
* The Pod's *effective request/limit* for a resource is the sum of
[pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/) and the higher of:
  * the sum of all non-init containers(app and sidecar containers) request/limit for a
  resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  init containers can reserve resources for initialization that are not used
  during the life of the Pod.
* The QoS (quality of service) tier of the Pod's *effective QoS tier* is the
  QoS tier for all init, sidecar and app containers alike.
-->
* 所有 Init 容器上定義的任何特定資源的 limit 或 request 的最大值，作爲
  Pod **有效初始 request/limit**。
  如果任何資源沒有指定資源限制，則被視爲最高限制。
* Pod 對資源的 **有效 limit/request** 是如下兩者中的較大者：
  * 所有應用容器對某個資源的 limit/request 之和
  * Init 容器中對某個資源的有效 limit/request
* 系統基於有效的 limit/request 完成調度，這意味着 Init 容器能夠爲初始化過程預留資源，
  而這些資源在 Pod 的生命週期中不再被使用。
* Pod 的 **有效 QoS 級別**，對於 Init 容器和應用容器而言是相同的。

<!--
Quota and limits are applied based on the effective Pod request and
limit.
-->
配額和限制適用於 Pod 的有效請求和限制值。

<!--
### Sidecar containers and Linux cgroups {#cgroups}

On Linux, resource allocations for Pod level control groups (cgroups) are based on the effective Pod
request and limit, the same as the scheduler.
-->
### 邊車容器和 Linux Cgroup   {#cgroups}

在 Linux 上，Pod Cgroup 的資源分配基於 Pod 級別的有效資源請求和限制，這一點與調度器相同。

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Adopt Sidecar Containers](/docs/tutorials/configuration/pod-sidecar-containers/)
* Read a blog post on [native sidecar containers](/blog/2023/08/25/native-sidecar-containers/).
* Read about [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* Learn about the [types of probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* Learn about [pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
-->
* 瞭解如何[採用邊車容器](/zh-cn/docs/tutorials/configuration/pod-sidecar-containers/)。
* 閱讀關於[原生邊車容器](/zh-cn/blog/2023/08/25/native-sidecar-containers/)的博文。
* 閱讀[如何創建具有 Init 容器的 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)。
* 瞭解[探針類型](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)：
  存活態探針、就緒態探針、啓動探針。
* 瞭解 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)。
