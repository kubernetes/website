---
title: Owners and Dependents
content_type: concept
weight: 60
---

<!-- overview -->

In Kubernetes, some objects are *owners* of other objects. For example, a
ReplicaSet is the owner of a set of pods. These owned objects are *dependents*
of their owner. 

Ownership is different from the [labels and selectors](/docs/concepts/overview/working-with-objects/labels/)
mechanism that some resources also use. For example, consider a Service that 
creates EndpointSlices. The Service uses labels to allow the control plane to
determine which `EndpointSlice` objects are used for that Service. In addition
to the labels, each `EndpointSlice` that is managed on behalf of a Service has
an owner reference. Owner references help different parts of Kubernetes avoid
interfering with objects they don’t control. 

## Owner references in object specifications

Dependent objects have a `metadata.ownerReferences` field that references their
owner object. A valid owner reference consists of the object name and a UID
within the same namespace as the dependent object. Kubernetes sets the value of
this field automatically for objects that are dependents of
ReplicationControllers, ReplicaSets, DaemonSets, Deployments, Jobs and CronJobs.
You can also configure these relationships manually by changing the value of
this field.

Dependent objects also have an `ownerReferences.blockOwnerDeletion` field that takes
a boolean value and controls whether specific dependents can block garbage
collection from deleting their owner object. Kubernetes automatically sets this
field to `true` if a controller like a ReplicaSet or Deployment sets the value
of the `metadata.ownerReferences` field. You can also set the value of the
`blockOwnerDeletion` field manually to control which dependents block garbage
collection.

A Kubernetes admission controller controls user access to change this field for
dependent resources, based on the delete permissions of the owner. This control
prevents unauthorized users from delaying owner object deletion.

## Ownership and finalizers

[[TODO: describe finalizers and link to finalizer concept]]

## {{% heading "whatsnext" %}}

* [Learn more about Kubernetes finalizers](/docs/concepts/overview/working-with-objects/finalizers/).
* [Learn about garbage collection](/docs/concepts/workloads/controllers/garbage-collection).