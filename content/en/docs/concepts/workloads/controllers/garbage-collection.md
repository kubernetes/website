---
title: Garbage Collection
content_type: concept
weight: 60
---

<!-- overview -->
{{<glossary_definition term_id="garbage-collection" length="short">}} This
allows the clean up of resources like the following:

  * [Objects without owner references](#owners-dependents)
  * [Unused containers and container images](#containers-images)
  * [Failed pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)
  * [Dynamically provisioned PersistentVolumes with a StorageClass reclaim policy of Delete](/docs/concepts/storage/persistent-volumes/#delete)
  * [Stale or expired CertificateSigningRequests (CSRs)](/reference/access-authn-authz/certificate-signing-requests/#request-signing-process)
  * Nodes deleted in the following scenarios:
    * On a cloud when the cluster uses a [cloud controller manager](/docs/concepts/architecture/cloud-controller/)
    * On-premises when the cluster uses an addon similar to a cloud controller
      manager
  * [Node Lease objects](/docs/concepts/architecture/nodes/#heartbeats)
  * [Completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/)

## Owners and dependents {#owners-dependents}

Many objects in Kubernetes are linked with each other through [*owner references*](/docs/concepts/overview/working-with-objects/owners-dependents/). 
Owner references tell the control plane which objects are dependent on others.
You can use owner references to block garbage collection of dependent resources
before their owner objects are deleted. In most cases, Kubernetes manages owner
references automatically.

## Cascading deletion {#cascading-deletion}

Kubernetes checks for and garbage collects objects that no longer have owner
references, like the pods left behind when you delete a ReplicaSet. When you
delete an object, you can control whether Kubernetes deletes the object's
dependents automatically, in a process called *cascading deletion*. There are
two types of cascading deletion, as follows: 

  * Foreground cascading deletion
  * Background cascading deletion

You can also control how and when garbage collection deletes resources that have
owner references using Kubernetes {{<glossary_tooltip text="finalizers" term_id="finalizer">}}. 

### Foreground cascading deletion

In foreground cascading deletion, the owner object first enters a *deletion in
progress* state. In this state, the following happens to the owner object:

  * The object is still visible through the API
  * The object `deletionTimestamp` field is set to the time that the object was marked for deletion.
  * The object `metadata.finalizers` field contains the value
    `foregroundDeletion`.

After the owner object enters the deletion in progress state, the garbage
collector deletes the dependents. After deleting all the dependent objects, the
garbage collector deletes the owner object. 

During foreground cascading deletion, the only dependents that block owner
deletion are those that have the `ownerReference.blockOwnerDeletion=true` field.

### Background cascading deletion

In background cascading deletion, the Kubernetes API server deletes the owner
object immediately and the garbage collector cleans up the dependent objects in
the background. By default, Kubernetes uses background cascading deletion unless
you manually use foreground deletion or choose to orphan the dependent objects.

### Orphaned dependents

When Kubernetes deletes an owner object, the dependents left behind are called
orphan objects. By default, Kubernetes deletes dependent objects. However, you
can force the garbage collector to orphan dependent objects by setting the
`--cascade=orphan` flag when deleting the owner object, or by setting
`propagationPolicy` to `Orphan` when using the API. 

## Garbage collection of unused containers and images {#containers-images}

The kubelet performs garbage collection on unused images every five minutes and
on unused containers every minute. You should avoid using external garbage
collection tools, as these can break the kubelet behavior and remove containers
that should exist. 

### Container image lifecycle

Kubernetes manages the lifecycle of all images through imageManager, with the
cooperation of cadvisor. The kubelet considers the following disk
usage limits when making garbage collection decisions:

  * `HighThresholdPercent`
  * `LowThresholdPercent`

Disk usage above the configured `HighThresholdPercent` value triggers garbage
collection, which deletes images in order based on the last time they were used,
starting with the oldest first. The kubelet garbage collector deletes images
until disk usage reaches the `LowThresholdPercent` value.

### Container image garbage collection

The kubelet garbage collects unused containers based on the following variables,
which you can define: 

  * `MinAge`: the minimum age at which the kubelet can garbage collect a
    container. Disable by setting to `0`.
  * `MaxPerPodContainer`: the maximum number of dead containers each Pod pair
    can have. Disable by setting to less than `0`.
  * `MaxContainers`: the maximum number of dead containers the cluster can have.
    Disable by setting to less than `0`. 

In addition to these variables, the kubelet garbage collects unidentified and
deleted containers, typically starting with the oldest first. 

`MaxPerPodContainer` and `MaxContainer` may potentially conflict with each other
in situations where retaining the maximum number of containers per Pod
(`MaxPerPodContainer`) would go outside the allowable total of global dead
containers (`MaxContainers`). In this situation, the kubelet adjusts
`MaxPodPerContainer` to address the conflict. A worst-case scenario would be to
downgrade `MaxPerPodContainer` to `1` and evict the oldest containers.
Additionally, containers owned by pods that have been deleted are removed once
they are older than `MinAge`.

{{<note>}}
The kubelet only garbage collects the containers it manages.
{{</note>}}

## Configuring garbage collection {#configuring-gc}

You can tune garbage collection of resources by configuring options specific to
the controllers managing those resources. The following pages show you how to
configure garbage collection:

  * [Configuring unused container and image garbage collection]
  * [Configuring cascading deletion of Kubernetes objects]
  * [Configuring cleanup of finished Jobs]
  * [[TODO: What else can we configure for GC?]]

## {{% heading "whatsnext" %}}

* [Learn more about ownership of Kubernetes objects](/docs/concepts/overview/working-with-objects/owners-dependents/).
* [Learn more about Kubernetes finalizers](/docs/concepts/overview/working-with-objects/finalizers/).
* [Learn about the TTL controller (beta) that cleans up finished Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/).