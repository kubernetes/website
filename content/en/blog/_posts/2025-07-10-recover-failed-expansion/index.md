---
layout: blog
title: "Kubernetes v1.34: Recovery From Volume Expansion Failure (GA)"
date: 2025-0X-XXT09:00:00-08:00
draft: true
slug: kubernetes-v1-34-recover-expansion-failure
author: >
  [Hemant Kumar](https://github.com/gnufied) (Red Hat)
---

Have you ever made a typo when expanding your persistent volumes in Kubernetes? Meant to specify `2TB`
but specified `20TiB`? This seemingly innocuous problem was kinda hard to fix - and took the project almost 5 years to fix.
[Automated recovery from storage expansion](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes) has been around for a while in beta; however, with the v1.34 release, we have graduated this to
**general availability**.

While it was always possible to recover from failing volume expansions manually, it usually required cluster-admin access and was tedious to do (See aformentioned link for more information).

What if you make a mistake and then realize immediately?
With Kubernetes v1.34, you should be able to reduce the requested size of the PersistentVolumeClaim (PVC) and, as long as the expansion to previously requested
size hadn't finished, you can amend the size requested. Kubernetes will
automatically work to correct it. Any quota consumed by failed expansion will be returned to the user and the associated PersistentVolume should be resized to the
latest size you specified.

I'll walk through an example of how all of this works.

## Reducing PVC size to recover from failed expansion

Imagine that you are running out of disk space for one of your database servers, and you want to expand the PVC from previously
specified `10TB` to `100TB` - but you make a typo and specify `1000TB`.

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1000TB # newly specified size - but incorrect!
```

Now, you may be out of disk space on your disk array or simply ran out of allocated quota on your cloud-provider. But, assume that expansion to `1000TB` is never going to succeed.

In Kubernetes v1.34, you can simply correct your mistake and request a new PVC size,
that is smaller than the mistake, provided it is still larger than the original size
of the actual PersistentVolume.

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100TB # Corrected size; has to be greater than 10TB.
                     # You cannot shrink the volume below its actual size.
```

This requires no admin intervention. Even better, any surplus Kubernetes quota that you temporarily consumed will be automatically returned.

This fault recovery mechanism does have a caveat: whatever new size you specify for the PVC, it **must** be still higher than the original size in `.status.capacity`.
Since Kubernetes doesn't support shrinking your PV objects, you can never go below the size that was originally allocated for your PVC request.

## Improved error handling and observability of volume expansion

Implementing what might look like a relatively minor change also required us to almost 
fully redo how volume expansion works under the hood in Kubernetes.
There are new API fields available in PVC objects which you can monitor to observe progress of volume expansion.

### Improved observability of in-progress expansion

You can query `.status.allocatedResourceStatus['storage']` of a PVC to monitor progress of a volume expansion operation.
For a typical block volume, this should transition between `ControllerResizeInProgress`, `NodeResizePending` and `NodeResizeInProgress` and become nil/empty when volume expansion has finished.

If for some reason, volume expansion to requested size is not feasible it should accordingly be in states like - `ControllerResizeInfeasible` or `NodeResizeInfeasible`.

You can also observe size towards which Kubernetes is working by watching `pvc.status.allocatedResources`.

### Improved error handling and reporting

Kubernetes should now retry your failed volume expansions at slower rate, it should make fewer requests to both storage system and Kubernetes apiserver.

Errors observerd during volume expansion are now reported as condition on PVC objects and should persist unlike events. Kubernetes will now populate `pvc.status.conditions` with error keys `ControllerResizeError` or `NodeResizeError` when volume expansion fails.

### Fixes long standing bugs in resizing workflows

This feature also has allowed us to fix long standing bugs in resizing workflow such as [Kubernetes issue #115294](https://github.com/kubernetes/kubernetes/issues/115294).
If you observe anything broken, please report your bugs to [https://github.com/kubernetes/kubernetes/issues](https://github.com/kubernetes/kubernetes/issues/new/choose), along with details about how to reproduce the problem.

Working on this feature through its lifecycle was challenging and it wouldn't have been possible to reach GA
without feedback from [@msau42](https://github.com/msau42), [@jsafrane](https://github.com/jsafrane) and [@xing-yang](https://github.com/xing-yang).

All of the contributors who worked on this also appreciate the input provided by [@thockin](https://github.com/thockin) and [@liggitt](https://github.comliggitt) at various Kubernetes contributor summits.
