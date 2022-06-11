---
title: 管理巨页（HugePages）
content_type: task
description: 将大页配置和管理为集群中的可调度资源。
---
<!--
reviewers:
- derekwaynecarr
title: Manage HugePages
content_type: task
description: Configure and manage huge pages as a schedulable resource in a cluster.
--->

<!-- overview -->
{{< feature-state state="stable" >}}

<!--
Kubernetes supports the allocation and consumption of pre-allocated huge pages
by applications in a Pod. This page describes how users can consume huge pages.
--->
Kubernetes 支持在 Pod 应用中使用预先分配的巨页。本文描述了用户如何使用巨页，以及当前的限制。



## {{% heading "prerequisites" %}}


<!--
1. Kubernetes nodes must pre-allocate huge pages in order for the node to report
   its huge page capacity. A node can pre-allocate huge pages for multiple
   sizes.

The nodes will automatically discover and report all huge page resources as
schedulable resources.
--->
1. 为了使节点能够上报巨页容量，Kubernetes 节点必须预先分配巨页。每个节点能够预先分配多种规格的巨页。

节点会自动发现全部巨页资源，并作为可供调度的资源进行上报。



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

用户可以通过在容器级别的资源需求中使用资源名称 `hugepages-<size>`
来使用巨页，其中的 size 是特定节点上支持的以整数值表示的最小二进制单位。
例如，如果一个节点支持 2048KiB 和 1048576KiB 页面大小，它将公开可调度的资源
`hugepages-2Mi` 和 `hugepages-1Gi`。与 CPU 或内存不同，巨页不支持过量使用（overcommit）。
注意，在请求巨页资源时，还必须请求内存或 CPU 资源。

同一 Pod 的 spec 中可能会消耗不同尺寸的巨页。在这种情况下，它必须对所有挂载卷使用
`medium: HugePages-<hugepagesize>` 标识。

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
Pod 只有在请求同一大小的巨页时才使用 `medium：HugePages`。

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

- 巨页的资源请求值必须等于其限制值。该条件在指定了资源限制，而没有指定请求的情况下默认成立。
- 巨页是被隔离在 pod 作用域的，因此每个容器在 spec 中都对 cgroup 沙盒有自己的限制。
- 巨页可用于 EmptyDir 卷，不过 EmptyDir 卷所使用的巨页数量不能够超出 Pod 请求的巨页数量。
- 通过带有 `SHM_HUGETLB` 的 `shmget()` 使用巨页的应用，必须运行在一个与
   `proc/sys/vm/hugetlb_shm_group` 匹配的补充组下。
- 通过 ResourceQuota 资源，可以使用 `hugepages-<size>` 标记控制每个命名空间下的巨页使用量，
  类似于使用 `cpu` 或 `memory` 来控制其他计算资源。



