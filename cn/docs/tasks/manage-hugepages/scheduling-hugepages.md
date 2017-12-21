---
approvers:
- derekwaynecarr
title: 管理巨页（HugePages）
---

{% capture overview %}
{% include feature-state-alpha.md %}

作为 **alpha** 特性，Kubernetes 支持在 Pod 应用中使用预先分配的巨页（或称“大页面”，下文统称为“巨页”）。  本文描述了用户如何使用巨页，以及当前的限制。

{% endcapture %}

{% capture prerequisites %}

1. 为了使节点能够上报巨页容量，Kubernetes 节点必须预先分配巨页。
   每个节点只能预先分配一种特定规格的巨页。
1. 用户必须在整个系统中将专用的 **alpha** 特性开关 `HugePages` 设置为 true： `--feature-gates=HugePages=true`。

节点会自动发现全部巨页资源，并作为可供调度的资源进行上报。

{% endcapture %}

{% capture steps %}

## API

用户可以通过在容器级别的资源需求中使用资源名称 `hugepages-<size>` 来使用巨页，其中的 size 是特定节点上支持的以整数值表示的最小二进制单位。 例如，如果节点支持 2048KiB 的页面规格， 它将暴露可供调度的资源 `hugepages-2Mi`。 与 CPU 或内存不同，巨页不支持过量使用（overcommit）。

```yaml
apiVersion: v1
kind: Pod
metadata:
  generateName: hugepages-volume-
spec:
  containers:
  - image: fedora:latest
    command:
    - sleep
    - inf
    name: example
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

- 巨页的资源需求和限制必须相等。 该条件在指定了资源限制，而没有指定需求的情况下默认成立。
- 巨页是被隔离在 pod 作用域的，计划在将来的迭代中实现容器级别的隔离。
- 巨页对 EmptyDir 卷提供支持，EmptyDir 卷所使用的巨页，不能够超出 pod 请求的内存容量。
- 通过带有 `SHM_HUGETLB` 的 `shmget()` 使用巨页的应用，必须运行在一个与
   `proc/sys/vm/hugetlb_shm_group` 匹配的补充组下。

## （待实现的）特性

- 在 pod 级别隔离的基础上，支持巨页在容器级别的隔离。
- 作为服务质量特性，保证巨页的 NUMA 局部性。
- 支持 ResourceQuota 。
- 支持 LimitRange 。

{% endcapture %}

{% include templates/task.md %}
