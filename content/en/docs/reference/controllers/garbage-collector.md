---
title: Garbage Collector
content_template: templates/concept
---

{{% capture overview %}}

The Kubernetes garbage collector is a built-in controller. It deletes certain
objects that once had an owner, but no longer have an owner.

{{% /capture %}}


{{% capture body %}}

## Controller behavior

This controller watches for changes to objects that have dependencies, and
spots objects that are eligible for garbage collection. Once identified these
are queued for (attempts at) deletion.

Other controllers can rely on this behavior to take care of cascading deletion
of objects via parent-child relationships.

For example: if you remove a {{< glossary_tooltip term_id="deployment" >}}
that relies on a {{< glossary_tooltip term_id="replica-set" >}} to ensure
the right number of {{< glossary_tooltip text="Pods" term_id="pod" >}} are
running, removing that Deployment will schedule removal of the ReplicaSet.

{{% /capture %}}

{{% capture whatsnext %}}

* Read [Garbage collection design document 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)

* Read [Garbage collection design document 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)

{{% /capture %}}
