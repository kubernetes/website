---
layout: blog
title: 'Image Filesystem: Configuring Kubernetes to store containers on a separate filesystem'
date: 2024-01-23
slug: kubernetes-separate-image-filesystem
author: >
  Kevin Hannon (Red Hat)
---

A common issue in running/operating Kubernetes clusters is running out of disk space.
When the node is provisioned, you should aim to have a good amount of storage space for your container images and running containers.
The [container runtime](/docs/setup/production-environment/container-runtimes/) usually writes to `/var`. 
This can be located as a separate partition or on the root filesystem.
CRI-O, by default, writes its containers and images to `/var/lib/containers`, while containerd writes its containers and images to `/var/lib/containerd`.

In this blog post, we want to bring attention to ways that you can configure your container runtime to store its content separately from the default partition.  
This allows for more flexibility in configuring Kubernetes and provides support for adding a larger disk for the container storage while keeping the default filesystem untouched.  

One area that needs more explaining is where/what Kubernetes is writing to disk.

## Understanding Kubernetes disk usage

Kubernetes has persistent data and ephemeral data.  The base path for the kubelet and local
Kubernetes-specific storage is configurable, but it is usually assumed to be `/var/lib/kubelet`.
In the Kubernetes docs, this is sometimes referred to as the root or node filesystem. The bulk of this data can be categorized into:

- ephemeral storage
- logs
- and container runtime

This is different from most POSIX systems as the root/node filesystem is not `/` but the disk that `/var/lib/kubelet` is on.

### Ephemeral storage

Pods and containers can require temporary or transient local storage for their operation.
The lifetime of the ephemeral storage does not extend beyond the life of the individual pod, and the ephemeral storage cannot be shared across pods.

### Logs

By default, Kubernetes stores the logs of each running container, as files within `/var/log`.
These logs are ephemeral and are monitored by the kubelet to make sure that they do not grow too large while the pods are running.

You can customize the [log rotation](/docs/concepts/cluster-administration/logging/#log-rotation) settings
for each node to manage the size of these logs, and configure log shipping (using a 3rd party solution)
to avoid relying on the node-local storage.

### Container runtime

The container runtime has two different areas of storage for containers and images.
- read-only layer: Images are usually denoted as the read-only layer, as they are not modified when containers are running.
The read-only layer can consist of multiple layers that are combined into a single read-only layer.
There is a thin layer on top of containers that provides ephemeral storage for containers if the container is writing to the filesystem.

- writeable layer: Depending on your container runtime, local writes might be
implemented as a layered write mechanism (for example, `overlayfs` on Linux or CimFS on Windows).
This is referred to as the writable layer.
Local writes could also use a writeable filesystem that is initialized with a full clone of the container
image; this is used for some runtimes based on hypervisor virtualisation.

The container runtime filesystem contains both the read-only layer and the writeable layer.
This is considered the `imagefs` in Kubernetes documentation.

## Container runtime configurations

### CRI-O

CRI-O uses a storage configuration file in TOML format that lets you control how the container runtime stores persistent and temporary data.
CRI-O utilizes the [storage library](https://github.com/containers/storage).  
Some Linux distributions have a manual entry for storage (`man 5 containers-storage.conf`).
The main configuration for storage is located in `/etc/containers/storage.conf` and one can control the location for temporary data and the root directory.  
The root directory is where CRI-O stores the persistent data.

```toml
[storage]
# Default storage driver
driver = "overlay"
# Temporary storage location
runroot = "/var/run/containers/storage"
# Primary read/write location of container storage 
graphroot = "/var/lib/containers/storage"
```

- `graphroot`
  - Persistent data stored from the container runtime
  - If SELinux is enabled, this must match the `/var/lib/containers/storage`
- `runroot`
  - Temporary read/write access for container
  - Recommended to have this on a temporary filesystem

Here is a quick way to relabel your graphroot directory to match `/var/lib/containers/storage`:

```bash
semanage fcontext -a -e /var/lib/containers/storage <YOUR-STORAGE-PATH>
restorecon -R -v <YOUR-STORAGE-PATH>
```

### containerd

The containerd runtime uses a TOML configuration file to control where persistent and ephemeral data is stored.
The default path for the config file is located at `/etc/containerd/config.toml`.

The relevant fields for containerd storage are `root` and `state`.

- `root`
  - The root directory for containerd metadata
  - Default is `/var/lib/containerd`
  - Root also requires SELinux labels if your OS requires it
- `state`
  - Temporary data for containerd
  - Default is `/run/containerd`

## Kubernetes node pressure eviction

Kubernetes will automatically detect if the container filesystem is split from the node filesystem. 
When one separates the filesystem, Kubernetes is responsible for monitoring both the node filesystem and the container runtime filesystem.
Kubernetes documentation refers to the node filesystem and the container runtime filesystem as nodefs and imagefs.
If either nodefs or the imagefs are running out of disk space, then the overall node is considered to have disk pressure.
Kubernetes will first reclaim space by deleting unusued containers and images, and then it will resort to evicting pods.
On a node that has a nodefs and an imagefs, the kubelet will
[garbage collect](/docs/concepts/architecture/garbage-collection/#containers-images) unused container images
on imagefs and will remove dead pods and their containers from the nodefs.
If there is only a nodefs, then Kubernetes garbage collection includes dead containers, dead pods and unused images.

Kubernetes allows more configurations for determining if your disk is full.  
The eviction manager within the kubelet has some configuration settings that let you control
the relevant thresholds.
For filesystems, the relevant measurements are `nodefs.available`, `nodefs.inodesfree`, `imagefs.available`, and `imagefs.inodesfree`.
If there is not a dedicated disk for the container runtime then imagefs is ignored.

Users can use the existing defaults:

- `memory.available` < 100MiB
- `nodefs.available` < 10%
- `imagefs.available` < 15%
- `nodefs.inodesFree` < 5% (Linux nodes)

Kubernetes allows you to set user defined values in `EvictionHard` and `EvictionSoft` in the kubelet configuration file.

`EvictionHard`
: defines limits; once these limits are exceeded, pods will be evicted without any grace period.

`EvictionSoft`
: defines limits; once these limits are exceeded, pods will be evicted with a grace period that can be set per signal.

If you specify a value for `EvictionHard`, it will replace the defaults.  
This means it is important to set all signals in your configuration.

For example, the following kubelet configuration could be used to configure [eviction signals](/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds) and grace period options.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
evictionSoft:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
evictionSoftGracePeriod:
    memory.available:  "1m30s"
    nodefs.available:  "2m"
    nodefs.inodesFree: "2m"
    imagefs.available: "2m"
    imagefs.inodesFree: "2m"
evictionMaxPodGracePeriod: 60s
```

### Problems

The Kubernetes project recommends that you either use the default settings for eviction or you set all the fields for eviction.
You can use the default settings or specify your own `evictionHard` settings. If you miss a signal, then Kubernetes will not monitor that resource.
One common misconfiguration administrators or users can hit is mounting a new filesystem to `/var/lib/containers/storage` or `/var/lib/containerd`.
Kubernetes will detect a separate filesystem, so you want to make sure to check that `imagefs.inodesfree` and `imagefs.available` match your needs if you've done this.

Another area of confusion is that ephemeral storage reporting does not change if you define an image
filesystem for your node. The image filesystem (`imagefs`) is used to store container image layers; if a
container writes to its own root filesystem, that local write doesn't count towards the size of the container image. The place where the container runtime stores those local modifications is runtime-defined, but is often
the image filesystem.
If a container in a pod is writing to a filesystem-backed `emptyDir` volume, then this uses space from the
`nodefs` filesystem.
The kubelet always reports ephemeral storage capacity and allocations based on the filesystem represented
by `nodefs`; this can be confusing when ephemeral writes are actually going to the image filesystem.

### Future work

To fix the ephemeral storage reporting limitations and provide more configuration options to the container runtime, SIG Node are working on [KEP-4191](http://kep.k8s.io/4191).
In KEP-4191, Kubernetes will detect if the writeable layer is separated from the read-only layer (images).
This would allow us to have all ephemeral storage, including the writeable layer, on the same disk as well as allowing for a separate disk for images.

### Getting involved

If you would like to get involved, you can
join [Kubernetes Node Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-node) (SIG).

If you would like to share feedback, you can do so on our
[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) Slack channel.
If you're not already part of that Slack workspace, you can visit https://slack.k8s.io/ for an invitation.

Special thanks to all the contributors who provided great reviews, shared valuable insights or suggested the topic idea.

- Peter Hunt
- Mrunal Patel
- Ryan Phillips
- Gaurav Singh
