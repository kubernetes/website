---
title: 管理巨頁（HugePage）
content_type: task
description: 將巨頁作爲叢集中的可調度資源來設定和管理
---
<!--
reviewers:
- derekwaynecarr
title: Manage HugePages
content_type: task
description: Configure and manage huge pages as a schedulable resource in a cluster.
--->

<!-- overview -->

{{< feature-state feature_gate_name="HugePages" >}}

<!--
Kubernetes supports the allocation and consumption of pre-allocated huge pages
by applications in a Pod. This page describes how users can consume huge pages.
--->
Kubernetes 支持在 Pod 應用中使用預先分配的巨頁。本文描述了使用者如何使用巨頁，以及當前的限制。

## {{% heading "prerequisites" %}}

<!--
Kubernetes nodes must
[pre-allocate huge pages](https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html)
in order for the node to report its huge page capacity.

A node can pre-allocate huge pages for multiple sizes, for instance,
the following line in `/etc/default/grub` allocates `2*1GiB` of 1 GiB
and `512*2 MiB` of 2 MiB pages:
--->
爲了使節點能夠上報巨頁容量，Kubernetes
節點必須[預先分配巨頁](https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html)。

節點能夠預先分配多種規格的巨頁。例如，在 `/etc/default/grub`
中的以下這一行分配了 `2*1GiB` 的 1 GiB 頁面和 `512*2 MiB` 的 2 MiB 頁面。

```
GRUB_CMDLINE_LINUX="hugepagesz=1G hugepages=2 hugepagesz=2M hugepages=512"
```

<!--
The nodes will automatically discover and report all huge page resources as
schedulable resources.

When you describe the Node, you should see something similar to the following
in the following in the `Capacity` and `Allocatable` sections:
-->
節點將自動發現並報告所有巨頁資源作爲可調度資源。

當你描述 Node 時，你應該在 `Capacity` 和 `Allocatable` 節中看到類似以下內容：

```
Capacity:
  cpu:                ...
  ephemeral-storage:  ...
  hugepages-1Gi:      2Gi
  hugepages-2Mi:      1Gi
  memory:             ...
  pods:               ...
Allocatable:
  cpu:                ...
  ephemeral-storage:  ...
  hugepages-1Gi:      2Gi
  hugepages-2Mi:      1Gi
  memory:             ...
  pods:               ...
```

{{< note >}}
<!--
For dynamically allocated pages (after boot), the Kubelet needs to be restarted
for the new allocations to be refrelected.
-->
對於動態分配的頁面（引導後），kubelet 需要被重新啓動才能更新爲新的分配。
{{< /note >}}

<!-- steps -->

## API

<!--
Huge pages can be consumed via container level resource requirements using the
resource name `hugepages-<size>`, where `<size>` is the most compact binary
notation using integer values supported on a particular node. For example, if a
node supports 2048KiB and 1048576KiB page sizes, it will expose a schedulable
resources `hugepages-2Mi` and `hugepages-1Gi`. Unlike CPU or memory, huge pages
do not support overcommit. Note that when requesting hugepage resources, either
memory or CPU resources must be requested as well.

A pod may consume multiple huge page sizes in a single pod spec. In this case it
must use `medium: HugePages-<hugepagesize>` notation for all volume mounts.
--->
使用者可以通過在容器級別的資源需求中使用資源名稱 `hugepages-<size>`
來使用巨頁，其中的 size 是特定節點上支持的以整數值表示的最小二進制單位。
例如，如果一個節點支持 2048KiB 和 1048576KiB 頁面大小，它將公開可調度的資源
`hugepages-2Mi` 和 `hugepages-1Gi`。與 CPU 或內存不同，巨頁不支持過量使用（overcommit）。
注意，在請求巨頁資源時，還必須請求內存或 CPU 資源。

同一 Pod 的 spec 中可能會消耗不同尺寸的巨頁。在這種情況下，它必須對所有掛載卷使用
`medium: HugePages-<hugepagesize>` 標識。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    - mountPath: /hugepages-1Gi
      name: hugepage-1gi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        hugepages-1Gi: 2Gi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
  - name: hugepage-1gi
    emptyDir:
      medium: HugePages-1Gi
```

<!--
A pod may use `medium: HugePages` only if it requests huge pages of one size.
-->
Pod 只有在請求同一大小的巨頁時才使用 `medium：HugePages`。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

<!--
- Huge page requests must equal the limits. This is the default if limits are
  specified, but requests are not.
- Huge pages are isolated at a container scope, so each container has own
  limit on their cgroup sandbox as requested in a container spec.
- EmptyDir volumes backed by huge pages may not consume more huge page memory
  than the pod request.
- Applications that consume huge pages via `shmget()` with `SHM_HUGETLB` must
  run with a supplemental group that matches `proc/sys/vm/hugetlb_shm_group`.
- Huge page usage in a namespace is controllable via ResourceQuota similar
  to other compute resources like `cpu` or `memory` using the `hugepages-<size>`
  token.
--->

- 巨頁的資源請求值必須等於其限制值。該條件在指定了資源限制，而沒有指定請求的情況下默認成立。
- 巨頁是被隔離在 Pod 作用域的，因此每個容器在 spec 中都對 cgroup 沙盒有自己的限制。
- 巨頁可用於 EmptyDir 卷，不過 EmptyDir 卷所使用的巨頁數量不能夠超出 Pod 請求的巨頁數量。
- 通過帶有 `SHM_HUGETLB` 的 `shmget()` 使用巨頁的應用，必須運行在一個與
  `proc/sys/vm/hugetlb_shm_group` 匹配的補充組下。
- 通過 ResourceQuota 資源，可以使用 `hugepages-<size>` 標記控制每個命名空間下的巨頁使用量，
  類似於使用 `cpu` 或 `memory` 來控制其他計算資源。
