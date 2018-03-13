* TOC
{:toc}

---
title: Kubernetes Downgrade issue from 1.10 to 1.9 due to PV/PVC Protection
---

## PV/PVC Protection in Kubernetes 1.10

When enabled, [PV/PVC Protection](docs/admin/admission-controllers.md#storage-object-in-use-protection-beta) prevents PV/PVC from being removed when the finalizers are removed. 

## Downgrading issue

After downgrading from Kubernetes 1.10 to 1.9, PV/PVCs that are created in Kubernetes 1.10 with PVC Protection cannot be removed.

## Workaround

Currently PV/PVC finalizers have to be manually removed so PV/PVC can be removed after downgrading to Kubernetes 1.9.

Before downgrading to Kubernetes 1.9, disable `StorageObjectInUseProtection` plugin and restart admission controller.

Then patch PV/PVC (e.g. `pv1`) using the following command:

```bash
kubectl patch pv pv1 --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
``` 

then verify the finalizers are removed:
```bash
kubectl get pv pv1 -o yaml |grep finalizer
# (result should be empty)
```
