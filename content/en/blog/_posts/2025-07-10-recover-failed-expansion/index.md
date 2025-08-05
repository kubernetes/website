---
layout: blog
title: "Kubernetes v1.34: Recover from volume expansion failure"
date: 2025-0X-XXT09:00:00-08:00
draft: true
slug: kubernetes-v1-34-recover-expansion-failure
author: >
  [Hemant Kumar](https://github.com/gnufied) (Red Hat)
---

Have you ever made a typo when expanding your persistent volumes in Kubernetes? Meant to specify `2TB`
but specified `20TB`? This seemingly innocous problem was kinda hard to fix and took us almost 5 year to fix but we have finally made `RecoverVolumeExpansionFailure` feature GA in v1.34 of Kubernetes - https://kubernetes.io/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes

While it was always possible to recover from failing volume expansions manually, it usually required cluster-admin access and was tedious to do (See aformentioned link for more information).

With v1.34 users should be able to reduce requested size of the persistentvolume claim(PVC) and as long as
expansion to previously requested size didn't finish, users can correct the size requested and Kubernetes will automatically work to correct it. Any quota consumed by failed expansion will be returned to the user and PVC should be resized to newly specified size.

Lets walk through an example of how all of this works.

## Reducing PVC size to recover from failed expansion

Lets say you are running out of disk space on your database server and you want to expand the PVC from previously specified `10TB` to `100TB` but made a typo and specified `1000TB`.

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
      storage: 1000TB --> newly specified size with Typo
```

Now, you may be out of disk space on your disk array or simply ran out of allocated quota on your cloud-provider and expansion to `1000TB` is never going to succeed.

In Kubernetes v1.34, you can simply correct your mistake and request *reduced* pvc size.

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
      storage: 100TB --> Fixed new size, has to be greater than 10TB.
```

This requires no admin intervention and whatever Kubernetes quota you consumed will be automatically returned.

This feature does have a caveat that, whatever new size you specify for the PVC, it **MUST** be still higher than what was original size in `.status.capacity`. It should be noted that, since Kubernetes doesn't support shriking your PV objects, you can never go below size that was originally allocatd for your PVC request.

## Improved error handling and observability of volume expansion

Implementing what might look like a relatively minor change also required us to almost 
fully redo how volume expansion works under the hood in Kubernetes.
There are new API fields available in PVC objects which you can monitor to observe progress of volume expansion.

### Improved observability of in-progress expansion

Users can use `pvc.status.allocatedResourceStatus['storage']` to monitor progress of their volume expansion operation. For a typical block volume, this should transition between `ControllerResizeInProgress`, `NodeResizePending` and `NodeResizeInProgress` and become nil/empty when volume expansion is finished.

If for some reason, volume expansion to requested size is not feasible it should accordingly be in states like - `ControllerResizeInfeasible` or `NodeResizeInfeasible`.

You can also observe size towards which Kubernetes is working by watching `pvc.status.allocatedResources`.

### Improved error handling and reporting

Kubernetes should now retry your failed volume expansions at slower rate, it should make fewer requests to both cloudprovider and Kubernetes apiserver.

Errors observerd during volume expansion are now reported as condition on PVC objects and should persist unlike events. Kubernetes will now populate `pvc.status.conditions` with error keys `ControllerResizeError` or `NodeResizeError` when volume expansion fails.

### Fixes long standing bugs in resizing workflows

This feature also has allowed us to fix long standing bugs in resizing workflow such as - https://github.com/kubernetes/kubernetes/issues/115294 . If you observe anything broken please report your bugs to https://github.com/kubernetes/kubernetes/issues .

Working on this feature through its lifecycle was challenging and it wouldn't have been possible to reach GA
without feedback from [@msau42](https://github.com/msau42), [@jsafrane](https://github.com/jsafrane) and [@xing-yang](https://github.com/xing-yang).

All of the contributors who worked on this also appreciate the input provided by [@thockin](https://github.com/thockin) and [@liggitt](https://github.comliggitt) at various Kubernetes contributor summits.
