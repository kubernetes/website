---
layout: blog
title: "Local Storage: Storage Capacity Tracking, Distributed Provisioning and Generic Ephemeral Volumes hit Beta"
date: 2021-04-14
slug: local-storage-features-go-beta
---

 **Authors:** Patrick Ohly (Intel)

The ["generic ephemeral
volumes"](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
and ["storage capacity
tracking"](/docs/concepts/storage/storage-capacity/)
features in Kubernetes are getting promoted to beta in Kubernetes
1.21. Together with the [distributed provisioning
support](https://github.com/kubernetes-csi/external-provisioner#deployment-on-each-node)
in the CSI external-provisioner, development and deployment of
Container Storage Interface (CSI) drivers which manage storage locally
on a node become a lot easier.

This blog post explains how such drivers worked before and how these
features can be used to make drivers simpler.

## Problems we are solving

There are drivers for local storage, like
[TopoLVM](https://github.com/cybozu-go/topolvm) for traditional disks
and [PMEM-CSI](https://intel.github.io/pmem-csi/latest/README.html)
for [persistent memory](https://pmem.io/). They work and are ready for
usage today also on older Kubernetes release, but making that possible
was not trivial.

### Central component required

The first problem is volume provisioning: it is handled through the
Kubernetes control plane. Some component must react to
[PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
(PVCs)
and create volumes. Usually, that is handled by a central deployment
of the [CSI
external-provisioner](https://kubernetes-csi.github.io/docs/external-provisioner.html)
and a CSI driver component that then connects to the storage
backplane. But for local storage, there is no such backplane.

TopoLVM solved this by having its different components communicate
with each other through the Kubernetes API server by creating and
reacting to custom resources. So although TopoLVM is based on CSI, a
standard that is independent of a particular container orchestrator,
TopoLVM only works on Kubernetes.

PMEM-CSI created its own storage backplane with communication through
gRPC calls. Securing that communication depends on TLS certificates,
which made driver deployment more complicated.

### Informing Pod scheduler about capacity

The next problem is scheduling. When volumes get created independently
of pods ("immediate binding"), the CSI driver must pick a node without
knowing anything about the pod(s) that are going to use it. Topology
information then forces those pods to run on the node where the volume
was created. If other resources like RAM or CPU are exhausted there,
the pod cannot start. This can be avoided by configuring in the
StorageClass that volume creation is meant to wait for the first pod
that uses a volume (`volumeBinding: WaitForFirstConsumer`). In that
mode, the Kubernetes scheduler tentatively picks a node based on other
constraints and then the external-provisioner is asked to create a
volume such that it is usable there. If local storage is exhausted,
the provisioner [can
ask](https://github.com/kubernetes-csi/external-provisioner/blob/master/doc/design.md)
for another scheduling round. But without information about available
capacity, the scheduler might always pick the same unsuitable node.

Both TopoLVM and PMEM-CSI solved this with scheduler extenders. This
works, but it is hard to configure when deploying the driver because
communication between kube-scheduler and the driver is very dependent
on how the cluster was set up.

### Rescheduling

A common use case for local storage is scratch space. A better fit for
that use case than persistent volumes are ephemeral volumes that get
created for a pod and destroyed together with it. The initial API for
supporting ephemeral volumes with CSI drivers (hence called ["*CSI*
ephemeral
volumes"](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes))
was [designed for light-weight
volumes](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20190122-csi-inline-volumes.md)
where volume creation is unlikely to fail. Volume creation happens
after pods have been permanently scheduled onto a node, in contrast to
the traditional provisioning where volume creation is tried before
scheduling a pod onto a node. CSI drivers must be modified to support
"CSI ephemeral volumes", which was done for TopoLVM and PMEM-CSI. But
due to the design of the feature in Kubernetes, pods can get stuck
permanently if storage capacity runs out on a node. The scheduler
extenders try to avoid that, but cannot be 100% reliable.

## Enhancements in Kubernetes 1.21

### Distributed provisioning

Starting with [external-provisioner
v2.1.0](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v2.1.0),
released for Kubernetes 1.20, provisioning can be handled by
external-provisioner instances that get [deployed together with the
CSI driver on each
node](https://github.com/kubernetes-csi/external-provisioner#deployment-on-each-node)
and then cooperate to provision volumes ("distributed
provisioning"). There is no need any more to have a central component
and thus no need for communication between nodes, at least not for
provisioning.

### Storage capacity tracking

A scheduler extender still needs some way to find out about capacity
on each node. When PMEM-CSI switched to distributed provisioning in
v0.9.0, this was done by querying the metrics data exposed by the
local driver containers. But it is better also for users to eliminate
the need for a scheduler extender completely because the driver
deployment becomes simpler. [Storage capacity
tracking](/docs/concepts/storage/storage-capacity/), [introduced in
1.19](https://kubernetes.io/blog/2020/09/01/ephemeral-volumes-with-storage-capacity-tracking/)
and promoted to beta in Kubernetes 1.21, achieves that. It works by
publishing information about capacity in `CSIStorageCapacity`
objects. The scheduler itself then uses that information to filter out
unsuitable nodes. Because information might be not quite up-to-date,
pods may still get assigned to nodes with insufficient storage, it's
just less likely and the next scheduling attempt for a pod should work
better once the information got refreshed.

### Generic ephemeral volumes

So CSI drivers still need the ability to recover from a bad scheduling
decision, something that turned out to be impossible to implement for
"CSI ephemeral volumes". ["*Generic* ephemeral
volumes"](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes),
another feature that got promoted to beta in 1.21, don't have that
limitation. This feature adds a controller that will create and manage
PVCs with the lifetime of the Pod and therefore the normal recovery
mechanism also works for them. Existing storage drivers will be able
to process these PVCs without any new logic to handle this new
scenario.

## Known limitations

Both generic ephemeral volumes and storage capacity tracking increase
the load on the API server. Whether that is a problem depends a lot on
the kind of workload, in particular how many pods have volumes and how
often those need to be created and destroyed.

No attempt was made to model how scheduling decisions affect storage
capacity. That's because the effect can vary considerably depending on
how the storage system handles storage. The effect is that multiple
pods with unbound volumes might get assigned to the same node even
though there is only sufficient capacity for one pod. Scheduling
should recover, but it would be more efficient if the scheduler knew
more about storage.

Because storage capacity gets published by a running CSI driver and
the cluster autoscaler needs information about a node that hasn't been
created yet, it will currently not scale up a cluster for pods that
need volumes. There is an [idea how to provide that
information](https://github.com/kubernetes/autoscaler/pull/3887), but
more work is needed in that area.

Distributed snapshotting and resizing are not currently supported. It
should be doable to adapt the respective sidecar and there are
tracking issues for external-snapshotter and external-resizer open
already, they just need some volunteer.

The recovery from a bad scheduling decising can fail for pods with
multiple volumes, in particular when those volumes are local to nodes:
if one volume can be created and then storage is insufficient for
another volume, the first volume continues to exist and forces the
scheduler to put the pod onto the node of that volume. There is an
idea how do deal with this, [rolling back the provision of the
volume](https://github.com/kubernetes/enhancements/pull/1703), but
this is only in the very early stages of brainstorming and not even a
merged KEP yet. For now it is better to avoid creating pods with more
than one persistent volume.

## Enabling the new features and next steps

With the feature entering beta in the 1.21 release, no additional actions are needed to enable it. Generic
ephemeral volumes also work without changes in CSI drivers. For more
information, see the
[documentation](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes)
and the [previous blog
post](/blog/2020/09/01/ephemeral-volumes-with-storage-capacity-tracking/)
about it. The API has not changed at all between alpha and beta.

For the other two features, the external-provisioner documentation
explains how CSI driver developers must change how their driver gets
deployed to support [storage capacity
tracking](https://github.com/kubernetes-csi/external-provisioner#capacity-support)
and [distributed
provisioning](https://github.com/kubernetes-csi/external-provisioner#deployment-on-each-node).
These two features are independent, therefore it is okay to enable
only one of them.

[SIG
Storage](https://github.com/kubernetes/community/tree/master/sig-storage)
would like to hear from you if you are using these new features. We
can be reached through
[email](https://groups.google.com/forum/#!forum/kubernetes-sig-storage),
[Slack](https://slack.k8s.io/) (channel [`#sig-storage`](https://kubernetes.slack.com/messages/sig-storage)) and in the
[regular SIG
meeting](https://github.com/kubernetes/community/tree/master/sig-storage#meeting).
A description of your workload would be very useful to validate design
decisions, set up performance tests and eventually promote these
features to GA.

## Acknowledgements

Thanks a lot to the members of the community who have contributed to these
features or given feedback including members of SIG Scheduling, SIG Auth,
￼and of course SIG Storage!
