---
layout: blog
title: "Kubernetes v1.35: Mutable PersistentVolume Node Affinity Alpha"
draft: true
slug: kubernetes-v1-35-mutable-pv-nodeaffinity
author: >
  Weiwen Hu (Alibaba Cloud)
  YuanHui Qiu (Alibaba Cloud)
---

The PersistentVolume [node affinity](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#node-affinity) API
dates back to Kubernetes v1.10.
It is widely used to express that volumes may not be equally accessible by all nodes in the cluster.
This field was previously immutable,
we are now making it mutable in Kubernetes v1.35 (alpha), Opening a door to more flexible online volume management.

## Why Making Node Affinity Mutable?

So why bother to make it mutable after 8 years?
While stateless workloads like Deployments can be changed freely
and the changes will be rolled out automatically by re-creating every Pod,
PersistentVolumes (PVs) are stateful and cannot be re-created easily without losing data.

However, Storage providers evolve and storage requirements change.
Most notably, multiple providers are offering regional disks now.
Some of them even support live migration from zonal to regional disks, without disrupting the workloads.
This change can be expressed through the recently GA'ed
[VolumeAttributesClass](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/) API.
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

So, we are making it mutable now, a first step towards a more flexible online volume management.
While it is a simple change that removes one validation from the API server,
we still have a long way to go to integrate well with the Kubernetes ecosystem.

## Try it out

This feature is for you if you are a Kubernetes cluster administrator,
and your storage provider allows online update that you want to utilize,
but those updates can affect the accessibility of the volume.

Note that changing PV node affinity alone will not actually change the accessibility of the underlying volume.
So before using this feature,
You must update the underlying volume in the storage provider first,
and understand which nodes can access the volume after the update.
Then you can enable this feature and keep the PV node affinity in sync.

Currently, this feature is in alpha state.
It is disabled by default, and may subject to change.
To try it out, enable `MutablePVNodeAffinity` feature gate on APIServer, then you can edit PV spec.nodeAffinity field.
Typically only administrators can edit PVs, please make sure you have the right RBAC permissions.

### Race Condition between Updating and Scheduling

There are only a few things out of Pod that can affects the scheduling decision. PV node affinity is one of them.
It is fine to allow more nodes to access the volume by relaxing node affinity.
But there is a race condition when you try to tighten node affinity:
We don't know how scheduler will see our modified PV in its cache,
so there is a small window where the scheduler may place a Pod on an old node that can no longer access the volume.

One mitigation under discussion is to have the kubelet fail Pod startup if the PV’s node affinity is violated.
This has not landed yet.
So if you are trying this out now, please watch subsequent Pods that use the updated PV,
and make sure they are scheduled onto nodes that can access the volume.
If you update PV then immediately start new Pods in a script, it may not work as intended.

## Future Integration with CSI (Container Storage Interface)

Currently, it is up to the cluster administrator to modify both PV's node affinity and the underlying volume in the storage provider.
But manual operations are error-prone and time-consuming.
We would like to eventually integrate this with VolumeAttributesClass,
so that an unprivileged user can modify their PersistentVolumeClaim (PVC) to trigger storage-side updates,
and PV node affinity is updated automatically when approprate, without the need for cluster admin's intervention.

## We need your feedback

As noted earlier, this is only a first step.

If you are a Kubernetes user,
we would like to learn how you use (or will use) PV node affinity.
Is it beneficial to update it online in your case?

If you are a CSI driver developer,
would you be willing to implement this feature? How would you like the API to look?

Please provide your feedback via:
- Slack channel [#sig-storage](https://kubernetes.slack.com/messages/sig-storage).
- Mailing list [kubernetes-sig-storage](https://groups.google.com/g/kubernetes-sig-storage).
- The KEP issue [Mutable PersistentVolume Node Affinity](https://kep.k8s.io/5381).

For any inquiries or specific questions related to this feature, please reach out to the [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
