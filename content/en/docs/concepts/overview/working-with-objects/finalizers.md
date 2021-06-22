---
title: Finalizers
content_type: concept
weight: 60
---

<!-- overview -->

In Kubernetes, finalizers are keys that allow you to specify pre-delete
operations for resources. You can use finalizers to control garbage collection
of resources by alerting controllers to perform specific cleanup tasks before
deleting the target resource. 

Finalizers don't usually specify the code to execute. Instead, they are
typically lists of keys on a specific resource similar to annotations.
Kubernetes specifies some finalizers automatically, but you can also specify
your own.

## How finalizers work

When you create a resource using a manifest file, you can specify finalizers in
the `metadata.finalizers` field. When you attempt to delete the resource, the
controller that manages it notices the values in the `finalizers` field and does
the following: 

  * Modifies the object to add a `metadata.deletionTimestamp` field with the
    time you started the deletion.
  * Marks the object as read-only until the `finalizers` field is empty.

The controller then attempts to satisfy the requirements of the finalizers
specified for that resource. Each time a finalizer condition is satisfied, the
controller removes that key from the resource's `finalizers` field. When the
field is empty, garbage collection continues. You can also use finalizers to
prevent deletion of unmanaged resources.

A common example of a finalizer is `kubernetes.io/pv-protection`, which prevents
accidental deletion of `PersistentVolume` objects.

## Owner references and finalizers

[Owner references](/concepts/overview/working-with-objects/owners-dependents/) describe the relationships between objects in Kubernetes.
Ownership is different to
[labels](/concepts/overview/working-with-objects/labels/). Kubernetes processes
finalizers when it identifies owner references on a resource targeted for
deletion. 

In some situations, finalizers can block the deletion of dependent objects,
which can cause the targeted owner object to remain in a read-only state without
being fully deleted. In these situations, you should check finalizers and owner
references on the target owner and dependent objects to troubleshoot the cause. 

{{<note>}}
In cases where objects are stuck in a deleting state, try to avoid manually
removing finalizers to allow deletion to continue. Finalizers are usually added
to resources for a reason, so forcefully removing them can lead to issues in
your cluster. 
{{</note>}}

## {{% heading "whatsnext" %}}

* Learn about working with finalizers.
* [Read the blog post about finalizers, owner references, and deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/).