---
title: Local ephemeral storage 
content_type: concept
weight: 95
---

Nodes have local ephemeral storage, backed by
locally-attached writeable devices or, sometimes, by RAM.
"Ephemeral" means that there is no long-term guarantee about durability.

Pods use ephemeral local storage for scratch space, caching, and for logs.
The kubelet can provide scratch space to Pods using local ephemeral storage to
mount [`emptyDir`](/docs/concepts/storage/volumes/#emptydir)
 {{< glossary_tooltip term_id="volume" text="volumes" >}} into containers.

The kubelet also uses this kind of storage to hold
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level),
container images, and the writable layers of running containers.

{{< caution >}}
If a node fails, the data in its ephemeral storage can be lost.
Your applications cannot expect any performance SLAs (disk IOPS for example)
from local ephemeral storage.
{{< /caution >}}

{{< note >}}
To make the resource quota work on ephemeral-storage, two things need to be done:

* An admin sets the resource quota for ephemeral-storage in a namespace.
* A user needs to specify limits for the ephemeral-storage resource in the Pod spec.

If the user doesn't specify the ephemeral-storage resource limit in the Pod spec,
the resource quota is not enforced on ephemeral-storage.

{{< /note >}}

Kubernetes lets you track, reserve and limit the amount
of ephemeral local storage a Pod can consume.

## Configurations for local ephemeral storage {#configurations}

Kubernetes supports two ways to configure local ephemeral storage on a node:
{{< tabs name="local_storage_configurations" >}}
{{% tab name="Single filesystem" %}}
In this configuration, you place all different kinds of ephemeral local data
(`emptyDir` volumes, writeable layers, container images, logs) into one filesystem.
The most effective way to configure the kubelet means dedicating this filesystem
to Kubernetes (kubelet) data.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
and treats these similarly to ephemeral local storage.

The kubelet writes logs to files inside its configured log directory (`/var/log`
by default); and has a base directory for other locally stored data
(`/var/lib/kubelet` by default).

Typically, both `/var/lib/kubelet` and `/var/log` are on the system root filesystem,
and the kubelet is designed with that layout in mind.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.
{{% /tab %}}
{{% tab name="Two filesystems" %}}
You have a filesystem on the node that you're using for ephemeral data that
comes from running Pods: logs, and `emptyDir` volumes. You can use this filesystem
for other data (for example: system logs not related to Kubernetes); it can even
be the root filesystem.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
into the first filesystem, and treats these similarly to ephemeral local storage.

You also use a separate filesystem, backed by a different logical storage device.
In this configuration, the directory where you tell the kubelet to place
container image layers and writeable layers is on this second filesystem.

The first filesystem does not hold any image layers or writeable layers.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.
{{% /tab %}}
{{< /tabs >}}

The kubelet can measure how much local storage it is using. It does this provided
that you have set up the node using one of the supported configurations for local
ephemeral storage.

If you have a different configuration, then the kubelet does not apply resource
limits for ephemeral local storage.

{{< note >}}
The kubelet tracks `tmpfs` emptyDir volumes as container memory use, rather
than as local ephemeral storage.
{{< /note >}}

{{< note >}}
The kubelet will only track the root filesystem for ephemeral storage. OS layouts that mount a separate disk to `/var/lib/kubelet` or `/var/lib/containers` will not report ephemeral storage correctly.
{{< /note >}}

## Setting requests and limits for local ephemeral storage {#requests-limits}

You can specify `ephemeral-storage` for managing local ephemeral storage. Each
container of a Pod can specify either or both of the following:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

Limits and requests for `ephemeral-storage` are measured in byte quantities.
You can express storage as a plain integer or as a fixed-point number using one of these suffixes:
E, P, T, G, M, k. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following quantities all represent roughly the same value:

- `128974848`
- `129e6`
- `129M`
- `123Mi`

Pay attention to the case of the suffixes. If you request `400m` of ephemeral-storage, this is a request
for 0.4 bytes. Someone who types that probably meant to ask for 400 mebibytes (`400Mi`)
or 400 megabytes (`400M`).

In the following example, the Pod has two containers. Each container has a request of
2GiB of local ephemeral storage. Each container has a limit of 4GiB of local ephemeral
storage. Therefore, the Pod has a request of 4GiB of local ephemeral storage, and
a limit of 8GiB of local ephemeral storage. 500Mi of that limit could be
consumed by the `emptyDir` volume.

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
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir:
        sizeLimit: 500Mi
```

## How Pods with ephemeral-storage requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum amount of local ephemeral storage it can provide for Pods.
For more information, see
[Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

The scheduler ensures that the sum of the resource requests of the scheduled containers is less than the capacity of the node.

## Ephemeral storage consumption management {#resource-emphemeralstorage-consumption}

If the kubelet is managing local ephemeral storage as a resource, then the
kubelet measures storage use in:

- `emptyDir` volumes, except _tmpfs_ `emptyDir` volumes
- directories holding node-level logs
- writeable container layers

If a Pod is using more ephemeral storage than you allow it to, the kubelet
sets an eviction signal that triggers Pod eviction.

For container-level isolation, if a container's writable layer and log
usage exceeds its storage limit, the kubelet marks the Pod for eviction.

For pod-level isolation the kubelet works out an overall Pod storage limit by
summing the limits for the containers in that Pod. In this case, if the sum of
the local ephemeral storage usage from all containers and also the Pod's `emptyDir`
volumes exceeds the overall Pod storage limit, then the kubelet also marks the Pod
for eviction.

{{< caution >}}
If the kubelet is not measuring local ephemeral storage, then a Pod
that exceeds its local storage limit will not be evicted for breaching
local storage resource limits.

However, if the filesystem space for writeable container layers, node-level logs,
or `emptyDir` volumes falls low, the node
{{< glossary_tooltip text="taints" term_id="taint" >}} itself as short on local storage
and this taint triggers eviction for any Pods that don't specifically tolerate the taint.

See the supported [configurations](#configurations) for ephemeral local storage.
{{< /caution >}}

The kubelet supports different ways to measure Pod storage use:

{{< tabs name="resource-emphemeralstorage-measurement" >}}

{{% tab name="Periodic scanning" %}}

The kubelet performs regular, scheduled checks that scan each `emptyDir` volume,
container log directory, and writeable container layer.

The scan measures how much space is used.

{{< note >}}
In this mode, the kubelet does not track open file descriptors
for deleted files.

If you (or a container) create a file inside an `emptyDir` volume,
something then opens that file, and you delete the file while it is still open,
then the inode for the deleted file stays until you close that file
but the kubelet does not categorize the space as in use.

{{< /note >}}

{{% /tab %}}

{{% tab name="Filesystem project quota" %}}

{{< feature-state feature_gate_name="LocalStorageCapacityIsolationFSQuotaMonitoring" >}}

Project quotas are an operating-system level feature for managing
storage use on filesystems. With Kubernetes, you can enable project
quotas for monitoring storage use. Make sure that the filesystem
backing the `emptyDir` volumes, on the node, provides project quota support.
For example, XFS and ext4fs offer project quotas.

{{< note >}}
Project quotas let you monitor storage use; they do not enforce limits.
{{< /note >}}

Kubernetes uses project IDs starting from `1048576`. The IDs in use are
registered in `/etc/projects` and `/etc/projid`. If project IDs in
this range are used for other purposes on the system, those project
IDs must be registered in `/etc/projects` and `/etc/projid` so that
Kubernetes does not use them.

Quotas are faster and more accurate than directory scanning.
When a directory is assigned to a project, all files created under a directory
are created in that project, and the kernel merely has to keep track of
how many blocks are in use by files in that project.
If a file is created and deleted, but has an open file descriptor,
it continues to consume space. Quota tracking records that space accurately
whereas directory scans overlook the storage used by deleted files.

To use quotas to track a pod's resource usage, the pod must be in 
a user namespace. Within user namespaces, the kernel restricts changes 
to projectIDs on the filesystem, ensuring the reliability of storage 
metrics calculated by quotas.

If you want to use project quotas, you should:

* Enable the `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  using the `featureGates` field in the
  [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).

* Ensure the `UserNamespacesSupport` 
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled, and that the kernel, CRI implementation and OCI runtime support user namespaces.

* Ensure that the root filesystem (or optional runtime filesystem)
  has project quotas enabled. All XFS filesystems support project quotas.
  For ext4 filesystems, you need to enable the project quota tracking feature
  while the filesystem is not mounted.

  ```bash
  # For ext4, with /dev/block-device not mounted
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* Ensure that the root filesystem (or optional runtime filesystem) is
  mounted with project quotas enabled. For both XFS and ext4fs, the
  mount option is named `prjquota`.

If you don't want to use project quotas, you should:

* Disable the `LocalStorageCapacityIsolationFSQuotaMonitoring`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  using the `featureGates` field in the
  [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
{{% /tab %}}
{{< /tabs >}}


## {{% heading "whatsnext" %}}

* Read about [project quotas](https://www.linux.org/docs/man8/xfs_quota.html) in XFS
