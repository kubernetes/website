---
reviewers:
- derekwaynecarr
title: Manage HugePages
content_template: templates/task
---

{{% capture overview %}}
{{< feature-state state="stable" >}}

Kubernetes supports the allocation and consumption of pre-allocated huge pages
by applications in a Pod as a **GA** feature. This page describes how users
can consume huge pages and the current limitations.

{{% /capture %}}

{{% capture prerequisites %}}

1. Kubernetes nodes must pre-allocate huge pages in order for the node to report
   its huge page capacity. A node can pre-allocate huge pages for multiple
   sizes.

The nodes will automatically discover and report all huge page resources as
schedulable resources.

{{% /capture %}}

{{% capture steps %}}

## API

Huge pages can be consumed via container level resource requirements using the
resource name `hugepages-<size>`, where `<size>` is the most compact binary
notation using integer values supported on a particular node. For example, if a
node supports 2048KiB and 1048576KiB page sizes, it will expose a schedulable
resources `hugepages-2Mi` and `hugepages-1Gi`. Unlike CPU or memory, huge pages
do not support overcommit. Note that when requesting hugepage resources, either
memory or CPU resources must be requested as well.

A pod may consume multiple huge page sizes in a single pod spec. In this case it
must use `medium: HugePages-<hugepagesize>` notation for all volume mounts.


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

A pod may use `medium: HugePages` only if it requests huge pages of one size.

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

- Huge page requests must equal the limits. This is the default if limits are
  specified, but requests are not.
- Huge pages are isolated at a container scope, so each container has own limit on their cgroup sandbox as requested in a container spec.
- EmptyDir volumes backed by huge pages may not consume more huge page memory
  than the pod request.
- Applications that consume huge pages via `shmget()` with `SHM_HUGETLB` must
  run with a supplemental group that matches `proc/sys/vm/hugetlb_shm_group`.
- Huge page usage in a namespace is controllable via ResourceQuota similar
to other compute resources like `cpu` or `memory` using the `hugepages-<size>`
token.
- Support of multiple sizes huge pages is feature gated. It can be
  enabled with the `HugePageStorageMediumSize` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) on the {{<
glossary_tooltip text="kubelet" term_id="kubelet" >}} and {{<
glossary_tooltip text="kube-apiserver"
term_id="kube-apiserver" >}} (`--feature-gates=HugePageStorageMediumSize=true`).

## Future

- NUMA locality guarantees as a feature of quality of service.
- LimitRange support.

{{% /capture %}}

