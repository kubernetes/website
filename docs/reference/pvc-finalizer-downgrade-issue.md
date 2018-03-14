* TOC
{:toc}

---
title: Downgrading issue from Kubernetes 1.10 to 1.9 due to StorageObjectInUseProtection 
---

## Storage Object in Use Protection in Kubernetes 1.10

When enabled, [Storage Object in Use Protection](/docs/admin/admission-controllers.md#storage-object-in-use-protection-beta) prevents PV/PVC from being removed when the finalizers are still present. 

## Downgrading issue

After downgrading from Kubernetes 1.10 to 1.9, PV/PVCs that contain finalizers cannot be removed until their finalizers are removed.

## Workaround

Currently the pv-protection and pvc-protection finalizers must be removed manually before you downgrade so that PVs and PVCs can be removed after you downgrade to version 1.9. Here's what to do:


Before downgrading to Kubernetes 1.9, disable `StorageObjectInUseProtection` plugin by using apiserver command line option `--disable-admission-plugins=StorageObjectInUseProtection` and restart apiserver:

- if apiserver is managed by systemd, stop it using `systemd stop <apiserver service name>`. Modify apiserver service unit service file, reload the service, and start it using `systemd start` command
- if apiserver is started through command line, kill the process and run the command again with the above command line option


Then patch PV/PVC (e.g. `pv1`) using the following command:

- Patch the PV or PVC, as in the following command, where `pv1` is the name of the PV to patch:

     ```bash
    kubectl patch pv pv1 --type=json -p='[{"op": "remove", "path": "/metadata/finalizers"}]'
    ````

- Verify the finalizers are removed:

    ```bash
    kubectl get pv pv1 -o yaml |grep finalizer
    ```

    The result should be empty.

- You can now safely downgrade to version 1.9.
