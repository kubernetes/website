---
title: Kubernetes Resource Management Types
content_type: reference
---

<!-- overview -->

This page provides information on the different resource types you can request, built into Kubernetes.

There are several different resource types: `cpu`, `memory`, `storage`, `hugepages-*`, and `ephemeral-storage`.

Resource requests on Pods are an integral part of scheduling and 
limiting and managing resource consumption in a Kubernetes 
cluster. 
See [Kubernetes Scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) and [Requests and Limits](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) for more details.

<!-- body -->
## Resource Types

### CPU
The `cpu` resource represents CPU in cores and can be specified as either a decimal (e.g. `1`, `0.5`) or as millicores (e.g. `500m`, `1000m`). `0.5` = `500m`.

You can request or limit the `cpu` resource for Pods and their containers, and any for object that
embeds a [Pod template](/docs/concepts/workloads/pods/#pod-templates).

When the cpu limit is reached, the Pod is throttled.

See [Meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu) for
more details on what CPU means in kubernetes.

### Memory
The `memory` resource represents memory in bytes and is specified with a number and a binary
suffix. e.g. `500Mi` = `500MiB` = `500 * 1024 * 1024`.

You can request or limit the `memory` resource in Pods and their containers, and any object that
embeds a Pod template.

If a container or Pod tries to use more memory than the configured limit, the
container runtime and / or host operating system kernel typically intervenes by
stopping a process in that Pod. That mechanism is called
“out of memory kill”, and is different from how CPU resource limits are handled
(CPU limits are enforced using time-slicing, whereas memory limits are enforced
by stopping containers that try to violate them).

See [Meaning of Memory](/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)
for more details on what memory means in kubernetes.

### Storage
The `storage` resource represents volume size in bytes and is specified with a number and a binary
suffix. e.g. `500Gi` = `500GiB` = `500 * 1024 * 1024 * 1024`

You can use the `storage` resource in a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}.

### Huge pages {#hugepages-all}

Huge pages are a Linux-specific feature where the node
kernel allocates blocks of memory that are much larger than the
default page size. You can set requests or limits for particular sizes
of huge page.

You cannot overcommit `hugepages-*` resources. This is different from the `memory` and `cpu` resources.

You request huge pages with a combination of two binary
suffixes. The first is part of the resource name in the request:
e.g. `hugepages-2Mi`. It specifies the size of the pages. The second part is the value of allocatable pages e.g. `80Mi`.

### Ephemeral storage

Ephemeral storage is storage provided to pods that has no
long-term guarantee of durability. Empheral Storage is in beta.
Empheral storage is represented in bytes and is specified with a
number and a binary suffix. e.g. `500Mi` = `500MiB` = `500 * 1024 * 1024`.

You can specify the `ephemeral-storage` resource in Pods and any object that embeds a Pod template.

See [Local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage) for more details.

### Extended Resources

Extended resources are fully-qualified resource names outside the kubernetes.io domain.
They allow cluster operators to advertise and users to consume the non-Kubernetes-built-in
resources.

See [Extended Resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources) for more information.

## Examples
### CPU and memory  {#example-cpu-memory}

```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
spec:
  ...
  requests:
    cpu: 500m
    memory: 250Mi
  limits:
    cpu: 700m
    memory: 500Mi
```

### Storage {#example-storage}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  ...
spec:
  ...
  requests:
    storage: 20Gi
```

### Huge pages {#example-hugepages}
```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
spec:
  ...
  requests:
    hugepages-2Mi: 80Mi
  limits:
    hugepages-2Mi: 100Mi
```

### Ephemeral storage {#example-ephemeral-storage}

```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
spec:
  ...
  requests:
    ephemeral-storage: 100Mi
  limits:
    ephemeral-storage: 500Mi
```
