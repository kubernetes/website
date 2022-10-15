---
layout: blog
title: "Kubernetes 1.25：本地存储容量隔离达到GA"
date: 2022-09-19
slug: local-storage-capacity-isolation-ga
---
<!---
layout: blog
title: "Kubernetes 1.25: Local Storage Capacity Isolation Reaches GA"
date: 2022-09-19
slug: local-storage-capacity-isolation-ga
-->

<!--
**Author:** Jing Xu (Google)
-->
**作者：**
Jing Xu (Google)

<!--
Local ephemeral storage capacity isolation was introduced as a alpha feature in Kubernetes 1.7 and it went beta in 1.9. With Kubernetes 1.25 we are excited to announce general availability(GA) of this feature.

Pods use ephemeral local storage for scratch space, caching, and logs. The lifetime of local ephemeral storage does not extend beyond the life of the individual pod. It is exposed to pods using the container’s writable layer, logs directory, and `EmptyDir` volumes. Before this feature was introduced, there were issues related to the lack of local storage accounting and isolation, such as Pods not knowing how much local storage is available and being unable to request guaranteed local storage. Local storage is a best-effort resource and pods can be evicted due to other pods filling the local storage.

The [local storage capacity isolation feature](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage) allows users to manage local ephemeral storage in the same way as managing CPU and memory. It provides support for capacity isolation of shared storage between pods, such that a pod can be hard limited in its consumption of shared resources by evicting Pods if its consumption of shared storage exceeds that limit. It also allows setting ephemeral storage requests for resource reservation. The limits and requests for shared `ephemeral-storage` are similar to those for memory and CPU consumption.
-->
本地临时存储容量隔离在 Kubernetes 1.7 中作为 Alpha 功能被引入，在 1.9 中成为 Beta 功能。随着 Kubernetes 1.25 的推出，我们很高兴地宣布这一功能的普遍可用性（GA）。

Pods 使用临时的本地存储，用于抓取空间、缓存和日志。本地临时存储的寿命不会超过单个 Pod 的寿命。它通过容器的可写层、日志目录和 `EmptyDir` 卷暴露给 pod。在这个功能被引入之前，有些与缺乏本地存储计算和隔离有关的问题，例如 Pod 不知道有多少本地存储可用，也无法请求保证本地存储。本地存储是一种尽力而为的资源，Pod 可能会因为其他 Pod 填满本地存储而被驱逐。

[本地存储容量隔离功能](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage) 允许用户以管理 CPU 和内存的相同方式管理本地临时存储。它提供了对 pod 之间共享存储的容量隔离的支持，这样，如果一个 pod 对共享存储的消耗超过了这个限制，它就可以通过驱逐 Pod 来硬性限制其对共享资源的消耗。它还允许为资源预订设置临时的存储请求。共享 `ephemeral-storage` 的限制和请求与内存和 CPU 的消耗类似。

<!--
### How to use local storage capacity isolation

A typical configuration for local ephemeral storage is to place all different kinds of ephemeral local data (emptyDir volumes, writeable layers, container images, logs) into one filesystem. Typically, both /var/lib/kubelet and /var/log are on the system's root filesystem. If users configure the local storage in different ways, kubelet might not be able to correctly measure disk usage and use this feature.
-->
### 如何使用本地存储的容量隔离

本地临时存储的典型配置是将所有不同种类的本地临时数据（emptyDir 卷、可写层、容器镜像、日志）放入一个文件系统。通常，/var/lib/kubelet 和 /var/log 都在系统的根文件系统上。如果用户以不同的方式配置本地存储，kubelet 可能无法正确地测量磁盘的使用情况和使用这一功能。

<!--
#### Setting requests and limits for local ephemeral storage
You can specify `ephemeral-storage` for managing local ephemeral storage. Each container of a Pod can specify either or both of the following:
-->
### 设置本地临时存储的请求和限制
你可以指定 `ephemeral-storage` 来管理本地临时存储。一个 Pod 的每个容器都可以指定以下的一个或两个。

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

<!--
In the following example, the Pod has two containers. The first container has a request of 8GiB of local ephemeral storage and a limit of 12GiB. The second container requests 2GiB of local storage, but no limit setting. Therefore, the Pod requests a total of 10GiB (8GiB+2GiB) of local ephemeral storage and enforces a limit of 12GiB of local ephemeral storage. It also sets emptyDir sizeLimit to 5GiB. With this setting in pod spec, it will affect how the scheduler makes a decision on scheduling pods and also how kubelet evict pods.
-->
在下面的例子中，Pod 有两个容器。第一个容器请求 8GiB 的本地临时存储，限制为 12GiB。第二个容器请求 2GiB 的本地存储，但没有限制设置。因此，Pod 总共请求了 10GiB（ 8GiB+2GiB ）的本地瞬时存储，并执行了 12GiB 的本地瞬时存储限制。它还将 emptyDir sizeLimit 设置为 5GiB。在 pod spec 中的这一设置，将影响调度器对调度 pod 的决定，也会影响 kubelet 驱逐 pod 的方式。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "8Gi"
      limits:
        ephemeral-storage: "12Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir: {}
        sizeLimit: 5Gi
```

<!--
First of all, the scheduler ensures that the sum of the resource requests of the scheduled containers is less than the capacity of the node. In this case, the pod can be assigned to a node only if its available ephemeral storage (allocatable resource) has more than 10GiB.
-->
首先，调度器确保预定容器的资源请求之和小于节点的容量。在这种情况下，只有当一个节点的可用临时存储（可分配资源）超过 10GiB 时，才能将 pod 分配给该节点。


<!--
Secondly, at container level, since one of the container sets resource limit, kubelet eviction manager will measure the disk usage of this container and evict the pod if the storage usage of the first container exceeds its limit (12GiB). At pod level,  kubelet works out an overall Pod storage limit by
adding up the limits of all the containers in that Pod. In this case, the total storage usage at pod level is the sum of the disk usage from all containers plus the Pod's `emptyDir` volumes. If this total usage exceeds the overall Pod storage limit (12GiB), then the kubelet also marks the Pod for eviction.

Last, in this example, emptyDir volume sets its sizeLimit to 5Gi. It means that if this pod's emptyDir used up more local storage than 5GiB, the pod will be evicted from the node.
-->

其次，在容器级别，由于其中一个容器设置了资源限制，kubelet 驱逐管理器将测量这个容器的磁盘使用量，如果第一个容器的存储使用量超过其限制（12GiB），则驱逐 pod。在 pod 级别，kubelet 通过将所有容器的限制加起来，得出一个整体的 Pod 存储限制
将该 Pod 中的所有容器的限制加起来。在这种情况下，pod 级别的总存储用量是所有容器的磁盘用量加上 Pod 的 `emptyDir` 卷的总和。如果这个总用量超过了整个 Pod 的存储限制（12GiB），那么 kubelet 也会标记 Pod 为驱逐状态。

最后，在这个例子中，emptyDir 卷将其 sizeLimit 设为 5Gi。这意味着，如果这个 Pod 的 emptyDir 用掉了超过 5GiB 的本地存储，这个 Pod 将被从节点上驱逐。

<!--
#### Setting resource quota and limitRange for local ephemeral storage

This feature adds two more resource quotas for storage. The request and limit set constraints on the total requests/limits of all containers’ in a namespace.
-->

### 为本地临时存储设置资源配额和 limitRange

这个功能为存储增加了两个资源配额。请求和限制对一个命名空间中的所有容器的总请求/限制设置约束。

* `requests.ephemeral-storage`
* `limits.ephemeral-storage`

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storage-resources
spec:
  hard:
    requests.ephemeral-storage: "10Gi"
    limits.ephemeral-storage: "20Gi"
```

<!--
Similar to CPU and memory, admin could use LimitRange to set default container’s local storage request/limit, and/or minimum/maximum resource constraints for a namespace.
-->
与 CPU 和内存类似，管理员可以使用 LimitRange 来设置默认容器的本地存储请求/限制，和/或者命名空间的最小/最大资源限制。

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storage-limit-range
spec:
  limits:
  - default:
      ephemeral-storage: 10Gi
    defaultRequest:
      ephemeral-storage: 5Gi
    type: Container
```
<!--
Also, ephemeral-storage may be specified to reserve for kubelet or system. example, `--system-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=10Gi][,][pid=1000] --kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=5Gi][,][pid=1000]`. If your cluster node root disk capacity is 100Gi, after setting system-reserved and kube-reserved value, the available allocatable ephemeral storage would become 85Gi. The schedule will use this information to assign pods based on request and allocatable resources from each node. The eviction manager will also use allocatable resource to determine pod eviction. See more details from [Reserve Compute Resources for System Daemons](/docs/tasks/administer-cluster/reserve-compute-resources/).
-->
例如，`--system-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=10Gi][,][pid=1000] --kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=5Gi][, ] [pid=1000]` 如果你的集群节点根磁盘容量是 100Gi，在设置了系统保留值和 kube 保留值之后，可用的可分配的临时存储将变成 85Gi。计划表将使用这些信息，根据每个节点的请求和可分配的资源来分配 pod。驱逐管理器也将使用可分配的资源来确定 pod 的驱逐。请参阅 [为系统守护进程保留计算资源](/docs/tasks/administer-cluster/reserve-compute-resources/) 中的更多细节。

<!--
### How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

We offer a huge thank you to all the contributors in [Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage) and CSI community who helped review the design and implementation of the project, including but not limited to the following:</p><ul><li>Benjamin Elder (<a href=https://github.com/BenTheElder>BenTheElder</a>)</li><li>Michelle Au (<a href=https://github.com/msau42>msau42</a>)</li><li>Tim Hockin (<a href=https://github.com/thockin>thockin</a>)</li><li>Jordan Liggitt (<a href=https://github.com/liggitt>liggitt</a>)</li><li>Xing Yang (<a href=https://github.com/xing-yang>xing-yang</a>)</li>
-->
### 我如何参与？

这个项目，就像所有的 Kubernetes 一样，是许多来自不同背景的贡献者一起努力工作的结果。

我们非常感谢 [Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage) 和 CSI 社区的所有贡献者，他们帮助审查了该项目的设计和实施，包括但不限于以下人士:</p><ul><li>Benjamin Elder (<a href=https://github.com/BenTheElder>BenTheElder</a>)</li><li>Michelle Au (<a href=https://github.com/msau42>msau42</a>)</li><li>Tim Hockin (<a href=https://github.com/thockin>thockin</a>)</li><li>Jordan Liggitt (<a href=https://github.com/liggitt>liggitt</a>)</li><li>Xing Yang (<a href=https://github.com/xing-yang>xing-yang</a>)</li>
