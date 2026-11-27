---
reviewers:
- derekwaynecarr
title: Manage HugePages
content_type: task
description: Configure and manage huge pages as a schedulable resource in a cluster.
---

<!-- overview -->
{{< feature-state feature_gate_name="HugePages" >}}

Kubernetes supports the allocation and consumption of pre-allocated huge pages
by applications in a Pod. This page describes how users can consume huge pages.

## {{% heading "prerequisites" %}}

Kubernetes nodes must
[pre-allocate huge pages](https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html)
in order for the node to report its huge page capacity.

A node can pre-allocate huge pages for multiple sizes, for instance,
the following line in `/etc/default/grub` allocates `2*1GiB` of 1 GiB
and `512*2 MiB` of 2 MiB pages:

```
GRUB_CMDLINE_LINUX="hugepagesz=1G hugepages=2 hugepagesz=2M hugepages=512"
```

The nodes will automatically discover and report all huge page resources as
schedulable resources.

When you describe the Node, you should see something similar to the following
in the following in the `Capacity` and `Allocatable` sections:

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
For dynamically allocated pages (after boot), the Kubelet needs to be restarted
for the new allocations to be refrelected.
{{< /note >}}

<!-- steps -->

## API

Huge pages can be consumed via container-level or
[Pod-level](/docs/concepts/configuration/manage-resources-containers/#pod-level-resource-specification)
(`spec.resources`) resource requirements using the
resource name `hugepages-<size>`, where `<size>` is the most compact binary
notation using integer values supported on a particular node. For example, if a
node supports 2048KiB and 1048576KiB page sizes, it will expose schedulable
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
- When specified at the container level, huge pages are isolated at a container
  scope, so each container has its own limit on its cgroup sandbox as requested
  in its container spec. When specified at the Pod level (`spec.resources`),
  the Pod's `hugetlb` cgroup enforces the Pod-level huge page limit across all
  containers in the Pod (and the Pod-level huge page limit must be greater than
  or equal to the aggregate container huge page limits). Containers still need
  to mount a huge page `emptyDir` volume to access the huge page filesystem.
- EmptyDir volumes backed by huge pages may not consume more huge page memory
  than the pod request.
- Applications that consume huge pages via `shmget()` with `SHM_HUGETLB` must
  run with a supplemental group that matches `proc/sys/vm/hugetlb_shm_group`.
- Huge page usage in a namespace is controllable via ResourceQuota similar
  to other compute resources like `cpu` or `memory` using the `hugepages-<size>`
  token.

