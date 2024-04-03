---
title: Change the default StorageClass
content_type: task
weight: 90
---

<!-- overview -->
This page shows how to change the default Storage Class that is used to
provision volumes for PersistentVolumeClaims that have no special requirements.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Why change the default storage class?

Depending on the installation method, your Kubernetes cluster may be deployed with
an existing StorageClass that is marked as default. This default StorageClass
is then used to dynamically provision storage for PersistentVolumeClaims
that do not require any specific storage class. See
[PersistentVolumeClaim documentation](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
for details.

The pre-installed default StorageClass may not fit well with your expected workload;
for example, it might provision storage that is too expensive. If this is the case,
you can either change the default StorageClass or disable it completely to avoid
dynamic provisioning of storage.

Deleting the default StorageClass may not work, as it may be re-created
automatically by the addon manager running in your cluster. Please consult the docs for your installation
for details about addon manager and how to disable individual addons.

## Changing the default StorageClass

1. List the StorageClasses in your cluster:

   ```bash
   kubectl get storageclass
   ```

   The output is similar to this:

   ```bash
   NAME                 PROVISIONER               AGE
   standard (default)   kubernetes.io/gce-pd      1d
   gold                 kubernetes.io/gce-pd      1d
   ```

   The default StorageClass is marked by `(default)`.

1. Mark the default StorageClass as non-default:

   The default StorageClass has an annotation
   `storageclass.kubernetes.io/is-default-class` set to `true`. Any other value
   or absence of the annotation is interpreted as `false`.

   To mark a StorageClass as non-default, you need to change its value to `false`:

   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   where `standard` is the name of your chosen StorageClass.

1. Mark a StorageClass as default:

   Similar to the previous step, you need to add/set the annotation
   `storageclass.kubernetes.io/is-default-class=true`.

   ```bash
   kubectl patch storageclass gold -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   Please note that at most one StorageClass can be marked as default. If two
   or more of them are marked as default, a `PersistentVolumeClaim` without
   `storageClassName` explicitly specified cannot be created.

1. Verify that your chosen StorageClass is default:

   ```bash
   kubectl get storageclass
   ```

   The output is similar to this:

   ```bash
   NAME             PROVISIONER               AGE
   standard         kubernetes.io/gce-pd      1d
   gold (default)   kubernetes.io/gce-pd      1d
   ```

## {{% heading "whatsnext" %}}

* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
