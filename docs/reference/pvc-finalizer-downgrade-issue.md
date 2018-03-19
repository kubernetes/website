* TOC
{:toc}

---
title: Downgrading issue from Kubernetes 1.10 to 1.9 due to StorageObjectInUseProtection 
---

## Storage Object in Use Protection in Kubernetes 1.10

When enabled, [Storage Object in Use Protection](/docs/admin/admission-controllers.md#storage-object-in-use-protection-beta) prevents PV/PVC from being removed when the finalizers are still present. 

## Downgrading issue

In Kubernetes 1.9, `PVCProtection` feature is turned off by default. After downgrading from Kubernetes 1.10 to 1.9, PV/PVCs that contain finalizers cannot be removed until their finalizers are removed.

## Workaround

Currently the pv-protection and pvc-protection finalizers must be removed manually after you downgrade so that PVs and PVCs can be removed. 

If `PVCProtection` feature is turned off in Kubernetes 1.9, here is what do do:

Patch PV/PVC (e.g. `pv1` and `pvc1`) using the following command:

- Patch the PV or PVC, as in the following command, where `pv1` is the name of the PV to patch, and `pvc1` is the name of the PVC to patch:

     ```bash
    kubectl patch pv  pv1  --type=json -p='[{"op": "remove", "path": "/metadata/finalizers", "value": "kubernetes.io/pv-protection"}]'
    kubectl patch pvc pvc1 --type=json -p='[{"op": "remove", "path": "/metadata/finalizers", "value": "kubernetes.io/pvc-protection"}]'
    ````

- Verify the finalizers are removed:

    ```bash
    kubectl get pv pv1 -o yaml |grep finalizer
    kubectl get pvc pvc1 -o yaml |grep finalizer
    ```

    The result should be empty.

- Then the PV and PVC can be removed.