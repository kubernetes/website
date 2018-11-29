---
reviewers:
- derekwaynecarr
title: Manage HugePages
---

{% capture overview %}
{% include feature-state-beta.md %}

Kubernetes supports the allocation and consumption of pre-allocated huge pages
by applications in a Pod as a **beta** feature. This page describes how users
can consume huge pages and the current limitations.

{% endcapture %}

{% capture prerequisites %}

1. Kubernetes nodes must pre-allocate huge pages in order for the node to report
   its huge page capacity. A node may only pre-allocate huge pages for a single
   size.

The nodes will automatically discover and report all huge page resources as a
schedulable resource.

{% endcapture %}

{% capture steps %}

## API

Huge pages can be consumed via container level resource requirements using the
resource name `hugepages-<size>`, where size is the most compact binary notation
using integer values supported on a particular node. For example, if a node
supports 2048KiB page sizes, it will expose a schedulable resource
`hugepages-2Mi`. Unlike CPU or memory, huge pages do not support overcommit.

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

- Huge page requests must equal the limits. This is the default if limits are
  specified, but requests are not.
- Huge pages are isolated at a pod scope, container isolation is planned in a
  future iteration.
- EmptyDir volumes backed by huge pages may not consume more huge page memory
  than the pod request.
- Applications that consume huge pages via `shmget()` with `SHM_HUGETLB` must
  run with a supplemental group that matches `proc/sys/vm/hugetlb_shm_group`.
- Huge page usage in a namespace is controllable via ResourceQuota similar
to other compute resources like `cpu` or `memory` using the `hugepages-<size>`
token.

## Future

- Support container isolation of huge pages in addition to pod isolation.
- NUMA locality guarantees as a feature of quality of service.
- LimitRange support.

{% endcapture %}

{% include templates/task.md %}
