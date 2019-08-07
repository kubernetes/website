---
title: Volume attach / detach controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip text="Volume" term_id="volume" >}}
attach / detach controller is part of a set of built-in controllers for storage management.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

The volume attach / detach controller is responsible for attaching and detaching
all Volumes across a cluster. This controller watches the API server for Pod
creation and termination.

Once a new pod is scheduled, the volume attach / detach controller works out what
volumes need to be attached and signals this (via the API server) to kubelet and
to storage services. The controller updates `.status.volumesAttached` on the
Node where the Pod is scheduled, and kubelet updates `.status.VolumesInUse` once
it starts using the Volume (ie, mounting it for a container in a Pod).

When a pod is terminated, the controller makes sure that the existing attached
volumes are detached. After signalling for kubelet to unmount the volume, the
volume attach / detach controller waits for graceful unmount before attempting
to detach it.

Different nodes might have different ways of attaching volumes, and different
Volumes can have different values for VolumeNodeAffinity, so the decision
around volume attachment happens after scheduling.

To learn more about how Kubernetes manages storage and makes this storage
available to Pods, refer to the [storage](/docs/concepts/storage/persistent-volumes/) documentation.

{{% /capture %}}
