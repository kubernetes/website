---
layout: blog
title: 'Kubernetes 1.23: StatefulSet PVC Auto-Deletion (alpha)'
date: 2021-12-16
slug: kubernetes-1-23-statefulset-pvc-auto-deletion
---

**Author:** Matthew Cary (Google)

Kubernetes v1.23 introduced a new, alpha-level policy for
[StatefulSets](/docs/concepts/workloads/controllers/statefulset/) that controls the lifetime of
[PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/) (PVCs) generated from the
StatefulSet spec template for cases when they should be deleted automatically when the StatefulSet
is deleted or pods in the StatefulSet are scaled down.

## What problem does this solve?
A StatefulSet spec can include Pod and PVC templates. When a replica is first created, the
Kubernetes control plane creates a PVC for that replica if one does not already exist. The behavior
before Kubernetes v1.23 was that the control plane never cleaned up the PVCs created for
StatefulSets - this was left up to the cluster administrator, or to some add-on automation that
you’d have to find, check suitability, and deploy. The common pattern for managing PVCs, either
manually or through tools such as Helm, is that the PVCs are tracked by the tool that manages them,
with explicit lifecycle. Workflows that use StatefulSets must determine on their own what PVCs are
created by a StatefulSet and what their lifecycle should be.

Before this new feature, when a StatefulSet-managed replica disappears, either because the
StatefulSet is reducing its replica count, or because its StatefulSet is deleted, the PVC and its
backing volume remains and must be manually deleted. While this behavior is appropriate when the
data is critical, in many cases the persistent data in these PVCs is either temporary, or can be
reconstructed from another source. In those cases, PVCs and their backing volumes remaining after
their StatefulSet or replicas have been deleted are not necessary, incur cost, and require manual
cleanup.

## The new StatefulSet PVC retention policy

If you enable the alpha feature, a StatefulSet spec includes a PersistentVolumeClaim retention
policy.  This is used to control if and when PVCs created from a StatefulSet’s `volumeClaimTemplate`
are deleted.  This first iteration of the retention policy contains two situations where PVCs may be
deleted.

The first situation is when the StatefulSet resource is deleted (which implies that all replicas are
also deleted). This is controlled by the `whenDeleted` policy. The second situation, controlled by
`whenScaled` is when the StatefulSet is scaled down, which removes some but not all of the replicas
in a StatefulSet. In both cases the policy can either be `Retain`, where the corresponding PVCs are
not touched, or `Delete`, which means that PVCs are deleted. The deletion is done with a normal
[object deletion](/docs/concepts/architecture/garbage-collection/), so that, for example, all
retention policies for the underlying PV are respected.

This policy forms a matrix with four cases. I’ll walk through and give an example for each one.

  * **`whenDeleted` and `whenScaled` are both `Retain`.** This matches the existing behavior for
    StatefulSets, where no PVCs are deleted. This is also the default retention policy. It’s
    appropriate to use when data on StatefulSet volumes may be irreplaceable and should only be
    deleted manually.

  * **`whenDeleted` is `Delete` and `whenScaled` is `Retain`.** In this case, PVCs are deleted only when
    the entire StatefulSet is deleted. If the StatefulSet is scaled down, PVCs are not touched,
    meaning they are available to be reattached if a scale-up occurs with any data from the previous
    replica. This might be used for a temporary StatefulSet, such as in a CI instance or ETL
    pipeline, where the data on the StatefulSet is needed only during the lifetime of the
    StatefulSet lifetime, but while the task is running the data is not easily reconstructible. Any
    retained state is needed for any replicas that scale down and then up.

  * **`whenDeleted` and `whenScaled` are both `Delete`.** PVCs are deleted immediately when their
    replica is no longer needed. Note this does not include when a Pod is deleted and a new version
    rescheduled, for example when a node is drained and Pods need to migrate elsewhere. The PVC is
    deleted only when the replica is no longer needed as signified by a scale-down or StatefulSet
    deletion. This use case is for when data does not need to live beyond the life of its
    replica. Perhaps the data is easily reconstructable and the cost savings of deleting unused PVCs
    is more important than quick scale-up, or perhaps that when a new replica is created, any data
    from a previous replica is not usable and must be reconstructed anyway.

  * **`whenDeleted` is `Retain` and `whenScaled` is `Delete`.** This is similar to the previous case,
    when there is little benefit to keeping PVCs for fast reuse during scale-up. An example of a
    situation where you might use this is an Elasticsearch cluster. Typically you would scale that
    workload up and down to match demand, whilst ensuring a minimum number of replicas (for example:
    3). When scaling down, data is migrated away from removed replicas and there is no benefit to
    retaining those PVCs. However, it can be useful to bring the entire Elasticsearch cluster down
    temporarily for maintenance. If you need to take the Elasticsearch system offline, you can do
    this by temporarily deleting the StatefulSet, and then bringing the Elasticsearch cluster back
    by recreating the StatefulSet. The PVCs holding the Elasticsearch data will still exist and the
    new replicas will automatically use them.

Visit the
[documentation](/docs/concepts/workloads/controllers/statefulset/#persistentvolumeclaim-policies) to
see all the details.

## What’s next?

Enable the feature and try it out! Enable the `StatefulSetAutoDeletePVC` feature gate on a cluster,
then create a StatefulSet using the new policy. Test it out and tell us what you think!

I'm very curious to see if this owner reference mechanism works well in practice. For example, we
realized there is no mechanism in Kubernetes for knowing who set a reference, so it’s possible that
the StatefulSet controller may fight with custom controllers that set their own
references. Fortunately, maintaining the existing retention behavior does not involve any new owner
references, so default behavior will be compatible.

Please tag any issues you report with the label `sig/apps` and assign them to Matthew Cary
([@mattcary](https://github.com/mattcary) at GitHub).

Enjoy!

