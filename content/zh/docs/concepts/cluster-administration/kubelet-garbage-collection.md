---
title: 配置 kubelet 垃圾回收策略
content_template: templates/concept
weight: 70
---

<!--
title: Configuring kubelet Garbage Collection
content_template: templates/concept
weight: 70
-->

{{% capture overview %}}

<!--
Garbage collection is a helpful function of kubelet that will clean up unused images and unused containers. Kubelet will perform garbage collection for containers every minute and garbage collection for images every five minutes.
-->

垃圾回收是 kubelet 的一个有用功能，它将清理未使用的镜像和容器。Kubelet 将每分钟对容器执行一次垃圾回收，每五分钟对镜像执行一次垃圾回收。


不建议使用外部垃圾收集工具，因为这些工具可能会删除原本期望存在的容器进而破坏 kubelet 的行为。

<!--
External garbage collection tools are not recommended as these tools can potentially break the behavior of kubelet by removing containers expected to exist.
-->

{{% /capture %}}


{{% capture body %}}

## 镜像回收

<!--
## Image Collection
-->

Kubernetes 借助于 cadvisor 通过 imageManager 来管理所有镜像的生命周期。

<!--
Kubernetes manages lifecycle of all images through imageManager, with the cooperation
of cadvisor.
-->

镜像垃圾回收策略只考虑两个因素：`HighThresholdPercent` 和 `LowThresholdPercent`。
磁盘使用率超过上限阈值（HighThresholdPercent）将触发垃圾回收。
垃圾回收将删除最近最少使用的镜像，直到磁盘使用率满足下限阈值（LowThresholdPercent）。

<!--
The policy for garbage collecting images takes two factors into consideration:
`HighThresholdPercent` and `LowThresholdPercent`. Disk usage above the high threshold
will trigger garbage collection. The garbage collection will delete least recently used images until the low
threshold has been met.
-->

## 容器回收

<!--
## Container Collection
-->

容器垃圾回收策略考虑三个用户定义变量。`MinAge` 是容器可以被执行垃圾回收的最小生命周期。`MaxPerPodContainer` 是每个 pod 内允许存在的死亡容器的最大数量。
`MaxContainers` 是全部死亡容器的最大数量。可以分别独立地通过将 `MinAge` 设置为 0，以及将 `MaxPerPodContainer` 和 `MaxContainers` 设置为小于 0 来禁用这些变量。
<!--
The policy for garbage collecting containers considers three user-defined variables. `MinAge` is the minimum age at which a container can be garbage collected. `MaxPerPodContainer` is the maximum number of dead containers every single
pod (UID, container name) pair is allowed to have. `MaxContainers` is the maximum number of total dead containers. These variables can be individually disabled by setting `MinAge` to zero and setting `MaxPerPodContainer` and `MaxContainers` respectively to less than zero.
-->

Kubelet 将处理无法辨识的、已删除的以及超出前面提到的参数所设置范围的容器。最老的容器通常会先被移除。
`MaxPerPodContainer` 和 `MaxContainer` 在某些场景下可能会存在冲突，例如在保证每个 pod 内死亡容器的最大数量（`MaxPerPodContainer`）的条件下可能会超过允许存在的全部死亡容器的最大数量（`MaxContainer`）。
`MaxPerPodContainer` 在这种情况下会被进行调整：最坏的情况是将 `MaxPerPodContainer` 降级为 1，并驱逐最老的容器。
此外，pod 内已经被删除的容器一旦年龄超过 `MinAge` 就会被清理。

<!--
Kubelet will act on containers that are unidentified, deleted, or outside of the boundaries set by the previously mentioned flags. The oldest containers will generally be removed first. `MaxPerPodContainer` and `MaxContainer` may potentially conflict with each other in situations where retaining the maximum number of containers per pod (`MaxPerPodContainer`) would go outside the allowable range of global dead containers (`MaxContainers`). `MaxPerPodContainer` would be adjusted in this situation: A worst case scenario would be to downgrade `MaxPerPodContainer` to 1 and evict the oldest containers. Additionally, containers owned by pods that have been deleted are removed once they are older than `MinAge`.
-->

不被 kubelet 管理的容器不受容器垃圾回收的约束。

<!--
Containers that are not managed by kubelet are not subject to container garbage collection.
-->

## 用户配置

<!--
## User Configuration
-->

用户可以使用以下 kubelet 参数调整相关阈值来优化镜像垃圾回收：

<!--
Users can adjust the following thresholds to tune image garbage collection with the following kubelet flags :
-->

<!--
1. `image-gc-high-threshold`, the percent of disk usage which triggers image garbage collection.
Default is 85%.

2. `image-gc-low-threshold`, the percent of disk usage to which image garbage collection attempts
to free. Default is 80%.
-->

1. `image-gc-high-threshold`，触发镜像垃圾回收的磁盘使用率百分比。默认值为 85%。

2. `image-gc-low-threshold`，镜像垃圾回收试图释放资源后达到的磁盘使用率百分比。默认值为 80%。

我们还允许用户通过以下 kubelet 参数自定义垃圾收集策略：

<!--
We also allow users to customize garbage collection policy through the following kubelet flags:
-->

<!--
1. `minimum-container-ttl-duration`, minimum age for a finished container before it is
garbage collected. Default is 0 minute, which means every finished container will be garbage collected.

2. `maximum-dead-containers-per-container`, maximum number of old instances to be retained
per container. Default is 1.

3. `maximum-dead-containers`, maximum number of old instances of containers to retain globally.
Default is -1, which means there is no global limit.
-->

1. `minimum-container-ttl-duration`，完成的容器在被垃圾回收之前的最小年龄，默认是 0 分钟，这意味着每个完成的容器都会被执行垃圾回收。

2. `maximum-dead-containers-per-container`，每个容器要保留的旧实例的最大数量。默认值为 1。

3. `maximum-dead-containers`，要全局保留的旧容器实例的最大数量。默认值是 -1，这意味着没有全局限制。


<!--
Containers can potentially be garbage collected before their usefulness has expired. These containers
can contain logs and other data that can be useful for troubleshooting. A sufficiently large value for
`maximum-dead-containers-per-container` is highly recommended to allow at least 1 dead container to be
retained per expected container. A larger value for `maximum-dead-containers` is also recommended for a
similar reason.
-->

容器可能会在其效用过期之前被垃圾回收。这些容器可能包含日志和其他对故障诊断有用的数据。
强烈建议为 `maximum-dead-containers-per-container` 设置一个足够大的值，以便每个预期容器至少保留一个死亡容器。
由于同样的原因，`maximum-dead-containers` 也建议使用一个足够大的值。

查阅 [这个问题](https://github.com/kubernetes/kubernetes/issues/13287) 获取更多细节。

<!--
See [this issue](https://github.com/kubernetes/kubernetes/issues/13287) for more details.
-->

## 弃用

<!--
## Deprecation
-->

这篇文档中的一些 kubelet 垃圾收集（Garbage Collection）功能将在未来被 kubelet 驱逐回收（eviction）所替代。

<!--
Some kubelet Garbage Collection features in this doc will be replaced by kubelet eviction in the future.
-->

包括:

| 现存参数 | 新参数 | 解释 |
| ------------- | -------- | --------- |
| `--image-gc-high-threshold` | `--eviction-hard` 或 `--eviction-soft` | 现存的驱逐回收信号可以触发镜像垃圾回收 |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` | 驱逐回收实现相同行为 |
| `--maximum-dead-containers` | | 一旦旧日志存储在容器上下文之外，就会被弃用 |
| `--maximum-dead-containers-per-container` | | 一旦旧日志存储在容器上下文之外，就会被弃用 |
| `--minimum-container-ttl-duration` | | 一旦旧日志存储在容器上下文之外，就会被弃用 |
| `--low-diskspace-threshold-mb` | `--eviction-hard` or `eviction-soft` | 驱逐回收将磁盘阈值泛化到其他资源 |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` | 驱逐回收将磁盘压力转换到其他资源 |

<!--
Including:

| Existing Flag | New Flag | Rationale |
| ------------- | -------- | --------- |
| `--image-gc-high-threshold` | `--eviction-hard` or `--eviction-soft` | existing eviction signals can trigger image garbage collection |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` | eviction reclaims achieve the same behavior |
| `--maximum-dead-containers` | | deprecated once old logs are stored outside of container's context |
| `--maximum-dead-containers-per-container` | | deprecated once old logs are stored outside of container's context |
| `--minimum-container-ttl-duration` | | deprecated once old logs are stored outside of container's context |
| `--low-diskspace-threshold-mb` | `--eviction-hard` or `eviction-soft` | eviction generalizes disk thresholds to other resources |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` | eviction generalizes disk pressure transition to other resources |
-->

{{% /capture %}}

{{% capture whatsnext %}}

查阅 [配置驱逐回收资源的策略](/docs/tasks/administer-cluster/out-of-resource/) 获取更多细节。

<!--
See [Configuring Out Of Resource Handling](/docs/tasks/administer-cluster/out-of-resource/) for more details.
-->

{{% /capture %}}
