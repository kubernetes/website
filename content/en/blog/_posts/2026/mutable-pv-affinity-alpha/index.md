---
layout: blog
title: "Kubernetes v1.35: Mutable PersistentVolume Node Affinity (alpha)"
date: 2026-01-08T10:30:00-08:00
slug: kubernetes-v1-35-mutable-pv-nodeaffinity
author: >
  Weiwen Hu (Alibaba Cloud),
  YuanHui Qiu (Alibaba Cloud)
---

The PersistentVolume [node affinity](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#node-affinity) API
dates back to Kubernetes v1.10.
It is widely used to express that volumes may not be equally accessible by all nodes in the cluster.
This field was previously immutable,
and it is now mutable in Kubernetes v1.35 (alpha). This change opens a door to more flexible online volume management.

## Why make node affinity mutable?

This raises an obvious question: why make node affinity mutable now?
While stateless workloads like Deployments can be changed freely
and the changes will be rolled out automatically by re-creating every Pod,
PersistentVolumes (PVs) are stateful and cannot be re-created easily without losing data.

However, Storage providers evolve and storage requirements change.
Most notably, multiple providers are offering regional disks now.
Some of them even support live migration from zonal to regional disks, without disrupting the workloads.
This change can be expressed through the
[VolumeAttributesClass](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/) API,
which recently graduated to GA in 1.34.
However, even if the volume is migrated to regional storage,
Kubernetes still prevents scheduling Pods to other zones because of the node affinity recorded in the PV object.
In this case, you may want to change the PV node affinity from:
```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.kubernetes.io/zone
          operator: In
          values:
          - us-east1-b
```
to:
```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.kubernetes.io/region
          operator: In
          values:
          - us-east1
```

As another example, providers sometimes offer new generations of disks.
New disks cannot always be attached to older nodes in the cluster.
This accessibility can also be expressed through PV node affinity and ensures the Pods can be scheduled to the right nodes.
But when the disk is upgraded, new Pods using this disk can still be scheduled to older nodes.
To prevent this, you may want to change the PV node affinity from:
```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: provider.com/disktype.gen1
          operator: In
          values:
          - available
```
to:
```yaml
spec:
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: provider.com/disktype.gen2
          operator: In
          values:
          - available
```

So, it is mutable now, a first step towards a more flexible online volume management.
While it is a simple change that removes one validation from the API server,
we still have a long way to go to integrate well with the Kubernetes ecosystem.

## Try it out

This feature is for you if you are a Kubernetes cluster administrator,
and your storage provider allows online update that you want to utilize,
but those updates can affect the accessibility of the volume.

Note that changing PV node affinity alone will not actually change the accessibility of the underlying volume.
Before using this feature,
you must first update the underlying volume in the storage provider,
and understand which nodes can access the volume after the update.
You can then enable this feature and keep the PV node affinity in sync.

Currently, this feature is in alpha state.
It is disabled by default, and may subject to change.
To try it out, enable the `MutablePVNodeAffinity` feature gate on APIServer, then you can edit the PV `spec.nodeAffinity` field.
Typically only administrators can edit PVs, please make sure you have the right RBAC permissions.

### Race condition between updating and scheduling

There are only a few factors outside of a Pod that can affect the scheduling decision, and PV node affinity is one of them.
It is fine to allow more nodes to access the volume by relaxing node affinity,
but there is a race condition when you try to tighten node affinity:
it is unclear how the Scheduler will see the modified PV in its cache,
so there is a small window where the scheduler may place a Pod on an old node that can no longer access the volume.
In this case, the Pod will stuck at `ContainerCreating` state.

One mitigation currently under discussion is for the kubelet to fail Pod startup if the PersistentVolume’s node affinity is violated.
This has not landed yet.
So if you are trying this out now, please watch subsequent Pods that use the updated PV,
and make sure they are scheduled onto nodes that can access the volume.
If you update PV and immediately start new Pods in a script, it may not work as intended.

## Future integration with CSI (Container Storage Interface)

Currently, it is up to the cluster administrator to modify both PV's node affinity and the underlying volume in the storage provider.
But manual operations are error-prone and time-consuming.
It is preferred to eventually integrate this with VolumeAttributesClass,
so that an unprivileged user can modify their PersistentVolumeClaim (PVC) to trigger storage-side updates,
and PV node affinity is updated automatically when appropriate, without the need for cluster admin's intervention.

## We welcome your feedback from users and storage driver developers

As noted earlier, this is only a first step.

If you are a Kubernetes user,
we would like to learn how you use (or will use) PV node affinity.
Is it beneficial to update it online in your case?

If you are a CSI driver developer,
would you be willing to implement this feature? How would you like the API to look?

Please provide your feedback via:
- Slack channel [#sig-storage](https://kubernetes.slack.com/messages/sig-storage).
- Mailing list [kubernetes-sig-storage](https://groups.google.com/a/kubernetes.io/g/sig-storage).
- The KEP issue [Mutable PersistentVolume Node Affinity](https://kep.k8s.io/5381).

For any inquiries or specific questions related to this feature, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
