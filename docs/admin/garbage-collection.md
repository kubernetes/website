---
assignees:
- mikedanese
title: Configuring kubelet Garbage Collection
---

* TOC
{:toc}

Garbage collection is a helpful function of kubelet that will clean up unused images and unused containers. Kubelet will perform garbage collection for containers every minute and garbage collection for images every five minutes.

External garbage collection tools are not recommended as these tools can potentially break the behavior of kubelet by removing containers expected to exist.

### Image Collection

Kubernetes manages lifecycle of all images through imageManager, with the cooperation
of cadvisor.

The policy for garbage collecting images takes two factors into consideration:
`HighThresholdPercent` and `LowThresholdPercent`. Disk usage above the high threshold
will trigger garbage collection. The garbage collection will delete least recently used images until the low
threshold has been met.

### Container Collection

The policy for garbage collecting containers considers three user-defined variables. `MinAge` is the minimum age at which a container can be garbage collected. `MaxPerPodContainer` is the maximum number of dead containers any single
pod (UID, container name) pair is allowed to have. `MaxContainers` is the maximum number of total dead containers. These variables can be individually disabled by setting 'MinAge' to zero and setting 'MaxPerPodContainer' and 'MaxContainers' respectively to less than zero.

Kubelet will act on containers that are unidentified, deleted, or outside of the boundaries set by the previously mentioned flags. The oldest containers will generally be removed first. 'MaxPerPodContainer' and 'MaxContainer' may potentially conflict with each other in situations where retaining the maximum number of containers per pod ('MaxPerPodContainer') would go outside the allowable range of global dead containers ('MaxContainers'). 'MaxPerPodContainer' would be adjusted in this situation: A worst case scenario would be to downgrade 'MaxPerPodContainer' to 1 and evict the oldest containers. Additionally, containers owned by pods that have been deleted are removed once they are older than `MinAge`.

Containers that are not managed by kubelet are not subject to container garbage collection.

### User Configuration

Users can adjust the following thresholds to tune image garbage collection with the following kubelet flags :

1. `image-gc-high-threshold`, the percent of disk usage which triggers image garbage collection.
Default is 90%.
2. `image-gc-low-threshold`, the percent of disk usage to which image garbage collection attempts
to free. Default is 80%.

We also allow users to customize garbage collection policy through the following kubelet flags:

1. `minimum-container-ttl-duration`, minimum age for a finished container before it is
garbage collected. Default is 1 minute.
2. `maximum-dead-containers-per-container`, maximum number of old instances to retain
per container. Default is 2.
3. `maximum-dead-containers`, maximum number of old instances of containers to retain globally.
Default is 100.

Containers can potentially be garbage collected before their usefulness has expired. These containers
can contain logs and other data that can be useful for troubleshooting. A sufficiently large value for
`maximum-dead-containers-per-container` is highly recommended to allow at least 2 dead containers to be
retained per expected container. A higher value for `maximum-dead-containers` is also recommended for a
similar reason.
See [this issue](https://github.com/kubernetes/kubernetes/issues/13287) for more details.
