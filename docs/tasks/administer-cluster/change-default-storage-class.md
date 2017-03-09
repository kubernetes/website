---
title: Changing the default StorageClass
---

{% capture overview %}
This page shows how to change the default Storage Class that is used to
provision volumes for PersistentVolumeClaims that have no special requirements.

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Why change default storage class

Depending on the installation method, Kubernetes cluster may be deployed with
existing StorageClass that is marked as default. This default StorageClass
is then used to dynamically provision storage for PersistentVolumeClaims
that have do not require any specific storage class. See
[PersistentVolumeClaim documentation](/docs/user-guide/persistent-volumes/#class-1)
for details.

This pre-installed default StorageClass may not fit well your expected work
load, e.g. it can provision too expensive storage, and you may choose either
change the StorageClass or disable it completelly to avoid dynamic provisioning
of storage.

Simply deleting the default StorageClass may not work, as it may be re-created
automatically by addon manager running in your cluster. Consult installation
guide for details about addon manager and how to disable individual addons.

## Changing default StorageClass

1. List the StorageClasses in your cluster:

        kubectl get storageclass

    The output is similar to this:

        NAME                TYPE
        default (default)   kubernetes.io/gce-pd
        gold                kubernetes.io/gce-pd

    Default StorageClass is marked by `(default)`.

1. Mark the default StorageClass as non-default:

   Default StorageClass has annotation
   `storageclass.beta.kubernetes.io/is-default-class` set to `true`. Any other value
   or absence of the annotation is interpreted as `false`.

   To mark a StorageClass as non-default, you need to change its value to `false`:

        kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.beta.kubernetes.io/is-default-class":"false"}}}'

    where `<your-class-name>` is the name of your chosen StorageClass.

    Note that the name of the annotation that marks default StorageClass may
    change in the future.

1. Mark a StorageClass as default:

   Similarly to previous step, you need to add/set annotation
   `storageclass.beta.kubernetes.io/is-default-class=true`.

        kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.beta.kubernetes.io/is-default-class":"true"}}}'

   Please note that at most one StorageClass can be marked as default. If two
   or more of them are marked as default, Kubernetes ignores the annotation,
   i.e. it behaves as there is no default StorageClass.

1. Verify that your chosen StorageClass is default:

        kubectl get storageclass

    The output is similar to this:

        NAME             TYPE
        default          kubernetes.io/gce-pd
        gold (default)   kubernetes.io/gce-pd

{% endcapture %}

{% capture whatsnext %}
* Learn more about [StorageClasses](/docs/user-guide/persistent-volumes/).
{% endcapture %}

{% include templates/task.md %}
